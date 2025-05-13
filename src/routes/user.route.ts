const express = require("express");
import { refreshToken, validateUser , createUserController, getUserById, deleteTokenController} from "../controller/user.controller";
import authenticateToken from "../middleware/authMiddleware";
import validateRefreshToken from "../middleware/refreshTokenMiddleware";

const router = express.Router();

router.post('/validate', validateUser)
router.post('/logout/:id', deleteTokenController)
router.post('/refresh',validateRefreshToken, refreshToken)
router.post('/createUser', createUserController)
router.get('/getUserById/:id',authenticateToken, getUserById )

export default router;