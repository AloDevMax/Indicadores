import React, { createContext, useCallback, useContext, useState } from 'react';
import ConfirmDialog, { ConfirmVariant } from '@/shared/components/ConfirmDialog';

export interface ConfirmOptions {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: ConfirmVariant;
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>;

interface PendingConfirm extends ConfirmOptions {
  resolve: (value: boolean) => void;
}

const ConfirmContext = createContext<ConfirmFn | null>(null);

/**
 * Mounts a single reusable confirmation dialog for the whole app. Any component
 * can call `useConfirm()` to get a `confirm(options)` function that returns a
 * promise resolving to `true` (confirmed) or `false` (cancelled/dismissed).
 */
export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pending, setPending] = useState<PendingConfirm | null>(null);

  const confirm = useCallback<ConfirmFn>((options) => {
    return new Promise<boolean>((resolve) => {
      setPending({ ...options, resolve });
    });
  }, []);

  const settle = (result: boolean) => {
    pending?.resolve(result);
    setPending(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        isOpen={pending !== null}
        title={pending?.title ?? ''}
        message={pending?.message ?? ''}
        confirmLabel={pending?.confirmLabel}
        cancelLabel={pending?.cancelLabel}
        variant={pending?.variant}
        onConfirm={() => settle(true)}
        onCancel={() => settle(false)}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmFn => {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm deve ser usado dentro de um ConfirmProvider');
  }
  return ctx;
};
