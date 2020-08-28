import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Project } from 'src/app/models';
import { AppState, selectAllProjectsList } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { projectAdded } from 'src/app/actions/project.actions';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.scss']
})
export class ProjectEntryComponent implements OnInit {
  projects$: Observable<Project[]>;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.projects$ = this.store.pipe(select(selectAllProjectsList));
    this.form = this.formBuilder.group({
      projectName: ['', [Validators.required]]
    });
  }

  submit(): void {
    this.store.dispatch(projectAdded({
      ...this.form.value,
    }));
    this.form.reset();
  }

}
