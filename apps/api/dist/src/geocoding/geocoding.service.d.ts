export type GeocodedLocation = {
    latitude: number;
    longitude: number;
    displayName: string;
};
export type AddressSuggestion = GeocodedLocation;
export declare class GeocodingService {
    geocode(address: string): Promise<GeocodedLocation>;
    suggest(query: string): Promise<AddressSuggestion[]>;
    private searchAddresses;
    private rankResults;
    private searchStructured;
    private searchKartverket;
    private fetchKartverket;
    private toLocation;
    private formatDisplayName;
    private formatPlaceName;
}
