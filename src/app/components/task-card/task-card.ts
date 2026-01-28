import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskInterface } from '../../models/task.interface';
import { TaskStatus } from '../../models/task-status.type';

@Component({
  selector: 'app-task-card',
  imports: [],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {
  @Input() task!:TaskInterface ;
  @Output() move = new EventEmitter<TaskStatus>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  isOverdue(task: TaskInterface): boolean {
    if (!task.dueDate) return false;
    return new Date() > task.dueDate;
  }
    calculateTime(createdAt: Date): string {
    const now = Date.now();
    const created = new Date(createdAt).getTime();
    const diff = now - created;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} Minutes ago`;
    if (hours < 24) return `${hours} Hours ago`;
    if (days < 7) return `${days} Days ago`;
    if (weeks < 4) return `${weeks} Weeks ago`;
    if (months < 12) return `${months} Months ago`;
    return `${years} Years ago`;
  }
  formatDate(date :string |Date):string{
    return new Date(date).toLocaleDateString()
  }
  moveTo(status:TaskStatus){
    this.move.emit(status);
  }
}
