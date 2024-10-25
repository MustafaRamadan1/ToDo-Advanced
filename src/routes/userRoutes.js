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
  Authorization("employee"),
  updateUserPassword
);

router.get("/test", isAuth, Authorization("employee"), getAllUsers);

router.get("/employees", isAuth, Authorization("leader"), getAllUsers);
router.get('/employees/:id', isAuth,Authorization('leader'), getUserById);

export default router;
