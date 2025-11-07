import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI, sessionUtils, User } from '@/lib/api';

// 비동기 액션 타입 정의
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

// Auth 상태 타입 정의
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

// 초기 상태
const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

// 비동기 액션들 (Redux Toolkit의 createAsyncThunk 사용)

// 로그인
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials.email, credentials.password);
      
      return {
        user: response.data.user,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '로그인에 실패했습니다.'
      );
    }
  }
);

// 회원가입
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (userData: SignupData, { rejectWithValue }) => {
    try {
      const response = await authAPI.signup(userData);
      
      return {
        user: response.data.user,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '회원가입에 실패했습니다.'
      );
    }
  }
);

// 사용자 정보 조회 (세션으로 자동 로그인) - /api/auth/me 사용
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.checkAuthStatus();
      
      if (response.authenticated && response.user) {
        return response.user;
      } else {
        return rejectWithValue('로그인되지 않음');
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || '사용자 정보를 가져올 수 없습니다.'
      );
    }
  }
);

// 로그아웃
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // 백엔드에 로그아웃 요청 (세션 삭제)
      await authAPI.logout();
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
      // API 호출이 실패해도 로컬 로그아웃은 진행
    }
    return;
  }
);

// Auth Slice 생성
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 동기 액션들
    clearError: (state) => {
      state.error = null;
    },
    
    // 세션 상태 초기화 (앱 시작 시)
    initializeAuth: (state) => {
      // 세션 기반이므로 서버에서 확인 필요
      state.isLoading = true;
    },
    
    // 강제 로그아웃 (세션 만료 등)
    forceLogout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 로그인
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // 회원가입
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 사용자 정보 조회
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = action.payload as string;
      });

    // 로그아웃
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        // 로그아웃은 실패해도 상태는 초기화
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

// 액션 내보내기
export const { clearError, initializeAuth, forceLogout } = authSlice.actions;

// 셀렉터들
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

// 리듀서 내보내기
export default authSlice.reducer;
