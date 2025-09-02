import express from "express";
import * as controller from "../controllers/booking.controller.js";

const bookingRouter = express.Router();

bookingRouter.post("/", controller.createBooking);
bookingRouter.post("/create", controller.createBooking)
bookingRouter.get("/seats/:showId", controller.getOccupiedSeats);
bookingRouter.get("/user/bookings", controller.getUserBookings); // ✅ new route

export default bookingRouter;
