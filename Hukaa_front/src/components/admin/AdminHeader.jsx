import { Shield } from 'lucide-react';

export default function AdminHeader({ title }) {
    return (
        <header className="bg-[#0f1629]/80 backdrop-blur border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
            <div>
                <h1 className="text-white font-heading font-bold text-xl leading-none">{title}</h1>
            </div>
            <div className="flex items-center gap-3">

                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-1.5">
                    <Shield size={15} className="text-indigo-400" />
                    <span className="text-white text-sm font-medium">Admin</span>
                </div>
            </div>
        </header>
    );
}
