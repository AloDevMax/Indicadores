export type ToastType = 'success' | 'error' | 'info';

type ToastListener = (message: string, type: ToastType) => void;

let _listener: ToastListener | null = null;

export const toast = {
  success: (message: string) => _listener?.(message, 'success'),
  error: (message: string) => _listener?.(message, 'error'),
  info: (message: string) => _listener?.(message, 'info'),
  _subscribe: (fn: ToastListener) => {
    _listener = fn;
    return () => { _listener = null; };
  },
};
