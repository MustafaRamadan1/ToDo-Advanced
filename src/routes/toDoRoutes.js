import express from 'express';
import isAuth from '../middlewares/authentication.js';
import Authorization from '../middlewares/Authorization.js';
import uploadImages from '../middlewares/uploadImages.js';
import resizeProductImg from '../utils/resizeProductsImage.js';
import { createToDo } from '../controllers/ToDoControllers.js';

const ToDoRouter = express.Router();

// create , get all , get , update , delete 

ToDoRouter.post('/',uploadImages.single('image'), resizeProductImg, isAuth, Authorization('leader'), createToDo)









export default ToDoRouter;