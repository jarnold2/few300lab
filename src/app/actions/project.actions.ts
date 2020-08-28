import { Project } from '../models/project';
import { createAction, props } from '@ngrx/store';

let tempId = 0;
export const projectAdded = createAction(
  '[project] project added',
  ({ name }: { name: string }) => ({
    payload: {
      id: 'TEMP' + tempId++,
      name
    } as Project
  })
);

export const projectAddedSucceeded = createAction(
  '[project] project added succeeded',
  props<{ oldId: string, payload: Project }>()
);

export const loadProjects = createAction(
  '[project] load projects'
);

export const loadProjectsSucceded = createAction(
  '[project] load projects succeeded',
  props<{ projects: Project[] }>()
);

export const loadProjectsFailed = createAction(
  '[project] load projects failed',
  props<{ error: string }>()
);
