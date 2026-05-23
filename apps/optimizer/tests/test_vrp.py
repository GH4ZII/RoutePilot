"""VRP constraint tests (capacity, depot, time windows, priority, no double assignment)."""

import pytest
from fastapi import HTTPException

from vrp import (
    VrpDeliveryInput,
    VrpSolveInput,
    VrpVehicleInput,
    solve_vrp,
)


def _two_vehicle_matrix() -> tuple[list[list[int]], list[list[int]]]:
    """0-1 deliveries, 2-3 vehicle0 depot, 4-5 vehicle1 depot."""
    duration = [
        [0, 600, 900, 0, 0, 0],
        [600, 0, 400, 0, 0, 0],
        [900, 400, 0, 0, 0, 0],
        [0, 0, 0, 0, 500, 800],
        [0, 0, 0, 500, 0, 400],
        [0, 0, 0, 800, 400, 0],
    ]
    distance = [[d * 10 for d in row] for row in duration]
    return duration, distance


def test_capacity_limits_assignment() -> None:
    duration, distance = _two_vehicle_matrix()
    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(3, 3, max_weight_units=50, max_volume_units=100, max_packages=1),
                VrpVehicleInput(4, 4, max_weight_units=50, max_volume_units=100, max_packages=1),
            ],
            deliveries=[
                VrpDeliveryInput(
                    0, 0, 40, 50, 1, None, None, None, "NORMAL", 100_000
                ),
                VrpDeliveryInput(
                    1, 1, 40, 50, 1, None, None, None, "NORMAL", 100_000
                ),
                VrpDeliveryInput(
                    2, 2, 40, 50, 1, None, None, None, "NORMAL", 100_000
                ),
            ],
            objective="MINIMIZE_TOTAL_TIME",
            respect_capacity=True,
            respect_time_windows=False,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    assert len(result.unassigned_delivery_indices) >= 1
    assigned = set()
    for route in result.routes:
        for node in route.route_indices:
            if node in (0, 1, 2):
                assert node not in assigned, "Delivery assigned to multiple vehicles"
                assigned.add(node)


def test_depot_start_and_end() -> None:
    duration, distance = _two_vehicle_matrix()
    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(3, 5, max_weight_units=500, max_volume_units=500, max_packages=10),
            ],
            deliveries=[
                VrpDeliveryInput(0, 0, 10, 10, 1, None, None, None, "NORMAL", 100_000),
                VrpDeliveryInput(1, 1, 10, 10, 1, None, None, None, "NORMAL", 100_000),
            ],
            objective="MINIMIZE_TOTAL_TIME",
            respect_capacity=True,
            respect_time_windows=False,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    route = result.routes[0].route_indices
    assert route[0] == 3
    assert route[-1] == 5


def test_time_windows_respected_or_dropped() -> None:
    duration = [
        [0, 300, 600],
        [300, 0, 300],
        [600, 300, 0],
    ]
    distance = [[d * 10 for d in row] for row in duration]
    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(0, 0, max_weight_units=500, max_volume_units=500, max_packages=5),
            ],
            deliveries=[
                VrpDeliveryInput(
                    1,
                    0,
                    10,
                    10,
                    1,
                    0,
                    200,
                    None,
                    "NORMAL",
                    100_000,
                ),
                VrpDeliveryInput(
                    2,
                    1,
                    10,
                    10,
                    1,
                    5000,
                    6000,
                    None,
                    "NORMAL",
                    100_000,
                ),
            ],
            objective="MINIMIZE_TOTAL_TIME",
            respect_capacity=False,
            respect_time_windows=True,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    assert 1 in result.unassigned_delivery_indices or any(
        2 in r.route_indices for r in result.routes
    )


def test_priority_keeps_critical_over_low() -> None:
    duration = [
        [0, 100, 100],
        [100, 0, 50],
        [100, 50, 0],
    ]
    distance = [[d * 10 for d in row] for row in duration]
    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(0, 0, max_weight_units=15, max_volume_units=15, max_packages=1),
            ],
            deliveries=[
                VrpDeliveryInput(1, 0, 10, 10, 1, None, None, None, "LOW", 1_000),
                VrpDeliveryInput(2, 1, 10, 10, 1, None, None, None, "CRITICAL", 10_000_000),
            ],
            objective="PRIORITIZE_URGENT",
            respect_capacity=True,
            respect_time_windows=False,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    assert 0 in result.unassigned_delivery_indices
    assert 1 not in result.unassigned_delivery_indices


