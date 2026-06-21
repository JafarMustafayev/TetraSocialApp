// src/components/settings/SettingsContent.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { settingsData } from '../../data/settingsData';

// Group Panel
import SettingsGroupPanel from './SettingsGroupPanel';

// Direct Category Components
import AppearanceSettings from './direct/AppearanceSettings';

// Item Components
import UsernamePasswordForm from './forms/UsernamePasswordForm';
import ActiveSessionsForm from './forms/ActiveSessionsForm';
import TwoFactorForm from './forms/TwoFactorForm';
import EditProfile from './forms/EditProfileForm';

// Component Map for direct categories
const DirectComponentMap = {
    'appearance': AppearanceSettings,
};

// Component Map for items inside group categories
const ItemComponentMap = {
    'username-password': UsernamePasswordForm,
    'active-sessions': ActiveSessionsForm,
    'two-factor': TwoFactorForm,
    'edit-profile': EditProfile,
};

const SettingsContent = () => {
    const { categoryId, itemId } = useParams();
    const navigate = useNavigate();

    const activeCategoryId = categoryId || 'account';
    const category = settingsData.find(c => c.id === activeCategoryId);

    if (!category) {
        return (
            <div className="p-8 text-center text-gray-500">
                Category not found.
            </div>
        );
    }

    // Direct Category Logic
    if (category.type === 'direct') {
        const DirectComponent = DirectComponentMap[category.componentKey];
        if (DirectComponent) {
            return <DirectComponent category={category} onBack={() => navigate('/settings')} />;
        }

        // Placeholder for direct components not yet implemented
        return (
            <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
                <div className="px-4 py-2 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-3 border-b border-gray-100 dark:border-[#1f1f1f]">
                    <button onClick={() => navigate('/settings')} className="md:hidden w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors">
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
                </div>
                <div className="p-8 text-center text-[15px] text-gray-500 dark:text-gray-400">
                    Settings for this section will be available soon.
                </div>
            </div>
        );
    }

    // Group Category Logic
    if (category.type === 'group') {
        if (!itemId) {
            return <SettingsGroupPanel category={category} onBack={() => navigate('/settings')} />;
        }

        const item = category.items?.find(i => i.id === itemId);
        if (!item) {
            return (
                <div className="p-8 text-center text-gray-500">
                    Subcategory not found.
                </div>
            );
        }

        const ItemComponent = ItemComponentMap[item.id];
        if (ItemComponent) {
            return <ItemComponent item={item} category={category} onBack={() => navigate(`/settings/${category.id}`)} />;
        }

        // Placeholder for group item forms not yet implemented
        return (
            <div className="w-full h-full flex flex-col bg-white dark:bg-[#09090b]">
                <div className="px-4 py-2 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-3 border-b border-gray-100 dark:border-[#1f1f1f]">
                    <button onClick={() => navigate(`/settings/${category.id}`)} className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors">
                        <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                    </button>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h2>
                </div>
                <div className="p-8 text-center text-[15px] text-gray-500 dark:text-gray-400">
                    Settings form not implemented yet.
                </div>
            </div>
        );
    }

    return null;
};

export default SettingsContent;
