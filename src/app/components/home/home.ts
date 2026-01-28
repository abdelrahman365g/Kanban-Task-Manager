import { Component, OnInit } from '@angular/core';
import { TaskInterface } from '../../models/task.interface';
import { TaskPriority } from '../../models/task-priority.enum';
import { Column } from '../column/column';
import { TaskStatus } from '../../models/task-status.type';
import { TaskModal } from '../task-modal/task-modal';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  imports: [Column, TaskModal , Header],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  tasks: TaskInterface[] = [];
  showModal: boolean = false;
  editingTask?: TaskInterface;
  lastVisibleId: number = 1;

  ngOnInit() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks).map((t: any) => ({
        ...t,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        createdAt: new Date(t.createdAt),
      }));
      this.lastVisibleId = this.tasks.length >0? Math.max(...this.tasks.map(t=> Number(t.visibleId.replace("#",""))))+1 : 1;
    }
  }

  addTask(name: string) {
    const newTask: TaskInterface = {
      id: Date.now(),
      visibleId: `#${(this.tasks.length + 1).toString().padStart(3, '0')}`,
      name,
      description: '',
      dueDate: null,
      createdAt: new Date(),
      priority: TaskPriority.Medium,
      status: 'todo',
    };

    this.tasks.push(newTask);
  }

  get todoTasks() {
    return this.tasks.filter((task) => task.status === 'todo');
  }

  get inProgressTasks() {
    return this.tasks.filter((task) => task.status === 'in-progress');
  }

  get completedTasks() {
    return this.tasks.filter((task) => task.status === 'completed');
  }
  updateTaskStatus(event: { id: number; status: TaskStatus }) {
    const task = this.tasks.find((t) => t.id === event.id);
    if (!task) return;

    task.status = event.status;
    this.saveTasksToStorage();
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter((t) => t.id !== id);
    this.saveTasksToStorage();
  }

  openNewTask() {
    this.editingTask = undefined;
    this.showModal = true;
  }
  openEditTask(id: number) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    this.editingTask = task;
    this.showModal = true;
  }
  saveTask(task: TaskInterface) {
    const index = this.tasks.findIndex((t) => t.id === task.id);

    if (index > -1) {
      this.tasks[index] = task;
    } else {
      this.tasks.push(task);
      this.lastVisibleId++;
    }
    this.saveTasksToStorage();
  }
  closeModal() {
    this.showModal = false;
    this.editingTask = undefined ;
  }
  saveTasksToStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}