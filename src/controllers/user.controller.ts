import { Request, Response } from "express";
import { AddressSchema } from "../schema/user";
import { prismaClient } from "../app";
import { UnAuthorizedException } from "../exceptions/unauthorized.exceptions";
import { ErrorCode } from "../exceptions/root.exceptions";

interface CreateAddressBody {
  lineOne: string;
  lineTwo: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
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
}
