import mongoose from "mongoose";

const toDoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "ToDo Must has a title"],
      minLength: [5, "ToDo title must be at least 5 character"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "ToDo Must has a description"],
      minLength: [10, "ToDo description must be at least 10 character"],
      trim: true
    },
    assignedTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User"
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low"
    },
    state: {
      type: String,
      required: [true, "ToDo Must has a state for the task"],
      enum: {
        values: ["todo", "doing", "done"],
        message: "Status must be pending,in-progress,completed or overdue"
      },
      default: "pending"
    },
    photo: {
      id: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("ToDo", toDoSchema);
