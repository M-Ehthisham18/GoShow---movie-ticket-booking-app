import express from 'express';
import { addShow, getNowPlayingMovies, getShows, getSingleShow } from '../controllers/show.controller.js';
import { protectAdmin } from '../middlewares/auth.middleware.js';

const showRouter = express.Router();

showRouter.get("/now-playing",protectAdmin ,getNowPlayingMovies);
showRouter.post("/add",protectAdmin, addShow);
showRouter.get("/all", getShows);
showRouter.get("/:movieId", getSingleShow);

export default showRouter;