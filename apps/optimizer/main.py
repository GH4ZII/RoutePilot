"""
RoutePilot optimization service — single-vehicle route (TSP) via Google OR-Tools.
"""

from typing import Literal

from fastapi import FastAPI, HTTPException
from ortools.constraint_solver import pywrapcp, routing_enums_pb2
from pydantic import BaseModel, Field

app = FastAPI(title="RoutePilot Optimizer", version="1.0.0")


class SolveRequest(BaseModel):
    duration_matrix: list[list[float]] = Field(
        description="N×N travel durations in seconds (integers recommended)",
    )
    depot_index: int = 0
    cost_type: Literal["duration", "distance"] = "duration"


class SolveResponse(BaseModel):
    route_indices: list[int]
    total_cost: int


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
