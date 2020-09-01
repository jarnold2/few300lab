import { EntityState, createEntityAdapter, Update } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import * as actions from '../actions/todo.actions';
export interface TodoEntity {
  id: string;
  name: string;
  project?: string;
  dueDate?: string;
  completed: boolean;
}

export interface TodoState extends EntityState<TodoEntity> {

}

export const adapter = createEntityAdapter<TodoEntity>();

const initialState = adapter.getInitialState();


const reducerFunction = createReducer(
  initialState,
  on(actions.todoAdded, (state, action) => adapter.addOne(action.payload, state)),
  on(actions.loadTodosSucceeded, (state, action) => adapter.addMany(action.todos, state)),
  on(actions.todoAddedSucceeded, (state, action) => {
    // the old switcharoo
    const tempState = adapter.removeOne(action.oldId, state);
    return adapter.addOne(action.payload, tempState);
  }),
  on(actions.markTodoAsCompleteSucceeded, (state, action) => adapter.updateOne(action.item, state)),
  on(actions.markTodoAsIncompleteSucceeded, (state, action) => adapter.updateOne(action.item, state)),
  on(actions.updateTodoProject, (state, action) => adapter.addOne(action.item, state)),
  on(actions.updateTodoProjectSucceeded, (state, action) => adapter.updateOne(action.item, state))
);

export function reducer(state: TodoState = initialState, action: Action): TodoState {
  return reducerFunction(state, action);
}
