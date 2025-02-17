"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidation = void 0;
const zod_1 = __importDefault(require("zod"));
// Product validation schema
exports.productValidation = zod_1.default.object({
    body: zod_1.default.object({
        name: zod_1.default.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        }),
        shopId: zod_1.default.string({
            required_error: 'Shop ID is required',
            invalid_type_error: 'Shop ID must be a string',
        }),
        description: zod_1.default.string({
            required_error: 'Description is required',
            invalid_type_error: 'Description must be a string',
        }),
        price: zod_1.default.number({
            required_error: 'Price is required',
            invalid_type_error: 'Price must be a number',
        }),
        tags: zod_1.default.array(zod_1.default.string({
            required_error: 'Tags are required',
            invalid_type_error: 'Each tags must be a string (path)',
        })),
        stock: zod_1.default.number({
            required_error: 'Stock is required',
            invalid_type_error: 'Stock must be an integer',
        }).int(),
        discount: zod_1.default.number({
            required_error: 'Discount is required',
            invalid_type_error: 'Discount must be a number',
        }),
        weight: zod_1.default.number({
            required_error: 'Weight is required',
            invalid_type_error: 'Weight must be a number',
        }),
    }),
});
