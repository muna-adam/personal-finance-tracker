import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";


import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import swaggerSpec from "./config/swagger.js";
import errorHandler from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/transactions", transactionRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/upload', uploadRoutes);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Personal Finance Tracker API is running!",
  });
});


const startServer = async () => {
  try {
    const connStr = process.env.NODE_ENV === 'development' 
      ? process.env.MONGODB_URI 
      : process.env.MONGODB_URI_PROD;

    if (!connStr) {
      throw new Error("MONGODB_URI lagama helin faylka .env");
    }

    await mongoose.connect(connStr);
    console.log('✅ Connected to ◇ MongoDB Atlas !');

    
    app.listen(PORT, () => {
      console.log(`◇ 🚀 Server running on port: ${PORT}`);
    });

  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1); 
  }
};


startServer();
