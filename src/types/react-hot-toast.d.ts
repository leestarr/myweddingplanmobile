declare module 'react-hot-toast' {
  export type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  
  export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'loading' | 'blank' | 'custom';
    icon?: JSX.Element;
    duration?: number;
    position?: ToastPosition;
  }

  export interface ToastOptions {
    duration?: number;
    position?: ToastPosition;
    icon?: JSX.Element;
    style?: React.CSSProperties;
    className?: string;
    success?: Partial<ToastOptions>;
    error?: Partial<ToastOptions>;
    loading?: Partial<ToastOptions>;
  }

  export function toast(message: string, options?: ToastOptions): string;
  export namespace toast {
    export function success(message: string, options?: ToastOptions): string;
    export function error(message: string, options?: ToastOptions): string;
    export function loading(message: string, options?: ToastOptions): string;
    export function dismiss(toastId?: string): void;
  }

  export function Toaster(props: {
    position?: ToastPosition;
    reverseOrder?: boolean;
    toastOptions?: ToastOptions;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    gutter?: number;
  }): JSX.Element;

  export default toast;
}