// src/utils/api-tester/api-tester-utils.js

export const highlightJson = (jsonStr) => {
    if (!jsonStr) return '';
    let escaped = jsonStr
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return escaped.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
        (match) => {
            let cls = 'text-sky-500 dark:text-sky-400'; // number
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'text-main font-semibold'; // key
                } else {
                    cls = 'text-emerald-500 dark:text-emerald-400'; // string
                }
            } else if (/true|false/.test(match)) {
                cls = 'text-amber-500'; // boolean
            } else if (/null/.test(match)) {
                cls = 'text-rose-400'; // null
            }
            return `<span class="${cls}">${match}</span>`;
        }
    );
};

export const getStatusStyle = (status) => {
    if (!status) return '';
    const code = parseInt(status);
    if (code >= 200 && code < 300) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    if (code >= 300 && code < 400) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    if (code >= 400 && code < 500) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
};
