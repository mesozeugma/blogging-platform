import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { RequestUser } from "../middlewares/passport";

export interface IComment {
  body: string;
  createdBy: Types.ObjectId;
  post: Types.ObjectId;
}

export interface CommentDocument extends IComment, Document {
  createdAt: Date;
  updatedAt: Date;
  canEdit(user: RequestUser): boolean;
}

export interface CommentModel extends Model<CommentDocument> {}

const schema = new Schema<IComment>(
  {
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true }
);

schema.method("canEdit", function (user: RequestUser) {
  return this.createdBy.toString() === user.id || user.isAdmin;
});

export const Comment = mongoose.model<CommentDocument, CommentModel>(
  "Comment",
  schema
);
