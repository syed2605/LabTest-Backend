import { Request, Response } from 'express';
import * as processService from '../services/process.service';

export const getAllProcesses = async (req: Request, res: Response) => {
    try {
        const processes = await processService.getAllProcesses();
        res.status(200).json({ success: true, message: 'Processes fetched successfully', data: processes });
    } catch (error: any) {
        console.error('Error fetching processes:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch processes', error: error.message });
    }
};

export const createProcess = async (req: Request, res: Response) => {
    try {
        const process = await processService.createProcess(req.body);
        res.status(201).json({ success: true, message: 'Process created successfully', data: process });
    } catch (error: any) {
        console.error('Error creating process:', error);
        res.status(500).json({ success: false, message: 'Failed to create process', error: error.message });
    }
};

export const getProcessById = async (req: Request, res: Response) => {
    try {
        const process = await processService.getProcessById(req.params.id);
        res.status(200).json({ success: true, message: 'Process fetched successfully', data: process });
    } catch (error: any) {
        if (error.message === 'Process not found') {
            res.status(404).json({ success: false, message: 'Process not found', error: error.message });
        } else {
            console.error('Error fetching process:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch process', error: error.message });
        }
    }
};

export const getProcessByDepId = async (req: Request, res: Response) => {
    try {
        const process = await processService.getProcessByDepId(req.params.id);
        res.status(200).json({ success: true, message: 'Process fetched successfully', data: process });
    } catch (error: any) {
        if (error.message === 'Process not found') {
            res.status(404).json({ success: false, message: 'Process not found', error: error.message });
        } else {
            console.error('Error fetching process:', error);
            res.status(500).json({ success: false, message: 'Failed to fetch process', error: error.message });
        }
    }
};

export const updateProcess = async (req: Request, res: Response) => {
    try {
        const process = await processService.updateProcess(req.params.id, req.body);
        res.status(200).json({ success: true, message: 'Process updated successfully', data: process });
    } catch (error: any) {
        if (error.message === 'Process not found') {
            res.status(404).json({ success: false, message: 'Process not found', error: error.message });
        } else {
            console.error('Error updating process:', error);
            res.status(500).json({ success: false, message: 'Failed to update process', error: error.message });
        }
    }
};

