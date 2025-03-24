import { toast } from 'sonner'

type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface NotificationOptions {
  title?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const showNotification = (
  message: string,
  type: NotificationType = 'info',
  options?: NotificationOptions
) => {
  const { title, duration = 5000, action } = options || {}

  const toastOptions = {
    description: message,
    duration,
    ...(action && {
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    }),
  }

  switch (type) {
    case 'success':
      toast.success(title || 'Success', toastOptions)
      break
    case 'error':
      toast.error(title || 'Error', toastOptions)
      break
    case 'warning':
      toast.warning(title || 'Warning', toastOptions)
      break
    case 'info':
    default:
      toast.info(title || 'Information', toastOptions)
      break
  }
}

export const notifySuccess = (message: string, options?: NotificationOptions) =>
  showNotification(message, 'success', options)

export const notifyError = (message: string, options?: NotificationOptions) =>
  showNotification(message, 'error', options)

export const notifyWarning = (message: string, options?: NotificationOptions) =>
  showNotification(message, 'warning', options)

export const notifyInfo = (message: string, options?: NotificationOptions) =>
  showNotification(message, 'info', options) 