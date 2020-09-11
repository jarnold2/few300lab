import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoItem } from '../../models';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import {
  AppState, selectInboxTodoList, selectListForProject, selectForecastDaysAfterTodayList,
  selectForecastOverdueList, selectForecastFutureList
} from '../../reducers';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as actions from '../../actions/todo.actions';
@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  items$: Observable<TodoItem[]>;
  constructor(
    private dialogRef: MatDialogRef<TodoListComponent>,
    private store: Store<AppState>,
    @Inject(MAT_DIALOG_DATA) public data: { filter: string, daysAfterToday: number }
  ) { }

  ngOnInit(): void {
    console.log(this.data.filter);
    if (this.data.filter === 'inbox') {
      console.log('test');
      this.items$ = this.store.pipe(
        select(selectInboxTodoList),
      );
    }
    else if (this.data.filter === 'forecast') {
      if (this.data.daysAfterToday === -1) {
        this.items$ = this.store.pipe(
          select(selectForecastOverdueList)
        );
      }
      else if (this.data.daysAfterToday === 7) {
        this.items$ = this.store.pipe(
          select(selectForecastFutureList)
        );
      }
      else {
        this.items$ = this.store.pipe(
          select(selectForecastDaysAfterTodayList(), { daysAfterToday: this.data.daysAfterToday })
        );
      }
    }
    else {
      this.items$ = this.store.pipe(
        select(selectListForProject, { name: this.data.filter })
      );
    }
  }

  drop(evt: CdkDragDrop<any[]>): void {
    if (evt.previousIndex !== evt.currentIndex) {
      this.store.dispatch(actions.todoItemSorted({
        id: evt.item.element.nativeElement.dataset.id,
        previousIndex: evt.previousIndex,
        currentIndex: evt.currentIndex
      }));
    }
  }

  done(): void {
    this.dialogRef.close();
  }

  updateItemStatus(item: TodoItem): void {
    if (item.completed) {
      this.store.dispatch(actions.markTodoAsIncomplete({ item }));
    }
    else {
      this.store.dispatch(actions.markTodoAsComplete({ item }));
    }
  }
}
