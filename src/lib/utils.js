import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
export function formatDateTime(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
export function formatTime(date) {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}
export function formatRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    }
    else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    }
    else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days === 1 ? '' : 's'} ago`;
    }
    else {
        return formatDate(date);
    }
}
export function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}
export function formatScore(score, totalMarks) {
    return `${score}/${totalMarks}`;
}
export function formatPercentage(percentage) {
    return `${Math.round(percentage)}%`;
}
export function getScoreColor(percentage) {
    if (percentage >= 90)
        return 'text-success-600';
    if (percentage >= 80)
        return 'text-success-500';
    if (percentage >= 70)
        return 'text-warning-600';
    if (percentage >= 60)
        return 'text-warning-500';
    return 'text-danger-600';
}
export function getScoreBadgeVariant(percentage) {
    if (percentage >= 90)
        return 'success';
    if (percentage >= 80)
        return 'success';
    if (percentage >= 70)
        return 'warning';
    if (percentage >= 60)
        return 'warning';
    return 'danger';
}
export function getStatusColor(status) {
    const statusColors = {
        PENDING: 'text-warning-600',
        IN_PROGRESS: 'text-primary-600',
        RESOLVED: 'text-success-600',
        CANCELLED: 'text-gray-500',
        COMPLETED: 'text-success-600',
        DRAFT: 'text-gray-500',
        PUBLISHED: 'text-success-600',
        SCHEDULED: 'text-primary-600',
        ACTIVE: 'text-success-600',
        ARCHIVED: 'text-gray-500',
    };
    return statusColors[status] || 'text-gray-500';
}
export function getStatusBadgeVariant(status) {
    const statusVariants = {
        PENDING: 'warning',
        IN_PROGRESS: 'primary',
        RESOLVED: 'success',
        CANCELLED: 'gray',
        COMPLETED: 'success',
        DRAFT: 'gray',
        PUBLISHED: 'success',
        SCHEDULED: 'primary',
        ACTIVE: 'success',
        ARCHIVED: 'gray',
    };
    return statusVariants[status] || 'gray';
}
export function getPriorityColor(priority) {
    const priorityColors = {
        LOW: 'text-success-600',
        MEDIUM: 'text-warning-600',
        HIGH: 'text-danger-600',
    };
    return priorityColors[priority] || 'text-gray-500';
}
export function getPriorityBadgeVariant(priority) {
    const priorityVariants = {
        LOW: 'success',
        MEDIUM: 'warning',
        HIGH: 'danger',
    };
    return priorityVariants[priority] || 'gray';
}
export function debounce(func, wait) {
    let timeout = null;
    return (...args) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => func(...args), wait);
    };
}
export function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
export function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.slice(0, maxLength) + '...';
}
export function generateInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}
export function generateAvatarColor(name) {
    const colors = [
        'bg-red-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function copyToClipboard(text) {
    if (navigator.clipboard) {
        return navigator.clipboard.writeText(text);
    }
    else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
        }
        catch (err) {
            console.error('Unable to copy to clipboard', err);
        }
        document.body.removeChild(textArea);
        return Promise.resolve();
    }
}
