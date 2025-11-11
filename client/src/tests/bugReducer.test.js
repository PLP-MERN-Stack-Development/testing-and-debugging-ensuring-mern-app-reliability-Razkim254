import { bugReducer } from '../redux/reducers/bugReducer';

describe('bugReducer', () => {
  it('adds a bug to state', () => {
    const initial = [];
    const action = { type: 'ADD_BUG', payload: { id: 1, title: 'Bug' } };
    const result = bugReducer(initial, action);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 1, title: 'Bug' });
  });

  it('returns initial state for unknown action', () => {
    const initial = [{ id: 1, title: 'Bug' }];
    const action = { type: 'UNKNOWN' };
    const result = bugReducer(initial, action);
    expect(result).toEqual(initial);
  });
});
