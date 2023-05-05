import mongoose, { Document, Model, Schema } from "mongoose";
import { compare, hash } from "bcrypt";

export interface IUser {
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface UserDocument extends IUser, Document {
  comparePassword(password: string): Promise<boolean>;
}

export interface UserModel extends Model<UserDocument> {
  findByUsername(username: string): Promise<UserDocument | null>;
}

const schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});
schema.index({ createdAt: 1 });

schema.method("comparePassword", async function (password: string) {
  return await compare(password, this.password);
});

schema.static("findByUsername", function (username: string) {
  return this.findOne({ username });
});

schema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPassword = await hash(this.password, 10);
    this.password = hashedPassword;
  }
});

export const User = mongoose.model<UserDocument, UserModel>("User", schema);
