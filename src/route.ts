
import { Router, Request, Response, NextFunction } from "express";

import employeeRouter from './Employee/route';

const router = Router();

router.use("/employee", employeeRouter);

export default router