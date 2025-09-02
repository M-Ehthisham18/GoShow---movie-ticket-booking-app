// models/show.model.js
import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movie: { type: String, required: true, ref: "Movie" },
  showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true },
  // Map of seatId -> userId (string)
  occupiedSeats: {
    type: Map,
    of: String,
    default: {},
  },
}, {
  minimize: false,
});

const Show = mongoose.model("Show", showSchema);
export default Show;
