import "./ModalFormularioCerrado.css";
import { LockKeyhole } from "lucide-react";

interface ModalFormularioCerradoProps {
  isOpen: boolean;
}

export function ModalFormularioCerrado({
  isOpen,
}: ModalFormularioCerradoProps) {
  if (!isOpen) return null;

  return (
    <div className="cierre-overlay" role="alertdialog" aria-modal="true">
      <div className="cierre-modal">
        <div className="cierre-icono">
          <LockKeyhole size={30} />
        </div>

        <span className="cierre-etiqueta">SHARING DAY · 2026</span>

        <h2>El periodo de inscripción ha finalizado</h2>

        <p>
          El plazo para registrar tu participación terminó.
          Actualmente, el formulario ya no admite nuevas respuestas.
        </p>

        <div className="cierre-aviso">
          <strong>FORMULARIO CERRADO</strong>
          <span>Gracias por tu interés y comprensión.</span>
        </div>
      </div>
    </div>
  );
}