import {configureStore} from '@reduxjs/toolkit'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {postsSlice} from "./slices/postsSlice";
import {authSlice} from "./slices/authSlice";

export const store = configureStore({
    reducer: {
        posts: postsSlice.reducer,
        auth: authSlice.reducer
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector