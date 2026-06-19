// src/components/apiTester/ApiTesterBodyTab.jsx
import React from 'react';
import { Database, Plus, Trash2, Sparkles } from 'lucide-react';

const BodyTab = ({
    bodyType,
    setBodyType,
    jsonBody,
    setJsonBody,
    xmlBody,
    setXmlBody,
    rawBody,
    setRawBody,
    formData,
    addFormData,
    updateFormData,
    removeFormData,
    formatJsonBody
}) => {
    return (
        <div className="space-y-4 h-full flex flex-col min-h-0">
            {/* Radio Selection bar */}
            <div className="flex flex-wrap gap-4 text-xs font-bold bg-gray-100/40 dark:bg-neutral-900/50 p-2.5 rounded-xl border border-main/60 shrink-0">
                {[
                    { id: 'none', label: 'None' },
                    { id: 'json', label: 'JSON' },
                    { id: 'xml', label: 'XML' },
                    { id: 'formdata', label: 'Form Data' },
                    { id: 'raw', label: 'Raw Text' }
                ].map(t => (
                    <label key={t.id} className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                            type="radio"
                            name="bodyType"
                            checked={bodyType === t.id}
                            onChange={() => setBodyType(t.id)}
                            className="accent-main w-3.5 h-3.5 cursor-pointer"
                        />
                        <span className={bodyType === t.id ? 'text-main' : 'text-gray-500 dark:text-zinc-400'}>{t.label}</span>
                    </label>
                ))}
            </div>

            <div className="flex-1 min-h-0">
                {bodyType === 'none' && (
                    <div className="py-16 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-neutral-850 rounded-2xl flex flex-col items-center justify-center gap-2">
                        <Database className="h-8 w-8 opacity-30 text-gray-400" />
                        <span>No payload body required for this request format.</span>
                    </div>
                )}

                {bodyType === 'json' && (
                    <div className="flex flex-col h-full space-y-2">
                        <div className="flex justify-between items-center text-xs text-gray-400">
                            <span className="font-semibold uppercase tracking-wider text-[10px]">JSON Payload Editor</span>
                            <button
                                type="button"
                                onClick={formatJsonBody}
                                className="flex items-center gap-1 text-[10px] text-main font-bold hover:underline cursor-pointer"
                            >
                                <Sparkles className="h-3 w-3" /> Auto-Format JSON
                            </button>
                        </div>

                        {/* Textarea code appearance */}
                        <div className="flex-1 border border-neutral-800 dark:border-neutral-900 bg-neutral-950 rounded-2xl flex overflow-hidden min-h-[220px]">
                            {/* Line Numbers mock */}
                            <div className="bg-neutral-900/40 text-neutral-600/70 select-none text-right px-2 py-4 border-r border-neutral-800 font-mono text-xs leading-relaxed shrink-0 w-8">
                                {Array.from({ length: Math.max(jsonBody.split('\n').length, 1) }).map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>
                            <textarea
                                value={jsonBody}
                                onChange={(e) => setJsonBody(e.target.value)}
                                className="flex-1 bg-transparent text-emerald-400 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed select-text"
                                placeholder={`{\n  "key": "value"\n}`}
                            />
                        </div>
                    </div>
                )}

                {bodyType === 'xml' && (
                    <div className="flex flex-col h-full space-y-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">XML Payload Editor</span>
                        <div className="flex-1 border border-neutral-800 dark:border-neutral-900 bg-neutral-950 rounded-2xl flex overflow-hidden min-h-[220px]">
                            <div className="bg-neutral-900/40 text-neutral-600/70 select-none text-right px-2 py-4 border-r border-neutral-800 font-mono text-xs leading-relaxed shrink-0 w-8">
                                {Array.from({ length: Math.max(xmlBody.split('\n').length, 1) }).map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>
                            <textarea
                                value={xmlBody}
                                onChange={(e) => setXmlBody(e.target.value)}
                                className="flex-1 bg-transparent text-sky-400 p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed select-text"
                                placeholder="<xml></xml>"
                            />
                        </div>
                    </div>
                )}

                {bodyType === 'raw' && (
                    <div className="flex flex-col h-full space-y-2">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Raw Text Payload Editor</span>
                        <textarea
                            value={rawBody}
                            onChange={(e) => setRawBody(e.target.value)}
                            className="w-full h-[220px] bg-neutral-950 text-zinc-300 border border-neutral-800 dark:border-neutral-900 rounded-2xl p-4 font-mono text-xs focus:outline-none resize-none leading-relaxed select-text"
                            placeholder="Raw body string"
                        />
                    </div>
                )}

                {bodyType === 'formdata' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold tracking-wider text-gray-400 uppercase">FormData editor</span>
                            <button
                                type="button"
                                onClick={addFormData}
                                className="text-[11px] text-main font-bold hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <Plus className="h-3.5 w-3.5" /> Add Field
                            </button>
                        </div>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 select-text">
                            {formData.map((fd, i) => (
                                <div key={i} className="flex items-center gap-2 bg-gray-55/30 dark:bg-neutral-900/10 p-1.5 rounded-xl border border-main">
                                    <select
                                        value={fd.type}
                                        onChange={(e) => updateFormData(i, 'type', e.target.value)}
                                        className="h-9 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-2.5 text-[10px] font-bold tracking-wider uppercase focus:outline-none focus:border-main cursor-pointer"
                                    >
                                        <option value="text">TEXT</option>
                                        <option value="file">FILE</option>
                                    </select>
                                    <input
                                        type="text"
                                        value={fd.key}
                                        onChange={(e) => updateFormData(i, 'key', e.target.value)}
                                        placeholder="Param Key"
                                        className="flex-1 h-9 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-3 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                                    />
                                    {fd.type === 'text' ? (
                                        <input
                                            type="text"
                                            value={fd.value}
                                            onChange={(e) => updateFormData(i, 'value', e.target.value)}
                                            placeholder="Param Value"
                                            className="flex-1 h-9 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-3 text-xs font-mono focus:outline-none focus:border-main text-gray-800 dark:text-zinc-200"
                                        />
                                    ) : (
                                        <div className="flex-1 flex items-center bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-2 h-9 overflow-hidden">
                                            <input
                                                type="file"
                                                onChange={(e) => updateFormData(i, 'file', e.target.files[0])}
                                                className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-main file:text-white hover:file:bg-main-hover cursor-pointer"
                                            />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => removeFormData(i)}
                                        className="h-9 w-9 flex items-center justify-center text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-150 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                            {formData.length === 0 && (
                                <div className="text-center py-10 text-xs text-gray-400 border border-dashed border-gray-200 dark:border-neutral-850 rounded-xl">
                                    No multipart values defined. Click "Add Field" to begin.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BodyTab;
