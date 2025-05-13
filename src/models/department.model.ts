
import { IDepartment } from '../interfaces/model.interfaces';

const DepartmentSchema = new Schema<IDepartment>({
  title: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