def test_no_double_assignment() -> None:
    duration, distance = _two_vehicle_matrix()
    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(3, 3, max_weight_units=200, max_volume_units=200, max_packages=5),
                VrpVehicleInput(4, 4, max_weight_units=200, max_volume_units=200, max_packages=5),
            ],
            deliveries=[
                VrpDeliveryInput(0, 0, 10, 10, 1, None, None, None, "NORMAL", 100_000),
                VrpDeliveryInput(1, 1, 10, 10, 1, None, None, None, "NORMAL", 100_000),
            ],
            objective="MINIMIZE_TOTAL_TIME",
            respect_capacity=True,
            respect_time_windows=False,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    seen: set[int] = set()
    for route in result.routes:
        for node in route.route_indices:
            if node in (0, 1):
                assert node not in seen
                seen.add(node)
    assert len(seen) <= 2


def test_balance_workload_spreads_across_vehicles() -> None:
    """BALANCE_WORKLOAD should use multiple vehicles when capacity allows."""
    n_deliveries = 9
    depot_nodes = [9, 10, 11]
    n = 12
    duration = [[0] * n for _ in range(n)]
    distance = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                duration[i][j] = 600
                distance[i][j] = 6000

    deliveries = [
        VrpDeliveryInput(
            node, idx, 10, 10, 1, None, None, None, "NORMAL", 100_000
        )
        for idx, node in enumerate(range(n_deliveries))
    ]

    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(
                    depot, depot, max_weight_units=500, max_volume_units=500, max_packages=50
                )
                for depot in depot_nodes
            ],
            deliveries=deliveries,
            objective="BALANCE_WORKLOAD",
            respect_capacity=True,
            respect_time_windows=False,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    assigned_per_vehicle = []
    for route in result.routes:
        stops = [node for node in route.route_indices if node < n_deliveries]
        assigned_per_vehicle.append(len(stops))

    vehicles_used = sum(1 for count in assigned_per_vehicle if count > 0)
    assert vehicles_used == 3, (
        f"Expected all selected vehicles to be used, got counts {assigned_per_vehicle}"
    )
    assert sorted(assigned_per_vehicle) == [3, 3, 3]
    assert len(result.unassigned_delivery_indices) == 0


def test_balance_workload_uses_all_vehicles_for_large_job() -> None:
    n_deliveries = 50
    depot_nodes = [50, 51, 52]
    n = 53
    duration = [[0] * n for _ in range(n)]
    distance = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            if i != j:
                duration[i][j] = 300 + (i * 7 + j * 3) % 200
                distance[i][j] = duration[i][j] * 10

    deliveries = [
        VrpDeliveryInput(
            node, idx, 5, 5, 1, None, None, None, "NORMAL", 100_000
        )
        for idx, node in enumerate(range(n_deliveries))
    ]

    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(
                    depot, depot, max_weight_units=5000, max_volume_units=5000, max_packages=100
                )
                for depot in depot_nodes
            ],
            deliveries=deliveries,
            objective="BALANCE_WORKLOAD",
            respect_capacity=True,
            respect_time_windows=False,
            service_time_sec=120,
            horizon_sec=86_400,
        )
    )

    assigned_per_vehicle = sorted(
        sum(1 for node in route.route_indices if node < n_deliveries)
        for route in result.routes
    )
    assert sum(1 for count in assigned_per_vehicle if count > 0) == 3
    assert assigned_per_vehicle == [16, 17, 17]
    assert len(result.unassigned_delivery_indices) == 0


def test_inverted_time_window_does_not_crash() -> None:
    duration = [
        [0, 300, 600],
        [300, 0, 300],
        [600, 300, 0],
    ]
    distance = [[d * 10 for d in row] for row in duration]
    result = solve_vrp(
        VrpSolveInput(
            duration_matrix=duration,
            distance_matrix=distance,
            vehicles=[
                VrpVehicleInput(0, 0, max_weight_units=500, max_volume_units=500, max_packages=5),
            ],
            deliveries=[
                VrpDeliveryInput(
                    1,
                    0,
                    10,
                    10,
                    1,
                    5000,
                    2000,
                    2000,
                    "NORMAL",
                    100_000,
                ),
            ],
            objective="MINIMIZE_TOTAL_TIME",
            respect_capacity=False,
            respect_time_windows=True,
            service_time_sec=0,
            horizon_sec=86_400,
        )
    )

    assert result.routes
