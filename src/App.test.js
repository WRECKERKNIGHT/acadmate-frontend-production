import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import BackendTest from './components/BackendTest';
function AppTest() {
    return (_jsx("div", { style: {
            fontFamily: 'Inter, system-ui, sans-serif',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem'
        }, children: _jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600", children: _jsxs("div", { className: "container mx-auto py-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-5xl font-bold text-white mb-4", children: "\uD83C\uDF93 Educational Test Platform" }), _jsx("p", { className: "text-xl text-white/90 mb-2", children: "Frontend \u2194 Backend Connection Test" }), _jsx("p", { className: "text-white/80", children: "Testing connection to backend server at http://localhost:5000" })] }), _jsx(BackendTest, {}), _jsx("div", { className: "text-center mt-8", children: _jsxs("div", { className: "bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold text-white mb-4", children: "\uD83D\uDE80 Connection Status" }), _jsx("p", { className: "text-white/90", children: "If you see a \u2705 \"Connected\" status above, your backend is working perfectly!" }), _jsx("p", { className: "text-white/80 mt-2", children: "This confirms that your 39 sample questions are loaded and ready for the frontend." })] }) })] }) }) }));
}
export default AppTest;
