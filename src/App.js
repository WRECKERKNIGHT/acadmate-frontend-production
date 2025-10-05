import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
// Legacy imports removed. Use only new premium components.
function App() {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { style: {
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }, children: _jsxs("div", { style: { textAlign: 'center', color: 'white' }, children: [_jsx("div", { style: {
                            width: '50px',
                            height: '50px',
                            border: '3px solid rgba(255,255,255,0.3)',
                            borderTop: '3px solid white',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 1rem'
                        } }), _jsx("p", { children: "Loading Acadmate..." })] }) }));
    }
    if (!user) {
        // Legacy UI removed. Use only new premium components.
    }
    const getDashboard = () => {
        switch (user.role) {
            case 'STUDENT':
            case 'TEACHER':
            case 'HEAD_TEACHER':
            default:
                // Legacy UI removed. Use only new premium components.
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-slate-900 text-slate-100", style: { fontFamily: 'Inter, system-ui, sans-serif' }, children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: getDashboard() }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] }), _jsx("style", { children: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      ` })] }));
}
export default App;
