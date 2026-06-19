// src/hooks/useApiTester.js
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';

export const useApiTester = () => {
    // ----------------------------------------------------
    // Layout & UI Preferences State
    // ----------------------------------------------------
    const [layoutMode, setLayoutMode] = useState(() => {
        return localStorage.getItem('api_tester_layout_mode') || 'split'; // 'split' | 'vertical'
    });
    const [splitWidth, setSplitWidth] = useState(() => {
        return Number(localStorage.getItem('api_tester_split_width')) || 50; // percentage
    });
    const [historyOpen, setHistoryOpen] = useState(false);
    const [methodDropdownOpen, setMethodDropdownOpen] = useState(false);
    const [activeRequestTab, setActiveRequestTab] = useState('headers'); // 'headers' | 'params' | 'body' | 'auth' | 'cookies'
    const [activeResponseTab, setActiveResponseTab] = useState('body'); // 'body' | 'headers' | 'cookies' | 'raw'
    const [jsonExpanded, setJsonExpanded] = useState(true);

    // ----------------------------------------------------
    // Request State
    // ----------------------------------------------------
    const [url, setUrl] = useState('http://localhost:5294/Test/');
    const [method, setMethod] = useState('GET');

    // Headers list
    const [headers, setHeaders] = useState([
        { key: 'Content-Type', value: 'application/json', active: true },
        { key: 'Accept', value: 'application/json', active: true }
    ]);

    // Query parameters list
    const [queryParams, setQueryParams] = useState([
        { key: '', value: '', active: true }
    ]);

    // Cookies list
    const [requestCookies, setRequestCookies] = useState([
        { key: '', value: '', active: true }
    ]);

    // Payload details
    const [bodyType, setBodyType] = useState('json'); // 'none' | 'json' | 'xml' | 'formdata' | 'raw'
    const [jsonBody, setJsonBody] = useState('{\n  "key": "value"\n}');
    const [xmlBody, setXmlBody] = useState('<request>\n  <key>value</key>\n</request>');
    const [rawBody, setRawBody] = useState('raw text value');
    const [formData, setFormData] = useState([
        { key: '', value: '', type: 'text', file: null }
    ]);

    // Authorization Details
    const [authType, setAuthType] = useState('none'); // 'none' | 'bearer' | 'basic' | 'apikey'
    const [authToken, setAuthToken] = useState('');
    const [authUsername, setAuthUsername] = useState('');
    const [authPassword, setAuthPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authApiKeyName, setAuthApiKeyName] = useState('X-API-Key');
    const [authApiKeyValue, setAuthApiKeyValue] = useState('');
    const [authApiKeyAddTo, setAuthApiKeyAddTo] = useState('header'); // 'header' | 'query'

    // ----------------------------------------------------
    // History persistent state
    // ----------------------------------------------------
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('hukaa_api_history_v2');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // ----------------------------------------------------
    // Response State
    // ----------------------------------------------------
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    // UI Helpers
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [copiedResponse, setCopiedResponse] = useState(false);

    // Refs
    const workspaceRef = useRef(null);

    // Save preferences
    useEffect(() => {
        localStorage.setItem('api_tester_layout_mode', layoutMode);
    }, [layoutMode]);

    useEffect(() => {
        localStorage.setItem('hukaa_api_history_v2', JSON.stringify(history));
    }, [history]);

    // ----------------------------------------------------
    // Sync URL and Query Params
    // ----------------------------------------------------
    // Parses params out of URL and fills Query Params list
    const handleUrlChange = (newUrl) => {
        setUrl(newUrl);
        try {
            const parsed = new URL(newUrl);
            const paramsList = [];
            parsed.searchParams.forEach((value, key) => {
                paramsList.push({ key, value, active: true });
            });
            if (paramsList.length > 0) {
                // Keep one empty row for convenience if needed
                setQueryParams([...paramsList, { key: '', value: '', active: true }]);
            }
        } catch (e) {
            // Keep typing without crash
        }
    };

    // Rebuilds URL with query params
    const updateUrlFromParams = (params) => {
        try {
            let baseUrl = url.split('?')[0];
            const searchParams = new URLSearchParams();

            params.forEach(p => {
                if (p.active && p.key) {
                    searchParams.append(p.key, p.value);
                }
            });

            const queryStr = searchParams.toString();
            setUrl(queryStr ? `${baseUrl}?${queryStr}` : baseUrl);
        } catch (e) {
            // Rebuild with manual parsing if host is relative/localhost without HTTP
            try {
                let baseUrl = url.split('?')[0];
                const parts = [];
                params.forEach(p => {
                    if (p.active && p.key) {
                        parts.push(`${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`);
                    }
                });
                const queryStr = parts.join('&');
                setUrl(queryStr ? `${baseUrl}?${queryStr}` : baseUrl);
            } catch (err) {
                // Ignore url format issues
            }
        }
    };

    // ----------------------------------------------------
    // Resizable Drag Handler
    // ----------------------------------------------------
    const handlePointerDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = splitWidth;
        const containerWidth = workspaceRef.current ? workspaceRef.current.clientWidth : window.innerWidth;

        const handlePointerMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaPercentage = (deltaX / containerWidth) * 100;
            const newPercentage = Math.min(Math.max(startWidth + deltaPercentage, 20), 80);
            setSplitWidth(newPercentage);
            localStorage.setItem('api_tester_split_width', newPercentage.toString());
        };

        const handlePointerUp = () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
    };

    // Helper status styling functions
    const getStatusStyle = (status) => {
        if (!status) return '';
        const code = parseInt(status);
        if (code >= 200 && code < 300) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
        if (code >= 300 && code < 400) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
        if (code >= 400 && code < 500) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    };

    // ----------------------------------------------------
    // SEND REQUEST LOGIC
    // ----------------------------------------------------
    const handleSendRequest = async () => {
        if (!url) {
            toast.error('URL is required');
            return;
        }

        setLoading(true);
        setError(null);
        setResponse(null);

        const startTime = performance.now();

        try {
            // Build dynamic headers
            const reqHeaders = {};

            // 1. Configured custom headers
            headers.forEach(h => {
                if (h.active && h.key) {
                    reqHeaders[h.key] = h.value;
                }
            });

            // 2. Auth Headers injection
            if (authType === 'bearer' && authToken) {
                reqHeaders['Authorization'] = `Bearer ${authToken}`;
            } else if (authType === 'basic' && authUsername && authPassword) {
                const encoded = btoa(`${authUsername}:${authPassword}`);
                reqHeaders['Authorization'] = `Basic ${encoded}`;
            } else if (authType === 'apikey' && authApiKeyAddTo === 'header' && authApiKeyName && authApiKeyValue) {
                reqHeaders[authApiKeyName] = authApiKeyValue;
            }

            // 3. Request Cookies injection
            const activeCookies = requestCookies.filter(c => c.active && c.key);
            if (activeCookies.length > 0) {
                reqHeaders['Cookie'] = activeCookies.map(c => `${c.key}=${c.value}`).join('; ');
            }

            // Build request target URL (injecting auth query param if configured)
            let finalUrl = url;
            if (authType === 'apikey' && authApiKeyAddTo === 'query' && authApiKeyName && authApiKeyValue) {
                try {
                    const parsedUrl = new URL(finalUrl);
                    parsedUrl.searchParams.append(authApiKeyName, authApiKeyValue);
                    finalUrl = parsedUrl.toString();
                } catch {
                    const separator = finalUrl.includes('?') ? '&' : '?';
                    finalUrl = `${finalUrl}${separator}${encodeURIComponent(authApiKeyName)}=${encodeURIComponent(authApiKeyValue)}`;
                }
            }

            // Build request payload body
            let reqBody = null;
            if (method !== 'GET' && method !== 'HEAD') {
                if (bodyType === 'json') {
                    reqBody = jsonBody;
                    if (!Object.keys(reqHeaders).some(k => k.toLowerCase() === 'content-type')) {
                        reqHeaders['Content-Type'] = 'application/json';
                    }
                } else if (bodyType === 'xml') {
                    reqBody = xmlBody;
                    if (!Object.keys(reqHeaders).some(k => k.toLowerCase() === 'content-type')) {
                        reqHeaders['Content-Type'] = 'application/xml';
                    }
                } else if (bodyType === 'raw') {
                    reqBody = rawBody;
                    if (!Object.keys(reqHeaders).some(k => k.toLowerCase() === 'content-type')) {
                        reqHeaders['Content-Type'] = 'text/plain';
                    }
                } else if (bodyType === 'formdata') {
                    const fd = new FormData();
                    formData.forEach(item => {
                        if (item.key) {
                            if (item.type === 'file' && item.file) {
                                fd.append(item.key, item.file);
                            } else {
                                fd.append(item.key, item.value);
                            }
                        }
                    });
                    reqBody = fd;
                    // boundary automatically managed by browser, delete Content-Type if set
                    const ctKey = Object.keys(reqHeaders).find(k => k.toLowerCase() === 'content-type');
                    if (ctKey) delete reqHeaders[ctKey];
                }
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

            const res = await fetch(finalUrl, {
                method,
                headers: reqHeaders,
                body: reqBody,
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const endTime = performance.now();
            const duration = Math.round(endTime - startTime);

            // Fetch response headers
            const resHeaders = {};
            res.headers.forEach((val, key) => {
                resHeaders[key] = val;
            });

            const contentLength = res.headers.get('content-length');
            const sizeStr = contentLength ? `${(contentLength / 1024).toFixed(2)} KB` : 'Unknown size';

            // Parse response data
            let responseData;
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                responseData = await res.json();
            } else {
                responseData = await res.text();
            }

            // Extract cookies if any
            const receivedCookies = resHeaders['set-cookie']
                ? resHeaders['set-cookie'].split(',').map(cookie => {
                    const [keyVal] = cookie.split(';');
                    const [key, ...value] = keyVal.split('=');
                    return { key: key.trim(), value: value.join('=').trim() };
                })
                : [];

            const resObj = {
                status: res.status,
                statusText: res.statusText,
                headers: resHeaders,
                data: responseData,
                cookies: receivedCookies,
                time: duration,
                size: sizeStr,
                isJson: contentType.includes('application/json')
            };

            setResponse(resObj);

            // Record to History list
            const historyItem = {
                url,
                method,
                headers,
                queryParams,
                requestCookies,
                bodyType,
                jsonBody,
                xmlBody,
                rawBody,
                formData,
                authType,
                authToken,
                authUsername,
                authPassword,
                authApiKeyName,
                authApiKeyValue,
                authApiKeyAddTo,
                status: `${res.status} ${res.statusText}`,
                statusCode: res.status,
                time: duration,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                pinned: false
            };

            setHistory(prev => {
                const filtered = prev.filter(h => h.url !== url || h.method !== method);
                const updated = [historyItem, ...filtered].slice(0, 30);
                return updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
            });

            toast.success(`Request completed: ${res.status} ${res.statusText}`);

        } catch (err) {
            console.error(err);
            const errMsg = err.name === 'AbortError' ? 'Request Timeout (30 seconds)' : err.message || 'Connection handshake failed';
            setError(errMsg);

            const failedHistoryItem = {
                url,
                method,
                headers,
                queryParams,
                requestCookies,
                bodyType,
                jsonBody,
                xmlBody,
                rawBody,
                formData,
                authType,
                authToken,
                authUsername,
                authPassword,
                authApiKeyName,
                authApiKeyValue,
                authApiKeyAddTo,
                status: 'Connection Failed',
                statusCode: 'ERR',
                time: 0,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                pinned: false
            };

            setHistory(prev => {
                const filtered = prev.filter(h => h.url !== url || h.method !== method);
                const updated = [failedHistoryItem, ...filtered].slice(0, 30);
                return updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
            });

            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    // ----------------------------------------------------
    // Keyboard Shortcuts Listener
    // ----------------------------------------------------
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ctrl + Enter -> Send Request
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                handleSendRequest();
            }
            // Ctrl + Shift + H -> Toggle History Drawer
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                setHistoryOpen(prev => !prev);
            }
            // Ctrl + Shift + L -> Toggle Layout
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                e.preventDefault();
                setLayoutMode(prev => prev === 'split' ? 'vertical' : 'split');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [url, method, headers, queryParams, requestCookies, bodyType, jsonBody, xmlBody, rawBody, formData, authType, authToken, authUsername, authPassword, authApiKeyName, authApiKeyValue, authApiKeyAddTo]);


    // ----------------------------------------------------
    // API Helper Actions
    // ----------------------------------------------------
    const addHeader = () => setHeaders([...headers, { key: '', value: '', active: true }]);
    const updateHeader = (i, field, val) => {
        const updated = [...headers];
        updated[i][field] = val;
        setHeaders(updated);
    };
    const removeHeader = (i) => setHeaders(headers.filter((_, idx) => idx !== i));

    const addQueryParam = () => setQueryParams([...queryParams, { key: '', value: '', active: true }]);
    const updateQueryParam = (i, field, val) => {
        const updated = [...queryParams];
        updated[i][field] = val;
        setQueryParams(updated);
        updateUrlFromParams(updated);
    };
    const removeQueryParam = (i) => {
        const updated = queryParams.filter((_, idx) => idx !== i);
        setQueryParams(updated);
        updateUrlFromParams(updated);
    };

    const addCookie = () => setRequestCookies([...requestCookies, { key: '', value: '', active: true }]);
    const updateCookie = (i, field, val) => {
        const updated = [...requestCookies];
        updated[i][field] = val;
        setRequestCookies(updated);
    };
    const removeCookie = (i) => setRequestCookies(requestCookies.filter((_, idx) => idx !== i));

    const addFormData = () => setFormData([...formData, { key: '', value: '', type: 'text', file: null }]);
    const updateFormData = (i, field, val) => {
        const updated = [...formData];
        if (field === 'file') {
            updated[i].file = val;
            updated[i].value = val ? val.name : '';
        } else {
            updated[i][field] = val;
        }
        setFormData(updated);
    };
    const removeFormData = (i) => setFormData(formData.filter((_, idx) => idx !== i));

    const clearUrl = () => setUrl('');
    const copyUrl = () => {
        navigator.clipboard.writeText(url);
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
        toast.success('URL copied to clipboard');
    };

    const formatJsonBody = () => {
        try {
            const parsed = JSON.parse(jsonBody);
            setJsonBody(JSON.stringify(parsed, null, 2));
            toast.success('JSON formatted successfully');
        } catch (e) {
            toast.error('Invalid JSON. Cannot format.');
        }
    };

    // Load History item
    const loadFromHistory = (item) => {
        setUrl(item.url);
        setMethod(item.method);
        setHeaders(item.headers || []);
        setQueryParams(item.queryParams || []);
        setRequestCookies(item.requestCookies || []);
        setBodyType(item.bodyType || 'json');
        setJsonBody(item.jsonBody || '{\n  "key": "value"\n}');
        setXmlBody(item.xmlBody || '');
        setRawBody(item.rawBody || '');
        setFormData(item.formData || []);
        setAuthType(item.authType || 'none');
        setAuthToken(item.authToken || '');
        setAuthUsername(item.authUsername || '');
        setAuthPassword(item.authPassword || '');
        setAuthApiKeyName(item.authApiKeyName || 'X-API-Key');
        setAuthApiKeyValue(item.authApiKeyValue || '');
        setAuthApiKeyAddTo(item.authApiKeyAddTo || 'header');
        toast.success(`Loaded ${item.method} Request`);
    };

    const deleteHistoryItem = (e, index) => {
        e.stopPropagation();
        setHistory(prev => prev.filter((_, i) => i !== index));
        toast.success('History item deleted');
    };

    const togglePinHistoryItem = (e, index) => {
        e.stopPropagation();
        setHistory(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], pinned: !updated[index].pinned };
            return updated.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        });
    };

    const clearAllHistory = () => {
        setHistory([]);
        toast.success('History cleared');
    };

    // Copy formatted response
    const copyResponse = () => {
        if (!response) return;
        const text = response.isJson ? JSON.stringify(response.data, null, 2) : response.data;
        navigator.clipboard.writeText(text);
        setCopiedResponse(true);
        setTimeout(() => setCopiedResponse(false), 2000);
        toast.success('Response copied to clipboard');
    };

    // Download formatted response payload
    const downloadResponse = () => {
        if (!response) return;
        const ext = response.isJson ? 'json' : 'txt';
        const content = response.isJson ? JSON.stringify(response.data, null, 2) : response.data;
        const blob = new Blob([content], { type: response.isJson ? 'application/json' : 'text/plain' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `response-${Date.now()}.${ext}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
        toast.success('File download started');
    };

    return {
        // Layout State
        layoutMode, setLayoutMode,
        splitWidth, setSplitWidth,
        historyOpen, setHistoryOpen,
        methodDropdownOpen, setMethodDropdownOpen,
        activeRequestTab, setActiveRequestTab,
        activeResponseTab, setActiveResponseTab,
        jsonExpanded, setJsonExpanded,

        // Request State
        url, setUrl,
        method, setMethod,
        headers, setHeaders,
        queryParams, setQueryParams,
        requestCookies, setRequestCookies,
        bodyType, setBodyType,
        jsonBody, setJsonBody,
        xmlBody, setXmlBody,
        rawBody, setRawBody,
        formData, setFormData,
        authType, setAuthType,
        authToken, setAuthToken,
        authUsername, setAuthUsername,
        authPassword, setAuthPassword,
        showPassword, setShowPassword,
        authApiKeyName, setAuthApiKeyName,
        authApiKeyValue, setAuthApiKeyValue,
        authApiKeyAddTo, setAuthApiKeyAddTo,

        // History
        history, setHistory,
        loadFromHistory, deleteHistoryItem, togglePinHistoryItem, clearAllHistory,

        // Response
        loading, setLoading,
        response, setResponse,
        error, setError,
        copiedUrl, setCopiedUrl,
        copiedResponse, setCopiedResponse,

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
        getStatusStyle,

        // Refs
        workspaceRef
    };
};
