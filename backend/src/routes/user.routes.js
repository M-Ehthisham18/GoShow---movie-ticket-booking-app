import express from "express";
import * as controller from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/bookings", controller.getUserBookings);
userRouter.post("/update-favorite", controller.updateFavorite);
// userRouter.put("/favorites", controller.updateFavorite);
userRouter.get("/favorites", controller.getFavorites);

export default userRouter;