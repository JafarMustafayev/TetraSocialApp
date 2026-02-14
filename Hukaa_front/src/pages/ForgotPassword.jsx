import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-6 col-md-12">
                    <div className="forgot-password-form justify-content-center">
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img
                                src="/src/assets/images/huka_logo.png"
                                alt="Huka Logo"
                                style={{ maxWidth: '240px', height: 'auto', display: 'inline-block' }}
                            />
                        </div>

                        <form>
                            <div className="form-group">
                                <label>Enter your email</label>
                                <input type="email" className="form-control profile-authentication-area-input-color" />
                            </div>

                            <button type="submit" className="default-btn">Send Recovery Link</button>

                            <div className="or-text">
                                <span><Link to="/login">Return to Login</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
