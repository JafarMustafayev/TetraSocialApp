import React from 'react';

const FormSkeleton = ({ rows = 3 }) => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(rows * 2)].map((_, index) => (
                    <div key={index} className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded ml-1"></div>
                        <div className="h-[50px] w-full bg-gray-50 rounded-xl border border-gray-100"></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-end pt-4">
                <div className="h-12 w-32 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
};

export default FormSkeleton;
