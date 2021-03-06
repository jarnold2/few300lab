import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppState, selectDashboardProjects } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { projectAdded } from 'src/app/actions/project.actions';
import { ProjectEntity } from 'src/app/reducers/projects.reducer';

@Component({
  selector: 'app-project-entry',
  templateUrl: './project-entry.component.html',
  styleUrls: ['./project-entry.component.scss']
})
export class ProjectEntryComponent implements OnInit {
  form: FormGroup;
  projects: ProjectEntity[];
  projectNameValid = true;
  projectNameHasValue = true;

  constructor(private formBuilder: FormBuilder, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.store.pipe(
      select(selectDashboardProjects)
    ).subscribe((x) => {
      this.projects = x;
    });

    this.form = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  submit(): void {

    this.projectNameHasValue = this.form.get('name').value;

    if (!this.projectNameHasValue) {
      return;
    }

    this.projectNameValid = this.projects.find
      (x => x.name === (this.form.get('name').value as string).replace(/\s+/g, '-').trim()) === undefined;

    if (this.projectNameValid) {
      this.store.dispatch(projectAdded({
        ...this.form.value,
      }));
      this.form.reset();
      this.projectNameHasValue = true;
      this.projectNameValid = true;
    }
  }
}
