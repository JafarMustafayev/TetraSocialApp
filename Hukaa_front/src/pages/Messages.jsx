import React from 'react';
import { Link } from 'react-router-dom';

const Messages = () => {
    return (
        <div className="all-messages-body">
            <div className="all-messages-header d-flex justify-content-between align-items-center">
                <h3>Messages</h3>

                <div className="dropdown">
                    <button className="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i className="flaticon-menu"></i></button>
                    <ul className="dropdown-menu">
                        <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-edit"></i> Edit Messages</Link></li>
                        <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-private"></i> Hide Messages</Link></li>
                        <li><Link className="dropdown-item d-flex align-items-center" to="#"><i className="flaticon-trash"></i> Delete Messages</Link></li>
                    </ul>
                </div>
            </div>

            <div className="messages-profile-box">
                <Link to="#"><img src="src/assets/images/user/user-11.jpg" className="rounded-circle" alt="image" /></Link>
                <h3><Link to="#">James Vanwin</Link></h3>
            </div>

            <div className="messages-chat-container">
                <div className="chat-content">
                    <div className="chat">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-11.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>Hello, dear I want talk to you?</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat chat-left">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-2.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>Said how can I cooperate with you?</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-3.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>I need some ideas from you about my design</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat chat-left">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-4.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>What you want to know about design</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-5.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>With everything I know about design, I can help you in many ways</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat chat-left">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-6.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>Ok, I'm taking note I'm telling you everything I need</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-7.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>I am waiting for your note</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>

                    <div className="chat chat-left">
                        <div className="chat-avatar">
                            <Link to="/profile" className="d-inline-block">
                                <img src="src/assets/images/user/user-8.jpg" width="50" height="50" className="rounded-circle" alt="image" />
                            </Link>
                        </div>

                        <div className="chat-body">
                            <div className="chat-message">
                                <p>What makes you different from other learning platforms?</p>
                                <span className="time d-block">7:45 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chat-list-footer">
                    <form className="d-flex align-items-center">
                        <div className="btn-box d-flex align-items-center me-3">
                            <button className="file-attachment-btn d-inline-block me-2" data-bs-toggle="tooltip" data-bs-placement="top" title="File Attachment" type="button"><i className="ri-attachment-2"></i></button>

                            <button className="emoji-btn d-inline-block" data-bs-toggle="tooltip" data-bs-placement="top" title="Emoji" type="button"><i className="ri-user-smile-line"></i></button>
                        </div>

                        <input type="text" className="form-control" placeholder="Type your message..." />

                        <button type="submit" className="send-btn d-inline-block">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messages;
