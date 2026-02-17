import React from 'react';

const ChangeUsername = () => {
    return (
        <form className="account-setting-form">
            <h3>Change Username</h3>

            <div className="row">
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>New Username</label>
                        <input type="text" className="form-control" placeholder="Enter new username" />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" className="form-control" placeholder="Confirm with password" />
                    </div>
                </div>

                <div className="col-lg-12 col-md-12">
                    <button type="submit" className="default-btn">Update Username</button>
                </div>
            </div>
        </form>
    );
};

export default ChangeUsername;
