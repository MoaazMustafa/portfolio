import { useCallback } from 'react';

import { toast } from '@/lib/toast';

interface ToastOptions {
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

/**
 * Hook wrapper for toast notifications
 * Provides a convenient way to use toast from React components
 *
 * Usage:
 * const { showSuccess, showError, showPromise } = useToast()
 *
 * showSuccess('Operation completed!')
 * showError('Something went wrong', { description: 'Please try again' })
 * showPromise(apiCall(), { loading: 'Saving...', success: 'Saved!', error: 'Failed' })
 */
export const useToast = () => {
  const showSuccess = useCallback((message: string, options?: ToastOptions) => {
    return toast.success(message, options);
  }, []);

  const showError = useCallback((message: string, options?: ToastOptions) => {
    return toast.error(message, options);
  }, []);

  const showWarning = useCallback((message: string, options?: ToastOptions) => {
    return toast.warning(message, options);
  }, []);

  const showInfo = useCallback((message: string, options?: ToastOptions) => {
    return toast.info(message, options);
  }, []);

  const showMessage = useCallback((message: string, options?: ToastOptions) => {
    return toast.message(message, options);
  }, []);

  const showLoading = useCallback(
    (message: string, options?: Omit<ToastOptions, 'action'>) => {
      return toast.loading(message, options);
    },
    []
  );

  const showPromise = useCallback(
    <T>(
      promise: Promise<T>,
      options: {
        loading: string;
        success: string | ((data: T) => string);
        error: string | ((error: Error) => string);
        description?: string;
        duration?: number;
      }
    ) => {
      return toast.promise(promise, options);
    },
    []
  );

  const dismiss = useCallback((toastId?: string | number) => {
    return toast.dismiss(toastId);
  }, []);

  const dismissAll = useCallback(() => {
    return toast.dismissAll();
  }, []);

  const showCustom = useCallback(
    (
      jsx: (id: string | number) => React.ReactElement,
      options?: ToastOptions
    ) => {
      return toast.custom(jsx, options);
    },
    []
  );

  return {
    // Individual methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showMessage,
    showLoading,
    showPromise,
    showCustom,
    dismiss,
    dismissAll,

    // Convenience aliases
    success: showSuccess,
    error: showError,
    warning: showWarning,
    info: showInfo,
    message: showMessage,
    loading: showLoading,
    promise: showPromise,
    custom: showCustom,

    // Access to full toast API if needed
    toast,
  };
};
