// api to get user bookings

import { clerkClient } from "@clerk/express";
import Booking from "../models/booking.model.js";
import Movie from "../models/movie.modle.js";

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth(); // ✅ Extract userId properly

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId }) // ✅ Use userId only
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 }); // ✅ Fix typo

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error in getUserBookings:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// api to add favorite movie in clerk user metadata
const addFavorite = async( req, res)=> {
  try {
    const {movieId} = req.body;
    const {userId} = req.auth();
    const user = await clerkClient.users.getUser(userId);
    if(!user.privateMetadata.favorites){
      user.privateMetadata.favorites = []
    };
    if(!user.privateMetadata.favorites.includes(movieId)){
      user.privateMetadata.favorites.push(movieId);
    }
    await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata});
    res.json({success:true, message:"Movie added to favorites"});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success:false, message : error.message});
  }
}

// api to update favorite movie in clerk user metadata
const updateFavorite = async( req, res)=> {
  try {
    const {movieId} = req.body;
    const {userId} = req.auth();
    const user = await clerkClient.users.getUser(userId);
    if(!user.privateMetadata.favorites){
      user.privateMetadata.favorites = []
    };
    if(!user.privateMetadata.favorites.includes(movieId)){
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter( id => id !== movieId);
    }
    await clerkClient.users.updateUserMetadata(userId, {privateMetadata: user.privateMetadata});
    res.json({success:true, message:"Favorites Movies updated successfully."});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success:false, message : error.message});
  }
}

const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites || [];

    // get movies from database
    const movies = await Movie.find({_id:{$in: favorites}});
    return res.json({success:true, movies});
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success:false, message : error.message});
  }
}


export {getUserBookings, addFavorite, updateFavorite, getFavorites};