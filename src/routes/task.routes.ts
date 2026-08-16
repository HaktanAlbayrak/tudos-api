import { Router } from "express";

import * as taskController from "../controllers/task.controller";

const router = Router();

router.get("/", taskController.getAll);
router.post("/", taskController.create);

router.get("/:id", taskController.getById);
router.patch("/:id", taskController.update);
router.delete("/:id", taskController.remove);

export default router;
