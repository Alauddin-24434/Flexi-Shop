import { Prisma } from "@prisma/client";

interface QueryOptions {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

export const getQueryOptions = (query: QueryOptions) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder: Prisma.SortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  // Category & Price Filtering
  const categoryFilter = query.category ? { category: { name: query.category } } : {};
  const priceFilter =
    query.minPrice || query.maxPrice
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
