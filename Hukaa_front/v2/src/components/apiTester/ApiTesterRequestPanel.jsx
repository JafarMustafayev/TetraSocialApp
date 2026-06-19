// src/components/apiTester/ApiTesterRequestPanel.jsx
import React from 'react';
import HeadersTab from './ApiTesterHeadersTab';
import ParamsTab from './ApiTesterParamsTab';
import BodyTab from './ApiTesterBodyTab';
import AuthTab from './ApiTesterAuthTab';
import CookiesTab from './ApiTesterCookiesTab';

const RequestPanel = ({
    method,
    activeRequestTab,
    setActiveRequestTab,
    headers,
    queryParams,
    requestCookies,
    bodyType,
    setBodyType,
    jsonBody,
    setJsonBody,
    xmlBody,
    setXmlBody,
    rawBody,
    setRawBody,
    formData,
    addHeader,
    updateHeader,
    removeHeader,
    addQueryParam,
    updateQueryParam,
    removeQueryParam,
    addCookie,
    updateCookie,
    removeCookie,
    addFormData,
    updateFormData,
    removeFormData,
    formatJsonBody,
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
        <div className="flex-1 flex flex-col min-h-0 bg-white/30 dark:bg-[#09090b]/10 p-5">
            {/* Tab Selectors */}
            <div className="flex border-b border-gray-200/60 dark:border-neutral-900 shrink-0 pb-px">
                {[
                    { id: 'headers', label: 'Headers', count: headers.filter(h => h.key).length },
                    { id: 'params', label: 'Query Params', count: queryParams.filter(q => q.key).length },
                    { id: 'body', label: 'Body', isMethodSensitive: true },
                    { id: 'auth', label: 'Auth' },
                    { id: 'cookies', label: 'Cookies' }
                ].map((tab) => {
                    if (tab.isMethodSensitive && method === 'GET') return null;
                    const isActive = activeRequestTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveRequestTab(tab.id)}
                            className={`pb-2.5 px-3 font-extrabold text-[10px] uppercase tracking-wider transition-all relative cursor-pointer ${isActive
                                ? 'text-main'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'
                                }`}
                        >
                            <span className="flex items-center gap-1.5">
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-main/10 text-main' : 'bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-zinc-400'}`}>
                                        {tab.count}
                                    </span>
                                )}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-main rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Configurations content */}
            <div className="flex-1 overflow-y-auto min-h-0 pt-4 custom-scrollbar">
                {activeRequestTab === 'headers' && (
                    <HeadersTab
                        headers={headers}
                        addHeader={addHeader}
                        updateHeader={updateHeader}
                        removeHeader={removeHeader}
                    />
                )}

                {activeRequestTab === 'params' && (
                    <ParamsTab
                        queryParams={queryParams}
                        addQueryParam={addQueryParam}
                        updateQueryParam={updateQueryParam}
                        removeQueryParam={removeQueryParam}
                    />
                )}

                {activeRequestTab === 'body' && method !== 'GET' && (
                    <BodyTab
                        bodyType={bodyType}
                        setBodyType={setBodyType}
                        jsonBody={jsonBody}
                        setJsonBody={setJsonBody}
                        xmlBody={xmlBody}
                        setXmlBody={setXmlBody}
                        rawBody={rawBody}
                        setRawBody={setRawBody}
                        formData={formData}
                        addFormData={addFormData}
                        updateFormData={updateFormData}
                        removeFormData={removeFormData}
                        formatJsonBody={formatJsonBody}
                    />
                )}

                {activeRequestTab === 'auth' && (
                    <AuthTab
                        authType={authType}
                        setAuthType={setAuthType}
                        authToken={authToken}
                        setAuthToken={setAuthToken}
                        authUsername={authUsername}
                        setAuthUsername={setAuthUsername}
                        authPassword={authPassword}
                        setAuthPassword={setAuthPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        authApiKeyName={authApiKeyName}
                        setAuthApiKeyName={setAuthApiKeyName}
                        authApiKeyValue={authApiKeyValue}
                        setAuthApiKeyValue={setAuthApiKeyValue}
                        authApiKeyAddTo={authApiKeyAddTo}
                        setAuthApiKeyAddTo={setAuthApiKeyAddTo}
                    />
                )}

                {activeRequestTab === 'cookies' && (
                    <CookiesTab
                        requestCookies={requestCookies}
                        addCookie={addCookie}
                        updateCookie={updateCookie}
                        removeCookie={removeCookie}
                    />
                )}
            </div>
        </div>
    );
};

export default RequestPanel;
