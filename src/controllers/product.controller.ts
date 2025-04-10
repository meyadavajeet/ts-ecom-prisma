import { Request, Response } from "express";
import { ProductSchema } from "../schema/product";
import { prismaClient } from "../app";
import { NotFoundException } from "../exceptions/notfound.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";

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

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await prismaClient.product.findMany();
  res.status(200).json(products);
};

export const getProductById = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new NotFoundException("Product not found", ErrorCode.NOT_FOUND);
  }
  const product = await prismaClient.product.findFirst({
    where: { id },
  });
  if (!product) {
    throw new NotFoundException("Product not found", ErrorCode.NOT_FOUND);
  }
  res.status(200).json(product);
};

export const deleteProductById = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new NotFoundException("Product not found", ErrorCode.NOT_FOUND);
  }
  const product = await prismaClient.product.delete({
    where: { id },
  });
  res.status(200).json(product);
};

export const updateProduct = async (
  req: Request<{ id: number }, {}, CreateProductRequestBody>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  if (!id) {
    throw new NotFoundException("Product not found", ErrorCode.NOT_FOUND);
  }
  const product = await prismaClient.product.update({
    where: { id },
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.status(200).json(product);
};
