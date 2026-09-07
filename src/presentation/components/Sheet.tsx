/*
 * No dedicated "Sheet" component exists in approved-v1's component set
 * (only Button/Panel/StatusPill/Tabs/Icon and the shop primitives) — the
 * readme's own Spacing & Layout section specifies the pattern directly
 * ("Sheets rise from the bottom edge over a warm scrim [--surface-scrim];
 * modals never cover the resource chips entirely"), so this is a direct
 * translation of that written rule into a component, using only existing
 * tokens (`--surface-scrim`, `--radius-panel`, `--shadow-modal`) — not an
 * invented visual language.
 *
 * Phase 12 hardening: this is a real modal (`role="dialog"`/
 * `aria-modal="true"`) but previously had no actual modal focus behavior
 * — focus never moved in on open, never returned to the trigger on
 * close, Escape did nothing, and Tab could escape into the background
 * tab bar/top bar behind the scrim. Standard modal-dialog focus handling
 * (move focus in, trap Tab/Shift+Tab within the dialog, Escape closes,
 * restore focus to whatever had it before the sheet opened) — not a new
 * UI system, the same real close button and `onClose` this component
 * already had.
 */
import * as React from "react";
import "./Sheet.css";

export interface SheetProps {
  readonly title: string;
  readonly onClose: () => void;
  readonly children: React.ReactNode;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Sheet({
  title,
  onClose,
  children,
}: SheetProps): React.JSX.Element {
  const sheetRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const onCloseRef = React.useRef(onClose);
  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Move focus into the sheet on mount, restore it to whatever had focus
  // beforehand on unmount — every sheet mounts/unmounts on open/close
  // (`SheetHost` renders `null` when no sheet is active), so this effect
  // firing once per mount is exactly "on open"/"on close".
  React.useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    return () => {
      if (
        previouslyFocused instanceof HTMLElement &&
        document.contains(previouslyFocused)
      ) {
        previouslyFocused.focus();
      }
    };
  }, []);

  // Escape closes; Tab/Shift+Tab is trapped within the sheet so keyboard
  // focus can never land on the tab bar/top bar behind the scrim while
  // the dialog is open.
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !sheetRef.current) return;
      const focusable = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="ds-sheet-scrim" onClick={onClose}>
      <div
        ref={sheetRef}
        className="ds-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <header className="ds-sheet__header">
          <h2 className="ds-sheet__title">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="ds-sheet__close"
            aria-label="Close"
            onClick={onClose}
          >
            ×
          </button>
        </header>
        <div className="ds-sheet__body">{children}</div>
      </div>
    </div>
  );
}
