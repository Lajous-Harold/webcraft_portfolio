import { useEffect, useRef } from "react";

export default function Modal({ open, title, onClose, children, footer }) {
  const dialogRef = useRef(null);

  // Fermer avec Échap
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Focus initial dans le dialog
  useEffect(() => {
    if (!open) return;
    const first = dialogRef.current?.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
    first?.focus?.();
  }, [open]);

  // ✅ Empêche le scroll de fond quand le modal est ouvert
  useEffect(() => {
    if (open) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");
    return () => document.body.classList.remove("modal-open");
  }, [open]);

  return (
    <div
      className='modal'
      aria-hidden={open ? "false" : "true"}
      style={{ display: open ? "block" : "none" }}>
      <div className='modal__overlay' onClick={onClose}></div>
      <div
        className='modal__dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='modalTitle'
        ref={dialogRef}>
        <div className='modal__header'>
          <h3 id='modalTitle'>{title || "Détails"}</h3>
          <button className='btn btn--icon' aria-label='Fermer le modal' onClick={onClose}>
            ✕
          </button>
        </div>

        <div className='modal__body'>{children}</div>

        <div className='modal__footer'>
          {footer || (
            <button className='btn' onClick={onClose}>
              Fermer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
