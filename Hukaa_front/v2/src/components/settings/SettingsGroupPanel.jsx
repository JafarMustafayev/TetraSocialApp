import { Link } from 'react-router-dom';

const SettingsGroupPanel = ({ category, onBack }) => {
    return (
        <div className="w-full h-full flex flex-col overflow-y-auto custom-scrollbar bg-white dark:bg-[#09090b]">
            <div className="px-4 pt-4  sticky top-0 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md z-10 flex items-center gap-3 ">
                <button
                    onClick={onBack}
                    className="md:hidden w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-[#16181c] flex items-center justify-center transition-colors"
                >
                    <i className="ri-arrow-left-line text-xl text-gray-900 dark:text-white"></i>
                </button>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h2>
            </div>

            <div className="p-4 ">
                <p className="text-[14px] text-gray-500 dark:text-gray-400">
                    {category.description}
                </p>
            </div>

            <div className="flex-col flex">
                {category.items && category.items.length > 0 ? (
                    category.items.map((item) => (
                        <Link
                            key={item.id}
                            to={`/settings/${category.id}/${item.id}`}
                            className="flex items-start gap-4 px-4 py-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-[#16181c] mx-2 mt-1.5 rounded-md"
                        >
                            <div className="mt-0.5 flex items-center justify-center">
                                {item.icon ? <item.icon size={18} className={`text-gray-500 dark:text-gray-400`} /> : <i className={`text-gray-500 dark:text-gray-400 text-xl ri-settings-3-line`}></i>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`font-medium text-[15px] mb-0.5 text-gray-900 dark:text-white`}>
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-[13px] text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                            <i className="ri-arrow-right-s-line text-gray-400 text-xl self-center"></i>
                        </Link>
                    ))
                ) : (
                    <div className="p-8 text-center text-[15px] text-gray-500 dark:text-gray-400">
                        This category has no items yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsGroupPanel;
