import express from "express";
import isAuth from "../middlewares/authentication.js";
import Authorization from "../middlewares/Authorization.js";
import uploadImages from "../middlewares/uploadImages.js";
import resizeProductImg from "../utils/resizeProductsImage.js";
import {
  createToDo,
  getAllToDos,
  getToDoById,
  deleteToDo,
  getUserToDos,
  updateToDoByEmployee,
  updateToDoByLeader,
} from "../controllers/ToDoControllers.js";

const ToDoRouter = express.Router();

// create , get all , get , update , delete

ToDoRouter.post(
  "/",
  uploadImages.single("image"),
  resizeProductImg,
  isAuth,
  Authorization("leader"),
  createToDo
);
ToDoRouter.get("/", isAuth, Authorization("leader"), getAllToDos);
ToDoRouter.get(
  "/:id",
  isAuth,
  Authorization("leader", "employee"),
  getToDoById
);
ToDoRouter.get(
  "/users/:userId",
  isAuth,
  Authorization("leader", "employee"),
  getUserToDos
);
ToDoRouter.delete("/:id", isAuth, Authorization("leader"), deleteToDo);
ToDoRouter.patch(
  "/:id/employee",
  isAuth,
  Authorization("employee"),
  updateToDoByEmployee
);
ToDoRouter.put(
  "/:id/leader",
  uploadImages.single("image"),
  resizeProductImg,
  isAuth,
  Authorization("leader"),
  updateToDoByLeader
);

export default ToDoRouter;
