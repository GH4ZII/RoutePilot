import type { JwtPayload } from '../auth/types/jwt-payload';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    getMe(user: JwtPayload): Promise<import("./organizations.service").OrganizationResponse>;
    updateMe(user: JwtPayload, dto: UpdateOrganizationDto): Promise<import("./organizations.service").OrganizationResponse>;
}
