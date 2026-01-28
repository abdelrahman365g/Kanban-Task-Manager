import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskInterface } from '../../models/task.interface';
import { TaskCard } from '../task-card/task-card';
import { TaskStatus } from '../../models/task-status.type';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-column',
  imports: [TaskCard, NgClass],
  templateUrl: './column.html',
  styleUrl: './column.css',
})
export class Column {
  @Input() columnName!: string;
  @Input() columnStatus!: TaskStatus;
  @Input() columnTasks: TaskInterface[] = [];
  @Output() moveTask = new EventEmitter<{ id: number; status: TaskStatus }>();
  @Output() editTask = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  onMove(id: number, status: TaskStatus) {
    this.moveTask.emit({ id, status });
  }
}
