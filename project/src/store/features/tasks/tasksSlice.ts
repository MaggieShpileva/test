import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { bonusesApi, tasksApi } from '@/api';
import type { BonusHistoryItem, BonusSummary, Task } from '@/types';

type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

type TasksState = {
  tasks: Task[];
  bonusSummary: BonusSummary | null;
  history: BonusHistoryItem[];
  tasksStatus: RequestStatus;
  historyStatus: RequestStatus;
  tasksError: string | null;
  historyError: string | null;
};

const initialState: TasksState = {
  tasks: [],
  bonusSummary: null,
  history: [],
  tasksStatus: 'idle',
  historyStatus: 'idle',
  tasksError: null,
  historyError: null,
};

export const fetchTasks = createAsyncThunk<
  { tasks: Task[]; bonusSummary: BonusSummary },
  void,
  { rejectValue: string }
>('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const { data } = await tasksApi.getList();
    return {
      tasks: data.tasks,
      bonusSummary: data.bonus_summary,
    };
  } catch (error) {
    console.error('[Tasks] List fetch failed:', error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось загрузить задания'
    );
  }
});

export const fetchBonusesHistory = createAsyncThunk<
  BonusHistoryItem[],
  { limit?: number; offset?: number } | undefined,
  { rejectValue: string }
>('tasks/fetchBonusesHistory', async (params, { rejectWithValue }) => {
  try {
    const { data } = await bonusesApi.getHistory(params);
    return data;
  } catch (error) {
    console.error('[Tasks] Bonuses history fetch failed:', error);
    return rejectWithValue(
      error instanceof Error
        ? error.message
        : 'Не удалось загрузить историю наград'
    );
  }
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.tasksStatus = 'loading';
        state.tasksError = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasksStatus = 'succeeded';
        state.tasks = action.payload.tasks;
        state.bonusSummary = action.payload.bonusSummary;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.tasksStatus = 'failed';
        state.tasksError =
          action.payload ?? 'Не удалось загрузить задания';
      })
      .addCase(fetchBonusesHistory.pending, (state) => {
        state.historyStatus = 'loading';
        state.historyError = null;
      })
      .addCase(fetchBonusesHistory.fulfilled, (state, action) => {
        state.historyStatus = 'succeeded';
        state.history = action.payload;
      })
      .addCase(fetchBonusesHistory.rejected, (state, action) => {
        state.historyStatus = 'failed';
        state.historyError =
          action.payload ?? 'Не удалось загрузить историю наград';
      });
  },
});

export const tasksReducer = tasksSlice.reducer;
