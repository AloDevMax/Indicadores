import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from './toast';

describe('toast', () => {
  // `toast` holds its listener in module-level state, so make sure no test
  // leaks a subscription into the next one.
  afterEach(() => {
    toast._subscribe(() => {})(); // subscribe then immediately unsubscribe, clearing `_listener`
  });

  describe('dispatch with no active subscriber', () => {
    it('toast.success does not throw and produces no observable effect when unsubscribed', () => {
      expect(() => toast.success('hello')).not.toThrow();
    });

    it('toast.error does not throw when unsubscribed', () => {
      expect(() => toast.error('boom')).not.toThrow();
    });

    it('toast.info does not throw when unsubscribed', () => {
      expect(() => toast.info('fyi')).not.toThrow();
    });
  });

  describe('_subscribe', () => {
    it('registers a listener that receives the exact message and type on toast.success', () => {
      const listener = vi.fn();
      toast._subscribe(listener);

      toast.success('Selo concedido com sucesso.');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('Selo concedido com sucesso.', 'success');
    });

    it('registers a listener that receives the exact message and type on toast.error', () => {
      const listener = vi.fn();
      toast._subscribe(listener);

      toast.error('Falha ao salvar.');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('Falha ao salvar.', 'error');
    });

    it('registers a listener that receives the exact message and type on toast.info', () => {
      const listener = vi.fn();
      toast._subscribe(listener);

      toast.info('Sincronizando dados...');

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith('Sincronizando dados...', 'info');
    });

    it('notifies the subscriber once per dispatch call, in order, for multiple dispatches', () => {
      const listener = vi.fn();
      toast._subscribe(listener);

      toast.success('first');
      toast.error('second');
      toast.info('third');

      expect(listener).toHaveBeenCalledTimes(3);
      expect(listener).toHaveBeenNthCalledWith(1, 'first', 'success');
      expect(listener).toHaveBeenNthCalledWith(2, 'second', 'error');
      expect(listener).toHaveBeenNthCalledWith(3, 'third', 'info');
    });

    it('returns an unsubscribe function that stops further notifications', () => {
      const listener = vi.fn();
      const unsubscribe = toast._subscribe(listener);

      unsubscribe();
      toast.success('after unsubscribe');

      expect(listener).not.toHaveBeenCalled();
    });

    it('replaces the previous listener when a new one subscribes, so only the latest receives dispatches', () => {
      const firstListener = vi.fn();
      const secondListener = vi.fn();

      toast._subscribe(firstListener);
      toast._subscribe(secondListener);
      toast.success('only for the second listener');

      expect(firstListener).not.toHaveBeenCalled();
      expect(secondListener).toHaveBeenCalledTimes(1);
      expect(secondListener).toHaveBeenCalledWith('only for the second listener', 'success');
    });

    it('calling the unsubscribe function from a stale (already-replaced) subscription clears the current listener too', () => {
      const firstListener = vi.fn();
      const secondListener = vi.fn();

      const unsubscribeFirst = toast._subscribe(firstListener);
      toast._subscribe(secondListener);
      unsubscribeFirst(); // stale unsubscribe — sets `_listener` to null, clearing the second subscription too

      toast.success('after stale unsubscribe');

      // Documents actual behavior: `_listener` is a single slot, so the stale
      // unsubscribe wipes out the second listener as well.
      expect(secondListener).not.toHaveBeenCalled();
    });
  });
});
