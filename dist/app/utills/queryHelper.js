"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQueryOptions = void 0;
const getQueryOptions = (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || "createdAt";
    const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";
    // Category & Price Filtering
    const categoryFilter = query.category ? { category: { name: query.category } } : {};
    const priceFilter = query.minPrice || query.maxPrice
        ? {
            price: {
                gte: query.minPrice ? Number(query.minPrice) : undefined,
                lte: query.maxPrice ? Number(query.maxPrice) : undefined,
            },
        }
        : {};
    // Search Query (name or description)
    const searchFilter = query.search
        ? {
            OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { description: { contains: query.search, mode: "insensitive" } },
            ],
        }
        : {};
    return { page, limit, skip, sortBy, sortOrder, categoryFilter, priceFilter, searchFilter };
};
exports.getQueryOptions = getQueryOptions;
