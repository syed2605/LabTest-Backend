const express = require("express");
import {
    getAllDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
} from '../controller/department.controller';
import authenticateToken from "../middleware/authMiddleware";

const router = express.Router();

// Departments routes
router.get('/',authenticateToken, getAllDepartments);
router.post('/', authenticateToken,createDepartment);
router.get('/:id', authenticateToken,getDepartmentById);
router.patch('/:id', authenticateToken,updateDepartment);

export default router;
