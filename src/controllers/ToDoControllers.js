import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import ToDo from '../Db/models/toDo.model.js';
import { uploadToCloudinary } from "../utils/uploadImgHelperFunc.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";


export const createToDo = catchAsync(async (req, res ,next)=>{

    const {title, description, assignedTo, priority, state} = req.body;

    
    
    
    if(!title || !description || !assignedTo || !priority || !state){
        return next(new AppError("Please provide all required fields", 400));
    }
    
    const cloudinaryUrl = await uploadToCloudinary(req.image)

    const newToDo = await ToDo.create({title, description, assignedTo, priority, state, photo:cloudinaryUrl});

    if(!newToDo){

        cloudinaryDeleteImg(cloudinaryUrl.id);

        return next(new AppError(`Couldn't create the ToDo Document`, 400));
    }



    res.status(201).json({
        status:'success',
        data: newToDo
    })
})