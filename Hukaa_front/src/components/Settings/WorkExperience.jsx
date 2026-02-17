import React, { useState, useEffect } from 'react';
import { getExperiences, addExperience, updateExperience, deleteExperience } from '../../api/profile';

const WorkExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setError(null);
        } catch (err) {
            setError('Failed to fetch experiences: ' + (err.message || ''));
            console.error(err);
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
        setError(null);
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
                await updateExperience(currentId, payload);
                await fetchExperiences();
                setIsEditing(false);
                setCurrentId(null);
            } else {
                await addExperience(payload);
                await fetchExperiences();
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
            setError(err.message || (isEditing ? 'Failed to update experience' : 'Failed to add experience'));
            console.error('Submission Error:', err);
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
        setError(null);
        // Scroll to form
        window.scrollTo({ top: document.querySelector('form')?.offsetTop - 150, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this experience?")) {
            try {
                await deleteExperience(id);
                setExperiences(experiences.filter(exp => exp.id !== id));
                setError(null);
            } catch (err) {
                setError('Failed to delete experience: ' + (err.message || ''));
                console.error(err);
            }
        }
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
        setError(null);
    };

    if (loading && experiences.length === 0) {
        return <div className="p-4 text-center">Loading experiences...</div>;
    }

    return (
        <div className="account-setting-form">
            <h3 className="mb-4">Work Experience</h3>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            {/* List of Experiences */}
            <div className="experience-list mb-6">
                {experiences.length === 0 ? (
                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
                        No work experience recorded yet.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="relative group p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h5 className="text-[17px] font-bold text-[#3644D9]">{exp.position}</h5>
                                        <div className="flex items-center text-[#515355] font-semibold mt-1">
                                            <i className="ri-building-line mr-2"></i>
                                            {exp.company}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <i className="ri-calendar-line mr-2"></i>
                                            {exp.startDate || 'N/A'} — {exp.isCurrent || !exp.endDate ? 'Present' : exp.endDate}
                                        </div>
                                        {exp.description && (
                                            <p className="mt-3 text-[#6B7C8F] text-[14px] leading-relaxed italic border-l-2 border-gray-100 pl-3">
                                                {exp.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex space-x-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-blue-500 hover:bg-blue-50 transition-colors"
                                            onClick={() => handleEdit(exp)}
                                            title="Edit"
                                        >
                                            <i className="ri-pencil-line"></i>
                                        </button>
                                        <button
                                            className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition-colors"
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
            <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                <h4 className="mb-4 font-bold text-lg flex items-center">
                    <i className={`mr-2 ${isEditing ? 'ri-edit-line text-blue-500' : 'ri-add-circle-line text-green-500'}`}></i>
                    {isEditing ? 'Edit Experience' : 'Add New Work Experience'}
                </h4>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group mb-3">
                            <label className="block mb-1.5 font-bold text-[#515355] text-sm">Company Name *</label>
                            <input
                                type="text"
                                className="w-full h-[45px] px-4 rounded-lg border border-gray-200 focus:border-[#3644D9] focus:ring-1 focus:ring-[#3644D9] outline-none transition-all"
                                placeholder="e.g. Acme Corporation"
                                name="company"
                                value={formData.company}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="block mb-1.5 font-bold text-[#515355] text-sm">Position / Designation *</label>
                            <input
                                type="text"
                                className="w-full h-[45px] px-4 rounded-lg border border-gray-200 focus:border-[#3644D9] focus:ring-1 focus:ring-[#3644D9] outline-none transition-all"
                                placeholder="e.g. Lead Software Engineer"
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="block mb-1.5 font-bold text-[#515355] text-sm">Start Date *</label>
                            <input
                                type="date"
                                className="w-full h-[45px] px-4 rounded-lg border border-gray-200 focus:border-[#3644D9] focus:ring-1 focus:ring-[#3644D9] outline-none transition-all"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group mb-3">
                            <label className="block mb-1.5 font-bold text-[#515355] text-sm">End Date</label>
                            <input
                                type="date"
                                className="w-full h-[45px] px-4 rounded-lg border border-gray-200 focus:border-[#3644D9] focus:ring-1 focus:ring-[#3644D9] outline-none transition-all"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                            />
                            <p className="text-[11px] text-gray-500 mt-1 font-medium italic">Leave empty if you currently work here.</p>
                        </div>

                        <div className="md:col-span-2 form-group mb-4">
                            <label className="block mb-1.5 font-bold text-[#515355] text-sm">Work Description</label>
                            <textarea
                                className="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 focus:border-[#3644D9] focus:ring-1 focus:ring-[#3644D9] outline-none transition-all resize-none"
                                placeholder="Describe your role, accomplishments, and tech stack..."
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </div>

                        <div className="md:col-span-2 flex items-center space-x-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`h-[45px] px-8 rounded-lg font-bold text-white transition-all shadow-sm flex items-center justify-center ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3644D9] hover:bg-[#2E3AB8] transform active:scale-95'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    isEditing ? 'Update Experience' : 'Save Experience'
                                )}
                            </button>
                            {isEditing && (
                                <button
                                    type="button"
                                    className="h-[45px] px-6 rounded-lg font-bold text-[#515355] border border-gray-200 hover:bg-white hover:shadow-sm transition-all"
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
