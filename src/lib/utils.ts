import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(date: string | Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days === 1 ? '' : 's'} ago`
  } else {
    return formatDate(date)
  }
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
}

export function formatScore(score: number, totalMarks: number) {
  return `${score}/${totalMarks}`
}

export function formatPercentage(percentage: number) {
  return `${Math.round(percentage)}%`
}

export function getScoreColor(percentage: number) {
  if (percentage >= 90) return 'text-success-600'
  if (percentage >= 80) return 'text-success-500'
  if (percentage >= 70) return 'text-warning-600'
  if (percentage >= 60) return 'text-warning-500'
  return 'text-danger-600'
}

export function getScoreBadgeVariant(percentage: number) {
  if (percentage >= 90) return 'success'
  if (percentage >= 80) return 'success'
  if (percentage >= 70) return 'warning'
  if (percentage >= 60) return 'warning'
  return 'danger'
}

export function getStatusColor(status: string) {
  const statusColors: Record<string, string> = {
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
  }
  return statusColors[status] || 'text-gray-500'
}

export function getStatusBadgeVariant(status: string) {
  const statusVariants: Record<string, string> = {
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
  }
  return statusVariants[status] || 'gray'
}

export function getPriorityColor(priority: string) {
  const priorityColors: Record<string, string> = {
    LOW: 'text-success-600',
    MEDIUM: 'text-warning-600',
    HIGH: 'text-danger-600',
  }
  return priorityColors[priority] || 'text-gray-500'
}

export function getPriorityBadgeVariant(priority: string) {
  const priorityVariants: Record<string, string> = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'danger',
  }
  return priorityVariants[priority] || 'gray'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateAvatarColor(name: string) {
  const colors = [
    'bg-red-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
  ]
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Unable to copy to clipboard', err)
    }
    document.body.removeChild(textArea)
    return Promise.resolve()
  }
}