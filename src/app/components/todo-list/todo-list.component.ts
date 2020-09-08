import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoItem } from '../../models';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState, selectInboxTodoList, selectListForProject, selectForecastTodayList, selectForecastOverdueList, selectForecastTomorrowList, selectForecastTwoAfterList, selectForecastFourAfterList, selectForecastThreeAfterList, selectForecastSixAfterList, selectForecastFiveAfterList, selectForecastFutureList } from '../../reducers';
import { tap } from 'rxjs/operators';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import * as actions from '../../actions/todo.actions';
import { TodoEntity } from 'src/app/reducers/todos.reducer';
import { Update } from '@ngrx/entity/src/models';
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
    @Inject(MAT_DIALOG_DATA) public data: { filter: string }
  ) { }

  ngOnInit(): void {

    switch (this.data.filter) {
      case 'inbox': {
        this.items$ = this.store.pipe(
          select(selectInboxTodoList),
        );
        break;
      }
      case 'overdue': {
        this.items$ = this.store.pipe(
          select(selectForecastOverdueList),
        );
        break;
      }
      case 'today': {
        this.items$ = this.store.pipe(
          select(selectForecastTodayList),
        );
        break;
      }
      case 'tomorrow': {
        this.items$ = this.store.pipe(
          select(selectForecastTomorrowList),
        );
        break;
      }
      case 'twoAfter': {
        this.items$ = this.store.pipe(
          select(selectForecastTwoAfterList),
        );
        break;
      }
      case 'threeAfter': {
        this.items$ = this.store.pipe(
          select(selectForecastThreeAfterList),
        );
        break;
      }
      case 'fourAfter': {
        this.items$ = this.store.pipe(
          select(selectForecastFourAfterList),
        );
        break;
      }
      case 'fiveAfter': {
        this.items$ = this.store.pipe(
          select(selectForecastFiveAfterList),
        );
        break;
      }
      case 'sixAfter': {
        this.items$ = this.store.pipe(
          select(selectForecastSixAfterList),
        );
        break;
      }
      case 'future': {
        this.items$ = this.store.pipe(
          select(selectForecastFutureList),
        );
        break;
      }
      default: {
        this.items$ = this.store.pipe(
          select(selectListForProject, { name: this.data.filter })
        );
      }
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
    // const updateTodoItem: Update<TodoEntity> = {
    //   id: item.id,
    //   changes: { completed: !item.completed }
    // };
    if (item.completed) {
      this.store.dispatch(actions.markTodoAsIncomplete({ item }));
    }
    else {
      this.store.dispatch(actions.markTodoAsComplete({ item }));
    }
  }


}
