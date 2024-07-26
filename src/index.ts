import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from './db';
import authRouter from "./routes/auth.route";
import reviewRouter from "./routes/bookReviews.route";
import userRouter from "./routes/user.route";



const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors());

const port:any = process.env.PORT || 3000; 

app.get('/', (req, res) => {
  res.send('Welcome to book review system');
});
app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/user", userRouter);
const host = '0.0.0.0'
connectDB().then(()=>{
  app.listen(port ,host ,() => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}).catch((err)=>{
  console.log(`${err} : did not connect`)
})
export default app