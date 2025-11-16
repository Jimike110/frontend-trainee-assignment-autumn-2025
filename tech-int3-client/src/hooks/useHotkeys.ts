import { useEffect, useCallback } from 'react';

export type HotkeyConfig = [string, (event: KeyboardEvent) => void];

export function useHotkeys(hotkeys: HotkeyConfig[]) {
  // Memoize to prevent re-adding/removing the listener on every render
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.repeat) {
        return;
      }

      const target = event.target as HTMLElement;

      // prevent firing on input but allow on checkboxes so that it calls on home screen
      // without having to change focus
      const isTextInput =
        target.isContentEditable ||
        target.tagName === 'TEXTAREA' ||
        (target.tagName === 'INPUT' &&
          !['checkbox', 'radio', 'button', 'submit', 'reset'].includes(
            (target as HTMLInputElement).type
          ));

      if (isTextInput) {
        return;
      }

      const hotkey = hotkeys.find(([key]) => key === event.key);

      if (hotkey) {
        const [, callback] = hotkey;
        event.preventDefault();
        callback(event);
      }
    },
    [hotkeys]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
