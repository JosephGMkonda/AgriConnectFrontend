import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../hooks/AuthSlice";
import profileReducer from "../hooks/ProfileSlice";
import postReducer from "../hooks/creatingPost"
import commentReducer from "../hooks/commentSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        post: postReducer,
        comments: commentReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
