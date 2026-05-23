"""
Multi-vehicle VRP with capacity, time windows, deadlines, and optional deliveries.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

from fastapi import HTTPException
from ortools.constraint_solver import pywrapcp, routing_enums_pb2

Objective = Literal[
    "MINIMIZE_TOTAL_TIME",
    "MINIMIZE_TOTAL_DISTANCE",
    "BALANCE_WORKLOAD",
    "PRIORITIZE_URGENT",
    "MINIMIZE_LATE_DELIVERIES",
]

PRIORITY_DROP_PENALTY: dict[str, int] = {
    "LOW": 10_000,
    "NORMAL": 100_000,
    "HIGH": 1_000_000,
    "CRITICAL": 10_000_000,
}


@dataclass
class VrpDeliveryInput:
    node_index: int
    delivery_index: int
    weight_units: int
    volume_units: int
    package_count: int
    time_window_start_sec: int | None
    time_window_end_sec: int | None
    deadline_sec: int | None
    priority: str
    drop_penalty: int


@dataclass
class VrpVehicleInput:
    start_index: int
    end_index: int
    max_weight_units: int
    max_volume_units: int
    max_packages: int


@dataclass
class VrpSolveInput:
    duration_matrix: list[list[int]]
    distance_matrix: list[list[int]]
    vehicles: list[VrpVehicleInput]
    deliveries: list[VrpDeliveryInput]
    objective: Objective
    respect_capacity: bool
    respect_time_windows: bool
    service_time_sec: int
    horizon_sec: int


@dataclass
class VrpRouteResult:
    vehicle_index: int
    route_indices: list[int]
    total_cost: int


@dataclass
class VrpSolveResult:
    routes: list[VrpRouteResult]
    unassigned_delivery_indices: list[int]


def _matrix_or_raise(matrix: list[list[float | int]]) -> list[list[int]]:
    n = len(matrix)
    if n < 2:
        raise HTTPException(status_code=400, detail="Matrix must be at least 2×2")
    out: list[list[int]] = []
    for row in matrix:
        if len(row) != n:
            raise HTTPException(status_code=400, detail="Matrix must be square")
        out.append([max(0, int(round(cell))) for cell in row])
    return out


def _clamp_sec(value: int | None, horizon: int) -> int | None:
    if value is None:
        return None
    return max(0, min(value, horizon))


def _effective_horizon(data: VrpSolveInput) -> int:
    horizon = data.horizon_sec
    for delivery in data.deliveries:
        for value in (
            delivery.time_window_start_sec,
            delivery.time_window_end_sec,
            delivery.deadline_sec,
        ):
            if value is not None:
                horizon = max(horizon, value + data.service_time_sec)
    return min(horizon, 7 * 86_400)


def _normalize_delivery_time_limits(
    delivery: VrpDeliveryInput,
    horizon: int,
    respect_time_windows: bool,
) -> tuple[int | None, int | None, int | None]:
    deadline = _clamp_sec(delivery.deadline_sec, horizon)
    if not respect_time_windows:
        return None, None, deadline

    start = _clamp_sec(delivery.time_window_start_sec, horizon)
    end = _clamp_sec(delivery.time_window_end_sec, horizon)

    if deadline is not None:
        end = deadline if end is None else min(end, deadline)

    if start is not None and end is not None and start > end:
        start = end

    return start, end, deadline


def _set_time_range(
    time_dimension: pywrapcp.RoutingDimension,
    index: int,
    start: int,
    end: int,
) -> None:
    if start > end:
        raise HTTPException(
            status_code=400,
            detail="Invalid delivery time window: start is after end",
        )
    try:
        time_dimension.CumulVar(index).SetRange(start, end)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid delivery time window for optimizer "
                f"(start={start}, end={end})"
            ),
        ) from exc


def _set_time_max(
    time_dimension: pywrapcp.RoutingDimension,
    index: int,
    upper: int,
) -> None:
    current_min = time_dimension.CumulVar(index).Min()
    safe_upper = max(upper, current_min)
    try:
        time_dimension.CumulVar(index).SetMax(safe_upper)
    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid delivery deadline for optimizer (deadline={upper})",
        ) from exc


def solve_vrp(data: VrpSolveInput) -> VrpSolveResult:
    duration = _matrix_or_raise(data.duration_matrix)
    distance = _matrix_or_raise(data.distance_matrix)
    n = len(duration)
    num_vehicles = len(data.vehicles)

    if num_vehicles < 1:
        raise HTTPException(status_code=400, detail="At least one vehicle required")
    if not data.deliveries:
        raise HTTPException(status_code=400, detail="At least one delivery required")

    starts = [v.start_index for v in data.vehicles]
    ends = [v.end_index for v in data.vehicles]
    for idx in starts + ends:
        if idx < 0 or idx >= n:
            raise HTTPException(status_code=400, detail="Vehicle depot index out of range")

    delivery_nodes = {d.node_index for d in data.deliveries}
    for d in data.deliveries:
        if d.node_index < 0 or d.node_index >= n:
            raise HTTPException(status_code=400, detail="Delivery node index out of range")

    use_time_cost = data.objective in (
        "MINIMIZE_TOTAL_TIME",
        "BALANCE_WORKLOAD",
        "MINIMIZE_LATE_DELIVERIES",
        "PRIORITIZE_URGENT",
    )
    cost_matrix = duration if use_time_cost else distance

    manager = pywrapcp.RoutingIndexManager(n, num_vehicles, starts, ends)
    routing = pywrapcp.RoutingModel(manager)

    service_at_node = [0] * n
    for d in data.deliveries:
        service_at_node[d.node_index] = max(0, data.service_time_sec)

    def transit_callback(from_index: int, to_index: int) -> int:
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        travel = cost_matrix[from_node][to_node]
        return travel + service_at_node[from_node]

    transit_cb = routing.RegisterTransitCallback(transit_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_cb)

    if data.respect_capacity:
        _add_capacity_dimension(
            routing,
            manager,
            data,
            "Weight",
            [d.weight_units for d in data.deliveries],
            [v.max_weight_units for v in data.vehicles],
        )
        _add_capacity_dimension(
            routing,
            manager,
            data,
            "Volume",
            [d.volume_units for d in data.deliveries],
            [v.max_volume_units for v in data.vehicles],
        )
        _add_capacity_dimension(
            routing,
            manager,
            data,
            "Packages",
            [d.package_count for d in data.deliveries],
            [v.max_packages for v in data.vehicles],
        )

    time_dimension = None
    needs_time = (
        data.respect_time_windows
        or any(d.deadline_sec is not None for d in data.deliveries)
        or data.objective in ("MINIMIZE_LATE_DELIVERIES", "BALANCE_WORKLOAD")
    )

    if needs_time:
        horizon_sec = _effective_horizon(data)

        def time_callback(from_index: int, to_index: int) -> int:
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return duration[from_node][to_node] + service_at_node[from_node]

        time_cb = routing.RegisterTransitCallback(time_callback)
        routing.AddDimension(
            time_cb,
            30 * 60,
            horizon_sec,
            False,
            "Time",
        )
        time_dimension = routing.GetDimensionOrDie("Time")

        for d in data.deliveries:
            index = manager.NodeToIndex(d.node_index)
            window_start, window_end, deadline = _normalize_delivery_time_limits(
                d,
                horizon_sec,
                data.respect_time_windows,
            )

            if data.respect_time_windows:
                if window_start is not None and window_end is not None:
                    _set_time_range(time_dimension, index, window_start, window_end)
                elif window_end is not None:
                    _set_time_max(time_dimension, index, window_end)
                elif window_start is not None:
                    time_dimension.CumulVar(index).SetMin(window_start)

            if deadline is not None:
                if data.objective == "MINIMIZE_LATE_DELIVERIES":
                    time_dimension.SetCumulVarSoftUpperBound(index, deadline, 100_000)
                elif data.respect_time_windows:
                    _set_time_max(time_dimension, index, deadline)
                else:
                    _set_time_max(time_dimension, index, deadline)

        if data.objective == "BALANCE_WORKLOAD" and time_dimension is not None:
            time_dimension.SetSpanCostCoefficientForAllVehicles(100)

    for d in data.deliveries:
        index = manager.NodeToIndex(d.node_index)
        penalty = d.drop_penalty or PRIORITY_DROP_PENALTY.get(
            d.priority, PRIORITY_DROP_PENALTY["NORMAL"]
        )
        routing.AddDisjunction([index], penalty)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.FromSeconds(30)

    solution = routing.SolveWithParameters(search_parameters)
    if solution is None:
        raise HTTPException(status_code=422, detail="No VRP solution found")

    routes: list[VrpRouteResult] = []
    visited_delivery_nodes: set[int] = set()

    for vehicle_idx in range(num_vehicles):
        index = routing.Start(vehicle_idx)
        route_nodes: list[int] = []
        total_cost = 0

        while not routing.IsEnd(index):
            node = manager.IndexToNode(index)
            route_nodes.append(node)
            if node in delivery_nodes:
                visited_delivery_nodes.add(node)
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            total_cost += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_idx
            )

        route_nodes.append(manager.IndexToNode(index))
        routes.append(
            VrpRouteResult(
                vehicle_index=vehicle_idx,
                route_indices=route_nodes,
                total_cost=total_cost,
            )
        )

    unassigned = [
        d.delivery_index
        for d in data.deliveries
        if d.node_index not in visited_delivery_nodes
    ]

    return VrpSolveResult(routes=routes, unassigned_delivery_indices=unassigned)


def _add_capacity_dimension(
    routing: pywrapcp.RoutingModel,
    manager: pywrapcp.RoutingIndexManager,
    data: VrpSolveInput,
    name: str,
    delivery_demands: list[int],
    vehicle_capacities: list[int],
) -> None:
    demands = [0] * len(data.duration_matrix)
    demand_by_node = {
        d.node_index: delivery_demands[i]
        for i, d in enumerate(data.deliveries)
    }
    for node_idx, demand in demand_by_node.items():
        demands[node_idx] = demand

    def demand_callback(from_index: int) -> int:
        from_node = manager.IndexToNode(from_index)
        return demands[from_node]

    demand_cb = routing.RegisterUnaryTransitCallback(demand_callback)
    routing.AddDimensionWithVehicleCapacity(
        demand_cb,
        0,
        vehicle_capacities,
        True,
        name,
    )
