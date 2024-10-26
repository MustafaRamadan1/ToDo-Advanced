import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import ToDo from "../Db/models/toDo.model.js";
import {
  deletePhotoFromServer,
  uploadToCloudinary,
} from "../utils/uploadImgHelperFunc.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";
import ApiFeature from "../utils/ApiFeature.js";

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

export const getAllToDos = catchAsync(async (req, res, next) => {

  const { priority, state, title } = req.query;

  const queryObj = {
  };

  if (title) {
    const regex = new RegExp(
      title
        .split("")
        .map((title) => `(?=.*${title})`)
        .join(""),
      "i"
    );

    queryObj.title = regex;
  }

  if (priority) {
    queryObj.priority = priority;
  }

  if (state) {
    queryObj.state = state;
  }


// sort 
if(req.query.sort){

  req.query.sort = req.query.sort.split(",").join(" ");
}
else {
  req.query.sort = '-createdAt';
}




// Pagination

const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 2;
const skip = (page - 1) * limit;

const documentsCount = (await ToDo.find(queryObj).sort(req.query.sort)).length;

let allToDos =  ToDo.find(queryObj).populate("assignedTo").sort(req.query.sort)


if(skip > documentsCount){
  allToDos = [];
}

 allToDos = await ToDo.find(queryObj).populate("assignedTo").sort(req.query.sort).skip(skip).limit(limit);



  if (allToDos.length === 0) {
    allToDos = [];
  }
  res.status(200).json({
    status: "success",
    result: allToDos.length,
    data: allToDos,
  });
});

export const getToDoById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const currentToDo = await ToDo.findById(id).populate("assignedTo");

  if (!currentToDo)
    return next(new AppError(`No To Do found with this id ${id}`, 404));

  res.status(200).json({
    status: "success",
    data: currentToDo,
  });
});

export const getUserToDos = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const { priority, state, title } = req.query;

  const queryObj = {
    assignedTo: { $in: [userId] },
  };

  if (title) {
    const regex = new RegExp(
      title
        .split("")
        .map((title) => `(?=.*${title})`)
        .join(""),
      "i"
    );

    queryObj.title = regex;
  }

  if (priority) {
    queryObj.priority = priority;
  }

  if (state) {
    queryObj.state = state;
  }


// sort 
if(req.query.sort){

  req.query.sort = req.query.sort.split(",").join(" ");
}
else {
  req.query.sort = '-createdAt';
}




// Pagination

const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 4;
const skip = (page - 1) * limit;

const documentsCount = (await ToDo.find(queryObj).sort(req.query.sort)).length;



if(skip > documentsCount){
  userToDos = [];
}

let userToDos = await ToDo.find(queryObj).populate("assignedTo").sort(req.query.sort).skip(skip).limit(limit);




  if (userToDos.length === 0) {
    userToDos = [];
  }

  res.status(200).json({
    status: "success",
    result: userToDos.length,
    data: userToDos,
  });
});

export const deleteToDo = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedToDo = await ToDo.findById(id).populate("assignedTo");

  if (!deletedToDo)
    return next(new AppError(`No To Do found with this id ${id}`, 404));

  res.status(204).json({
    status: "success",
    message: `To Do with id ${id} has been deleted successfully`,
  });
});

export const getFilteredToDos = catchAsync(async (req, res, next) => {
  const { pattern } = req.params;

  const toDos = await ToDo.find({
    title: { $regex: pattern, $options: "i" },
  }).populate("assignedTo");

  if (toDos.length === 0) {
    return next(new AppError(`No To Do found with this id ${id}`, 404));
  }

  res.status(200).json({
    status: "success",
    result: toDos.length,
    data: toDos,
  });
});
