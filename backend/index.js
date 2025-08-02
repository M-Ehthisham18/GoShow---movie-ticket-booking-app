import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/congfig/db.js";
import { clerkMiddleware } from '@clerk/express';
import { clerkClient, requireAuth, getAuth } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js";

dotenv.config();
const app = express();
const port = 3000;
await connectDB();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware()); 

// app.get('/protected', requireAuth(), async (req, res) => {
//   const { userId } = getAuth(req)
//   const user = await clerkClient.users.getUser(userId)
//   return res.json({ user })
// })

app.get("/", (req, res) => {
  res.status(200).send("server is live... , test case running successfully !");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.listen(port, ()=> console.log(`server is running on http://localhost:${port}`));