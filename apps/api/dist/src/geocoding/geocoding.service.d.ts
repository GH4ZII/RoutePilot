import { ConfigService } from '@nestjs/config';
export type GeocodedLocation = {
    latitude: number;
    longitude: number;
    displayName: string;
};
export type AddressSuggestion = GeocodedLocation;
export declare class GeocodingService {
    private readonly config;
    constructor(config: ConfigService);
    geocode(address: string): Promise<GeocodedLocation>;
    suggest(query: string): Promise<AddressSuggestion[]>;
    private searchNominatim;
    private toLocation;
}
