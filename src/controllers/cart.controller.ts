import { Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";
import { prismaClient } from "../app";
import { CreateCartSchema } from "../validator-schema/cart";
import { Product } from "@prisma/client";
import { UnprocessableEntity } from "../exceptions/validation.exception";
import { NotFoundException } from "../exceptions/notfound.exceptions";

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;

  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to add item to cart"
    );
  }
  // check if productId exist
  if (!req.body.productId) {
    throw new UnprocessableEntity(
      "Product ID not provided",
      ErrorCode.BAD_REQUEST,
      "Please provide product ID"
    );
  }
  if (!validatedData.quantity) {
    throw new UnprocessableEntity(
      "Quantity not provided",
      ErrorCode.BAD_REQUEST,
      "Please provide quantity"
    );
  }
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: req.body.productId,
      },
    });
    
  } catch (error) {
    console.log(error);
    throw new NotFoundException(
      "Product not found",
      ErrorCode.NOT_FOUND,
      "Please provide a valid product ID"
    );
    
  }
  // add item to cart
  const cartItem = await prismaClient.cartItem.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  // return cart item
  res.status(201).json(cartItem);
};

export const removeItemFromCart = async (
  req: Request,
  res: Response
): Promise<void> => {};
export const updateItemInCart = async (
  req: Request,
  res: Response
): Promise<void> => {};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to view cart"
    );
  }
  // get all cart items
  const cartItems = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id,
    },
  });
  // return cart items
  res.status(200).json(cartItems);
};
