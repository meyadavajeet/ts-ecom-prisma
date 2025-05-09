import { Request, Response } from "express";
import { ProductSchema } from "../validator-schema/product";
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
  // const products = await prismaClient.product.findMany();
  // add pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1;
  const skip = (page - 1) * limit;
  const products = await prismaClient.product.findMany({
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });
  const totalProducts = await prismaClient.product.count();
  const totalPages = Math.ceil(totalProducts / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const previousPage = hasPreviousPage ? page - 1 : null;
  const pagination = {
    totalProducts,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPage,
    previousPage,
  };
  res.setHeader("X-Pagination", JSON.stringify(pagination));
  res.status(200).json({
    pagination,
    products,
  });
};

export const getProductById = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await prismaClient.product.findFirstOrThrow({
      where: { id },
    });

    res.status(200).json(product);
  } catch (error) {
    throw new NotFoundException("Product not found", ErrorCode.NOT_FOUND);
  }
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

export const searchProduct = async (req: Request, res: Response) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).json({ message: "Please provide a search query" });
    return;
  }
  const products = await prismaClient.product.findMany({
    where: {
      // OR: [
      //   { name: { contains: q as string, mode: "insensitive" } },
      //   { description: { contains: q as string, mode: "insensitive" } },
      //   { tags: { contains: q as string, mode: "insensitive" } },
      // ],
      name: {
        contains: q as string,
        mode: "insensitive",
      },
      description: {
        contains: q as string,
        mode: "insensitive",
      },
      tags: {
        contains: q as string,
        mode: "insensitive",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: 0,
    take: 10,
  });
  res.status(200).json(products);
};
