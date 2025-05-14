import {body,param} from 'express-validator';

export const sampleCreateValidator = [
    body('patientId').notEmpty().isMongoId().withMessage('patientId is required'),
    body('departmentId').notEmpty().isMongoId().withMessage('departmentId is required'),
    body('status').notEmpty().withMessage('status is required'),
    body('currentProcessId').isMongoId().notEmpty().withMessage('currentProcessId is required'),
    body('processIds').isArray().notEmpty().withMessage('processIds is required'),
    body('physicianName').notEmpty().withMessage('physicianName is required'),
    body('collectionDate').isDate().notEmpty().withMessage('collectionDate is required'),
    body('tissueType').notEmpty().withMessage('tissueType is required'),
]

// export const trialByIdValidator = [
//     param('id').isMongoId().withMessage('valid ID is required')
// ]