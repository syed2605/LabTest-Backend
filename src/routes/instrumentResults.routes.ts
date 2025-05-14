import { Router } from 'express';
import {
    getAllInstrumentResults,
    createInstrumentResult,
    getInstrumentResultById,
    updateInstrumentResult,
} from '../controller/instrumentResult.controller';

const router = Router();

// Instrument Results routes
router.get('/', getAllInstrumentResults);
router.post('/', createInstrumentResult);
router.get('/:id', getInstrumentResultById);
router.patch('/:id', updateInstrumentResult);

export default router;
