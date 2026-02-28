import { getExperiences, addExperience, updateExperience, deleteExperience } from '../../api/profile';
import FormSkeleton from '../Skeleton/FormSkeleton';
import { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';

const WorkExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast, showConfirm } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        setLoading(true);
        try {
            const response = await getExperiences();
            if (response && response.success) {
                const mappedData = response.data.map(exp => {
                    const rawStart = exp.startAt || exp.startDate;
                    const rawEnd = exp.endAt || exp.endDate;
                    return {
                        id: exp.id,
                        company: exp.company,
                        position: exp.position,
                        startDate: rawStart && !rawStart.startsWith('0001') ? rawStart.split('T')[0] : '',
                        endDate: rawEnd && !rawEnd.startsWith('0001') ? rawEnd.split('T')[0] : '',
                        description: exp.description,
                        isCurrent: exp.isCurrent
                    };
                });
                setExperiences(mappedData);
            }
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch experiences.', 'error', 3000, 'top-left');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // .NET DateTime model binding can be sensitive to the 'Z' suffix and milliseconds.
            // Using a strictly compliant YYYY-MM-DDTHH:mm:ss format.
            const formatForBackend = (dateStr) => {
                if (!dateStr) return null;
                // If it already has T, it might be an ISO from an edit, split and re-format
                const cleanDate = dateStr.split('T')[0];
                return `${cleanDate}T00:00:00`;
            };

            const isoStartDate = formatForBackend(formData.startDate);
            const isoEndDate = formatForBackend(formData.endDate);

            const payload = {
                company: formData.company,
                position: formData.position,
                description: formData.description,
                startDate: isoStartDate,
                endDate: isoEndDate,
                startAt: isoStartDate,
                endAt: isoEndDate,
                isCurrent: !formData.endDate
            };


            if (isEditing) {
                const response = await updateExperience(currentId, payload);
                if (response.success) {
                    showToast('Experience updated successfully!', 'success', 3000, 'top-left');
                    await fetchExperiences();
                    setIsEditing(false);
                    setCurrentId(null);
                } else {
                    showToast(response.message || 'Failed to update experience', 'error', 3000, 'top-left');
                }
            } else {
                const response = await addExperience(payload);
                if (response.success) {
                    showToast('Experience added successfully!', 'success', 3000, 'top-left');
                    await fetchExperiences();
                } else {
                    showToast(response.message || 'Failed to add experience', 'error', 3000, 'top-left');
                }
            }

            // Success! Reset form
            setFormData({
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                description: ''
            });
        } catch (err) {
            console.error('Submission Error:', err);
            showToast(err.message || (isEditing ? 'Failed to update experience' : 'Failed to add experience'), 'error', 3000, 'top-left');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (experience) => {
        setIsEditing(true);
        setCurrentId(experience.id);
        setFormData({
            company: experience.company,
            position: experience.position,
            startDate: experience.startDate,
            endDate: experience.endDate,
            description: experience.description
        });
        // Scroll to form
        window.scrollTo({ top: document.querySelector('form')?.offsetTop - 150, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        showConfirm(
            "Delete Experience?",
            "Are you sure you want to delete this experience?",
            async () => {
                try {
                    const response = await deleteExperience(id);
                    if (response.success) {
                        setExperiences(experiences.filter(exp => exp.id !== id));
                        showToast('Experience deleted successfully!', 'success', 3000, 'top-left');
                    } else {
                        showToast(response.message || 'Failed to delete experience', 'error', 3000, 'top-left');
                    }
                } catch (err) {
                    console.error(err);
                    showToast('Failed to delete experience: ' + (err.message || ''), 'error', 3000, 'top-left');
                }
            }
        );
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentId(null);
        setFormData({
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            description: ''
        });
    };

    if (loading && experiences.length === 0) {
        return <FormSkeleton rows={2} />;
    }

    return (
        <div className="space-y-8">

            {/* List of Experiences */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-800 ml-1">Your Career Journey</h3>
                {experiences.length === 0 ? (
                    <div className="p-10 border-2 border-dashed border-gray-100 rounded-2xl text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <i className="ri-briefcase-line text-3xl"></i>
                        </div>
                        <p className="text-gray-400 font-medium">No work experience recorded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="relative group p-5 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-xl hover:shadow-blue-50/50 transition-all duration-300">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 space-y-1">
                                        <h5 className="text-lg font-bold text-[#3644D9]">{exp.position}</h5>
                                        <div className="flex items-center text-gray-700 font-bold text-sm">
                                            <i className="ri-building-line mr-2 text-gray-400"></i>
                                            {exp.company}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                                            <i className="ri-calendar-line mr-2"></i>
                                            {exp.startDate || 'N/A'} — {exp.isCurrent || !exp.endDate ? 'Present' : exp.endDate}
                                        </div>
                                        {exp.description && (
                                            <p className="mt-4 text-gray-500 text-sm leading-relaxed italic line-clamp-3">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-50 text-[#3644D9] hover:bg-[#3644D9] hover:text-white transition-all shadow-sm"
                                            onClick={() => handleEdit(exp)}
                                            title="Edit"
                                        >
                                            <i className="ri-pencil-line"></i>
                                        </button>
                                        <button
                                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                            onClick={() => handleDelete(exp.id)}
                                            title="Delete"
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Form */}
            <div className="p-6 md:p-8 rounded-2xl bg-gray-50/50 border border-gray-100">
                <h4 className="mb-6 font-bold text-lg flex items-center text-gray-800">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${isEditing ? 'bg-blue-100 text-[#3644D9]' : 'bg-green-100 text-green-600'}`}>
                        <i className={isEditing ? 'ri-edit-line text-xl' : 'ri-add-circle-line text-xl'}></i>
                    </div>
                    {isEditing ? 'Edit Experience' : 'Add New Work Experience'}
                </h4>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Company Name *</label>
                            <input
                                type="text"
                                className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. Acme Corporation"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Position / Designation *</label>
                            <input
                                type="text"
                                className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-400"
                                placeholder="e.g. Lead Software Engineer"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Start Date *</label>
                            <input
                                type="date"
                                className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all cursor-pointer"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">End Date</label>
                            <input
                                type="date"
                                className="w-full h-[50px] px-4 rounded-xl border border-gray-200 bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all cursor-pointer"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                            <p className="text-[11px] text-gray-400 mt-1 font-bold italic ml-1">Leave empty if you currently work here.</p>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="block text-sm font-bold text-gray-700 ml-1">Work Description</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 rounded-xl border border-gray-200 bg-white focus:border-[#3644D9] focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none placeholder:text-gray-400"
                                placeholder="Describe your role, accomplishments, and tech stack..."
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-10 py-3.5 bg-[#3644D9] text-white rounded-xl font-bold hover:bg-[#2E3AB8] hover:shadow-xl hover:shadow-blue-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    isEditing ? 'Update Experience' : 'Save Experience'
                                )}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="px-8 py-3.5 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 hover:text-[#3644D9] transition-all"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WorkExperience;
