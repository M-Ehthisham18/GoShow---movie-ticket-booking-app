import Booking from "../models/booking.model.js"
import Show from "../models/show.model.js"
import User from "../models/user.model.js"
import { clerkClient } from "@clerk/express";
//. api to check user is admin
const isAdmin = async (req, res) => {
  try {
    const { userId } = req.auth() || {};

    if (!userId) {
      return res.json({ success: true, isAdmin: false });
    }

    const user = await clerkClient.users.getUser(userId);

    const isAdmin = user.privateMetadata.role === "admin";

    res.json({ success: true, isAdmin });
  } catch (error) {
    console.log("isAdmin error:", error.message);
    res.status(500).json({ success: false, isAdmin: false });
  }
};


// api to get dashboard data

const getDashboardData = async (req, res) => {
  try {
    // 1. Get all paid bookings
    const bookings = await Booking.find({ isPaid: true });

    // 2. Get shows that are active (date >= now)
    const activeShows = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    // 3. Count all registered users
    const totalUsers = await User.countDocuments();

    // 4. Prepare dashboard response
    const dashboardData = {
      totalBookings: bookings.length,
      totalRevenue: bookings.reduce((acc, booking) => acc + booking.amount, 0), // fixed typo
      activeShows,
      totalUser: totalUsers, // 👈 matches frontend
    };

    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log("Error in getDashboardData:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find({showDateTime:{$gte: new Date()}}).populate("movie").sort({showDateTime:1});
    res.json({success : true, shows});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success:false, message : error.message});
  }
}

const getAllBookings = async (req, res ) => {
  try {
    const bookings = await Booking.find({}).populate("user").populate({path:"show", populate: {path: "movie"}}).sort({createdAt:-1});

    res.json({success : true, bookings});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success:false, message : error.message});
  }
}

export {isAdmin, getDashboardData, getAllShows, getAllBookings};