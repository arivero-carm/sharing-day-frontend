import React from 'react';
import './ModalSuccess.css';

interface ModalSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: React.ReactNode;
}

export const ModalSuccess: React.FC<ModalSuccessProps> = ({
  isOpen,
  onClose,
  title = "¡Registro Exitoso!",
  message = (
    <>
      Tu inscripción a las Ponencias de <strong>Vessperiencias</strong> ha sido completada correctamente.
    </>
  ),
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icono verde de registro exitoso */}
        <div className="modal-icon-wrapper success">
          <svg
            className="modal-icon-check"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="modal-title">{title}</h2>

        <p className="modal-message">{message}</p>

        <button className="modal-button" onClick={onClose}>
          Aceptar
        </button>
      </div>
    </div>
  );
};