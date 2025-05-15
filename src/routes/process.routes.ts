const express = require("express");
import {
    getAllProcesses,
    createProcess,
    getProcessById,
    updateProcess,
    getProcessByDepId
} from '../controller/process.controller';
import authenticateToken from '../middleware/authMiddleware';
const router = express.Router();

// Process routes
router.get('/', authenticateToken,getAllProcesses);
router.post('/',authenticateToken, createProcess);
router.get('/:id',authenticateToken, getProcessById);
router.patch('/:id',authenticateToken, updateProcess);
router.get('/getProcessByDepId/:id', authenticateToken,getProcessByDepId);

export default router;
