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
        <div className="row">
            <div className="col-lg-9 col-md-12 p-0 p-lg-3"> {/* Adjusted padding classes */}
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
