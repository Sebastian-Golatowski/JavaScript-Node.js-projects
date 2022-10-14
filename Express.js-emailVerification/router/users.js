import  express  from "express";
import * as userController from "../controllers/userController.js"; 
const router = express.Router();

router.get('/:usId', userController.checksVerified)

router.post('/post', userController.addAccount)

router.get('/valid/:usId', userController.validateAccount)

router.get('/send/:usId', userController.sendAgain)

export default router