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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("../generated/prisma/client");
let AuthService = class AuthService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async register(dto) {
        const email = dto.email.toLowerCase();
        const slug = dto.organizationSlug.toLowerCase();
        const existingOrg = await this.prisma.organization.findUnique({
            where: { slug },
        });
        if (existingOrg) {
            throw new common_1.ConflictException('Organization slug already in use');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const result = await this.prisma.$transaction(async (tx) => {
            const organization = await tx.organization.create({
                data: {
                    name: dto.organizationName,
                    slug,
                },
            });
            const user = await tx.user.create({
                data: {
                    organizationId: organization.id,
                    email,
                    passwordHash,
                    role: client_1.UserRole.ADMIN,
                    name: dto.name,
                },
            });
            return { organization, user };
        });
        return this.buildAuthResponse(result.user, result.organization);
    }
    async login(dto) {
        const email = dto.email.toLowerCase();
        const slug = dto.organizationSlug.toLowerCase();
        const organization = await this.prisma.organization.findUnique({
            where: { slug },
        });
        if (!organization) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                organizationId_email: {
                    organizationId: organization.id,
                    email,
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.buildAuthResponse(user, organization);
    }
    async getMe(userId, organizationId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, organizationId },
            include: { organization: true },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return this.toUserResponse(user, user.organization);
    }
    buildAuthResponse(user, organization) {
        const payload = {
            sub: user.id,
            organizationId: user.organizationId,
            role: user.role,
        };
        const accessToken = this.jwt.sign(payload, {
            expiresIn: (this.config.get('JWT_EXPIRES_IN') ??
                '7d'),
        });
        return {
            accessToken,
            user: this.toUserResponse(user, organization),
        };
    }
    toUserResponse(user, organization) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            organization: {
                id: organization.id,
                name: organization.name,
                slug: organization.slug,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map