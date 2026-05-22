"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const org_scope_service_1 = require("../common/org-scope.service");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    orgScope;
    constructor(prisma, orgScope) {
        this.prisma = prisma;
        this.orgScope = orgScope;
    }
    async findAll(user) {
        const rows = await this.prisma.user.findMany({
            where: this.orgScope.forOrganization(user),
            orderBy: { createdAt: 'desc' },
        });
        return rows.map(toUserResponse);
    }
    async findOne(user, id) {
        const row = await this.findScopedOrThrow(user, id);
        return toUserResponse(row);
    }
    async create(user, dto) {
        const organizationId = this.orgScope.requireOrganizationId(user);
        const email = dto.email.toLowerCase();
        const existing = await this.prisma.user.findUnique({
            where: { organizationId_email: { organizationId, email } },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already in use in this organization');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const created = await this.prisma.user.create({
            data: {
                organizationId,
                email,
                passwordHash,
                role: dto.role,
                name: dto.name,
            },
        });
        return toUserResponse(created);
    }
    async update(user, id, dto) {
        await this.findScopedOrThrow(user, id);
        const data = {};
        if (dto.role !== undefined) {
            data.role = dto.role;
        }
        if (dto.name !== undefined) {
            data.name = dto.name;
        }
        if (dto.password) {
            data.passwordHash = await bcrypt.hash(dto.password, 12);
        }
        const updated = await this.prisma.user.update({
            where: { id },
            data,
        });
        return toUserResponse(updated);
    }
    async remove(user, id) {
        if (user.sub === id) {
            throw new common_1.ForbiddenException('You cannot delete your own account');
        }
        await this.findScopedOrThrow(user, id);
        await this.prisma.user.delete({ where: { id } });
    }
    async findScopedOrThrow(user, id) {
        const row = await this.prisma.user.findFirst({
            where: this.orgScope.forOrganization(user, { id }),
        });
        if (!row) {
            throw new common_1.NotFoundException('User not found');
        }
        return row;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        org_scope_service_1.OrgScopeService])
], UsersService);
function toUserResponse(user) {
    return {
        id: user.id,
        organizationId: user.organizationId,
        email: user.email,
        role: user.role,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}
//# sourceMappingURL=users.service.js.map