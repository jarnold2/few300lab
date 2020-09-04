import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoEntryComponent } from '../todo-entry/todo-entry.component';
import { DashboardProject, TodoItem } from 'src/app/models';
import {
  AppState, selectDashboardProjects, selectInboxTodoList, selectForecastTodayList,
  selectForecastOverdueList, selectForecastTomorrowList, selectForecastTwoAfterList, selectForecastThreeAfterList,
  selectForecastFourAfterList, selectForecastFiveAfterList, selectForecastSixAfterList, selectForecastFutureList
} from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { loadTodos } from 'src/app/actions/todo.actions';
import { loadProjects } from 'src/app/actions/project.actions';
import { logOutRequested } from 'src/app/actions/auth.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  projects$: Observable<DashboardProject[]>;

  inbox$: Observable<TodoItem[]>;
  overdueTodos$: Observable<TodoItem[]>;
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
    this.projects$ = this.store.pipe(
      select(selectDashboardProjects)
    );
    this.inbox$ = this.store.pipe(select(selectInboxTodoList));
    this.overdueTodos$ = this.store.pipe(select(selectForecastOverdueList));
    this.todayTodos$ = this.store.pipe(select(selectForecastTodayList));
    this.tomorrowTodos$ = this.store.pipe(select(selectForecastTomorrowList));
    this.twoAfterTodos$ = this.store.pipe(select(selectForecastTwoAfterList));
    this.threeAfterTodos$ = this.store.pipe(select(selectForecastThreeAfterList));
    this.fourAfterTodos$ = this.store.pipe(select(selectForecastFourAfterList));
    this.fiveAfterTodos$ = this.store.pipe(select(selectForecastFiveAfterList));
    this.sixAfterTodos$ = this.store.pipe(select(selectForecastSixAfterList));
    this.futureTodos$ = this.store.pipe(select(selectForecastFutureList));

    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params.inbox) {
        this.showList();
      }
      if (params.forecast) {
        this.showForecast(params.forecast);
      }
      if (params.project) {
        this.showProject(params.project);
      }
    });
  }

  private showProject(project: string): void {
    const dlg = this.dialog.open(TodoListComponent, { disableClose: true, data: { filter: project } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }
  private showList(): void {
    const dlg = this.dialog.open(TodoListComponent, { disableClose: true, data: { filter: 'inbox' } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }
  private showForecast(forecast: string): void {
    const dlg = this.dialog.open(TodoListComponent, { disableClose: true, data: { filter: forecast } });
    dlg.afterClosed().subscribe(_ => this.router.navigate(['dashboard']));
  }

  getDay(daysAfterToday: number): string {
    const today = new Date();
    today.setDate(today.getDate() + daysAfterToday);
    switch (today.getDay()) {
      case 0: {
        return 'Sunday';
      }
      case 1: {
        return 'Monday';
      }
      case 2: {
        return 'Tuesday';
      }
      case 3: {
        return 'Wednesday';
      }
      case 4: {
        return 'Thursday';
      }
      case 5: {
        return 'Friday';
      }
      case 6: {
        return 'Saturday';
      }
      default: {
        return 'ERROR';
      }
    }
  }

  addItem(): void {
    const config: MatBottomSheetConfig = {
      disableClose: true,
      autoFocus: true
    };
    this.bottomSheet.open(TodoEntryComponent, config);
  }

  logOut(): void {
    this.store.dispatch(logOutRequested());
  }
}
