// src/pages/Bookmarks.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    ArrowLeft,
    Folder,
    FolderPlus,
    Bookmark,
    Loader2,
    Heart,
    Edit2,
    Trash2
} from 'lucide-react';
import PostCard from '../components/feed/PostCard.jsx';
import Skeleton from '../components/skeletons/Skeleton.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import { PostSkeleton } from '../components/skeletons/index.js';
import {
    getBookmarks,
    getFolders,
    createFolder,
    getLikedPosts,
    updateFolder,
    deleteFolder
} from '../api/bookmark.api.js';

const Bookmarks = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Active sub-tab state (bookmarks or likes) synchronized with URL query parameter
    const activeTab = searchParams.get('tab') || 'bookmarks';

    // Data lists
    const [bookmarks, setBookmarks] = useState([]);
    const [folders, setFolders] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);

    // Loading states
    const [loading, setLoading] = useState(true);
    const [loadingLikes, setLoadingLikes] = useState(false);
    const [hasLoadedLikes, setHasLoadedLikes] = useState(false);
    const [selectedFolder, setSelectedFolder] = useState(null);

    // Modal state for creating folder
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [creating, setCreating] = useState(false);

    // Modal state for editing folder
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFolderName, setEditFolderName] = useState('');
    const [editing, setEditing] = useState(false);

    const bookmarkTabs = [
        { id: 'bookmarks', label: 'Bookmarks' },
        { id: 'likes', label: 'Likes' }
    ];

    // Set page title
    useEffect(() => {
        document.title = "Bookmarks";
    }, []);

    // Fetch bookmarks and folders on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const bookmarksRes = await getBookmarks();
                const foldersRes = await getFolders();

                if (bookmarksRes.Success) {
                    setBookmarks(bookmarksRes.Data);
                }
                if (foldersRes.Success) {
                    setFolders(foldersRes.Data);
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load bookmarks.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch liked posts when switching to "likes" tab (only if not loaded yet)
    useEffect(() => {
        if (activeTab !== 'likes' || hasLoadedLikes) return;

        const fetchLikedPosts = async () => {
            setLoadingLikes(true);
            try {
                const res = await getLikedPosts();
                if (res.Success) {
                    setLikedPosts(res.Data);
                } else {
                    toast.error(res.Message || 'Failed to load liked posts.');
                }
            } catch (err) {
                console.error(err);
                toast.error('An error occurred while loading liked posts.');
            } finally {
                setLoadingLikes(false);
                setHasLoadedLikes(true);
            }
        };

        fetchLikedPosts();
    }, [activeTab, hasLoadedLikes]);

    // Handle tab transitions
    const handleTabChange = (tabId) => {
        setSearchParams({ tab: tabId });
    };

    // Create a new category folder
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        setCreating(true);
        try {
            const res = await createFolder(newFolderName);
            if (res.Success) {
                setFolders(prev => [...prev, res.Data]);
                toast.success(`Folder "${res.Data.name}" created successfully.`);
                setNewFolderName('');
                setIsModalOpen(false);
            } else {
                toast.error(res.Message || 'Failed to create folder.');
            }
        } catch (err) {
            toast.error('An error occurred.');
        } finally {
            setCreating(false);
        }
    };

    // Edit an existing folder name
    const handleEditFolder = async (e) => {
        e.preventDefault();
        if (!editFolderName.trim() || !selectedFolder) return;

        setEditing(true);
        try {
            const res = await updateFolder(selectedFolder.id, editFolderName);
            if (res.Success) {
                setFolders(prev => prev.map(f => f.id === selectedFolder.id ? res.Data : f));
                setSelectedFolder(res.Data);
                toast.success('Folder name updated successfully.');
                setIsEditModalOpen(false);
            } else {
                toast.error(res.Message || 'Failed to update folder.');
            }
        } catch (err) {
            toast.error('An error occurred.');
        } finally {
            setEditing(false);
        }
    };

    // Delete folder completely
    const handleDeleteFolder = async (folder) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the folder "${folder.name}"?`);
        if (!confirmDelete) return;

        try {
            const res = await deleteFolder(folder.id);
            if (res.Success) {
                setFolders(prev => prev.filter(f => f.id !== folder.id));
                setSelectedFolder(null);
                toast.success(`Folder "${folder.name}" deleted successfully.`);
            } else {
                toast.error(res.Message || 'Failed to delete folder.');
            }
        } catch (err) {
            toast.error('An error occurred.');
        }
    };

    // Filtered bookmarks list when a folder is selected
    const getFolderBookmarks = () => {
        if (!selectedFolder) return [];
        return bookmarks.filter(b => selectedFolder.postIds.includes(b.Id));
    };

    return (
        <div className="flex justify-center w-full bg-white dark:bg-[#09090b] transition-colors duration-300">
            <div className="w-full border-x border-gray-100 dark:border-neutral-900 min-h-screen pb-10">

                {/* Header (Includes Sticky tabs selector) */}
                <div className="sticky top-0 z-20 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-md flex flex-col border-b border-gray-100 dark:border-[#1f1f1f]">
                    <div className="flex items-center justify-between px-4 h-[53px]">
                        <div className="flex items-center gap-4">
                            {/* Back arrow only rendered inside folders */}
                            {selectedFolder && (
                                <button
                                    onClick={() => setSelectedFolder(null)}
                                    className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                                    aria-label="Back"
                                >
                                    <ArrowLeft size={18} className="text-gray-900 dark:text-white" />
                                </button>
                            )}
                            <div className={selectedFolder ? '' : 'ms-5'}>
                                <h1 className={`text-xl font-bold text-gray-900 dark:text-white `} >
                                    {selectedFolder ? selectedFolder.name : (activeTab === 'bookmarks' ? "Bookmarks" : "Likes")}
                                </h1>
                            </div>
                        </div>

                        {/* Action buttons (only show Folder Plus when viewing folder grid inside bookmarks tab) */}
                        {!selectedFolder && !loading && activeTab === 'bookmarks' && (
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="w-9 h-9 rounded-xl hover:bg-main/10 text-gray-500 hover:text-main flex items-center justify-center transition-all cursor-pointer"
                                title="New Folder"
                            >
                                <FolderPlus size={20} />
                            </button>
                        )}

                        {/* Edit / Delete actions when inside a folder */}
                        {selectedFolder && (
                            <div className="flex gap-1 shrink-0">
                                <button
                                    onClick={() => {
                                        setEditFolderName(selectedFolder.name);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="w-9 h-9 rounded-xl hover:bg-main/10 text-gray-500 hover:text-main flex items-center justify-center transition-all cursor-pointer"
                                    title="Edit Folder Name"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteFolder(selectedFolder)}
                                    className="w-9 h-9 rounded-xl hover:bg-red-50/15 text-gray-500 hover:text-red-500 flex items-center justify-center transition-all cursor-pointer"
                                    title="Delete Folder"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Switch Tabs (Only show if no folder is active) */}
                    {!selectedFolder && (
                        <Tabs tabs={bookmarkTabs} activeTab={activeTab} onChange={handleTabChange} />
                    )}
                </div>

                {/* Main Content Area */}
                <div className="w-full">
                    {activeTab === 'likes' ? (
                        // Likes Content View
                        loadingLikes ? (
                            <PostSkeleton count={3} />
                        ) : likedPosts.length > 0 ? (
                            likedPosts.map(post => (
                                <PostCard key={post.Id} post={post} />
                            ))
                        ) : (
                            <div className="py-20 text-center flex flex-col items-center justify-center px-4">
                                <Heart size={40} className="text-gray-300 dark:text-zinc-700 mb-3" />
                                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                    No liked posts yet
                                </h3>
                                <p className="text-gray-500 text-sm max-w-xs">
                                    Posts you like will be saved and displayed here.
                                </p>
                            </div>
                        )
                    ) : (
                        // Bookmarks Content View
                        loading ? (
                            // Loader Skeletons
                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex gap-4 items-center">
                                            <Skeleton className="w-10 h-10 rounded-xl" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-2/3" />
                                                <Skeleton className="h-3 w-1/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : selectedFolder ? (
                            // Folder Bookmarks List
                            getFolderBookmarks().length > 0 ? (
                                getFolderBookmarks().map(post => (
                                    <PostCard key={post.Id} post={post} />
                                ))
                            ) : (
                                <div className="py-20 text-center flex flex-col items-center justify-center px-4">
                                    <Bookmark size={40} className="text-gray-300 dark:text-zinc-700 mb-3" />
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                        This folder is empty
                                    </h3>
                                    <p className="text-gray-500 text-sm max-w-xs">
                                        Save posts here to organize your bookmarks by folder.
                                    </p>
                                </div>
                            )
                        ) : folders.length > 0 ? (
                            // Folders Grid View
                            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {folders.map(folder => (
                                    <div
                                        key={folder.id}
                                        onClick={() => setSelectedFolder(folder)}
                                        className="bg-gray-50/50 dark:bg-zinc-900/30 border border-gray-150 dark:border-zinc-850 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:bg-main/5 dark:hover:bg-main/5 hover:border-main/50 dark:hover:border-main/50 transition-all duration-200 hover:-translate-y-0.5"
                                    >
                                        <div className="w-11 h-11 bg-main/10 dark:bg-main/10 text-main rounded-xl flex items-center justify-center shrink-0">
                                            <Folder size={22} className="fill-main/20" />
                                        </div>
                                        <div className="min-w-0 text-left">
                                            <h3 className="font-bold text-[15px] text-gray-900 dark:text-white truncate">
                                                {folder.name}
                                            </h3>
                                            <p className="text-[12px] text-gray-500">
                                                {folder.postIds?.length || 0} items
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Direct Flat Bookmarks View (If no folders exist)
                            bookmarks.length > 0 ? (
                                bookmarks.map(post => (
                                    <PostCard key={post.Id} post={post} />
                                ))
                            ) : (
                                <div className="py-20 text-center flex flex-col items-center justify-center px-4">
                                    <Bookmark size={40} className="text-gray-300 dark:text-zinc-700 mb-3" />
                                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                                        Save posts for later
                                    </h3>
                                    <p className="text-gray-500 text-sm max-w-xs">
                                        Bookmark posts to view them here later. Organize them by folders if you wish!
                                    </p>
                                </div>
                            )
                        )
                    )}
                </div>

                {/* Create Folder Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Create New Folder
                            </h2>
                            <form onSubmit={handleCreateFolder}>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="Folder name (e.g. Technology)"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-main focus:border-main text-sm mb-4"
                                    required
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setNewFolderName('');
                                        }}
                                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-150 dark:hover:bg-zinc-800 transition-colors text-xs cursor-pointer"
                                        disabled={creating}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-full bg-main hover:bg-main-hover text-white font-bold transition-colors text-xs flex items-center gap-1 cursor-pointer"
                                        disabled={creating}
                                    >
                                        {creating && <Loader2 size={12} className="animate-spin" />}
                                        <span>Create</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Folder Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                Edit Folder Name
                            </h2>
                            <form onSubmit={handleEditFolder}>
                                <input
                                    type="text"
                                    value={editFolderName}
                                    onChange={(e) => setEditFolderName(e.target.value)}
                                    placeholder="Folder name"
                                    className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-main focus:border-main text-sm mb-4"
                                    required
                                    autoFocus
                                />
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditModalOpen(false);
                                            setEditFolderName('');
                                        }}
                                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-150 dark:hover:bg-zinc-800 transition-colors text-xs cursor-pointer"
                                        disabled={editing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 rounded-full bg-main hover:bg-main-hover text-white font-bold transition-colors text-xs flex items-center gap-1 cursor-pointer"
                                        disabled={editing}
                                    >
                                        {editing && <Loader2 size={12} className="animate-spin" />}
                                        <span>Save</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Bookmarks;
