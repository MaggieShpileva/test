import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ACCESS_TOKEN_KEY, authApi } from '@/api';

type AuthState = {
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: AuthState = {
  token: localStorage.getItem(ACCESS_TOKEN_KEY),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>('auth/login', async (_, { rejectWithValue }) => {
  try {
    const phone = String(import.meta.env.VITE_DEV_PHONE ?? '').trim();

    if (!phone) {
      return rejectWithValue('Не задан VITE_DEV_PHONE');
    }

    const { data } = await authApi.login({ phone });
    const token = data.data.access_token;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.error('[Auth] Login failed:', error);
    return rejectWithValue(
      error instanceof Error ? error.message : 'Не удалось авторизоваться'
    );
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Не удалось авторизоваться';
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
