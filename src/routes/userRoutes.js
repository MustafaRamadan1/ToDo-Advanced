import { Router } from "express";
import {
  login,
  signUp,
  updateUserPassword,
  getUserById,
  getAllEmployees,
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

router.get("/employees", isAuth, Authorization("leader"), getAllEmployees);
router.get('/employees/:id', isAuth,Authorization('leader'), getUserById);

export default router;
