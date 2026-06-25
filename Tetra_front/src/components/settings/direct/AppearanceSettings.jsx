// src/components/settings/direct/AppearanceSettings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

const MockFeedCard = ({ hue, title, isDark }) => {
    return (
        <div
            className="flex-1 rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-[#09090b] overflow-hidden"
            style={{
                '--color-main': `hsl(${hue} 89% ${isDark ? '55%' : '46%'})`,
                '--color-main-hover': `hsl(${hue} 89% ${isDark ? '55%' : '46%'} / 90%)`,
                '--color-optional': `hsl(${hue} 89% ${isDark ? '55%' : '46%'} / 80%)`
            }}
        >
            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-100 dark:border-neutral-800 text-[10px] text-gray-500 font-bold uppercase tracking-wider bg-gray-50 dark:bg-[#16181c]">
                <span>{title}</span>
            </div>
            <div className="px-4 pt-3 flex items-center justify-between border-b border-gray-100 dark:border-neutral-800">
                <div className="flex-1 flex justify-center pb-2 relative">
                    <span className="font-bold text-[14px] text-gray-900 dark:text-white">New</span>
                    <div className="absolute bottom-0 w-8 h-1 bg-main rounded-t-full"></div>
                </div>
                <div className="flex-1 flex justify-center pb-2">
                    <span className="font-bold text-[14px] text-gray-500">Trending</span>
                </div>
            </div>

            <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0"></div>
                <div className="flex-1 space-y-2 mt-1">
                    <div className="h-2.5 bg-gray-200 dark:bg-neutral-800 rounded-full w-24"></div>
                    <div className="h-2.5 bg-gray-200 dark:bg-neutral-800 rounded-full w-full"></div>
                    <div className="h-2.5 bg-gray-200 dark:bg-neutral-800 rounded-full w-4/5"></div>
                </div>
            </div>

            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex gap-4">
                    <i className="ri-chat-1-line text-gray-400 text-[18px]"></i>
                    <i className="ri-heart-3-fill text-main text-[18px]"></i>
                    <i className="ri-loop-left-line text-main text-[18px]"></i>
                </div>
                <button className="bg-main text-white px-4 py-1.5 rounded-full text-[13px] font-bold hover:opacity-90">
                    + Post
                </button>
            </div>
        </div>
    );
};

const AppearanceSettings = ({ category, onBack }) => {
    const navigate = useNavigate();
    const { theme, setTheme, isDark } = useTheme();

    // Load current hue from localStorage or use default 200
    const initialHue = parseInt(localStorage.getItem('accentHue')) || 200;
    const [accentHue, setAccentHue] = useState(initialHue);
    const [previewHue, setPreviewHue] = useState(initialHue);

    const handleSave = () => {
        setAccentHue(previewHue);
        localStorage.setItem('accentHue', previewHue);

        // Immediately update global CSS variables without refresh
        document.documentElement.style.setProperty('--accent-hue', previewHue);
        document.documentElement.style.setProperty('--color-main', `hsl(${previewHue} 89% var(--accent-l))`);
        document.documentElement.style.setProperty('--color-main-hover', `hsl(${previewHue} 89% var(--accent-l) / 80%)`);
        document.documentElement.style.setProperty('--color-optional', `hsl(${previewHue} 89% var(--accent-l) / 70%)`);
    };

    const handleReset = () => {
        setPreviewHue(200);
    };

    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            <div className="px-4 py-3 sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="md:hidden w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category?.title || 'Appearance'}</h2>
            </div>

            <div className="p-4 md:p-6 max-w-[800px] w-full mx-auto pb-20">
                <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8">
                    {category?.description || 'Customize your theme and accent color.'}
                </p>

                {/* Theme Selection */}
                <div className="bg-gray-50 dark:bg-[#16181c] border border-gray-200 dark:border-neutral-800 rounded-2xl p-5">
                    <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-4">Background theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors ${theme?.toLowerCase() === 'light' ? 'border-main bg-white dark:bg-black' : 'border-gray-200 dark:border-[#1f1f1f] hover:border-gray-300'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme?.toLowerCase() === 'light' ? 'border-main' : 'border-gray-400'}`}>
                                {theme?.toLowerCase() === 'light' && <div className="w-2.5 h-2.5 bg-main rounded-full" />}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">Light</span>
                        </button>

                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors bg-[#09090b] ${theme?.toLowerCase() === 'dark' ? 'border-main' : 'border-gray-200 dark:border-[#1f1f1f] hover:border-gray-700'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme?.toLowerCase() === 'dark' ? 'border-main' : 'border-gray-500'}`}>
                                {theme?.toLowerCase() === 'dark' && <div className="w-2.5 h-2.5 bg-main rounded-full" />}
                            </div>
                            <span className="font-medium text-white">Dark</span>
                        </button>

                        <button
                            onClick={() => setTheme('System')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-3 transition-colors bg-gray-100 dark:bg-[#1f1f1f] ${theme?.toLowerCase() === 'system' ? 'border-main' : 'border-gray-200 dark:border-[#1f1f1f] hover:border-gray-300 dark:hover:border-gray-700'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${theme?.toLowerCase() === 'system' ? 'border-main' : 'border-gray-500'}`}>
                                {theme?.toLowerCase() === 'system' && <div className="w-2.5 h-2.5 bg-main rounded-full" />}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">System</span>
                        </button>
                    </div>


                    {/* Accent Color Card */}
                    <h3 className="font-bold text-[18px] text-gray-900 dark:text-white mb-2 mt-5">Accent color</h3>
                    <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-8">
                        Choose the main color used for active tabs, buttons, links, mentions, hashtags, and highlighted UI elements.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
                        {/* Selected Color Circle */}
                        <div
                            className="w-16 h-16 rounded-full shrink-0 border-4 border-white dark:border-neutral-900 shadow-sm transition-colors duration-200"
                            style={{ backgroundColor: `hsl(${previewHue}, 89%, ${isDark ? '55%' : '46%'})` }}
                        ></div>

                        {/* Slider Controls */}
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-end mb-4">
                                <span className="font-bold text-[15px] text-gray-900 dark:text-white">
                                    Hue: {previewHue}°
                                </span>
                                <button
                                    onClick={handleReset}
                                    className="text-[13px] text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1.5 transition-colors font-medium"
                                >
                                    <i className="ri-refresh-line"></i>
                                    Reset to default
                                </button>
                            </div>

                            {/* Spectrum Slider */}
                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={previewHue}
                                onChange={(e) => setPreviewHue(parseInt(e.target.value))}
                                className="w-full h-3 rounded-full appearance-none outline-none cursor-pointer"
                                style={{
                                    background: 'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))'
                                }}
                            />

                            <style dangerouslySetInnerHTML={{
                                __html: `
                                input[type=range]::-webkit-slider-thumb {
                                    -webkit-appearance: none;
                                    appearance: none;
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    background: white;
                                    border: 4px solid hsl(${previewHue}, 89%, 50%);
                                    cursor: pointer;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                                }
                                input[type=range]::-moz-range-thumb {
                                    width: 24px;
                                    height: 24px;
                                    border-radius: 50%;
                                    background: white;
                                    border: 4px solid hsl(${previewHue}, 89%, 50%);
                                    cursor: pointer;
                                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                                }
                            `}} />
                        </div>
                    </div>

                    {/* Previews */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <MockFeedCard hue={accentHue} title="Current" isDark={isDark} />
                        <MockFeedCard hue={previewHue} title={`Preview (${previewHue}°)`} isDark={isDark} />
                    </div>

                    {/* Footer / Info / Save */}
                    {
                        accentHue !== previewHue && (
                            <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                                <button
                                    onClick={handleSave}
                                    className={`px-6 py-2 rounded-full font-bold text-[15px] transition-all bg-gray-900 text-white dark:bg-white dark:text-gray-900 hover:opacity-90`}
                                >
                                    Save changes
                                </button>
                            </div>
                        )
                    }
                </div>


            </div>
        </div>
    );
};

export default AppearanceSettings;
