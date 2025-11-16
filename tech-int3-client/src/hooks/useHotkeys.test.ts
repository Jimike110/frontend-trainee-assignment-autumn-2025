import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useHotkeys } from './useHotkeys';

describe('useHotkeys hook', () => {
  it('should call the correct callback when a hotkey is pressed', () => {
    const callbackA = vi.fn();
    const callbackB = vi.fn();

    renderHook(() =>
      useHotkeys([
        ['a', callbackA],
        ['b', callbackB],
      ])
    );

    fireEvent.keyDown(window, { key: 'a' });

    expect(callbackA).toHaveBeenCalledTimes(1);
    expect(callbackB).not.toHaveBeenCalled();
  });

  it('should not call callback if the event target is an input', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys([['a', callback]]));

    const input = document.createElement('input');
    document.body.appendChild(input);

    fireEvent.keyDown(input, { key: 'a' });

    expect(callback).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('should call callback if the event target is an input checkbox', () => {
    const callback = vi.fn();
    renderHook(() => useHotkeys([['a', callback]]));

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    document.body.appendChild(checkbox);

    fireEvent.keyDown(checkbox, { key: 'a' });

    expect(callback).toHaveBeenCalledTimes(1);
    document.body.removeChild(checkbox);
  });
});
