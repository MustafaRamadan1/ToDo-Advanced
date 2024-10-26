import mongoose from "mongoose";

/*

description (String): Detailed description of the task, including any necessary instructions.
assignedTo (Array of ObjectId): List of employees assigned to the task (in case of multiple assignees).
dueDate (Date): Deadline for task completion.
priority (String, enum: ["low", "medium", "high"]): Priority level of the task.
status (String, enum: ["pending", "in-progress", "completed", "overdue"]): Current status of the task.
photo (String or Array of Strings): URLs or paths to images related to the task, allowing multiple photos if needed.
tags (Array of Strings): Tags or labels to categorize tasks for easier searching/filtering.
completedAt (Date, optional): Timestamp when the task is marked as completed.

*/

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
