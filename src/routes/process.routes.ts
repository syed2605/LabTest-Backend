import { Router } from 'express';
import {
    getAllProcesses,
    createProcess,
    getProcessById,
    updateProcess
} from '../controller/process.controller';

const router = Router();

// Process routes
router.get('/', getAllProcesses);
router.post('/', createProcess);
router.get('/:id', getProcessById);
router.patch('/:id', updateProcess);

export default router;
