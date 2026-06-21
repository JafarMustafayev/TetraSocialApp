// src/components/ui/Tabs.jsx

const Tabs = ({ tabs, activeTab, onChange, className }) => {
    return (
        <div className={`flex border-b border-gray-100 dark:border-[#1f1f1f] bg-white dark:bg-[#09090b] w-full ${className}`}>
            {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex-1 py-3 text-[15px] font-bold transition-all border-b-3 cursor-pointer ${isActive
                            ? 'text-gray-900 dark:text-white border-main'
                            : 'text-gray-500 border-transparent hover:text-gray-950 dark:hover:text-gray-200'
                            }`}
                    >
                        <span>{tab.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default Tabs;
