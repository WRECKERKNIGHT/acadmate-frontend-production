import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button, Input, icons } from './ui';
import toast from 'react-hot-toast';
const LoginForm = () => {
    const [uid, setUid] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!uid || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            await login(uid, password);
            toast.success('Login successful!');
        }
        catch (error) {
            toast.error(error.message || 'Login failed');
        }
        finally {
            setLoading(false);
        }
    };
    const GraduationIcon = icons.graduation;
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4", children: [_jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [_jsx("div", { className: "absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" })] }), _jsxs(motion.div, { className: "relative w-full max-w-md", initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(motion.div, { className: "inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25", whileHover: { scale: 1.05, rotate: 5 }, transition: { type: "spring", stiffness: 300 }, children: _jsx(GraduationIcon, { className: "w-10 h-10 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold text-white mb-2", children: "Acadmate" }), _jsx("p", { className: "text-slate-400 text-lg", children: "Educational Test Platform" }), _jsx("p", { className: "text-slate-500 text-sm mt-2", children: "For Coaching Personnel Only" })] }), _jsxs(motion.div, { className: "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl", initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.2, duration: 0.4 }, children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-semibold text-white mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-slate-400", children: "Sign in to your account to continue" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("div", { children: _jsx(Input, { type: "text", placeholder: "Enter your UID (e.g., STH123, TRE456)", value: uid, onChange: (e) => setUid(e.target.value.toUpperCase()), icon: "user", label: "User ID", className: "mb-4" }) }), _jsx("div", { children: _jsx(Input, { type: "password", placeholder: "Enter your password", value: password, onChange: (e) => setPassword(e.target.value), icon: "lock", label: "Password" }) }), _jsx(Button, { type: "submit", variant: "primary", size: "lg", loading: loading, className: "w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 py-3 text-base font-semibold", disabled: loading, children: loading ? 'Signing in...' : 'Sign In' })] }), _jsxs("div", { className: "mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700/30", children: [_jsxs("h3", { className: "text-sm font-medium text-slate-300 mb-3 flex items-center", children: [_jsx(icons.info, { className: "w-4 h-4 mr-2" }), "Demo Credentials"] }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex justify-between text-slate-400", children: [_jsx("span", { children: "Student:" }), _jsx("code", { className: "bg-slate-800 px-2 py-1 rounded", children: "STH123 / sth123" })] }), _jsxs("div", { className: "flex justify-between text-slate-400", children: [_jsx("span", { children: "Teacher:" }), _jsx("code", { className: "bg-slate-800 px-2 py-1 rounded", children: "TRE123 / tre123" })] }), _jsxs("div", { className: "flex justify-between text-slate-400", children: [_jsx("span", { children: "Head Teacher:" }), _jsx("code", { className: "bg-slate-800 px-2 py-1 rounded", children: "HTR123 / htr123" })] })] })] })] }), _jsxs("div", { className: "text-center mt-8 text-slate-500 text-sm", children: [_jsx("p", { children: "\u00A9 2024 Acadmate. All rights reserved." }), _jsx("p", { className: "mt-1", children: "Secure authentication for educational excellence" })] })] })] }));
};
export default LoginForm;
