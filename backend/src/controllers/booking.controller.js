import Stripe from "stripe";
import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";

// Helper: check seat availability
const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats || {};
    const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
    return !isAnySeatTaken;
  } catch (error) {
    console.error("Error in checkSeatAvailability:", error.message);
    return false;
  }
};

// Create Booking
// const createBooking = async (req, res) => {
//   try {
//     const auth = req.auth || {};
//     const userId = auth.userId;
//     const {origin} = req.headers;
//     if (!userId) {
//       return res.status(401).json({ success: false, message: "User not authenticated" });
//     }

//     const { showId, selectedSeats } = req.body;
//     if (!showId || !selectedSeats || !selectedSeats.length) {
//       return res.status(400).json({ success: false, message: "Missing showId or selectedSeats" });
//     }

//     // get show price (we need it to compute amount)
//     const showData = await Show.findById(showId);
//     if (!showData) {
//       return res.status(404).json({ success: false, message: "Show not found" });
//     }

//     // Build atomic filter: ensure none of the selected seats exist
//     const seatChecks = selectedSeats.map((s) => ({ [`occupiedSeats.${s}`]: { $exists: false } }));
//     const filter = { _id: showId, $and: seatChecks };

//     // Build $set object to claim seats
//     const setObj = selectedSeats.reduce((acc, seat) => {
//       acc[`occupiedSeats.${seat}`] = userId;
//       return acc;
//     }, {});

//     // Try to atomically set the seats. If some seat already exists, result will be null.
//     const updatedShow = await Show.findOneAndUpdate(
//       filter,
//       { $set: setObj },
//       { new: true } // return updated doc
//     );

//     if (!updatedShow) {
//       // Some seat already occupied
//       return res.status(400).json({ success: false, message: "Selected seats are not available" });
//     }

//     // Now create booking record
//     const booking = await Booking.create({
//       user: userId,
//       show: showId,
//       amount: (showData.showPrice || 0) * selectedSeats.length,
//       bookedSeats: selectedSeats,
//       isPaid: false,
//     });

//     // stripe gateway
//     const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

//     // creating line items for stripe
//     const line_items = [{
//       price_data: {
//         currency:'usd',
//         product_data : {
//           name:showData.movie.title
//         },
//         unit_amount : Math.floor(booking.amount) * 100,
//       },
//       quantity: 1
//     }];

//     const session = await stripeInstance.checkout.sessions.create({
//       success_url : `${origin}/loading/my-bookings`,
//       // success_url: `${origin}/loading/my-bookings?session_id={CHECKOUT_SESSION_ID}`,

//       cancel_url:  `${origin}/my-bookings`,
//       line_items : line_items,
//       mode:"payment",
//       metadata : {
//         bookingId: booking._id.toString()
//       },
//       expires_at: Math.floor(Date.now() / 1000) + 30 *60, // expires in 30mins
//     })

//     booking.paymentLink = session.url
//     await booking.save();

//     // Return booking & updated occupied seats if useful
//     return res.json({
//       success: true,
//       url:session.url,
//       message: "Booking created successfully",
//       booking,
//       occupiedSeats: Object.keys(updatedShow.occupiedSeats || {}),
//     });
//   } catch (error) {
//     console.error("Error in createBooking:", error);
//     return res.status(500).json({ success: false, message: error.message || "Server error" });
//   }
// };

const createBooking = async (req, res) => {
  try {
    const auth = req.auth || {};
    const userId = auth.userId;
    const {origin} = req.headers;
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const { showId, selectedSeats } = req.body;
    if (!showId || !selectedSeats || !selectedSeats.length) {
      return res.status(400).json({ success: false, message: "Missing showId or selectedSeats" });
    }

    // get show price (we need it to compute amount)
    const showData = await Show.findById(showId);
    if (!showData) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    // Build atomic filter: ensure none of the selected seats exist
    const seatChecks = selectedSeats.map((s) => ({ [`occupiedSeats.${s}`]: { $exists: false } }));
    const filter = { _id: showId, $and: seatChecks };

    // Build $set object to claim seats
    const setObj = selectedSeats.reduce((acc, seat) => {
      acc[`occupiedSeats.${seat}`] = userId;
      return acc;
    }, {});

    // Try to atomically set the seats. If some seat already exists, result will be null.
    const updatedShow = await Show.findOneAndUpdate(
      filter,
      { $set: setObj },
      { new: true } // return updated doc
    );

    if (!updatedShow) {
      // Some seat already occupied
      return res.status(400).json({ success: false, message: "Selected seats are not available" });
    }

    // Now create booking record
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: (showData.showPrice || 0) * selectedSeats.length,
      bookedSeats: selectedSeats,
      isPaid: false,
    });

    // stripe gateway
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    // creating line items for stripe
    const line_items = [{
      price_data: {
        currency:'usd',
        product_data : {
          name:(showData.movie && showData.movie.title) ? showData.movie.title : "Movie Ticket"
        },
        unit_amount : Math.floor(booking.amount) * 100,
      },
      quantity: 1
    }];

    const session = await stripeInstance.checkout.sessions.create({
      success_url : `${origin}/loading/my-bookings`,
      // success_url: `${origin}/loading/my-bookings?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:  `${origin}/my-bookings`,
      line_items : line_items,
      mode:"payment",
      metadata : {
        bookingId: booking._id.toString()
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 *60, // expires in 30mins
    })

    booking.paymentLink = session.url
    await booking.save();

    // Return booking & updated occupied seats if useful
    return res.json({
      success: true,
      url:session.url,
      message: "Booking created successfully",
      booking,
      occupiedSeats: Object.keys(updatedShow.occupiedSeats || {}),
    });
  } catch (error) {
    console.error("Error in createBooking:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};
// Get Occupied Seats (fixed)
const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    if (!showData) return res.status(404).json({ success: false, message: "Show not found" });

    // if occupiedSeats is a Map, get keys; if object, Object.keys
    let occupiedSeatsArr = [];
    const os = showData.occupiedSeats || {};
    if (typeof os.keys === "function") {
      // Map
      occupiedSeatsArr = Array.from(os.keys());
    } else {
      occupiedSeatsArr = Object.keys(os);
    }

    res.json({ success: true, occupiedSeats: occupiedSeatsArr });
  } catch (error) {
    console.error("Error in getOccupiedSeats:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Bookings for Logged-in User
const getUserBookings = async (req, res) => {
  try {
    const auth = req.auth || {};
    const userId = auth.userId;
    if (!userId) return res.status(401).json({ success: false, message: "User not authenticated" });

    const bookings = await Booking.find({ user: userId })
      .populate({ path: "show", populate: { path: "movie" } })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error in getUserBookings:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { createBooking, getOccupiedSeats, getUserBookings };
