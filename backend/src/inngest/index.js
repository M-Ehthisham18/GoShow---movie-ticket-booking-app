import { Inngest } from "inngest";
import User from "../models/user.model.js"

// Create a client to send and receive events
export const inngest = new Inngest({ id: "movie-ticket-booking" });

// create inngest fucntion
const syncUserCreation = inngest.createFunction(
  {id: 'movie-ticket-booking-sync-user-from-clerk'},
  {event : 'clerk/user.created'},
  async ({ event }) => {
    const { id , first_name, last_name, email_addresses, image_url} = event?.data;
    const userData = {
      _id : id,
      email : email_addresses[0].email_address,
      name : `${first_name} ${last_name}`,
      image: image_url
    }
    await User.create(userData);

  }
);
const syncUserDeletion = inngest.createFunction(
  {id: 'movie-ticket-booking-delete-user-with-clerk'},
  {event : 'clerk/user.updated'},
  async ({ event }) => {
    const {id} =event?.data;
    await User.findOneAndDelete({id});
  }
);
const syncUserUpdation = inngest.createFunction(
  {id: 'movie-ticket-booking-update-user-from-clerk'},
  {event : 'clerk/user.created'},
  async ({ event }) => {
    const { id , first_name, last_name, email_addresses, image_url} = event?.data;
    const userData = {
      _id : id,
      email : email_addresses[0].email_address,
      name : `${first_name} ${last_name}`,
      image: image_url
    }
    await User.findOneAndUpdate(id, userData);

  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation
];