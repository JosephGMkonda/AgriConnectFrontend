
import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { api } from '../service/api'

export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'share' | 'system';
  title: string;
  message: string;
  user: {
    id: number;
    username: string;
    avatar_url: string;
  };
  post?: {
    id: number;
    title: string;
    content: string;
  };
  read: boolean;
  created_at: string;
  metadata?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  nextPage: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  hasMore: true,
  nextPage: 1,
};


export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications/');
      console.log("notifications", response)
      return {
        notifications: response.data.results || response.data,
        next: response.data.next,
        page
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await api.get('/notifications/unread-count/');
      return response.data.count;
    } catch (error: any) {
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await api.patch(`/notifications/${notificationId}/`, { read: true });
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/notifications/mark_all_as_read/');
      return true;
    } catch (error: any) {
      
      console.warn('Mark all as read endpoint not available, marking locally');
      return true;
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: number, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}/`);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.nextPage = 1;
      state.hasMore = true;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    updateUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        
        if (action.payload.page === 1) {
          
          state.notifications = action.payload.notifications;
        } else {
          
          state.notifications = [...state.notifications, ...action.payload.notifications];
        }
        
        state.hasMore = !!action.payload.next;
        state.nextPage = action.payload.page + 1;
        
        
        state.unreadCount = state.notifications.filter(notif => !notif.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, (state) => {
        
        state.unreadCount = state.notifications.filter(notif => !notif.read).length;
      })
      
      
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(notif => notif.id === notificationId);
        
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(notif => ({
          ...notif,
          read: true
        }));
        state.unreadCount = 0;
      })
      
    
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload;
        const notification = state.notifications.find(notif => notif.id === notificationId);
        
        if (notification && !notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        
        state.notifications = state.notifications.filter(notif => notif.id !== notificationId);
      });
  },
});

export const {
  clearNotifications,
  clearError,
  addNotification,
  updateUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer;