import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoEntryComponent } from '../todo-entry/todo-entry.component';
import { DashboardProject } from 'src/app/models';
import { AppState, selectDashboardProjects } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { loadTodos } from 'src/app/actions/todo.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  projects$: Observable<DashboardProject[]>;

  routeQueryParams$: Subscription;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private bottomSheet: MatBottomSheet) {
    store.dispatch(loadTodos());
  }

  ngOnInit(): void {
    this.projects$ = this.store.pipe(
      select(selectDashboardProjects)
    );
    this.routeQueryParams$ = this.route.queryParams.subscribe(params => {
      if (params.inbox) {
        this.showList();
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

  addItem(): void {
    const config: MatBottomSheetConfig = {
      disableClose: true,
      autoFocus: true
    };
    this.bottomSheet.open(TodoEntryComponent, config);
  }
}
