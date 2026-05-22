"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HORIZON_SEC = exports.SERVICE_TIME_SEC = void 0;
exports.weightToUnits = weightToUnits;
exports.volumeToUnits = volumeToUnits;
exports.dropPenaltyForPriority = dropPenaltyForPriority;
exports.parseRouteStart = parseRouteStart;
exports.secondsFromRouteStart = secondsFromRouteStart;
exports.extractDeliveryVisitOrder = extractDeliveryVisitOrder;
exports.computeLegMetrics = computeLegMetrics;
exports.SERVICE_TIME_SEC = 120;
exports.HORIZON_SEC = 86_400;
const PRIORITY_DROP_PENALTY = {
    LOW: 10_000,
    NORMAL: 100_000,
    HIGH: 1_000_000,
    CRITICAL: 10_000_000,
};
function weightToUnits(kg) {
    return Math.max(0, Math.round(kg * 100));
}
function volumeToUnits(m3) {
    if (m3 == null) {
        return 0;
    }
    return Math.max(0, Math.round(m3 * 1000));
}
function dropPenaltyForPriority(priority) {
    return PRIORITY_DROP_PENALTY[priority];
}
function parseRouteStart(plannedDate, routeStartTime) {
    const [hours, minutes] = routeStartTime.split(':').map(Number);
    const [year, month, day] = plannedDate.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
}
function secondsFromRouteStart(routeStart, value) {
    if (!value) {
        return null;
    }
    const sec = Math.floor((value.getTime() - routeStart.getTime()) / 1000);
    return sec < 0 ? 0 : sec;
}
function extractDeliveryVisitOrder(routeIndices, points) {
    const seen = new Set();
    const order = [];
    for (const idx of routeIndices) {
        if (seen.has(idx)) {
            continue;
        }
        seen.add(idx);
        if (points[idx]?.kind === 'delivery') {
            order.push(idx);
        }
    }
    return order;
}
function computeLegMetrics(routeIndices, matrix, routeStart) {
    let totalDistanceMeters = 0;
    let totalDurationSeconds = 0;
    const stopEtas = new Map();
    let currentTime = routeStart;
    for (let i = 0; i < routeIndices.length - 1; i += 1) {
        const from = routeIndices[i];
        const to = routeIndices[i + 1];
        const dist = matrix.distancesMeters[from]?.[to] ?? 0;
        const dur = matrix.durationsSeconds[from]?.[to] ?? 0;
        totalDistanceMeters += dist;
        totalDurationSeconds += dur;
        currentTime = new Date(currentTime.getTime() + dur * 1000);
        stopEtas.set(to, new Date(currentTime));
    }
    return { totalDistanceMeters, totalDurationSeconds, stopEtas };
}
//# sourceMappingURL=optimization-vrp.util.js.map