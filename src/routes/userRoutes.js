import { Router } from "express";
import {
  getAllUsers,
  login,
  signUp,
  updateUserPassword,
  getUserById,
} from "../controllers/authControllers.js";
import isAuth from "../middlewares/authentication.js";
import Authorization from "../middlewares/Authorization.js";

const router = Router();

router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.patch(
  "/auth/updatePassword",
  isAuth,
  Authorization("user"),
  updateUserPassword
);


router.get("/users", isAuth, Authorization("admin"), getAllUsers);
router.get('/users/:id', isAuth,Authorization('admin'), getUserById);

export default router;
