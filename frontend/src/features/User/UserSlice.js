import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      username: '',
      email: '',
      isFetching: false,
      isSuccess: false,
      isError: false,
      errorMessage: ''
    }
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    }
  }
});
export const { login, logout } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
