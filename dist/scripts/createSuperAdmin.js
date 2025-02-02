"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function createSuperAdmin() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = "superadmin@gmail.com";
        const password = "123456";
        const role = "SUPER_ADMIN";
        // Check if the super admin already exists
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            console.log("Super admin already exists");
            return;
        }
        // Hash the password
        const hashPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create the super admin user
        const superAdmin = yield prisma.user.create({
            data: {
                email,
                password: hashPassword,
                role,
            },
        });
        console.log("Super admin created successfully:", superAdmin);
    });
}
createSuperAdmin()
    .catch((e) => {
    console.error(e);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
//   npx ts-node src/scripts/createSuperAdmin.ts
