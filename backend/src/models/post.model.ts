import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { RequestUser } from "../middlewares/passport";
import { Comment } from "./comment.model";

export interface IPost {
  title: string;
  body: string;
  featuredUntil: Date | undefined;
  createdBy: Types.ObjectId;
}

export interface PostDocument extends IPost, Document {
  createdAt: Date;
  updatedAt: Date;
  canEdit(user: RequestUser): boolean;
}

export interface PostModel extends Model<PostDocument> {
  deletePostsByUser(userId: string): Promise<void>;
}

const schema = new Schema<IPost>(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    featuredUntil: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);
schema.index({ createdAt: 1 });

schema.method("canEdit", function (user: RequestUser) {
  return this.createdBy.toString() === user.id || user.isAdmin;
});

schema.static("deletePostsByUser", async function (userId: string) {
  const posts: PostDocument[] = await this.find({ createdBy: userId });
  const postIds = posts.map((post) => post._id);
  await Comment.deleteMany({ post: { $in: postIds } });
  await this.deleteMany({ createdBy: userId });
});

schema.pre("save", function () {
  const post = this as PostDocument;
  if (!post.featuredUntil) {
    if (Math.random() >= 0.5) {
      post.featuredUntil = new Date(
        post.createdAt.getTime() + 7 * 24 * 60 * 60 * 1000
      );
    } else {
      post.featuredUntil = post.createdAt;
    }
  }
});

export const Post = mongoose.model<PostDocument, PostModel>("Post", schema);
