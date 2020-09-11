import { createAction, props } from '@ngrx/store';
import { ProjectEntity } from '../reducers/projects.reducer';

let tempId = 0;
export const projectAdded = createAction(
  '[project] project added',
  ({ name }: { name: string }) => ({
    payload: {
      id: 'TEMP' + tempId++,
      name: name.replace(/\s+/g, '-').trim(),
      addPending: true
    } as ProjectEntity
  })
);

export const projectAddedSucceeded = createAction(
  '[project] project added succeeded',
  props<{ oldId: string, payload: ProjectEntity }>()
);

export const projectAddedFailed = createAction(
  '[project] project added failed',
  props<{ oldId: string }>()
);

export const loadProjects = createAction(
  '[project] load projects'
);

export const loadProjectsSucceded = createAction(
  '[project] load projects succeeded',
  props<{ projects: ProjectEntity[] }>()
);

export const loadProjectsFailed = createAction(
  '[project] load projects failed',
  props<{ error: string }>()
);
