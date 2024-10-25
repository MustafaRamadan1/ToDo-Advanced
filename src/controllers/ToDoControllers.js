import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import ToDo from "../Db/models/toDo.model.js";
import { deletePhotoFromServer, uploadToCloudinary } from "../utils/uploadImgHelperFunc.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";
import ApiFeature from '../utils/ApiFeature.js';

export const createToDo = catchAsync(async (req, res, next) => {
  const { title, description, assignedTo, priority, state } = req.body;

  if (!title || !description || !assignedTo || !priority || !state) {
    return next(new AppError("Please provide all required fields", 400));
  }

  const cloudinaryUrl = await uploadToCloudinary(req.image);
  await deletePhotoFromServer(req.image);

  const newToDo = await ToDo.create({
    title,
    description,
    assignedTo,
    priority,
    state,
    photo: cloudinaryUrl,
  });

  if (!newToDo) {
    cloudinaryDeleteImg(cloudinaryUrl.id);

    return next(new AppError(`Couldn't create the ToDo Document`, 400));
  }

  res.status(201).json({
    status: "success",
    data: newToDo,
  });
});



export const getAllToDos = catchAsync(async (req,res,next)=>{
    const documentsNumber = await ToDo.countDocuments();
    const apiFeature = new ApiFeature(ToDo.find(),req.query).filter().sort().pagination(documentsNumber);


    const allToDos = await apiFeature.query.populate('assignedTo')


    if(allToDos.length === 0){
        return next(new AppError('No documents found',404));
    }



    res.status(200).json({
        status:'success',
        result:allToDos.length,
        data:allToDos
    })
})



export const getToDoById = catchAsync(async(req,res,next)=>{


    const {id} = req.params;

    const currentToDo = await ToDo.findById(id).populate('assignedTo');

    if(!currentToDo) return next(new AppError(`No To Do found with this id ${id}`,404));


    res.status(200).json({
        status:'success',
        data:currentToDo
    })
})


export const deleteToDo = catchAsync(async (req, res, next)=>{

  const {id} = req.params;

  const deletedToDo = await ToDo.findById(id).populate('assignedTo');

  if(!deletedToDo) return next(new AppError(`No To Do found with this id ${id}`,404));


  res.status(204).json({
    status:'success',
    message:`To Do with id ${id} has been deleted successfully`
  })
})