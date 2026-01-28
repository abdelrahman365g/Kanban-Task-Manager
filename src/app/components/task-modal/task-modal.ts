import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TaskInterface } from '../../models/task.interface';
import { TaskPriority } from '../../models/task-priority.enum';

@Component({
  selector: 'app-task-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css',
})
export class TaskModal implements OnInit, OnChanges {
  @Input() show: boolean = false;
  @Input() task?: TaskInterface;
  @Input() lastVisibleId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<TaskInterface>();
  taskForm!: FormGroup;
  @ViewChild('nameInput') nameInput!: ElementRef;

  ngOnInit() {
    this.initForm();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['task'] && this.taskForm) {
      this.taskForm.patchValue({
        taskName: this.task?.name || '',
        taskDescription: this.task?.description || '',
        taskPriority: this.task?.priority || TaskPriority.Medium,
        taskDueDate: this.task?.dueDate
          ? this.task.dueDate.toISOString().split('T')[0]
          : '',
      });
    } else if (changes['show'] && this.show) {
      setTimeout(() => {
        this.nameInput.nativeElement.focus();
      } , 0);
      this.initForm();
    }
  }

  initForm() {
    this.taskForm = new FormGroup({
      taskName: new FormControl(this.task?.name || '', {
        validators: [Validators.required],
      }),
      taskDescription: new FormControl(this.task?.description || ''),
      taskPriority: new FormControl(this.task?.priority || TaskPriority.Medium),
      taskDueDate: new FormControl(
        this.task?.dueDate ? this.task.dueDate.toISOString().split('T')[0] : '',
        {
          validators: [this.futureDateValidator()],
        },
      ),
    });
  }
  submitForm() {
    if (this.taskForm.invalid) return;
    const formData = this.taskForm.value;
    const newTask: TaskInterface = {
      id: this.task?.id || Date.now(),
      visibleId:
        this.task?.visibleId ||
        `#${this.lastVisibleId.toString().padStart(3, '0')}`,
      name: formData.taskName,
      description: formData.taskDescription,
      dueDate: formData.taskDueDate ? new Date(formData.taskDueDate) : null,
      createdAt: this.task?.createdAt || new Date(),
      priority: formData.taskPriority,
      status: this.task?.status || 'todo',
    };
    this.save.emit(newTask);
    this.close.emit();
  }
  closeModal() {
    this.close.emit();
  }
  futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const inputDate = new Date(control.value);
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      if (inputDate < now) {
        return { pastDate: true };
      }

      return null;
    };
  }
}
