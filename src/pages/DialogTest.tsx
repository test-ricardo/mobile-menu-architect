import React from "react";
import { useDialog } from "@/contexts/DialogContext";

const DialogTest: React.FC = () => {
  const { showDialog } = useDialog();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-2xl font-bold">Test Dialog Global</h1>
      <div className="flex gap-4">
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={() => showDialog({
            title: "¿Eliminar elemento?",
            description: "Esta acción no se puede deshacer.",
            type: "danger",
            confirmText: "Sí, eliminar",
            cancelText: "No, cancelar",
            onConfirm: () => alert("Eliminado!"),
          })}
        >
          Dialog Danger
        </button>
        <button
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
          onClick={() => showDialog({
            title: "¡Éxito!",
            description: "La operación fue exitosa.",
            type: "success",
            confirmText: "Ok",
            onConfirm: () => alert("Éxito!"),
          })}
        >
          Dialog Success
        </button>
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => showDialog({
            title: "Información",
            description: "Este es un mensaje informativo.",
            type: "info",
            confirmText: "Entendido",
            onConfirm: () => alert("Info!"),
          })}
        >
          Dialog Info
        </button>
      </div>
    </div>
  );
};

export default DialogTest;
