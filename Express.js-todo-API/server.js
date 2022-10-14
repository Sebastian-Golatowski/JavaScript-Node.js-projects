import  express  from "express";
import bodyParser from "body-parser";
import todoRoutes from "./routes/task.js";
import userRouter from "./routes/user.js";
import cors from "cors";

const app = express()
const PORT = process.env.PORT

app.use(cors())

app.use(bodyParser.json());

app.use('/api/tasks', todoRoutes)
app.use('/api/users', userRouter)

app.listen(PORT, () => {console.log(`working on port: ${PORT}`)});