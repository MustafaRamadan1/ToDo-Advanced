import sharp from "sharp";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { catchAsync } from "./catchAsync.js";
import AppError from "./AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const resizeProductImg = catchAsync(async (req, res, next) => {
  if (req.file) {
    const filepath = `${__dirname}/../uploads/tasks/${uuid()}.jpg`;

    await sharp(req.file.buffer)
      .sharpen({
        sigma: 1,
        m1: 0.8,
        m2: 0.7,
      })
      .toFormat("jpeg", {
        quality: 90, // Keep quality high
        progressive: true,
        chromaSubsampling: "4:4:4", // Retain full color quality
        trellisQuantisation: true,
        overshootDeringing: true,
        optimizeScans: true,
      })
      .toFile(filepath);


    req.image = filepath;

    return next();
  } else {
    if (req.params.id && req.method === "PUT" && !req.file) {
      return next();
    } 
  }
    next();
  });

 


export default resizeProductImg;
