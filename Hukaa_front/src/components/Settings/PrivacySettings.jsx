import React from 'react';

const PrivacySettings = () => {
    return (
        <form className="account-setting-form">

            <div className="row">
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Who Can See Your Profile?</label>
                        <select className="form-select">
                            <option value="true">All</option>
                            <option value="false">My followers</option>
                            <option value="">No one</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Who Can Send You Follow Request?</label>
                        <select className="form-select">
                            <option value="true">All</option>
                            <option value="false">My followers</option>
                            <option value="">No one</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Who Can See Your Phone Number?</label>
                        <select className="form-select">
                            <option value="true">All</option>
                            <option value="false">My followers</option>
                            <option value="">No one</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-6 col-md-6">
                    <div className="form-group">
                        <label>Who Can See Your Birthday?</label>
                        <select className="form-select">
                            <option value="true">All</option>
                            <option value="false">My followers</option>
                            <option value="">No one</option>
                        </select>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 text-end">
                    <button type="submit" className="h-[45px] px-6  font-bold text-[#515355]  hover:bg-white hover:shadow-sm transition-all btn-primary mt-2 ">Save Change</button>
                </div>
            </div>
        </form>
    );
};

export default PrivacySettings;
