
import { AppState, Module, StudentAssignment, StudentQuizResult, UserRole } from '../types';
import { INITIAL_MODULES } from '../constants';

const STORAGE_KEY = 'digital_aware_state';

export const getInitialState = (): AppState => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse state', e);
    }
  }
  return {
    modules: INITIAL_MODULES,
    assignments: [],
    quizResults: [],
    currentUser: null
  };
};

export const saveState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};
