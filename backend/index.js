import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/congfig/db.js";
import { clerkMiddleware } from '@clerk/express';
import { clerkClient, requireAuth, getAuth } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./src/inngest/index.js";
import showRouter from "./src/routes/show.routes.js";
import bookingRouter from "./src/routes/booking.route.js";
import adminRouter from "./src/routes/admin.routes.js";
import userRouter from "./src/routes/user.routes.js";
import migrateRouter from "./src/routes/admin-migrate.js";
import { stripWebhooks } from "./src/controllers/stripeWebhooks.controller.js";

dotenv.config();
const app = express();
const port = 3000;
await connectDB();

// stripe webhook route
app.use('/api/stripe', express.raw({type:'application/json'}),stripWebhooks)

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.status(200).send("server is live... , test case running successfully !");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter)
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);
//for migration
app.use("/admin", migrateRouter);

app.listen(port, ()=> console.log(`server is running on http://localhost:${port}`));