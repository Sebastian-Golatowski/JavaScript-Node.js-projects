import express from "express";
import bodyParser from "body-parser";
import userRouter from "./router/users.js"
const app = express();
const PORT = 5000

app.use(bodyParser.json());

app.use('/api/users',userRouter)


app.listen(PORT, ()=>{console.log(`Working at Port: ${PORT}`)})