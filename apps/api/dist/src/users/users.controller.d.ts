import type { JwtPayload } from '../auth/types/jwt-payload';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(user: JwtPayload): Promise<import("./users.service").UserResponse[]>;
    create(user: JwtPayload, dto: CreateUserDto): Promise<import("./users.service").UserResponse>;
    findOne(user: JwtPayload, id: string): Promise<import("./users.service").UserResponse>;
    update(user: JwtPayload, id: string, dto: UpdateUserDto): Promise<import("./users.service").UserResponse>;
    remove(user: JwtPayload, id: string): Promise<void>;
}
