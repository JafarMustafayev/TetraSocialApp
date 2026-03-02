import React from 'react';

const ProfileHeaderSkeleton = () => {
    return (
        <div className="content-page-box-area animate-pulse">
            <div className="mb-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Cover Image Placeholder */}
                    <div className="w-full h-[200px] md:h-[300px] bg-gray-200"></div>

                    <div className="px-4 md:px-8 lg:px-12  pb-6 lg:pb-0 relative mb-5">
                        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end">
                            <div className="flex flex-col md:flex-row items-center w-full lg:w-auto">
                                {/* Profile Image Placeholder */}
                                <div className="mt-[-60px] md:mt-[-80px] lg:mt-[-100px] relative w-[130px] md:w-[180px] lg:w-[260px] shrink-0">
                                    <div className="w-full aspect-square bg-gray-100 border-4 border-white shadow-xl rounded-4xl"></div>
                                </div>
                                {/* Header Text Placeholder */}
                                <div className="mt-4 md:mt-0 md:ml-6 text-center md:text-left grow max-w-full space-y-3">
                                    <div className="h-8 w-48 md:w-64 bg-gray-200 rounded-lg mx-auto md:mx-0"></div>
                                    <div className="h-4 w-32 md:w-40 bg-gray-100 rounded-lg mx-auto md:mx-0"></div>
                                </div>
                            </div>

                            {/* Stats Placeholder */}
                            <div className="flex flex-row items-center justify-between sm:justify-center gap-x-4 md:gap-x-10 lg:gap-x-12 mt-8 lg:mt-4 mb-4 bg-gray-50/50 p-4 rounded-2xl w-full lg:w-auto">
                                <div className="text-center flex-1 sm:flex-none space-y-2">
                                    <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-100 rounded mx-auto"></div>
                                </div>
                                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                                <div className="text-center flex-1 sm:flex-none space-y-2">
                                    <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-100 rounded mx-auto"></div>
                                </div>
                                <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
                                <div className="text-center flex-1 sm:flex-none space-y-2">
                                    <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
                                    <div className="h-3 w-16 bg-gray-100 rounded mx-auto"></div>
                                </div>
                            </div>
                        </div>

                        {/* Tabs Placeholder */}
                        <div className="mt-8 md:mt-12  pt-4 flex space-x-8">
                            <div className="h-6 w-24 bg-gray-200 rounded-lg"></div>
                            <div className="h-6 w-24 bg-gray-100 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeaderSkeleton;
