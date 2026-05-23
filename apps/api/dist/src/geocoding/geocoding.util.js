"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAddressQuery = parseAddressQuery;
exports.normalizeAddress = normalizeAddress;
exports.placeMatches = placeMatches;
function parseAddressQuery(query) {
    const raw = query.trim().replace(/\s+/g, ' ');
    const postnummer = raw.match(/\b(\d{4})\b/)?.[1];
    const structured = raw.match(/^(.+?)\s+(\d+[A-Za-z]?)\s*,?\s*(?:\d{4})?(?:\s+(.+))?$/);
    if (structured) {
        const placeFromTail = raw.match(/\b\d{4}\s+(.+)$/i)?.[1]?.trim();
        return {
            raw,
            adressenavn: structured[1].trim(),
            nummer: structured[2],
            postnummer,
            place: placeFromTail || structured[3]?.trim() || undefined,
        };
    }
    return { raw, postnummer };
}
function normalizeAddress(value) {
    return value.trim().replace(/\s+/g, ' ').toLowerCase();
}
function placeMatches(addressPlace, queryPlace) {
    if (!addressPlace?.trim() || !queryPlace.trim()) {
        return false;
    }
    const normalize = (value) => value
        .trim()
        .replace(/\s+S$/i, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    const hay = normalize(addressPlace);
    const needle = normalize(queryPlace);
    return hay.includes(needle) || needle.includes(hay);
}
//# sourceMappingURL=geocoding.util.js.map