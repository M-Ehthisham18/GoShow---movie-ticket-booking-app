// import express from "express";
// import * as controller from '../controllers/admin.controller.js';
// import {protectAdmin} from "../middlewares/auth.middlerware.js";
// const adminRouter =express.Router();


// adminRouter.get("/isAdmin", protectAdmin, controller.isAdmin);
// adminRouter.get("/dashboard", protectAdmin, controller.getDashboardData);
// adminRouter.get("/all-shows", protectAdmin, controller.getAllShows);
// adminRouter.get("/all-bookings", protectAdmin, controller.getAllBookings)

// export default adminRouter;
import express from "express";
import * as controller from "../controllers/admin.controller.js";
import { protectAdmin } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

// 👇 Public route (no middleware)
adminRouter.get("/isAdmin", controller.isAdmin);

// 👇 Protected routes
adminRouter.get("/dashboard", protectAdmin, controller.getDashboardData);
adminRouter.get("/all-shows", protectAdmin, controller.getAllShows);
adminRouter.get("/all-bookings", protectAdmin, controller.getAllBookings);

export default adminRouter;
