
import { ActionReducerMap, createSelector } from '@ngrx/store';
import * as fromProjects from './projects.reducer';
import * as fromTodos from './todos.reducer';
import * as fromModels from '../models';
import * as fromUiHints from './ui-hints.reducer';
import * as fromAuth from './auth.reducer';
import { DateHelper } from '../helpers/date-helper';

export interface AppState {
  projects: fromProjects.ProjectState;
  todos: fromTodos.TodoState;
  uiHints: fromUiHints.UiHintsState;
  auth: fromAuth.AuthState;
}

export const reducers: ActionReducerMap<AppState> = {
  projects: fromProjects.reducer,
  todos: fromTodos.reducer,
  uiHints: fromUiHints.reducer,
  auth: fromAuth.reducer
};

// Selectors

// One per "branch" of the state.

const selectProjectBranch = (state: AppState) => state.projects;
const selectTodosBranch = (state: AppState) => state.todos;
const selectUiHintsBranch = (state: AppState) => state.uiHints;
const selectAuthBranch = (state: AppState) => state.auth;

// Any Helpers?

const { selectEntities: selectTodoEntities, selectAll: selectAllTodos } = fromTodos.adapter.getSelectors(selectTodosBranch);
const { selectAll: selectAllProjects } = fromProjects.adapter.getSelectors(selectProjectBranch);
const selectInboxTodoSorts = createSelector(selectUiHintsBranch, b => b.inboxSort);
// Selectors for Components

export const selectAllProjectsList = createSelector(
  selectAllProjects,
  (p) => p as fromProjects.ProjectEntity[]
);

export const selectAllTodosList = createSelector(
  selectAllTodos,
  (p) => p as fromTodos.TodoEntity[]
);

const selectSortedInboxTodos = createSelector(
  selectInboxTodoSorts,
  selectTodoEntities,
  (sort, entities) => sort.map(s => entities[s])
);

export const selectInboxTodoList = createSelector(
  selectSortedInboxTodos,
  (todos) => {
    console.log('INBOX TEST');
    return todos.filter(t => !t.project) as fromModels.TodoItem[];
  }
);

export const selectForecastOverdueList = createSelector(
  selectAllTodosList,
  (todos) => {
    return todos.filter(t => new Date(t.dueDate) < DateHelper.makeDate(0)) as fromModels.TodoItem[];
  }
);

export const selectForecastDaysAfterTodayList = () => createSelector(
  selectAllTodosList,
  (todos, props) => {
    return todos.filter(t =>
      t.dueDate === DateHelper.makeDateString(props.daysAfterToday)
    ) as fromModels.TodoItem[];
  }
);

export const selectForecastFutureList = createSelector(
  selectAllTodosList,
  (todos) => {
    return todos.filter(t => new Date(t.dueDate) > DateHelper.makeDate(7)) as fromModels.TodoItem[];
  }
);

export const selectDashboardProjects = createSelector(
  selectAllProjectsList,
  selectAllTodos,
  (projects, todos) => projects.map(p => ({
    id: p.id,
    name: p.name,
    count: todos.filter(t => t.project === p.name).length,
    addPending: p.addPending
  } as fromModels.DashboardProject))
);

export const selectListForProject = createSelector(
  selectAllTodos,
  (todos, props) => {
    return todos.filter((t: fromTodos.TodoEntity) => t.project === props.name) as fromModels.TodoItem[];
  }
);

export const selectIsLoggedIn = createSelector(
  selectAuthBranch,
  b => b.isLoggedIn
);

export const selectLoggedInUserName = createSelector(
  selectAuthBranch,
  b => b.userName
);

export const selectAuthToken = createSelector(
  selectAuthBranch,
  b => b.token
);
