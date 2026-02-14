import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-6 col-md-12">
                    <div className="login-form justify-content-center">
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img
                                src="/src/assets/images/huka_logo.png"
                                alt="Huka Logo"
                                style={{ maxWidth: '240px', height: 'auto', display: 'inline-block' }}
                            />
                        </div>

                        <form>
                            <div className="form-group">
                                <label>Username or email</label>
                                <input
                                    type="text"
                                    className="form-control profile-authentication-area-input-color"
                                />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control profile-authentication-area-input-color"
                                />
                            </div>

                            <div className="remember-me-wrap d-flex justify-content-between align-items-center">
                                <p>
                                    <input type="checkbox" id="test1" />
                                    <label htmlFor="test1">Remember me</label>
                                </p>

                                <div className="lost-your-password-wrap">
                                    <Link to="/forgot-password" className="lost-your-password">
                                        Forgot password ?
                                    </Link>
                                </div>
                            </div>

                            <button type="submit" className="default-btn">LOGIN</button>

                            <div className="or-text">
                                <span>If you don't have an account</span>
                            </div>

                            <button type="button" className="google-btn">
                                <Link to="/register"> REGISTER </Link>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
