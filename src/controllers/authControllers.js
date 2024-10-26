import User from "../Db/models/user.model.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { signToken, compileTemplate } from "../utils/helperFunc.js";
import sendEmail from "../utils/sendEmail.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import logger from "../utils/logger.js";
import ApiFeature from "../utils/ApiFeature.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const newUser = await User.create({
    name: name.split(" ")[0],
    email,
    password,
    role,
  });

  if (!newUser) {
    logger.error(`Couldn't Create new user`, {
      name,
      email,
    });
    return next(new AppError(`Couldn't create new User`, 400));
  }

  const html = compileTemplate(`${__dirname}/../views/activateAccount.pug`, {
    firstName: newUser.name,
  });

  await sendEmail({
    to: newUser.email,
    subject: `Welcome ${newUser.name} to our site`,
    text: `This Email to Welcome you on the site`,
    html,
  });

  const token = signToken({ id: newUser._id });
  logger.info(`Created the user and send OTP to the email`, {
    userId: newUser._id,
    name: newUser.name,
    email: newUser.email,
  });

  res.status(200).json({
    status: "success",
    token,
    data: newUser,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    logger.error(`Invalid Email or Password for user in login`, {
      email,
    });
    return next(new AppError(`Invalid email or password`, 404));
  }

  if (!(await user.CheckPassword(password))) {
    logger.error(`Invalid Email or Password for user in login`, {
      email,
    });
    return next(new AppError(`Invalid email or password`, 404));
  }

  const token = signToken({ id: user._id });

  logger.info(`User Authenticated Success`, {
    userId: user._id,
    email: user.email,
    name: user.name,
    isActive: user.isActive,
  });

  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

export const getAllEmployees = catchAsync(async (req, res, next) => {
  const limit = req.query.limit * 1 || 5;

  const totalDocumentCounts = await User.countDocuments();

  const apiFeature = new ApiFeature(User.find({ role: "employee" }), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();

  const _getAllUsers = await apiFeature.query;

  logger.info(`Get All User Route Accessed by following account`, {
    userId: req.user._id,
    role: req.user._role,
  });

  res.status(200).json({
    status: "success",
    result: _getAllUsers.length,
    numPages: Math.ceil(totalDocumentCounts / limit),
    data: _getAllUsers,
  });
});

export const updateUserPassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    logger.error(`No User Found`);
    return next(new AppError(` User Not Found`, 404));
  }

  if (!(await user.CheckPassword(oldPassword))) {
    logger.error(`Invalid Password`, {
      userId: req.user._id,
    });
    return next(new AppError(` Invalid Password`, 400));
  }

  user.password = newPassword;
  await user.save();

  logger.info(
    `Update Password for the user after received the old Password and he's authenticated`,
    {
      userId: req.user._id,
    }
  );

  res.status(200).json({
    status: "success",
    message: "Password Changed Successfully",
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id).populate("cart");

  if (!user) {
    return next(new AppError(`No User with this id`, 404));
  }
  res.status(200).json({
    status: "success",
    data: user,
  });
});
