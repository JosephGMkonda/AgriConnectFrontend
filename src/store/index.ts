import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Slices/AuthSlice";
import profileReducer from "../Slices/ProfileSlice";
import postReducer from "../Slices/creatingPost"
import commentReducer from "../Slices/commentSlice"
import Follower from "../Slices/followSlice";
import friendsReducer  from "../Slices/FindFriendSlice"
import suggestedUsersSlice from "../Slices/SuggestedFollow"
import likeReducer from "../Slices/LikeSlice"
import notificationReducer from "../Slices/Notification"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        post: postReducer,
        comments: commentReducer,
        follow: Follower,
        friends: friendsReducer, 
        suggested: suggestedUsersSlice,
        likes: likeReducer,
        notifications: notificationReducer

    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
