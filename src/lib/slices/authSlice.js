import { createSlice } from "@reduxjs/toolkit";

// 초기 상태
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  // 앱 최초 로드 시 /api/auth/me 세션 확인이 끝났는지 여부
  // (성공/실패와 무관하게 확인이 완료되면 true)
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 로그인 시작
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // 로그인 성공
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    // 로그인 실패
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    },
    // 로그아웃
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // 사용자 정보 업데이트
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    // 세션 복구 (앱 초기 로드 시)
    restoreSession: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      }
    },
    // 세션 확인 완료 (성공/실패 모두 호출됨)
    sessionCheckComplete: (state) => {
      state.initialized = true;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
  restoreSession,
  sessionCheckComplete,
} = authSlice.actions;

export default authSlice.reducer;

