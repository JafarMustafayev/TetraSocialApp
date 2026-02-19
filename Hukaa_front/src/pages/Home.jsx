import PostWidget from '../components/PostWidget';
import CreatePostWidget from '../components/CreatePostWidget';


const Home = () => {
    return (
        <div className="row">
            <div className="col-lg-9 col-md-12 p-0 p-lg-3"> {/* Adjusted padding classes */}
                <div className="news-feed-area">
                    <CreatePostWidget />

                    <PostWidget
                        post={{
                            id: 1,
                            userName: 'Julie R. Morleyv',
                            userImage: null,
                            content: 'Donec rutrum congue leo eget malesuada. Nulla quis lorem ut libero malesuada feugiat.',
                            media: [
                                { url: '"C:\Users\quliy\Pictures\WhatsApp Image 2026-02-18 at 3.49.59 PM.jpeg"', type: 'image' },
                                { url: '/src/assets/images/news-feed-post/post-1.jpg', type: 'video' },
                                { url: '/src/assets/images/news-feed-post/post-1.jpg', type: 'image' },
                                { url: '/src/assets/images/news-feed-post/post-1.jpg', type: 'video' },
                                { url: '/src/assets/images/news-feed-post/post-1.jpg', type: 'image' }
                            ],
                            totalReactionCount: 1499,
                            commentCount: 599,
                            shareCount: 24,
                            createAt: '10 Mins Ago'
                        }}
                    />
                </div>
            </div>


        </div>
    );
};

export default Home;
