"""
RoutePilot optimization service — TSP (single vehicle) and VRP (multi-vehicle).
"""

from typing import Literal

from fastapi import FastAPI, HTTPException
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from pydantic import BaseModel, Field

from vrp import (
    PRIORITY_DROP_PENALTY,
    VrpDeliveryInput,
    VrpSolveInput,
    VrpVehicleInput,
    solve_vrp,
)

app = FastAPI(title="RoutePilot Optimizer", version="2.0.0")


class SolveRequest(BaseModel):
    duration_matrix: list[list[float]] = Field(
        description="N×N travel durations in seconds",
    )
    depot_index: int = 0
    cost_type: Literal["duration", "distance"] = "duration"


class SolveResponse(BaseModel):
    route_indices: list[int]
    total_cost: int


class VrpDeliveryModel(BaseModel):
    node_index: int
    delivery_index: int
    weight_units: int = Field(ge=0)
    volume_units: int = Field(ge=0)
    package_count: int = Field(default=1, ge=1)
    time_window_start_sec: int | None = None
    time_window_end_sec: int | None = None
    deadline_sec: int | None = None
    priority: Literal["LOW", "NORMAL", "HIGH", "CRITICAL"] = "NORMAL"
    drop_penalty: int | None = None


class VrpVehicleModel(BaseModel):
    start_index: int
    end_index: int
    max_weight_units: int = Field(ge=0)
    max_volume_units: int = Field(ge=0)
    max_packages: int = Field(ge=1)


class VrpSolveRequest(BaseModel):
    duration_matrix: list[list[float]]
    distance_matrix: list[list[float]]
    vehicles: list[VrpVehicleModel]
    deliveries: list[VrpDeliveryModel]
    objective: Literal[
        "MINIMIZE_TOTAL_TIME",
        "MINIMIZE_TOTAL_DISTANCE",
        "BALANCE_WORKLOAD",
        "PRIORITIZE_URGENT",
        "MINIMIZE_LATE_DELIVERIES",
    ] = "MINIMIZE_TOTAL_TIME"
    respect_capacity: bool = True
    respect_time_windows: bool = True
    service_time_sec: int = Field(default=120, ge=0)
    horizon_sec: int = Field(default=86400, ge=60)


class VrpRouteResponse(BaseModel):
    vehicle_index: int
    route_indices: list[int]
    total_cost: int


class VrpSolveResponse(BaseModel):
    routes: list[VrpRouteResponse]
    unassigned_delivery_indices: list[int]


def _matrix_or_raise(matrix: list[list[float]]) -> list[list[int]]:
    n = len(matrix)
    if n < 2:
        raise HTTPException(status_code=400, detail="Matrix must be at least 2×2")
    out: list[list[int]] = []
    for row in matrix:
        if len(row) != n:
            raise HTTPException(status_code=400, detail="Matrix must be square")
        out.append([max(0, int(round(cell))) for cell in row])
    return out


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/solve", response_model=SolveResponse)
def solve(body: SolveRequest) -> SolveResponse:
    cost_matrix = _matrix_or_raise(body.duration_matrix)
    n = len(cost_matrix)
    depot = body.depot_index
    if depot < 0 or depot >= n:
        raise HTTPException(status_code=400, detail="depot_index out of range")

    manager = pywrapcp.RoutingIndexManager(n, 1, depot)
    routing = pywrapcp.RoutingModel(manager)

    def transit_callback(from_index: int, to_index: int) -> int:
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return cost_matrix[from_node][to_node]

    callback_index = routing.RegisterTransitCallback(transit_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(callback_index)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.FromSeconds(10)

    solution = routing.SolveWithParameters(search_parameters)
    if solution is None:
        raise HTTPException(status_code=422, detail="No solution found")

    index = routing.Start(0)
    route: list[int] = []
    total_cost = 0
    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        route.append(node)
        previous_index = index
        index = solution.Value(routing.NextVar(index))
        total_cost += routing.GetArcCostForVehicle(previous_index, index, 0)

    route.append(manager.IndexToNode(index))

    return SolveResponse(route_indices=route, total_cost=total_cost)


@app.post("/solve-vrp", response_model=VrpSolveResponse)
def solve_vrp_endpoint(body: VrpSolveRequest) -> VrpSolveResponse:
    deliveries = [
        VrpDeliveryInput(
            node_index=d.node_index,
            delivery_index=d.delivery_index,
            weight_units=d.weight_units,
            volume_units=d.volume_units,
            package_count=d.package_count,
            time_window_start_sec=d.time_window_start_sec,
            time_window_end_sec=d.time_window_end_sec,
            deadline_sec=d.deadline_sec,
            priority=d.priority,
            drop_penalty=d.drop_penalty
            or PRIORITY_DROP_PENALTY.get(d.priority, PRIORITY_DROP_PENALTY["NORMAL"]),
        )
        for d in body.deliveries
    ]

    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=_matrix_or_raise(body.duration_matrix),
            distance_matrix=_matrix_or_raise(body.distance_matrix),
            vehicles=[
                VrpVehicleInput(
                    start_index=v.start_index,
                    end_index=v.end_index,
                    max_weight_units=v.max_weight_units,
                    max_volume_units=v.max_volume_units,
                    max_packages=v.max_packages,
                )
                for v in body.vehicles
            ],
            deliveries=deliveries,
            objective=body.objective,
            respect_capacity=body.respect_capacity,
            respect_time_windows=body.respect_time_windows,
            service_time_sec=body.service_time_sec,
            horizon_sec=body.horizon_sec,
        )
    )

    return VrpSolveResponse(
        routes=[
            VrpRouteResponse(
                vehicle_index=r.vehicle_index,
                route_indices=r.route_indices,
                total_cost=r.total_cost,
            )
            for r in result.routes
        ],
        unassigned_delivery_indices=result.unassigned_delivery_indices,
    )
