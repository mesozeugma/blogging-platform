import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { getRequestUser } from "../middlewares/passport";
import { Comment } from "../models/comment.model";
import { IPost, Post, PostDocument } from "../models/post.model";
import { BadRequestException } from "../utils/exceptions/bad-request-exception";
import { ForbiddenException } from "../utils/exceptions/forbidden-exceptiony";
import { NotFoundException } from "../utils/exceptions/not-found-exception";
import { asyncHandler } from "../utils/utils";
import { commentsRoute, createCommentResponse } from "./comment";

const PostDTO = z
  .object({
    title: z.string(),
    body: z.string(),
  })
  .strict();

export const PostParamsDTO = z
  .object({
    postId: z.string().refine(isValidObjectId),
  })
  .strict();

interface PostResponse extends IPost {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createPostResponse(post: PostDocument): PostResponse {
  return {
    id: post._id,
    title: post.title,
    body: post.body,
    createdBy: post.createdBy,
    featuredUntil: post.featuredUntil,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export const postRoute = Router();

postRoute.use("/:postId/comments", commentsRoute);

postRoute.get(
  "/",
  asyncHandler(async (_req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json({ items: posts.map(createPostResponse) });
  })
);

postRoute.get(
  "/:postId",
  asyncHandler(async (req, res) => {
    const params = PostParamsDTO.safeParse(req.params);
    if (!params.success) {
      throw new NotFoundException();
    }

    const post = await Post.findById(params.data.postId);
    if (post === null) throw new NotFoundException();
    const comments = await Comment.find({ post: params.data.postId }).sort({
      createdAt: -1,
    });

    res.json({
      ...createPostResponse(post),
      comments: comments.map(createCommentResponse),
    });
  })
);

postRoute.post(
  "/",
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    const parseResult = PostDTO.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestException();
    }

    const post = await Post.create({ ...parseResult.data, createdBy: user.id });
    await post.save();
    res.status(201).json(createPostResponse(post));
  })
);

postRoute.put(
  "/:postId",
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    const params = PostParamsDTO.safeParse(req.params);
    const body = PostDTO.safeParse(req.body);
    if (!params.success) {
      throw new NotFoundException();
    }
    if (!body.success) {
      throw new BadRequestException();
    }

    const existsingPost = await Post.findById(params.data.postId);
    if (existsingPost === null) throw new NotFoundException();
    if (existsingPost.canEdit(user)) {
      existsingPost.title = body.data.title;
      existsingPost.body = body.data.body;
      const post = await existsingPost.save();
      res.json(createPostResponse(post));
    } else {
      throw new ForbiddenException();
    }
  })
);

postRoute.delete(
  "/:postId",
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    const params = PostParamsDTO.safeParse(req.params);
    if (!params.success) {
      throw new NotFoundException();
    }

    const post = await Post.findById(params.data.postId);
    if (post === null) throw new NotFoundException();
    if (post.canEdit(user)) {
      await Comment.deleteMany({ post: post._id });
      await post.deleteOne();
      res.status(204).send();
    } else {
      throw new ForbiddenException();
    }
  })
);
