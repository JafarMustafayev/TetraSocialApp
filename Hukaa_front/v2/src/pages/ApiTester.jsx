// src/pages/ApiTester.jsx
import React from 'react';
import { History, LayoutGrid, LayoutList } from 'lucide-react';
import { useApiTester } from '../hooks/useApiTester';
import HistoryDrawer from '../components/apiTester/ApiTesterHistoryDrawer';
import UrlBar from '../components/apiTester/ApiTesterUrlBar';
import RequestPanel from '../components/apiTester/ApiTesterRequestPanel';
import ResponsePanel from '../components/apiTester/ApiTesterResponsePanel';

const ApiTester = () => {
    const {
        // Layout State
        layoutMode, setLayoutMode,
        splitWidth,
        historyOpen, setHistoryOpen,
        methodDropdownOpen, setMethodDropdownOpen,
        activeRequestTab, setActiveRequestTab,
        activeResponseTab, setActiveResponseTab,
        jsonExpanded, setJsonExpanded,

        // Request State
        url,
        method, setMethod,
        headers,
        queryParams,
        requestCookies,
        bodyType, setBodyType,
        jsonBody, setJsonBody,
        xmlBody, setXmlBody,
        rawBody, setRawBody,
        formData,
        authType, setAuthType,
        authToken, setAuthToken,
        authUsername, setAuthUsername,
        authPassword, setAuthPassword,
        showPassword, setShowPassword,
        authApiKeyName, setAuthApiKeyName,
        authApiKeyValue, setAuthApiKeyValue,
        authApiKeyAddTo, setAuthApiKeyAddTo,

        // History
        history,
        loadFromHistory, deleteHistoryItem, togglePinHistoryItem, clearAllHistory,

        // Response
        loading,
        response,
        error,
        copiedUrl,
        copiedResponse,

        // Handlers
        handleUrlChange,
        handlePointerDown,
        handleSendRequest,
        addHeader, updateHeader, removeHeader,
        addQueryParam, updateQueryParam, removeQueryParam,
        addCookie, updateCookie, removeCookie,
        addFormData, updateFormData, removeFormData,
        clearUrl, copyUrl,
        formatJsonBody,
        copyResponse, downloadResponse,

        // Refs
        workspaceRef
    } = useApiTester();

    return (
        <div className="flex-1 w-full min-h-screen bg-slate-50/40 dark:bg-[#070709] text-gray-900 dark:text-zinc-100 flex flex-col font-sans relative overflow-hidden transition-colors duration-300">

            {/* Header Area */}
            <header className="border-b border-gray-200/50 dark:border-neutral-900 bg-white/70 dark:bg-[#09090b]/70 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 z-20">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className={`h-10 px-4 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all duration-200 cursor-pointer ${historyOpen
                            ? 'bg-main text-white border-main shadow-md shadow-main/20'
                            : 'bg-white hover:bg-gray-50 border-gray-200/80 text-gray-600 dark:bg-neutral-900 dark:border-neutral-800 dark:text-zinc-300 dark:hover:bg-neutral-800'
                            }`}
                        title="Toggle Request History drawer (Ctrl+Shift+H)"
                    >
                        <History className="h-4 w-4" />
                        <span>History</span>
                    </button>
                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                            API Workspace
                        </h1>
                        <p className="text-[11px] font-semibold text-gray-500 dark:text-zinc-400">Test and validate local or external API endpoints</p>
                    </div>
                </div>

                {/* Layout Controls */}
                <div className="flex flex-wrap items-center gap-2">
                    <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

                    <div className="bg-gray-150/60 dark:bg-neutral-900/60 p-1 rounded-xl flex items-center border border-gray-200/50 dark:border-neutral-800">
                        <button
                            onClick={() => setLayoutMode('split')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${layoutMode === 'split'
                                ? 'bg-white text-gray-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-zinc-350'
                                }`}
                            title="Split View (Ctrl+Shift+L)"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                            <span className="sr-only lg:not-sr-only text-[10px] uppercase font-bold tracking-wider">Split</span>
                        </button>
                        <button
                            onClick={() => setLayoutMode('vertical')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 cursor-pointer ${layoutMode === 'vertical'
                                ? 'bg-white text-gray-900 dark:bg-neutral-800 dark:text-white shadow-sm'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-zinc-350'
                                }`}
                            title="Vertical View (Ctrl+Shift+L)"
                        >
                            <LayoutList className="h-3.5 w-3.5" />
                            <span className="sr-only lg:not-sr-only text-[10px] uppercase font-bold tracking-wider">Vertical</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Area container */}
            <div className="flex-1 flex min-h-0 overflow-hidden relative">

                {/* History Drawer Slider & Backdrop Overlay */}
                <HistoryDrawer
                    historyOpen={historyOpen}
                    setHistoryOpen={setHistoryOpen}
                    history={history}
                    clearAllHistory={clearAllHistory}
                    loadFromHistory={loadFromHistory}
                    handleSendRequest={handleSendRequest}
                    togglePinHistoryItem={togglePinHistoryItem}
                    deleteHistoryItem={deleteHistoryItem}
                />

                {/* Workspace Split Content */}
                <div
                    ref={workspaceRef}
                    className={`flex-1 flex ${layoutMode === 'split' ? 'flex-col lg:flex-row' : 'flex-col'
                        } overflow-y-auto lg:overflow-hidden min-h-0 relative`}
                >

                    {/* Left/Top Pane: Request Builder */}
                    <div
                        style={{
                            width: layoutMode === 'split' ? `${splitWidth}%` : '100%',
                            height: layoutMode === 'split' ? '100%' : '50%',
                            minWidth: layoutMode === 'split' ? '35%' : 'auto'
                        }}
                        className={`flex flex-col overflow-y-auto lg:overflow-hidden divide-y divide-gray-200/50 dark:divide-neutral-900 min-h-0 shrink-0 ${layoutMode === 'split'
                            ? 'border-r border-gray-200/30 dark:border-neutral-900/30'
                            : 'border-b border-gray-200/30 dark:border-neutral-900/30'
                            }`}
                    >
                        {/* URL entry bar */}
                        <UrlBar
                            method={method}
                            setMethod={setMethod}
                            methodDropdownOpen={methodDropdownOpen}
                            setMethodDropdownOpen={setMethodDropdownOpen}
                            url={url}
                            handleUrlChange={handleUrlChange}
                            clearUrl={clearUrl}
                            copyUrl={copyUrl}
                            copiedUrl={copiedUrl}
                            handleSendRequest={handleSendRequest}
                            loading={loading}
                        />

                        {/* Request configurations */}
                        <RequestPanel
                            method={method}
                            activeRequestTab={activeRequestTab}
                            setActiveRequestTab={setActiveRequestTab}
                            headers={headers}
                            queryParams={queryParams}
                            requestCookies={requestCookies}
                            bodyType={bodyType}
                            setBodyType={setBodyType}
                            jsonBody={jsonBody}
                            setJsonBody={setJsonBody}
                            xmlBody={xmlBody}
                            setXmlBody={setXmlBody}
                            rawBody={rawBody}
                            setRawBody={setRawBody}
                            formData={formData}
                            addHeader={addHeader}
                            updateHeader={updateHeader}
                            removeHeader={removeHeader}
                            addQueryParam={addQueryParam}
                            updateQueryParam={updateQueryParam}
                            removeQueryParam={removeQueryParam}
                            addCookie={addCookie}
                            updateCookie={updateCookie}
                            removeCookie={removeCookie}
                            addFormData={addFormData}
                            updateFormData={updateFormData}
                            removeFormData={removeFormData}
                            formatJsonBody={formatJsonBody}
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
                    </div>

                    {/* Resizer divider (hidden if not split view) */}
                    {layoutMode === 'split' && (
                        <div
                            onPointerDown={handlePointerDown}
                            className="hidden lg:block w-[7px] bg-gray-200/50 hover:bg-main/50 dark:bg-neutral-900 dark:hover:bg-main/40 cursor-col-resize h-full transition-colors shrink-0 z-10 active:bg-main select-none"
                            title="Drag to adjust column layout size"
                        />
                    )}

                    {/* Right/Bottom Pane: Response Viewer */}
                    <div
                        style={{
                            width: layoutMode === 'split' ? `${100 - splitWidth}%` : '100%',
                            height: layoutMode === 'split' ? '100%' : '50%',
                            minWidth: layoutMode === 'split' ? '35%' : 'auto'
                        }}
                        className="flex-1 flex flex-col overflow-y-auto lg:overflow-hidden min-h-0 shrink-0"
                    >
                        <ResponsePanel
                            loading={loading}
                            error={error}
                            response={response}
                            activeResponseTab={activeResponseTab}
                            setActiveResponseTab={setActiveResponseTab}
                            jsonExpanded={jsonExpanded}
                            setJsonExpanded={setJsonExpanded}
                            copiedResponse={copiedResponse}
                            copyResponse={copyResponse}
                            downloadResponse={downloadResponse}
                        />
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ApiTester;
