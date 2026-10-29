import React from "react";
import "./ModalSinCupos.css";

interface ModalSinCuposProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: React.ReactNode;
}

export const ModalSinCupos: React.FC<ModalSinCuposProps> = ({
  isOpen,
  onClose,
  title = "¡Cupos completos!",
  message = (
    <>
      Los cupos del curso seleccionado se han agotado. Por favor, selecciona
      otro curso disponible para continuar con tu inscripción.
    </>
  ),
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-sin-cupos-overlay" onClick={onClose}>
      <div
        className="modal-sin-cupos-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-sin-cupos-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-sin-cupos-icono" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
              d="M12 9v4m0 4h.01M10.3 3.9L2.6 17.3A2 2 0 004.3 20h15.4a2 2 0 001.7-2.7L13.7 3.9a2 2 0 00-3.4 0z"
            />
          </svg>
        </div>

        <h2
          className="modal-sin-cupos-titulo"
          id="modal-sin-cupos-title"
        >
          {title}
        </h2>

        <div className="modal-sin-cupos-mensaje">{message}</div>

        <button
          type="button"
          className="modal-sin-cupos-boton"
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};