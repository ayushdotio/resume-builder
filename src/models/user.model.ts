import { Document, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "@/types/user.types";

interface IUserModel extends Omit<IUser, "_id">, Document {
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUserModel>({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Password is required."],
    minLength: [6, "Password must be at least 6 characters long."],
    select: false,
  },

  mobile: {
    type: String,
    unique: true,
    trim: true,
    minLength: [10, "Mobile number must be 10 digits"],
    maxLength: [10, "Mobile number must be 10 digits"],
  },
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (): Promise<void> {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export const User = model("User", userSchema);
