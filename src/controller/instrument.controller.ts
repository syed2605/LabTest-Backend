import { Request, Response } from 'express';
import * as instrumentService from '../services/instrument.service';
import { ParsedQs } from 'qs';

// Get all instruments with search, filter, and sort
export const getAllInstruments = async (req: Request, res: Response): Promise<void> => {
    try {
        const queryParams = req.query as ParsedQs;
        const pageNumber = parseInt(queryParams.page as string || '1', 10);
        const sortDirection: 'asc' | 'desc' = queryParams.sortOrder === 'desc' ? 'desc' : 'asc';
        const sortOptions: Record<string, 'asc' | 'desc'> = queryParams.sortBy 
            ? { [queryParams.sortBy as string]: sortDirection } 
            : { createdAt: 'desc' };
        const searchFields = ['name', 'type'];
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
        const { instruments, total } = await instrumentService.getInstruments(filter, sortOptions, skip, pageSize);
        const totalPages = Math.ceil(total / pageSize);
        const data = {
            instruments,
            total,
            totalPages,
            currentPage: pageNumber,
            pageSize,
        };
        res.status(200).json({ success: true, message: "Instruments fetched successfully", data });
    } catch (error: any) {
        console.error('Error fetching instruments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch instruments', error });
    }
};

// Create a new instrument
export const createInstrument = async (req: Request, res: Response): Promise<void> => {
    try {
        const instrument = await instrumentService.createInstrument(req.body);
        res.status(201).json({ success: true, message: "Instrument created successfully", data: instrument });
    } catch (error: any) {
        console.error('Error creating instrument:', error);
        res.status(500).json({ success: false, message: 'Failed to create instrument', error });
    }
};

// Get an instrument by ID
export const getInstrumentById = async (req: Request, res: Response): Promise<void> => {
    try {
        const instrument = await instrumentService.getInstrumentById(req.params.id);
        if (!instrument) {
            res.status(404).json({ success: false, message: 'Instrument not found' });
            return;
        }
        res.status(200).json({ success: true, message: "Instrument fetched successfully", data: instrument });
    } catch (error: any) {
        console.error('Error fetching instrument:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch instrument', error });
    }
};

// Update an instrument
export const updateInstrument = async (req: Request, res: Response): Promise<void> => {
    try {
        const instrument = await instrumentService.updateInstrument(req.params.id, req.body);
        if (!instrument) {
            res.status(404).json({ success: false, message: 'Instrument not found' });
            return;
        }
        res.status(200).json({ success: true, message: "Instrument updated successfully", data: instrument });
    } catch (error: any) {
        console.error('Error updating instrument:', error);
        res.status(500).json({ success: false, message: 'Failed to update instrument', error });
    }
};

