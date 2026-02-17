import React from 'react';

const ProfileInformation = () => {
    return (
        <form className="account-setting-form">
            <h3>Profile Information</h3>

            <div className="row">
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>First Name</label>
                        <input type="text" className="form-control" placeholder="First name" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Last Name</label>
                        <input type="text" className="form-control" placeholder="Last name" />
                    </div>
                </div>
                <div className="col-lg-12 col-md-12">
                    <div className="form-group">
                        <label>Bio</label>
                        <textarea className="form-control" placeholder="Write something about yourself..."></textarea>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Date of Birth</label>
                        <input type="text" className="form-control" placeholder="Date of birth" id="datepicker" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Phone No:</label>
                        <input type="number" className="form-control" placeholder="Phone no" />
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Gender</label>
                        <select className="form-select">
                            <option defaultValue="1">Gender</option>
                            <option value="2">Male</option>
                            <option value="3">Female</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Relation Status</label>
                        <select className="form-select">
                            <option defaultValue="1">Relation Status</option>
                            <option value="2">Married</option>
                            <option value="3">Unmarried</option>
                            <option value="4">Single</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12">
                    <button type="submit" className="default-btn">Save</button>
                </div>
            </div>
        </form>
    );
};

export default ProfileInformation;
