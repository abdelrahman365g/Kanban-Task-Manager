import { TaskPriority } from './task-priority.enum';
import { TaskStatus } from './task-status.type';

export interface TaskInterface {
  id: number;
  visibleId: string;
  name: string;
  description: string;
  dueDate: Date | null;
  createdAt: Date;
  priority: TaskPriority;
  status: TaskStatus;
}
