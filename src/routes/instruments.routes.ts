import { Router } from 'express';
import {
    getAllInstruments,
    createInstrument,
    getInstrumentById,
    updateInstrument
} from '../controller/instrument.controller';

const router = Router();

// Instruments routes
router.get('/', getAllInstruments);
router.post('/', createInstrument);
router.get('/:id', getInstrumentById);
router.patch('/:id', updateInstrument);

export default router;
