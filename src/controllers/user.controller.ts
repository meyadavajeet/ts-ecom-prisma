import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../validator-schema/user";
import { prismaClient } from "../app";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";
import { Address } from "@prisma/client";
import { NotFoundException } from "../exceptions/notfound.exceptions";
import { BadRequestException } from "../exceptions/badrequest.exceptions";

interface CreateAddressBody {
  lineOne: string;
  lineTwo: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

interface UpdateUserBody {
  name: string | null;
  shippingAddress: number | null;
  defaultAddress: number | null;
}

export const addAddress = async (
  req: Request<{}, {}, CreateAddressBody>,
  res: Response
): Promise<void> => {
  // validate payload
  AddressSchema.parse(req.body);
  console.log(req.body);

  // create address
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user?.id,
    },
  });
  // return address
  res.status(201).json(address);
};

export const listAllAddress = async (
  req: Request,
  res: Response
): Promise<void> => {
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to view address"
    );
  }
  // get all address
  const address = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  // return address
  res.status(200).json(address);
};

export const deleteAddress = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response
): Promise<void> => {
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to delete address"
    );
  }
  // delete address
  const address = await prismaClient.address.delete({
    where: {
      id: req.params.id,
    },
  });
  // return address
  res.status(200).json(address);
};

export const updateAddress = async (
  req: Request<{ id: number }, {}, CreateAddressBody>,
  res: Response
): Promise<void> => {
  // validate payload
  AddressSchema.parse(req.body);
  const { lineOne, lineTwo, city, state, country, pinCode } = req.body;
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to update address"
    );
  }
  // update address
  const address = await prismaClient.address.update({
    where: {
      id: req.params.id,
    },
    data: {
      lineOne,
      lineTwo,
      city,
      state,
      country,
      pinCode,
    },
  });
  // return address
  res.status(200).json(address);
};

export const getAddressById = async (
  req: Request<{ id: number }, {}, {}>,
  res: Response
): Promise<void> => {
  // check if userId exist
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to view address"
    );
  }
  // get address by id
  const address = await prismaClient.address.findFirstOrThrow({
    where: {
      id: req.params.id,
    },
  });
  // return address
  res.status(200).json(address);
};

export const updateUser = async (
  req: Request<{}, {}, UpdateUserBody>,
  res: Response
): Promise<void> => {
  if (!req?.user?.id) {
    throw new UnAuthorizedException(
      "User not authorized",
      ErrorCode.UNAUTHORIZED,
      "Please login to delete address"
    );
  }
  const validateData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let defaultAddress: Address;
  if (validateData.shippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: +validateData.shippingAddress,
        },
      });
    } catch (e) {
      console.log(e);
      throw new NotFoundException("Address not found", ErrorCode.NOT_FOUND);
    }
    if (shippingAddress.userId != req.user.id) {
      throw new BadRequestException(
        "Address does not belongs to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONGS_TO_USER
      );
    }
  }
  if (validateData.defaultAddress) {
    try {
      defaultAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: +validateData.defaultAddress,
        },
      });
    } catch (e) {
      console.log(e);
      throw new NotFoundException("Address not found", ErrorCode.NOT_FOUND);
    }
    if (defaultAddress.userId != req.user.id) {
      throw new BadRequestException(
        "Address does not belongs to user",
        ErrorCode.ADDRESS_DOES_NOT_BELONGS_TO_USER
      );
    }
  }
  const updateUser = await prismaClient.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      name: validateData.name,
      defaultAddress: validateData.defaultAddress
        ? +validateData.defaultAddress
        : null,
      shippingAddress: validateData.shippingAddress
        ? +validateData.shippingAddress
        : null,
    },
  });
  res.status(200).json(updateUser);
};

/**
 *
 * ADMIN CONTROLLERS
 *
 */
export const getAllUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany({
    where: {
      role: "USER",
    },
    skip: req.params.skip ? +req.params.skip : 0,
    take: req.params.take ? +req.params.take : 10,
  });
  res.status(200).json(users);
};
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new NotFoundException("Please provide User ID", ErrorCode.NOT_FOUND);
  }
  try {
    const user = await prismaClient.user.findFirstOrThrow({
      where: {
        id: +id,
      },
      include: {
        Address: true,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    throw new NotFoundException("User not found", ErrorCode.NOT_FOUND);
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!id) {
    throw new NotFoundException("User not found", ErrorCode.NOT_FOUND);
  }
  if (!role) {
    throw new BadRequestException("Role not provided", ErrorCode.BAD_REQUEST);
  }
  // role may be "USER" or "ADMIN"
  if (role !== "USER" && role !== "ADMIN") {
    throw new BadRequestException(
      "Role must be either USER or ADMIN",
      ErrorCode.BAD_REQUEST
    );
  }
  // check if userId exist
  try {
    await prismaClient.user.findFirstOrThrow({
      where: {
        id: +id,
      },
    });
  } catch (e) {
    console.log(e);
    throw new NotFoundException("User not found", ErrorCode.NOT_FOUND);
  }
  const user = await prismaClient.user.update({
    where: {
      id: +id,
    },
    data: {
      role,
    },
  });
  res.status(200).json(user);
};

/**
 * END OF ADMIN CONTROLLERS
 */
