// routes/admin-migrate.js (temporary admin-only endpoint)
import express from "express";
import Show from "../models/show.model.js";
import Booking from "../models/booking.model.js";

const router = express.Router();

// Protect this route in production! Only use locally or behind auth.
router.post("/migrate/occupied-seats", async (req, res) => {
  try {
    // 1) Convert array -> object
    const convertResult = await Show.updateMany(
      { occupiedSeats: { $type: "array" } },
      { $set: { occupiedSeats: {} } }
    );

    // 2) Backfill from bookings
    const bookingsCursor = Booking.find({}).cursor();
    let backfilled = 0;
    for (let b = await bookingsCursor.next(); b != null; b = await bookingsCursor.next()) {
      const seats = b.bookedSeats || [];
      if (!seats.length) continue;

      const setObj = {};
      seats.forEach((seat) => {
        setObj[`occupiedSeats.${seat}`] = b.user;
      });

      await Show.updateOne({ _id: b.show }, { $set: setObj });
      backfilled++;
    }

    return res.json({
      success: true,
      message: "Migration completed",
      convertedCount: convertResult.modifiedCount,
      backfilledBookings: backfilled,
    });
  } catch (err) {
    console.error("Migration error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
