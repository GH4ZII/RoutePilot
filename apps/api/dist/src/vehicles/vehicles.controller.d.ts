import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles-query.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    findAll(user: JwtPayload, query: ListVehiclesQueryDto): Promise<import("./vehicles.service").VehicleResponse[]>;
    create(user: JwtPayload, dto: CreateVehicleDto): Promise<import("./vehicles.service").VehicleResponse>;
    findOne(user: JwtPayload, id: string): Promise<import("./vehicles.service").VehicleResponse>;
    update(user: JwtPayload, id: string, dto: UpdateVehicleDto): Promise<import("./vehicles.service").VehicleResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
}
