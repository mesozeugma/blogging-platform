import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { getRequestUser } from "../middlewares/passport";
import { Comment, CommentDocument, IComment } from "../models/comment.model";
import { BadRequestException } from "../utils/exceptions/bad-request-exception";
import { ForbiddenException } from "../utils/exceptions/forbidden-exceptiony";
import { NotFoundException } from "../utils/exceptions/not-found-exception";
import { asyncHandler } from "../utils/utils";
import { PostParamsDTO } from "./post";

export interface CommentResponse extends Omit<IComment, "post"> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentParamsDTO = z
  .object({
    postId: z.string().refine(isValidObjectId),
    commentId: z.string().refine(isValidObjectId),
  })
  .strict();

const CommentDTO = z
  .object({
    body: z.string().min(1),
  })
  .strict();

export function createCommentResponse(
  comment: CommentDocument
): CommentResponse {
  return {
    id: comment._id,
    body: comment.body,
    createdBy: comment.createdBy,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
  };
}

export const commentsRoute = Router({ mergeParams: true });

commentsRoute.get(
  "/",
  asyncHandler(async (req, res) => {
    const params = PostParamsDTO.safeParse(req.params);
    if (!params.success) {
      throw new NotFoundException();
    }

    const comments = await Comment.find({ post: params.data.postId }).sort({
      createdAt: -1,
    });
    res.json({ items: comments.map(createCommentResponse) });
  })
);

commentsRoute.get(
  "/:commentId",
  asyncHandler(async (req, res) => {
    const params = CommentParamsDTO.safeParse(req.params);
    if (!params.success) {
      throw new NotFoundException();
    }

    const comment = await Comment.findOne({
      _id: params.data.commentId,
      post: params.data.postId,
    });
    if (comment === null) throw new NotFoundException();
    res.json(createCommentResponse(comment));
  })
);

commentsRoute.post(
  "/",
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    const params = PostParamsDTO.safeParse(req.params);
    const body = CommentDTO.safeParse(req.body);
    if (!params.success) {
      throw new NotFoundException();
    }
    if (!body.success) {
      throw new BadRequestException();
    }

    const comment = await Comment.create({
      ...body.data,
      createdBy: user.id,
      post: params.data.postId,
    });
    res.json(createCommentResponse(comment));
  })
);

commentsRoute.put(
  "/:commentId",
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    const params = CommentParamsDTO.safeParse(req.params);
    const body = CommentDTO.safeParse(req.body);
    if (!params.success) {
      throw new NotFoundException();
    }
    if (!body.success) {
      throw new BadRequestException();
    }

    const existingComment = await Comment.findOne({
      _id: params.data.commentId,
      post: params.data.postId,
    });
    if (existingComment === null) throw new NotFoundException();
    if (existingComment.canEdit(user)) {
      existingComment.body = body.data.body;
      const comment = await existingComment.save();
      res.json(createCommentResponse(comment));
    } else {
      throw new ForbiddenException();
    }
  })
);

commentsRoute.delete(
  "/:commentId",
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    const params = CommentParamsDTO.safeParse(req.params);
    if (!params.success) {
      throw new NotFoundException();
    }

    const comment = await Comment.findOne({
      _id: params.data.commentId,
      post: params.data.postId,
    });
    if (comment === null) throw new NotFoundException();
    if (comment.canEdit(user)) {
      await comment.deleteOne();
      res.status(204).send();
    } else {
      throw new ForbiddenException();
    }
  })
);
