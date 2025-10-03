
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hook';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
  addNotification,
} from "../Slices/Notification"

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    nextPage,
  } = useAppSelector((state) => state.notifications);

  const loadNotifications = useCallback((page?: number) => {
    return dispatch(fetchNotifications(page || nextPage));
  }, [dispatch, nextPage]);

  const loadUnreadCount = useCallback(() => {
    return dispatch(fetchUnreadCount());
  }, [dispatch]);

  const markNotificationAsRead = useCallback((notificationId: number) => {
    return dispatch(markAsRead(notificationId));
  }, [dispatch]);

  const markAllNotificationsAsRead = useCallback(() => {
    return dispatch(markAllAsRead());
  }, [dispatch]);

  const removeNotification = useCallback((notificationId: number) => {
    return dispatch(deleteNotification(notificationId));
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const addNewNotification = useCallback((notification: any) => {
    dispatch(addNotification(notification));
  }, [dispatch]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    nextPage,
    actions: {
      loadNotifications,
      loadUnreadCount,
      markAsRead: markNotificationAsRead,
      markAllAsRead: markAllNotificationsAsRead,
      deleteNotification: removeNotification,
      clearNotifications: clearAllNotifications,
      addNotification: addNewNotification,
    },
  };
};