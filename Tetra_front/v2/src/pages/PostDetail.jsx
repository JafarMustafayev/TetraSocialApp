// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getPostById } from '../api/post.api';
import PostCard from '../components/feed/PostCard';
import { PostSkeleton } from '../components/skeletons/index.js';
import { toast } from 'react-hot-toast';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Post Detail";
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await getPostById(id);
                if (response.Success || response.success) {
                    setPost(response.Data || response.data);
                } else {
                    toast.error(response.Message || "Failed to load post.");
                }
            } catch (error) {
                console.error("Error loading post details:", error);
                toast.error("An error occurred while loading the post.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPost();
        }
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex justify-center w-full">
            <div className="w-full border-x border-gray-100 dark:border-neutral-800 min-h-screen bg-white dark:bg-[#09090b]">
                {/* Header with Back button */}
                <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-100 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10">
                    <button
                        onClick={handleBack}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                        aria-label="Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Post</h1>
                </div>

                {/* Post Content */}
                <div className="w-full">
                    {loading ? (
                        <PostSkeleton count={1} />
                    ) : post ? (
                        <PostCard post={post} isDetail={true} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full flex items-center justify-center text-red-500 mb-4">
                                <i className="ri-error-warning-line text-2xl"></i>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Post not found
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                                The post you are looking for does not exist, has been deleted, or is currently unavailable.
                            </p>
                            <button
                                onClick={handleBack}
                                className="bg-main text-white hover:bg-main-hover px-5 py-2 rounded-full font-bold text-[14px] transition-colors duration-200 cursor-pointer"
                            >
                                Go Back
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
