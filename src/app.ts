import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import cookieParser from "cookie-parser";


const app: Application = express();
app.use(cors({
  origin:['http://localhost:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization"]
}));

// parser
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph health care server..",
  });
});

//routes
app.use("/api/v1",router)
app.use(globalErrorHandler)
app.use((req: Request, res: Response, next: NextFunction)=>{
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
})

export default app;
