import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ListDriversQueryDto } from './dto/list-drivers-query.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriversService } from './drivers.service';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    findAll(user: JwtPayload, query: ListDriversQueryDto): Promise<import("./drivers.service").DriverResponse[]>;
    create(user: JwtPayload, dto: CreateDriverDto): Promise<import("./drivers.service").DriverResponse>;
    findOne(user: JwtPayload, id: string): Promise<import("./drivers.service").DriverResponse>;
    update(user: JwtPayload, id: string, dto: UpdateDriverDto): Promise<import("./drivers.service").DriverResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
}
