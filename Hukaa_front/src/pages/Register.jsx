import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    return (
        <div className="container">
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-6 col-md-12">
                    <div className="register-form justify-content-center">
                        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <img
                                src="/src/assets/images/huka_logo.png"
                                alt="Huka Logo"
                                style={{ maxWidth: '240px', height: 'auto', display: 'inline-block' }}
                            />
                        </div>

                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control profile-authentication-area-input-color" />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className="form-control profile-authentication-area-input-color" />
                            </div>

                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" className="form-control profile-authentication-area-input-color" />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" className="form-control profile-authentication-area-input-color" />
                            </div>

                            <div className="remember-me-wrap d-flex justify-content-between align-items-center">
                                <p>
                                    <input type="checkbox" id="test2" />
                                    <label htmlFor="test2">I Agree the <Link to="/privacy">Privacy Policy</Link></label>
                                </p>
                            </div>

                            <button type="submit" className="default-btn">REGISTER</button>

                            <div className="or-text">
                                <span>Already have an account? <Link to="/login">Login</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
