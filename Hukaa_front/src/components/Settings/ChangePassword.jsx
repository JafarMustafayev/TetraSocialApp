import React from 'react';

const ChangePassword = () => {
    return (
        <form className="account-setting-form">
            <h3>Change Password</h3>

            <div className="row">
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" className="form-control" />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" className="form-control" />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input type="password" className="form-control" />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <button type="submit" className="default-btn">Change Password</button>
                </div>
            </div>
        </form>
    );
};

export default ChangePassword;
