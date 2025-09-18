import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook"
import { fetchPosts } from "../hooks/creatingPost"
import { PostCard } from "../re-components/PostCard"
import { ErrorMessage } from "../re-components/errorMessage";
import { LoadingSpinner } from "../re-components/LoadingSpinner";




export const Feed: React.FC = () => {
  const dispatch = useAppDispatch();
  const { posts, loading, error, hasMore, nextPage } = useAppSelector((state) => state.post);
  const observer = useRef<IntersectionObserver>();
  const loadingRef = useRef<HTMLDivElement>(null);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    
    try {
      await dispatch(fetchPosts({ page: nextPage, limit: 10 })).unwrap();
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  }, [dispatch, loading, hasMore, nextPage]);


  useEffect(() => {
    if (loading) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      if (entries[0].isIntersecting && hasMore) {
        loadPosts();
      }
    };

    observer.current = new IntersectionObserver(observerCallback, {
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loadPosts, loading, hasMore]);

  
  useEffect(() => {
    if (posts.length === 0 && !loading) {
      loadPosts();
    }
  }, [loadPosts, posts.length, loading]);

  const handleFollow = (userId: number) => {
    console.log('Follow user:', userId);
    
  };

  const handleLike = (postId: number) => {
    console.log('Like post:', postId);
    
  };

  const handleComment = (postId: number) => {
    console.log('Comment on post:', postId);
    
  };

  const handleShare = (postId: number) => {
    console.log('Share post:', postId);
    
  };

  if (error && posts.length === 0) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadPosts}
        className="max-w-2xl mx-auto mt-8"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Latest Posts</h1>
        <p className="text-gray-600">Discover agricultural insights from farmers worldwide</p>
      </div>

      
      <div className="space-y-4">
        {posts.map((post, index) => (
          <PostCard
            key={`${post.id}-${index}`}
            post={post}
            onFollow={handleFollow}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
          />
        ))}
      </div>

    
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

    
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>You've reached the end of the feed</p>
        </div>
      )}

      
      {!loading && posts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
          <p className="text-gray-600">Be the first to share your farming experience!</p>
        </div>
      )}

    
      <div ref={loadingRef} className="h-1" />
    </div>
  );
}
