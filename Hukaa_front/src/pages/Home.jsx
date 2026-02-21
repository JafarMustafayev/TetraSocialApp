import React, { useState } from 'react';
import PostWidget from '../components/PostWidget';
import CreatePostWidget from '../components/CreatePostWidget';


const Home = () => {
    const [posts, setPosts] = useState([

    ]);

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="flex flex-wrap -mx-3">
            <div className="w-full lg:w-3/4 px-3">
                <div className="news-feed-area">
                    <CreatePostWidget onPostCreated={handlePostCreated} />

                    {posts.map(post => (
                        <PostWidget
                            key={post.id}
                            post={post}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
