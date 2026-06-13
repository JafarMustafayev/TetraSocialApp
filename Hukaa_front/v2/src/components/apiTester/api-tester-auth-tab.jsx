// src/components/apiTester/api-tester-auth-tab.jsx
import React from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

const AuthTab = ({
    authType,
    setAuthType,
    authToken,
    setAuthToken,
    authUsername,
    setAuthUsername,
    authPassword,
    setAuthPassword,
    showPassword,
    setShowPassword,
    authApiKeyName,
    setAuthApiKeyName,
    authApiKeyValue,
    setAuthApiKeyValue,
    authApiKeyAddTo,
    setAuthApiKeyAddTo
}) => {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-150 dark:border-neutral-900 pb-3">
                <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">Authentication Mode</span>
                <select
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                    className="h-9 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-850 rounded-lg px-3 text-xs font-bold focus:outline-none focus:border-main cursor-pointer"
                >
                    <option value="none">No Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="basic">Basic Auth</option>
                    <option value="apikey">API Key</option>
                </select>
            </div>

            <div className="space-y-4">
                {authType === 'none' && (
                    <div className="py-12 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-neutral-850 rounded-xl flex flex-col items-center justify-center gap-2">
                        <Lock className="h-8 w-8 opacity-30 text-gray-400" />
                        <span>This request will be executed without authorization credentials.</span>
                    </div>
                )}

                {authType === 'bearer' && (
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Bearer Token</label>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={authToken}
                                onChange={(e) => setAuthToken(e.target.value)}
                                placeholder="Paste your token token here (without Bearer prefix)"
                                className="w-full h-11 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                            />
                        </div>
                    </div>
                )}

                {authType === 'basic' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500">Username</label>
                            <input
                                type="text"
                                value={authUsername}
                                onChange={(e) => setAuthUsername(e.target.value)}
                                placeholder="Username"
                                className="w-full h-11 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 text-xs focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500">Password</label>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full h-11 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl pl-4 pr-10 text-xs focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {authType === 'apikey' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500">Key Name</label>
                                <input
                                    type="text"
                                    value={authApiKeyName}
                                    onChange={(e) => setAuthApiKeyName(e.target.value)}
                                    placeholder="X-API-Key"
                                    className="w-full h-11 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500">Key Value</label>
                                <input
                                    type="text"
                                    value={authApiKeyValue}
                                    onChange={(e) => setAuthApiKeyValue(e.target.value)}
                                    placeholder="Secret api key"
                                    className="w-full h-11 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 block">Add key credentials to</label>
                            <div className="flex gap-4 text-xs font-bold bg-gray-50/50 dark:bg-neutral-900/40 p-2.5 rounded-xl border border-gray-200/50 dark:border-neutral-850">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="apiKeyAddTo"
                                        checked={authApiKeyAddTo === 'header'}
                                        onChange={() => setAuthApiKeyAddTo('header')}
                                        className="accent-main w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <span className={authApiKeyAddTo === 'header' ? 'text-main' : 'text-gray-500 dark:text-zinc-400'}>Request Header</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="radio"
                                        name="apiKeyAddTo"
                                        checked={authApiKeyAddTo === 'query'}
                                        onChange={() => setAuthApiKeyAddTo('query')}
                                        className="accent-main w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <span className={authApiKeyAddTo === 'query' ? 'text-main' : 'text-gray-500 dark:text-zinc-400'}>URL Query Parameters</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthTab;
