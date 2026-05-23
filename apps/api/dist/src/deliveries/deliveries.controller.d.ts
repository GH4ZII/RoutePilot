import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { ListDeliveriesQueryDto } from './dto/list-deliveries-query.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { ImportCsvBodyDto } from './dto/import-csv.dto';
import { DeliveriesService } from './deliveries.service';
export declare class DeliveriesController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    findAll(user: JwtPayload, query: ListDeliveriesQueryDto): Promise<import("./deliveries.service").DeliveryResponse[]>;
    create(user: JwtPayload, dto: CreateDeliveryDto): Promise<import("./deliveries.service").DeliveryResponse>;
    importCsv(user: JwtPayload, file?: Express.Multer.File, body?: ImportCsvBodyDto): Promise<import("./deliveries.service").ImportCsvResult> | {
        created: never[];
        errors: {
            row: number;
            message: string;
        }[];
    };
    findOne(user: JwtPayload, id: string): Promise<import("./deliveries.service").DeliveryResponse>;
    update(user: JwtPayload, id: string, dto: UpdateDeliveryDto): Promise<import("./deliveries.service").DeliveryResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
}
