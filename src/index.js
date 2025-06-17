//imports
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandling from "./middleware/errorHandler.js";
import rentalAppRoutes from "./routes/rentalAppRoutes.js";
import tenantRoutes from "./routes/tenantRoutes.js";
import landlordRoutes from "./routes/landlordRoutes.js";



dotenv.config({ path: './src/.env' });



const app = express();
const port = process.env.PORT;


//Test database connection


//Middlewares
app.use(express.json());
app.use(cors());


//Error Handling Middleware
app.use(errorHandling);


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rentals", rentalAppRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/landlord", landlordRoutes);





//Test database connection
app.get("/", async(req, res) => {
    const result = await pool.query("SELECT current_database()"); //gives current db name
    res.send(`The DB name is: ${result.rows[0].current_database}`);
});

//Server 
app.listen(port, () => {
    console.log(`The server is running on http:localhost:${port}`);
    // console.log("Loaded PORT from .env:", process.env.PORT); --debugging  
});