import { SuggestAddressQueryDto } from './dto/suggest-address-query.dto';
import { GeocodingService } from './geocoding.service';
export declare class GeocodingController {
    private readonly geocoding;
    constructor(geocoding: GeocodingService);
    suggest(query: SuggestAddressQueryDto): Promise<import("./geocoding.service").GeocodedLocation[]>;
}
