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
              quantity: item.quantity,
              price: item.product.price,
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

export const getOrderById = async (req: Request, res: Response) => {
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to view order"
    );
  }
  if (!req.params.id) {
    throw new UnAuthorizedException(
      "Order ID not provided",
      ErrorCode.BAD_REQUEST,
      "Please provide order ID"
    );
  }
  // get order by id
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
        userId: req.user.id,
      },
      include: {
        orderProducts: true,
        orderEvent: true,
      },
    });
    // return order
    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    throw new UnAuthorizedException(
      "Order not found",
      ErrorCode.NOT_FOUND,
      "Please provide valid order ID"
    );
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to view orders"
    );
  }
  // get all orders
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  // return orders
  res.status(200).json(orders);
};
export const cancelOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (prisma) => {
    // check if userId exist
    if (!req?.user?.id) {
      throw new UnAuthorizedException(
        "User not authorized",
        ErrorCode.UNAUTHORIZED,
        "Please login to cancel order"
      );
    }
    if (!req.params.id) {
      throw new UnAuthorizedException(
        "Order ID not provided",
        ErrorCode.BAD_REQUEST,
        "Please provide order ID"
      );
    }
    // cancel order
    const order = await prisma.order.update({
      where: {
        id: +req.params.id,
        userId: req.user.id,
      },
      data: {
        status: "CANCELLED",
      },
    });
    // create order event
    await prisma.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELLED",
      },
    });
    // return order
    res.status(200).json(order);
  });
};

/**
 * ADMIN CONTROLLERS START
 */

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  if (req.query.status) {
    whereClause = {
      ...whereClause,
      status: req.query.status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 10,
  });
  res.status(200).json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  // start transaction
  return await prismaClient.$transaction(async (prisma) => {
    try {
      // check if userId exist
      if (!req?.user?.id) {
        throw new UnAuthorizedException(
          "User not authorized",
          ErrorCode.UNAUTHORIZED,
          "Please login to change order status"
        );
      }
      if (!req.params.id) {
        throw new UnAuthorizedException(
          "Order ID not provided",
          ErrorCode.BAD_REQUEST,
          "Please provide order ID"
        );
      }
      if (!req.body.status) {
        throw new UnAuthorizedException(
          "Status not provided",
          ErrorCode.BAD_REQUEST,
          "Please provide order status"
        );
      }
      // change order status
      const order = await prisma.order.update({
        where: {
          id: +req.params.id,
        },
        data: {
          status: req.body.status,
        },
      });
      // create order event
      await prisma.orderEvent.create({
        data: {
          orderId: order.id,
          status: req.body.status,
        },
      });
      // return order
      res.status(200).json(order);
    } catch (error) {
      console.error("Transaction error:", error);
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  });
};

export const listUsersOrders = async (req: Request, res: Response) => {
  if (!req.query.userId) {
    throw new UnAuthorizedException(
      "User ID not provided",
      ErrorCode.BAD_REQUEST,
      "Please provide user ID"
    );
  }
  let whereClause: any = {
    userId: +req.query.userId,
  };
  if (req.query.status) {
    whereClause = {
      ...whereClause,
      status: req.query.status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: req.query.skip ? +req.query.skip : 0,
    take: req.query.take ? +req.query.take : 10,
  });
  res.status(200).json(orders);
};

/**
 * ADMIN CONTROLLERS END
 */
