import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../hooks/AuthSlice";
import profileReducer from "../hooks/ProfileSlice";
import postReducer from "../hooks/creatingPost"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        post: postReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
