import { useEffect } from 'react';

export type HotkeyConfig = [string, (event: KeyboardEvent) => void];

/**
 * A custom hook to declaratively manage keyboard shortcuts.
 * @param hotkeys - an array of tuples, each containing a key and a callback function to execute.
 */

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // do not trigger hotkeys if user is typing
      const target = event.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return;
      }

      const hotkey = hotkeys.find(([key]) => key === event.key);

      if (hotkey) {
        const [, callback] = hotkey;
        event.preventDefault(); // prevent browser default actions
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkeys]);
}
