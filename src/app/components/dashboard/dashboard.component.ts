import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoEntryComponent } from '../todo-entry/todo-entry.component';
import { DashboardProject, TodoItem } from 'src/app/models';
import {
  AppState, selectDashboardProjects, selectInboxTodoList, selectForecastDaysAfterTodayList,
  selectForecastOverdueList, selectForecastFutureList
} from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { loadTodos } from 'src/app/actions/todo.actions';
import { loadProjects } from 'src/app/actions/project.actions';
import { logOut } from 'src/app/actions/auth.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  projects$: Observable<DashboardProject[]>;

  todayTodosCount: number;

  inbox$: Observable<TodoItem[]>;
  overdueTodos$: Observable<TodoItem[]>;
  // todayTodos: TodoItem[];
  todayTodos$: Observable<TodoItem[]>;
  tomorrowTodos$: Observable<TodoItem[]>;
  twoAfterTodos$: Observable<TodoItem[]>;
  threeAfterTodos$: Observable<TodoItem[]>;
  fourAfterTodos$: Observable<TodoItem[]>;
  fiveAfterTodos$: Observable<TodoItem[]>;
  sixAfterTodos$: Observable<TodoItem[]>;
  futureTodos$: Observable<TodoItem[]>;

  routeQueryParams$: Subscription;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet) {
    store.dispatch(loadTodos());
    store.dispatch(loadProjects());
  }

  ngOnInit(): void {
    console.log('dashboard oninit');
    this.projects$ = this.store.pipe(
      select(selectDashboardProjects)
    );

    this.inbox$ = this.store.pipe(select(selectInboxTodoList));

    this.overdueTodos$ = this.store.pipe(select(selectForecastOverdueList));
    this.todayTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 0 }));
    this.tomorrowTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 1 }));
    this.twoAfterTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 2 }));
    this.threeAfterTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 3 }));
    this.fourAfterTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 4 }));
    this.fiveAfterTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 5 }));
    this.sixAfterTodos$ = this.store.pipe(select(selectForecastDaysAfterTodayList(), { daysAfterToday: 6 }));
    this.futureTodos$ = this.store.pipe(select(selectForecastFutureList));

    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params.inbox) {
        this.showDialog('inbox', -1);
      }
      if (params.forecast) {
        this.showDialog('forecast', params.forecast as number);
      }
      if (params.project) {
        this.showDialog(params.project, -1);
      }
    });
  }

  private showDialog(filter: string, daysAfterToday: number): void {
    const dlg = this.dialog.open(TodoListComponent, { disableClose: true, data: { filter, daysAfterToday } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }

  getDay(daysAfterToday: number): number {
    const today = new Date();
    today.setDate(today.getDate() + daysAfterToday);
    return today.getDay();
  }

  addItem(): void {
    const config: MatBottomSheetConfig = {
      disableClose: true,
      autoFocus: true
    };
    this.bottomSheet.open(TodoEntryComponent, config);
  }

  logOut(): void {
    this.store.dispatch(logOut());
  }
}
