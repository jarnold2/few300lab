import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState, selectDashboardProjects } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { projectAdded } from 'src/app/actions/project.actions';
import { Observable } from 'rxjs';
import { ProjectEntity } from 'src/app/reducers/projects.reducer';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.scss']
})
export class ProjectEntryComponent implements OnInit {
  form: FormGroup;
  projects$: Observable<ProjectEntity[]>;
  projectNameValid = true;

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.projects$ = this.store.pipe(
      select(selectDashboardProjects)
    );

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  submit(): void {
    this.projects$.subscribe((array) => {
      this.projectNameValid = array.find(x => x.name === this.form.get('name').value) === undefined;

      if (this.projectNameValid) {
        this.store.dispatch(projectAdded({
          ...this.form.value,
        }));
        this.form.reset();
      }
    });
  }
}
