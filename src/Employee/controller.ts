import { Request, Response } from "express";

import {
  getAll,
  create,
  update,
  remove,
} from "./service";


export const getAllCtrl = async (req: Request, res: Response) => {
  try {
    const response = await getAll(req.body);
    res.send(response);
  } catch (err) {
    res
      .status(500)
      .send({ isSuccess: false, message: "Internal Server Error" });
  }
};

export const createCtrl = async (req: Request, res: Response) => {
  try {
    const response = await create(
      req.body);
    res.send(response);
  } catch (err) {
    res
      .status(500)
      .send({ isSuccess: false, message: "Internal Server Error" });
  }
};

export const updateCtrl = async (req: Request, res: Response) => {
  try {
    const response = await update(req.params.id, req.body);
    res.send(response);
  } catch (err) {
    res
      .status(500)
      .send({ isSuccess: false, message: "Internal Server Error" });
  }
};

export const removeCtrl = async (req: Request, res: Response) => {
  try {
    const response = await remove(req.params.id);
    res.send(response);
  } catch (err) {
    res
      .status(500)
      .send({ isSuccess: false, message: "Internal Server Error" });
  }
};
