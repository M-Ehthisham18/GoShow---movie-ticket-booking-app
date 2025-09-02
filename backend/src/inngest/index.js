import { Inngest } from "inngest";
import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";
import Show from "../models/show.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// create inngest fucntion
const syncUserCreation = inngest.createFunction(
  { id: "movie-ticket-booking-sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event?.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      image: image_url,
    };
    await User.create(userData);
  }
);
// delete
const syncUserDeletion = inngest.createFunction(
  { id: "movie-ticket-booking-delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event?.data;
    await User.findOneAndDelete({ _id: id });
  }
);
//update
const syncUserUpdation = inngest.createFunction(
  { id: "movie-ticket-booking-update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event?.data;

    await User.findOneAndUpdate(
      { _id: id }, // ✅ Correct filter
      {
        $set: {
          email: email_addresses[0].email_address,
          name: `${first_name} ${last_name}`,
          image: image_url,
        },
      }, // ✅ Use $set for update
      { new: true }
    );
  }
);

// inngest function to cancel booking and release seats for booking after 5min of not paided after selecting
const releasesSeatsAndDeleteBooking = inngest.createFunction(
  {id: 'release-seats-delete-booking'},
  {event : 'app/checkpayment'},
  async (event, step) => {
    const fiveMinlater =new Date(Date.now() + 5 *60 * 1000);
    await step.sleepUntil('wait-for-5-minutes', fiveMinlater);

    await step.run('check-payment-status', async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);
      // is payment is not made, release seats
      if(!booking.isPaid){
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat]
        });
        show.markModified('occupiedSeats')
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    })
  }
)

// Create an empty array where we'll export future Inngest functions
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdation, releasesSeatsAndDeleteBooking];
