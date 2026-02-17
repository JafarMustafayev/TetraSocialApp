import React, { useState } from 'react';

const ChangeEmail = () => {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Here you would verify the password with the backend
        console.log("Verifying password:", password);
        // If successful, move to next step
        setStep(2);
    };

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        // Here you would send the new email to the backend to trigger OTP
        console.log("Sending OTP to:", newEmail);
        // If successful, move to next step
        setStep(3);
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        // Here you would verify the OTP with the backend
        console.log("Verifying OTP:", otp);
        // If successful, complete the process
        alert("Email updated successfully!");
        // Reset form or redirect
        setStep(1);
        setPassword('');
        setNewEmail('');
        setOtp('');
    };

    return (
        <div className="account-setting-form">
            <h3>Change Email</h3>

            {step === 1 && (
                <form onSubmit={handlePasswordSubmit}>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                                <label>Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Enter current password to continue"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                            <button type="submit" className="default-btn">Next</button>
                        </div>
                    </div>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleEmailSubmit}>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                                <label>New Email Address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter new email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                            <button type="submit" className="default-btn">Send OTP</button>
                        </div>
                    </div>
                </form>
            )}

            {step === 3 && (
                <form onSubmit={handleOtpSubmit}>
                    <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="form-group">
                                <label>Enter OTP</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter OTP code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                            <button type="submit" className="default-btn">Verify & Change Email</button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default ChangeEmail;
