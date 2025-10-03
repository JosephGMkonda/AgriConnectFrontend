
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from "../store/hook"
import { useNotifications } from "../service/NotificationHook"
import { formatDistanceToNow } from 'date-fns';
import { 
  FaHeart, 
  FaComment, 
  FaUserPlus, 
  FaShare,
  FaBell,
  FaCheck,
  FaTrash,
  FaCog,
  FaFilter,
  FaExclamationCircle
} from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';

export const Notification: React.FC = () => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    nextPage,
    actions
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'likes' | 'comments' | 'follows'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);


  useEffect(() => {
    actions.loadNotifications(1); 
  }, []);

  
  const loadMore = () => {
    if (hasMore && !loading) {
      actions.loadNotifications(nextPage);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FaHeart className="text-red-500" />;
      case 'comment':
        return <FaComment className="text-blue-500" />;
      case 'follow':
        return <FaUserPlus className="text-green-500" />;
      case 'share':
        return <FaShare className="text-purple-500" />;
      default:
        return <FaBell className="text-yellow-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'bg-red-50 border-red-200';
      case 'comment':
        return 'bg-blue-50 border-blue-200';
      case 'follow':
        return 'bg-green-50 border-green-200';
      case 'share':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await actions.markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await actions.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await actions.deleteNotification(notificationId);
      } catch (error) {
        console.error('Failed to delete notification:', error);
      }
    }
  };

  const handleRetry = () => {
    actions.loadNotifications(1);
  };

  // Filter notifications based on current filter
  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'likes') return notif.type === 'like';
    if (filter === 'comments') return notif.type === 'comment';
    if (filter === 'follows') return notif.type === 'follow';
    return true;
  });

  if (loading && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && notifications.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <FaExclamationCircle className="text-4xl text-red-500" />
            </div>
            <div className="text-red-500 text-lg mb-4">Failed to load notifications</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <FaBell className="text-xl sm:text-2xl text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {unreadCount > 0 
                    ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
                    : 'All caught up!'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 self-end sm:self-auto">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={loading}
                  className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FaCheck size={12} />
                  <span className="hidden sm:inline">Mark all as read</span>
                  <span className="sm:hidden">Mark all</span>
                </button>
              )}
              
              
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaFilter size={16} />
              </button>
            </div>
          </div>

        
          <div className={`mt-6 ${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
            <div className="flex space-x-1 overflow-x-auto pb-2 -mx-2 px-2">
              {[
                { key: 'all', label: 'All', count: notifications.length },
                { key: 'unread', label: 'Unread', count: unreadCount },
                { key: 'likes', label: 'Likes', count: notifications.filter(n => n.type === 'like').length },
                { key: 'comments', label: 'Comments', count: notifications.filter(n => n.type === 'comment').length },
                { key: 'follows', label: 'Follows', count: notifications.filter(n => n.type === 'follow').length }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setFilter(tab.key as any);
                    setShowMobileFilters(false);
                  }}
                  disabled={loading}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 disabled:opacity-50 ${
                    filter === tab.key
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                  }`}
                >
                  <span className="hidden xs:inline">{tab.label}</span>
                  <span className="xs:hidden">
                    {tab.key === 'all' ? 'All' : 
                     tab.key === 'unread' ? 'Unread' : 
                     tab.key === 'likes' ? 'Likes' : 
                     tab.key === 'comments' ? 'Comments' : 'Follows'}
                  </span>
                  {tab.count > 0 && (
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                      filter === tab.key ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 sm:p-12 text-center">
              <div className="flex justify-center mb-4">
                <FaBell className="text-3xl sm:text-4xl text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {filter === 'all' 
                  ? "You're all caught up! Check back later for new notifications."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            <>
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg border-2 p-3 sm:p-4 transition-all duration-200 hover:shadow-md ${
                    notification.read 
                      ? 'border-gray-100' 
                      : `border-l-4 border-l-blue-500 ${getNotificationColor(notification.type)}`
                  }`}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                  
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={notification.sender.avatar_url || '/default-avatar.png'}
                          alt={notification.sender.username}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 sm:p-1 shadow-sm">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                      </div>
                    </div>

                
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                              {notification.sender.username}
                            </span>
                            <span className="text-gray-600 text-sm sm:text-base">{notification.message}</span>
                          </div>
                          
                          {notification.post && (
                            <div className="bg-gray-50 rounded-lg p-2 sm:p-3 mt-2 border border-gray-200">
                              <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                {notification.post.title}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mt-1">
                                {notification.post.content}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-3 sm:space-x-4 mt-2">
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(notification.created_at))} ago
                            </span>
                            
                            {!notification.read && (
                              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <span className="hidden xs:inline">New</span>
                              </span>
                            )}
                          </div>
                        </div>

                        
                        <div className="flex items-center justify-end space-x-2 mt-3 sm:mt-0 sm:ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              disabled={loading}
                              className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Mark as read"
                            >
                              <IoMdCheckmarkCircle size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            disabled={loading}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete notification"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              
              {hasMore && (
                <div className="text-center pt-6">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More Notifications'}
                  </button>
                </div>
              )}

              
              {loading && notifications.length > 0 && (
                <div className="text-center py-4">
                  <div className="inline-flex items-center space-x-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span>Loading more notifications...</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        
        {unreadCount > 0 && (
          <div className="sm:hidden fixed bottom-6 right-6">
            <button
              onClick={handleMarkAllAsRead}
              disabled={loading}
              className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              title="Mark all as read"
            >
              <FaCheck size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};