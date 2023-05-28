import type {PayloadAction} from '@reduxjs/toolkit'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import User from "../../types/User";
import AuthResponse from "../../types/AuthResponse";
import api from "../../api";
import AuthDto from "../../types/dto/AuthDto";
import CustomError from "../../types/CustomError";

interface AuthState {
    isAuthorize: boolean
    user?: User
    isAuthLoading: boolean
    isTryAuthLoading: boolean
    isAuthError: string
}

const initialState: AuthState = {
    isAuthorize: false,
    isAuthError: '',
    isAuthLoading: false,
    isTryAuthLoading: false
}

export const login = createAsyncThunk<AuthResponse, AuthDto>('auth/login', async (dto, {rejectWithValue}) => {
    try {
        const res = await api.post<AuthResponse>('auth/login', dto)
        return res.data as AuthResponse
    } catch (e: any) {
        return rejectWithValue(e?.response?.data)
    }
})

export const register = createAsyncThunk<AuthResponse, AuthDto>('auth/register', async (dto, {rejectWithValue}) => {
    try {
        const res = await api.post<AuthResponse | CustomError>('auth/register', dto)
        return res.data as AuthResponse
    } catch (e: any) {
        return rejectWithValue(e?.response?.data)
    }
})

export const me = createAsyncThunk<AuthResponse>('auth/me', async (dto, {rejectWithValue}) => {
    const res = await api.post<AuthResponse | CustomError>('auth/me', dto)
    if (res.status != 201) {
        return rejectWithValue(res.data as CustomError)
    }
    return res.data as AuthResponse
})


const setAuthorize = (state: AuthState, action: PayloadAction<AuthResponse>) => {
    state.isAuthorize = true
    state.isAuthLoading = false
    state.isTryAuthLoading = false
    state.user = action.payload.user
    localStorage.setItem('blog-token', action.payload.token)
}

const setIsAuthLoading = (state: AuthState) => {
    state.isAuthLoading = true
    state.isAuthError = ''
}

const setIsAuthError = (state: AuthState, action: PayloadAction<any>) => {
    state.isAuthLoading = false
    state.isAuthError = action.payload as string
}


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signOut(state) {
            state.isAuthorize = false
            state.isAuthLoading = false
            state.isTryAuthLoading = false
            state.user = undefined
            localStorage.removeItem('blog-token')
        }
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, setIsAuthLoading)
        builder.addCase(register.pending, setIsAuthLoading)
        builder.addCase(register.fulfilled, setAuthorize)
        builder.addCase(login.fulfilled, setAuthorize)
        builder.addCase(me.fulfilled, setAuthorize)
        builder.addCase(login.rejected, setIsAuthError)
        builder.addCase(register.rejected, setIsAuthError)
        builder.addCase(me.pending, (state) => {
            state.isTryAuthLoading = true
        })
        builder.addCase(me.rejected, (state) => {
            state.isTryAuthLoading = false
            localStorage.removeItem('blog-token')
        })
    }
})

export const signOut = authSlice.actions.signOut

export default authSlice.reducer