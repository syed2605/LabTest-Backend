import { Request, Response } from 'express';
import * as instrumentResultService from '../services/instrumentResult.service';
import { ParsedQs } from 'qs';

// Get all instrument results with search, filter, and sort
export const getAllInstrumentResults = async (req: Request, res: Response): Promise<void> => {
    try {
        const queryParams = req.query as ParsedQs;
        const pageNumber = parseInt(queryParams.page as string || '1', 10);
        const sortDirection: 'asc' | 'desc' = queryParams.sortOrder === 'desc' ? 'desc' : 'asc';
        const sortOptions: Record<string, 'asc' | 'desc'> = queryParams.sortBy 
            ? { [queryParams.sortBy as string]: sortDirection } 
            : { createdAt: 'desc' };
        const searchFields = ['result', 'instrumentName'];
        const searchFilter = queryParams.search && searchFields.length > 0
            ? { $or: searchFields.map(field => ({ [field]: { $regex: queryParams.search as string, $options: 'i' } })) }
            : {};
        const pageSize = parseInt(queryParams.limit as string || '10', 10);
        const skip = (pageNumber - 1) * pageSize;
        const dynamicFilter = queryParams.filterBy && queryParams.filterValue
            ? (() => {
                try {
                    const parsedValue = JSON.parse(queryParams.filterValue as string);
                    return Array.isArray(parsedValue)
                        ? { [queryParams.filterBy as string]: { $in: parsedValue } }
                        : { [queryParams.filterBy as string]: queryParams.filterValue };
                } catch (error) {
                    return { [queryParams.filterBy as string]: queryParams.filterValue };
                }
            })()
            : {};
        const filter = { ...searchFilter, ...dynamicFilter };
        const { instrumentResults, total } = await instrumentResultService.getInstrumentResults(filter, sortOptions, skip, pageSize);
        const totalPages = Math.ceil(total / pageSize);
        const data = {
            instrumentResults,
            total,
            totalPages,
            currentPage: pageNumber,
            pageSize,
        };
        res.status(200).json({ success: true, message: "Instrument results fetched successfully", data });
    } catch (error: any) {
        console.error('Error fetching instrument results:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch instrument results', error });
    }
};

// Create a new instrument result
export const createInstrumentResult = async (req: Request, res: Response): Promise<void> => {
    try {
        const instrumentResult = await instrumentResultService.createInstrumentResult(req.body);
        res.status(201).json({ success: true, message: "Instrument result created successfully", data: instrumentResult });
    } catch (error: any) {
        console.error('Error creating instrument result:', error);
        res.status(500).json({ success: false, message: 'Failed to create instrument result', error });
    }
};

// Get an instrument result by ID
export const getInstrumentResultById = async (req: Request, res: Response): Promise<void> => {
    try {
        const instrumentResult = await instrumentResultService.getInstrumentResultById(req.params.id);
        if (!instrumentResult) {
            res.status(404).json({ success: false, message: 'Instrument result not found' });
            return;
        }
        res.status(200).json({ success: true, message: "Instrument result fetched successfully", data: instrumentResult });
    } catch (error: any) {
        console.error('Error fetching instrument result:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch instrument result', error });
    }
};

// Update an instrument result
export const updateInstrumentResult = async (req: Request, res: Response): Promise<void> => {
    try {
        const instrumentResult = await instrumentResultService.updateInstrumentResult(req.params.id, req.body);
        if (!instrumentResult) {
            res.status(404).json({ success: false, message: 'Instrument result not found' });
            return;
        }
        res.status(200).json({ success: true, message: "Instrument result updated successfully", data: instrumentResult });
    } catch (error: any) {
        console.error('Error updating instrument result:', error);
        res.status(500).json({ success: false, message: 'Failed to update instrument result', error });
    }
};


