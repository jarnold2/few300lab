import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as actions from '../actions/project.actions';
import { switchMap, map } from 'rxjs/operators';
import { Project } from '../models/project';
@Injectable()
export class ProjectEffects {

  saveProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.projectAdded),
      switchMap((originalAction) => this.client.post<Project>(environment.apiUrl + 'projects', {
        name: originalAction.payload.name,
      }).pipe(
        map(response => actions.projectAddedSucceeded({ oldId: originalAction.payload.id, payload: response }))
      ))
    ), { dispatch: true }
  );

  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.loadProjects),
      switchMap(() => this.client.get<{ data: Project[] }>(environment.apiUrl + 'projects')
        .pipe(
          map(response => actions.loadProjectsSucceded({ projects: response.data }))
        )
      )
    ), { dispatch: true }
  );

  constructor(private actions$: Actions, private client: HttpClient) { }
}
