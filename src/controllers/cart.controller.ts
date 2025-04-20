import { Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";
import { prismaClient } from "../app";
import { CreateCartSchema, UpdateCartQuanity } from "../validator-schema/cart";
import { Product } from "@prisma/client";
import { UnprocessableEntity } from "../exceptions/validation.exception";
import { NotFoundException } from "../exceptions/notfound.exceptions";

export const addItemToCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  //TODO: if product already available in cart, update the quantity
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
  // check if product already exist in the cart for the same user if yes, update the quantity
  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user.id,
      productId: req.body.productId,
    },
  });
  if (existingCartItem) {
    const updatedCartItem = await prismaClient.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + validatedData.quantity,
      },
    });
    res.status(200).json(updatedCartItem);
    return;
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
): Promise<void> => {
  //? TODO: Before removing item from cart, check cart item belongs to that user
  const cartItemId = req.params.id;
  if (!req?.user?.id) {
    throw new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }
  if (!cartItemId) {
    throw new UnprocessableEntity(
      "Cart Id is not provided",
      ErrorCode.BAD_REQUEST,
      "Please provide cart id"
    );
  }
  // find the records of cart
  const cartItem = await prismaClient.cartItem.findFirst({
    where: {
      id: +cartItemId,
      // userId: req.user.id,
    },
  });
  if (!cartItem) {
    throw new NotFoundException("Cart Item Not Found", ErrorCode.NOT_FOUND);
  }
  if(cartItem.userId != req.user.id) {
    throw new NotFoundException("Cart Item not belongs to you", ErrorCode.NOT_FOUND);
  }
  await prismaClient.cartItem.delete({
    where: {
      id: +cartItemId,
      userId: req.user.id,
    },
  });
  res.status(200).json({ message: "success" });
};
export const updateItemInCart = async (
  req: Request,
  res: Response
): Promise<void> => {
  const validatedData = UpdateCartQuanity.parse(req.body);
  const cartItemId = req.params.id;
  if (!req?.user?.id) {
    throw new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }
  if (!cartItemId) {
    throw new UnprocessableEntity(
      "Cart Id is not provided",
      ErrorCode.BAD_REQUEST,
      "Please provide cart id"
    );
  }

  // find the records of cart
  const cartItem = await prismaClient.cartItem.findFirst({
    where: {
      id: +cartItemId,
      // userId: req.user.id,
    },
  });
  if (!cartItem) {
    throw new NotFoundException("Cart Item Not Found", ErrorCode.NOT_FOUND);
  }
  if(cartItem.userId != req.user.id) {
    throw new NotFoundException("Cart Item not belongs to you", ErrorCode.NOT_FOUND);
  }
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: +cartItemId,
      userId: req.user.id,
    },
    data: {
      quantity: +validatedData.quantity,
    },
  });
  res.status(200).json(updatedCart);
};

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
    include: {
      product: true,
    },
  });
  // return cart items
  res.status(200).json(cartItems);
};
