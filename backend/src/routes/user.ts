import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { isAdminMiddleware } from "../middlewares/is-admin";
import { isAuthenticated } from "../middlewares/is-autheticated";
import { authenticate, getRequestUser } from "../middlewares/passport";
import { Comment } from "../models/comment.model";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";
import { BadRequestException } from "../utils/exceptions/bad-request-exception";
import { InternalServerErrorException } from "../utils/exceptions/internal-server-error.exception";
import { NotFoundException } from "../utils/exceptions/not-found-exception";
import { asyncHandler } from "../utils/utils";

const UserDTO = z
  .object({
    username: z.string(),
    password: z.string(),
  })
  .strict();
type UserDTO = z.infer<typeof UserDTO>;

const UserParamsDTO = z
  .object({
    userId: z.string().refine(isValidObjectId),
  })
  .strict();

export const userRoute = Router();

userRoute.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parseResult = UserDTO.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestException("Invalid body");
    }

    const existingUser = await User.findByUsername(parseResult.data.username);
    if (existingUser !== null) {
      throw new BadRequestException("User already exists");
    }
    const user = await User.create(parseResult.data);
    await user.save();
    res.status(201).send({ username: user.username });
  })
);

userRoute.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parseResult = UserDTO.safeParse(req.body);
    if (!parseResult.success) {
      throw new BadRequestException("Invalid body");
    }

    await authenticate(req, res);
    res.status(204).send();
  })
);

userRoute.post("/logout", isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(new InternalServerErrorException(err));
    }
    return res.status(204).send();
  });
});

userRoute.get(
  "/",
  isAdminMiddleware,
  asyncHandler(async (_req, res) => {
    const users = await User.find();
    res.json({
      items: users.map((user) => ({
        id: user._id,
        username: user.username,
        isAdmin: user.isAdmin,
      })),
    });
  })
);

userRoute.get(
  "/me",
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = getRequestUser(req);
    res.json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    });
  })
);

userRoute.delete(
  "/:userId",
  isAdminMiddleware,
  asyncHandler(async (req, res) => {
    const params = UserParamsDTO.safeParse(req.params);
    if (!params.success) throw new BadRequestException();

    const user = await User.findById(params.data.userId);
    if (user === null) throw new NotFoundException();
    await Comment.deleteMany({ createdBy: user._id });
    await Post.deletePostsByUser(user._id);
    await user.deleteOne();
    res.status(204).send();
  })
);
