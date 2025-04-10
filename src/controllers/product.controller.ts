import { Request, Response } from "express";
import { ProductSchema } from "../schema/product";
import { prismaClient } from "../app";

interface CreateProductRequestBody {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export const createProduct = async (
  req: Request<{}, {}, CreateProductRequestBody>,
  res: Response
): Promise<void> => {
  ProductSchema.parse(req.body);
  // const { name, description, price, tags } = req.body;
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.status(201).json(product);
};
