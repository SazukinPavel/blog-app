import type {PayloadAction} from '@reduxjs/toolkit'
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import api from "../../api";
import AddPostDto from "../../types/dto/AddPostDto";
import Post from "../../types/Post";
import EditPostDto from "../../types/dto/EditPostDto";

export const fetchPosts = createAsyncThunk<Post[], { limit: number, page: number }>('posts/fetch', async ({
                                                                                                              page,
                                                                                                              limit
                                                                                                          }) => {
    const res = await api.get<Post[]>('posts', {params: {limit, page}})
    return res.data
})

export const fetchCount = createAsyncThunk<number>('posts/count', async () => {
    const res = await api.get<{ count: number }>('posts', {params: {count: true}})
    return res.data.count
})

export const addPost = createAsyncThunk<Post, AddPostDto>('posts/push', async (dto, {rejectWithValue}) => {
    try {
        const res = await api.post<Post>('posts', dto)
        return res.data
    } catch (e: any) {
        return rejectWithValue(e)
    }
})

export const deletePost = createAsyncThunk<string, string>('posts/delete', async (id, {rejectWithValue}) => {
    try {
        await api.delete('posts/' + id)
        return id
    } catch (e: any) {
        return rejectWithValue(e)
    }
})

export const editPost = createAsyncThunk<Post, EditPostDto>('posts/update', async (dto, {rejectWithValue}) => {
    try {
        const res = await api.put<Post>('posts', dto)
        return res.data
    } catch (e: any) {
        return rejectWithValue(e)
    }
})

interface PostsState {
    posts: Post[]
    isFetchLoading: boolean
    count: number
}

const initialState: PostsState = {
    posts: [],
    count: 0,
    isFetchLoading: false
}

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPosts.pending, state => {
            state.isFetchLoading = true
        })
        builder.addCase(fetchPosts.fulfilled, (state, {payload}) => {
            state.isFetchLoading = false
            state.posts = payload
        })
        builder.addCase(fetchPosts.rejected, state => {
            state.isFetchLoading = false
        })
        builder.addCase(fetchCount.pending, state => {
            state.isFetchLoading = true
        })
        builder.addCase(fetchCount.fulfilled, (state, {payload}) => {
            state.isFetchLoading = false
            state.count = payload
        })
        builder.addCase(fetchCount.rejected, state => {
            state.isFetchLoading = false
        })
        builder.addCase(addPost.fulfilled, (state, {payload}) => {
            state.posts = [payload, ...state.posts];
        })
        builder.addCase(deletePost.fulfilled, (state, {payload}) => {
            state.posts = state.posts.filter(p => p._id !== payload);
        })
        builder.addCase(editPost.fulfilled, (state, {payload}) => {
            state.posts = state.posts.map((p) => {
                if (p._id === payload._id) {
                    return payload
                }
                return p
            })
        })
    }
})

export const {setPosts} = postsSlice.actions

export default postsSlice.reducer