import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Badge, Modal, Loading, icons } from './ui';
import api from '../config/api';
import toast from 'react-hot-toast';
const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        loadNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);
    const loadNotifications = async () => {
        try {
            const response = await api.notifications.getAll();
            setNotifications(response.data || []);
        }
        catch (error) {
            console.error('Error loading notifications:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const markAsRead = async (notificationId) => {
        try {
            await api.notifications.markAsRead(notificationId);
            setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
        }
        catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };
    const markAllAsRead = async () => {
        try {
            await api.notifications.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications marked as read');
        }
        catch (error) {
            toast.error('Failed to mark all notifications as read');
        }
    };
    const deleteNotification = async (notificationId) => {
        try {
            await api.notifications.delete(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            toast.success('Notification deleted');
        }
        catch (error) {
            toast.error('Failed to delete notification');
        }
    };
    const deleteAllRead = async () => {
        try {
            await api.notifications.deleteAllRead();
            setNotifications(prev => prev.filter(n => !n.isRead));
            toast.success('All read notifications deleted');
        }
        catch (error) {
            toast.error('Failed to delete read notifications');
        }
    };
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread')
            return !n.isRead;
        if (filter === 'read')
            return n.isRead;
        return true;
    });
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return icons.success;
            case 'WARNING': return icons.warning;
            case 'ERROR': return icons.error;
            default: return icons.info;
        }
    };
    const getNotificationColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'success';
            case 'WARNING': return 'warning';
            case 'ERROR': return 'error';
            default: return 'info';
        }
    };
    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1)
            return 'Just now';
        if (diffMins < 60)
            return `${diffMins}m ago`;
        if (diffHours < 24)
            return `${diffHours}h ago`;
        if (diffDays < 7)
            return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };
    if (loading)
        return _jsx(Loading, { className: "h-64" });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("h1", { className: "text-3xl font-bold text-slate-100 flex items-center gap-2", children: [_jsx(icons.bell, { className: "w-8 h-8" }), "Notifications"] }), unreadCount > 0 && (_jsxs(Badge, { variant: "error", className: "text-xs", children: [unreadCount, " unread"] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "secondary", size: "sm", icon: "success", onClick: markAllAsRead, disabled: unreadCount === 0, children: "Mark all read" }), _jsx(Button, { variant: "secondary", size: "sm", icon: "delete", onClick: deleteAllRead, disabled: notifications.filter(n => n.isRead).length === 0, children: "Clear read" }), _jsx(Button, { variant: "secondary", size: "sm", icon: "refresh", onClick: loadNotifications, children: "Refresh" })] })] }), _jsx("div", { className: "flex space-x-1 bg-slate-800/50 rounded-lg p-1", children: ['all', 'unread', 'read'].map(tab => (_jsxs("button", { onClick: () => setFilter(tab), className: `flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all capitalize ${filter === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'}`, children: [tab, " ", tab === 'unread' && unreadCount > 0 && `(${unreadCount})`] }, tab))) }), _jsx("div", { className: "space-y-3", children: _jsx(AnimatePresence, { children: filteredNotifications.map((notification) => {
                        const IconComponent = getNotificationIcon(notification.type);
                        return (_jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, layout: true, children: _jsx(Card, { className: `p-4 cursor-pointer transition-all ${notification.isRead
                                    ? 'opacity-75 hover:opacity-90'
                                    : 'border-l-4 border-l-blue-500 hover:border-l-blue-400'}`, hover: true, onClick: () => {
                                    setSelectedNotification(notification);
                                    setModalOpen(true);
                                    if (!notification.isRead) {
                                        markAsRead(notification.id);
                                    }
                                }, children: _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: `flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'SUCCESS' ? 'bg-green-500/20 text-green-400' :
                                                notification.type === 'WARNING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    notification.type === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-blue-500/20 text-blue-400'}`, children: _jsx(IconComponent, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [_jsx("h3", { className: `font-medium ${notification.isRead ? 'text-slate-300' : 'text-slate-100'}`, children: notification.title }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsx("span", { className: "text-xs text-slate-500", children: formatTimeAgo(notification.createdAt) }), !notification.isRead && (_jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full" }))] })] }), _jsx("p", { className: `text-sm line-clamp-2 ${notification.isRead ? 'text-slate-400' : 'text-slate-300'}`, children: notification.message }), notification.actionUrl && (_jsx("div", { className: "mt-2", children: _jsx(Badge, { variant: "info", size: "sm", children: "Action Required" }) }))] }), _jsx("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: _jsx(Button, { variant: "secondary", size: "sm", icon: "delete", onClick: (e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification.id);
                                                }, className: "p-1 hover:bg-red-500/20 hover:text-red-400" }) })] }) }) }, notification.id));
                    }) }) }), filteredNotifications.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(icons.bell, { className: "w-16 h-16 text-slate-600 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-slate-300 mb-2", children: filter === 'unread' ? 'No unread notifications' :
                            filter === 'read' ? 'No read notifications' :
                                'No notifications yet' }), _jsx("p", { className: "text-slate-500", children: filter === 'all' ? 'You\'ll receive notifications about tests, doubts, and other important updates here.' : '' })] })), _jsx(Modal, { isOpen: modalOpen, onClose: () => setModalOpen(false), title: "Notification Details", size: "md", children: selectedNotification && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg", children: [(() => {
                                    const IconComponent = getNotificationIcon(selectedNotification.type);
                                    return _jsx(IconComponent, { className: `w-6 h-6 ${selectedNotification.type === 'SUCCESS' ? 'text-green-400' :
                                            selectedNotification.type === 'WARNING' ? 'text-yellow-400' :
                                                selectedNotification.type === 'ERROR' ? 'text-red-400' :
                                                    'text-blue-400'}` });
                                })(), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold text-slate-100", children: selectedNotification.title }), _jsx("p", { className: "text-sm text-slate-400", children: new Date(selectedNotification.createdAt).toLocaleString() })] }), _jsx(Badge, { variant: getNotificationColor(selectedNotification.type), children: selectedNotification.type })] }), _jsx("div", { className: "p-4", children: _jsx("p", { className: "text-slate-300 leading-relaxed", children: selectedNotification.message }) }), selectedNotification.actionUrl && (_jsxs("div", { className: "p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg", children: [_jsx("p", { className: "text-sm text-blue-400 mb-2", children: "Action Required:" }), _jsx(Button, { variant: "primary", size: "sm", icon: "right", children: "Take Action" })] })), _jsxs("div", { className: "flex justify-end gap-2 pt-4 border-t border-slate-700", children: [_jsx(Button, { variant: "secondary", size: "sm", icon: "delete", onClick: () => {
                                        deleteNotification(selectedNotification.id);
                                        setModalOpen(false);
                                    }, children: "Delete" }), _jsx(Button, { variant: "primary", size: "sm", onClick: () => setModalOpen(false), children: "Close" })] })] })) })] }));
};
export default NotificationCenter;
