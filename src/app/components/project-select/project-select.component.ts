import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TodoItem } from 'src/app/models/todo-item';
import { Observable } from 'rxjs';
import { ProjectEntity } from 'src/app/reducers/projects.reducer';
import { Store, select } from '@ngrx/store';
import { AppState, selectAllProjectsList } from 'src/app/reducers';
import { MatSelect } from '@angular/material/select';
import { updateTodoProject } from 'src/app/actions/todo.actions';

@Component({
  selector: 'app-project-select',
  templateUrl: './project-select.component.html',
  styleUrls: ['./project-select.component.scss']
})
export class ProjectSelectComponent implements OnInit {
  @Input() item: TodoItem;
  @ViewChild(MatSelect) projectDropdown;

  projects$: Observable<ProjectEntity[]>;
  projectEditEnabled: boolean;

  constructor(private store: Store<AppState>) { }

  ngOnInit(): void {
    this.projects$ = this.store.pipe(
      select(selectAllProjectsList)
    );
  }

  enableProjectEdit(): void {
    this.projectEditEnabled = true;
  }

  saveProjectEdit(): void {
    console.log(this.projectDropdown.selected.value);
    this.store.dispatch(updateTodoProject({ item: this.item, projectName: this.projectDropdown.selected.value }));
    this.projectEditEnabled = false;
  }

  cancelProjectEdit(): void {
    this.projectEditEnabled = false;
  }
}
