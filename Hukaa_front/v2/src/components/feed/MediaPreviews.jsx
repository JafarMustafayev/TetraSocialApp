const MediaPreviews = ({ files, onRemove, onAddClick, maxFiles = 10 }) => {
    if (!files || files.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-3 mt-4">
            {files.map((media) => (
                <div key={media.id} className="relative mx-1.5 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden group border border-gray-100 dark:border-gray-800 shadow-sm">
                    {media.type.startsWith('video/') ? (
                        <video src={media.previewUrl} className="w-full h-full object-cover" />
                    ) : (
                        <img src={media.previewUrl} alt="preview" className="w-full h-full object-cover" />
                    )}

                    {/* Hover Overlay with X button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-1">
                        <button
                            onClick={() => onRemove(media.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-red-500 text-white transition-colors backdrop-blur-sm"
                            type="button"
                        >
                            <i className="ri-close-line text-sm font-bold"></i>
                        </button>
                    </div>
                </div>
            ))}

            {/* Add More Button (Only if below max files limit) */}
            {files.length < maxFiles && (
                <button
                    onClick={onAddClick}
                    type="button"
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-main hover:border-main hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                >
                    <i className="ri-add-line text-2xl"></i>
                </button>
            )}
        </div>
    );
};

export default MediaPreviews;
