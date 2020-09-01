import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { TodoItem } from 'src/app/models';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { updateTodoDueDate } from 'src/app/actions/todo.actions';

@Component({
  selector: 'app-due-date-edit',
  templateUrl: './due-date-edit.component.html',
  styleUrls: ['./due-date-edit.component.scss']
})
export class DueDateEditComponent implements OnInit {
  @Input() item: TodoItem;
  dueDateEditEnabled: boolean;
  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
  }

  enableDueDateEdit(): void {
    this.dueDateEditEnabled = true;
  }

  saveDueDateEdit(newDueDate: string): void {
    this.store.dispatch(updateTodoDueDate({ item: this.item, newDueDate }));
    this.dueDateEditEnabled = false;
  }

  cancelDueDateEdit(): void {
    this.dueDateEditEnabled = false;
  }
}
