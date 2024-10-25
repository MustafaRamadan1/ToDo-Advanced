import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is Required"],
      trim: true,
      minLength: [3, "name must be at least 3 character"],
    },
    email: {
      type: String,
      required: [true, "email is Required"],
      trim: true,
      lowercase: true,
      unique: true,
      validate: [validator.isEmail, "Please Provide a valid "],
    },
    password: {
      type: String,
      required: [true, "Password is Required"],
      trim: true,
      minLength: [8, "password must be at least 8 character"],
    },
    role: {
      type: String,
      enum: {
        values: ["employee", "leader"],
        message: "Role must be user or admin",
      },
      default: "employee",
    },

    
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);


userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  }
  return next();
});


userSchema.methods.CheckPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};



userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.__v;
  delete userObject.password;

  return userObject;
};
export default mongoose.model("User", userSchema);
