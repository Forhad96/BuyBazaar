import { Product } from "@prisma/client";

export interface ProductResponse {
    meta: {
      page: number;
      limit: number;
      total: number;
    };
    data: Product[];
  }