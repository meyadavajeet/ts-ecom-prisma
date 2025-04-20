import { Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";
import { prismaClient } from "../app";
export const createOrder = async (req: Request, res: Response) => {
  /**
   * TODO:
   * 1. To create a transaction
   * 2. To list all the cart items and proceed if cart is not empty
   * 3. Calculate the total price of the order
   * 4. Fetch the address of the user
   * 5. Create the formatted addess for the shipping address field
   * 6. Create the order
   * 7. Create the orderProducts
   * 8. Create the OrderEvents and by default it will be in PENDING state
   * 9. Clear the cart
   */

  //  1. To create a transaction
  return await prismaClient.$transaction(async (prisma) => {
    try {
      // check if userId exist
      if (!req?.user?.id) {
        throw new UnAuthorizedException(
          "User not authorized",
          ErrorCode.UNAUTHORIZED,
          "Please login to create order"
        );
      }

      const cartItems = await prisma.cartItem.findMany({
        where: {
          userId: req.user.id,
        },
        include: {
          product: true,
        },
      });
      // 2. To list all the cart items and proceed if cart is not empty
      if (cartItems.length === 0) {
        return res.status(400).json({
          message: "Cart is empty",
        });
      }
      // 3. Calculate the total price of the order
      const totalPrice = cartItems.reduce((prev, curr) => {
        return +(prev + curr.product.price * curr.quantity).toFixed(2);
      }, 0);
      // 4. Fetch the address of the user
      const address = await prisma.address.findFirst({
        where: {
          id: req.user.shippingAddress,
          userId: req.user.id,
        },
      });
      // 5. Create the formatted addess for the shipping address field
      if (!address) {
        return res.status(400).json({
          message: "Address not found",
        });
      }
      const formattedAddress = `${address.lineOne}, ${address.lineTwo}, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}`;
      // 6. Create the order
      const order = await prisma.order.create({
        data: {
          userId: req.user.id,
          netAmount: totalPrice,
          shippingAddress: formattedAddress,
          orderProducts: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity
            })),
          },
        },
      });
      // 7. Create the orderProducts

      // 8. Create the OrderEvents and by default it will be in PENDING state
      const events = await prisma.orderEvent.create({
        data: {
          orderId: order.id,
        },
      });

      // 9. Clear the cart
      await prisma.cartItem.deleteMany({
        where: {
          userId: req.user.id,
          id: {
            in: cartItems.map((item) => item.id),
          },
        },
      });
      return res.status(201).json({
        order,
        orderEvent: events,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};
export const getOrderById = async (req: Request, res: Response) => {};
export const getAllOrders = async (req: Request, res: Response) => {};
export const cancelOrder = async (req: Request, res: Response) => {};
