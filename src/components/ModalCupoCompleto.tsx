import React from "react";
import "./ModalCupoCompleto.css";

interface ModalCupoCompletoProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: React.ReactNode;
}

export const ModalCupoCompleto: React.FC<ModalCupoCompletoProps> = ({
  isOpen,
  onClose,
  title = "¡Inscripciones cerradas!",
  message = (
    <>
      Las inscripciones para la visita de <strong>Su Santidad el Papa León XIV al Perú</strong> han alcanzado el cupo máximo de participantes. Actualmente no es posible registrar nuevas inscripciones.
    </>
  ),
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-icon-wrapper">
          <svg
            className="modal-icon-check"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v4m0 4h.01M10.3 3.9L2.6 17.3A2 2 0 004.3 20h15.4a2 2 0 001.7-2.7L13.7 3.9a2 2 0 00-3.4 0z"
            />
          </svg>
        </div>

        <h2 className="modal-title" id="modal-title">
          {title}
        </h2>

        <div className="modal-message">{message}</div>

        <button
          type="button"
          className="modal-button"
          onClick={onClose}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};