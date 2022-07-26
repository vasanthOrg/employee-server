import { Router } from "express";

import {
  getAllCtrl,
  createCtrl,
  updateCtrl,
  removeCtrl,
} from "./controller";

const employeeRouter: Router = Router();

employeeRouter.post("/list", getAllCtrl);

employeeRouter.post("/create", createCtrl);

employeeRouter.patch("/:id", updateCtrl);

employeeRouter.delete("/:id", removeCtrl);

export default employeeRouter;
