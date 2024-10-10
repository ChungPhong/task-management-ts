import { Router, Request, Response } from "express";
const router: Router = Router();

import Task from "../../../model/task.model";

// const controller = require("../controllers/task.controller");
// router.get("/", controller.index);
// router.get("/detail/:id", controller.detail);

router.get("/", async (req: Request, res: Response) => {
  const tasks = await Task.find({
    deleted: false,
  });
  res.json(tasks);
});

router.get("/detail/:id", async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const task = await Task.findOne({
    deleted: false,
    _id: id,
  });
  res.json(task);
});

export const taskRoutes: Router = router;
