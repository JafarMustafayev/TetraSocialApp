import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../api/post';
import PostWidget from '../components/PostWidget';
import PostSkeleton from '../components/Skeleton/PostSkeleton';
import { useToast } from '../context/ToastContext';

const PostPage = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await getPost(postId);
                if (response.success) {
                    setPost(response.data.post);
                } else {
                    showToast(response.message || 'Post not found', 'error');
                }
            } catch (error) {
                console.error('Failed to fetch post:', error);
                showToast('An error occurred while fetching the post', 'error');
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            fetchPost();
        }
    }, [postId, showToast]);

    if (loading) {
        return (
            <div className="max-w-[700px] mx-auto mt-4">
                <PostSkeleton />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                    <i className="ri-error-warning-line text-4xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
                <p className="text-gray-500 mb-8 max-w-md">The post you are looking for might have been deleted or is no longer available.</p>
                <button
                    onClick={() => window.history.back()}
                    className="px-8 py-3 bg-main text-white rounded-2xl font-bold hover:bg-optional transition-all shadow-lg shadow-blue-100 active:scale-95"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-[700px] mx-auto mt-4 animate-fade-in">
            <PostWidget
                post={post}
                onUpdate={(updatedPost) => setPost(updatedPost)}
                onDelete={() => window.history.back()}
            />
        </div>
    );
};

export default PostPage;
