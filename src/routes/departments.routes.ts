import { Router } from 'express';
import {
    getAllDepartments,
    createDepartment,
    getDepartmentById,
    updateDepartment,
} from '../controller/department.controller';

const router = Router();

// Departments routes
router.get('/', getAllDepartments);
router.post('/', createDepartment);
router.get('/:id', getDepartmentById);
router.patch('/:id', updateDepartment);

export default router;
