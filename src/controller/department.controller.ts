import { Request, Response } from 'express';
import * as departmentService from '../services/department.service';
import { ParsedQs } from 'qs';

// Get all departments with search, filter, and sort
export const getAllDepartments = async (req: Request, res: Response) => {
    try {
        const queryParams = req.query as ParsedQs;
        const pageNumber = parseInt(queryParams.page as string || '1', 10);
        const sortDirection: 'asc' | 'desc' = queryParams.sortOrder === 'desc' ? 'desc' : 'asc';
        const sortOptions: Record<string, 'asc' | 'desc'> = queryParams.sortBy 
            ? { [queryParams.sortBy as string]: sortDirection } 
            : { createdAt: 'desc' };
        const searchFields = ['title', 'description'];
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
        const { departments, total } = await departmentService.getDepartments(filter, sortOptions, skip, pageSize);
        const totalPages = Math.ceil(total / pageSize);
        const data = {
            departments,
            total,
            totalPages,
            currentPage: pageNumber,
            pageSize,
        };
        res.status(200).json({ success: true, message: "Departments fetched successfully", data });
    } catch (error: any) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch departments', error });
    }
};

// Create a new department
export const createDepartment = async (req: Request, res: Response) => {
    try {
        const department = await departmentService.createDepartment(req.body);
        res.status(201).json({ success: true, message: "Department created successfully", data: department });
    } catch (error: any) {
        console.error('Error creating department:', error);
        res.status(500).json({ success: false, message: 'Failed to create department', error });
    }
};

// Get a department by ID
export const getDepartmentById = async (req: Request, res: Response) => {
    try {
        const department = await departmentService.getDepartmentById(req.params.id);
        if (!department) {
             res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.status(200).json({ success: true, message: "Department fetched successfully", data: department });
    } catch (error: any) {
        console.error('Error fetching department:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch department', error });
    }
};

// Update a department
export const updateDepartment = async (req: Request, res: Response) => {
    try {
        const department = await departmentService.updateDepartment(req.params.id, req.body);
        if (!department) {
             res.status(404).json({ success: false, message: 'Department not found' });
        }
        res.status(200).json({ success: true, message: "Department updated successfully", data: department });
    } catch (error: any) {
        console.error('Error updating department:', error);
        res.status(500).json({ success: false, message: 'Failed to update department', error });
    }
};
