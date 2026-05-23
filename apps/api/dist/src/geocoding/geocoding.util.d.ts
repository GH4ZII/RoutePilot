export type ParsedAddressQuery = {
    raw: string;
    adressenavn?: string;
    nummer?: string;
    postnummer?: string;
    place?: string;
};
export declare function parseAddressQuery(query: string): ParsedAddressQuery;
export declare function normalizeAddress(value: string): string;
export declare function placeMatches(addressPlace: string | undefined, queryPlace: string): boolean;
