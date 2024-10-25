import jwt from "jsonwebtoken";
import pug from "pug";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.SECERT_KEY, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

export const filterObject = (object, ...allowedFields) => {
  const obj = {};

  allowedFields.forEach((field) => {
    if (object[field]) return (obj[field] = object[field]);
  });

  return obj;
};

// payment helper function



export const compileTemplate = (templatePath, data) => {
  const toHtml = pug.compileFile(`${templatePath}`);
  const html = toHtml(data);

  return html;
};


