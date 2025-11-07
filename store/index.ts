import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

// Store 설정
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 직렬화 체크에서 제외할 액션들 (필요시)
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production', // 개발 환경에서만 Redux DevTools 활성화
});

// 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 타입이 지정된 훅들
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
