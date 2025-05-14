import { Department } from '../models/department.model';
import { IDepartment } from '../interfaces/model.interfaces';
import { ParsedQs } from 'qs';

export const getDepartments = async (
    filter: any = {},
    sortOptions: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' },
    skip: number = 0,
    limit: number = 10
): Promise<{ departments: IDepartment[]; total: number }> => {
    const departments = await Department.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);
    const total = await Department.countDocuments(filter);
    return { departments, total };
};

export const createDepartment = async (data: IDepartment): Promise<IDepartment> => {
    const department = new Department(data);
    await department.save();
    return department;
};

export const getDepartmentById = async (id: string): Promise<IDepartment | null> => {
    return await Department.findById(id);
};

export const updateDepartment = async (id: string, data: IDepartment): Promise<IDepartment | null> => {
    return await Department.findByIdAndUpdate(id, data, { new: true });
};
