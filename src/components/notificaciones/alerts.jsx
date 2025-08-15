import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { FiCheck, FiAlertTriangle } from "react-icons/fi";

const toastConfig = {
  position: "top-right",
  autoClose: 800,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};

const alertStyles = {
  success: {
    background: "#f6a0a0",
    color: "white",
    borderLeft: "4px solid rgb(250, 148, 148)",
    icon: <FiCheck className="me-2" />,
  },
  error: {
    background: "#f6a0a0",
    color: "white",
    borderLeft: "4px solid rgb(250, 148, 148)",
    icon: <FiAlertTriangle className="me-2" />,
  },
  info: {
    background: "#f6a0a0",
    color: "white",
    borderLeft: "4px solid rgb(250, 148, 148)",
    icon: <FiAlertTriangle className="me-2" />,
  },
};

export const showAlert = (type, message) => {
  const style = alertStyles[type] || alertStyles.info;

  toast(
    <div className="d-flex align-items-center">
      {style.icon}
      <span>{message}</span>
    </div>,
    {
      ...toastConfig,
      className: "custom-toast",
      style: {
        background: style.background,
        color: style.color,
        borderLeft: style.borderLeft,
      },
      progressStyle: {
        background:
          type === "success"
            ? "#f6a0a0"
            : type === "error"
            ? "#f6a0a0"
            : "#f6a0a0",
      },
    }
  );
};

export const showConfirmDialog = (message, onConfirm) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="custom-confirm-dialog">
          <div className="dialog-header">
            <FiAlertTriangle className="me-2" size={24} />
            <h5>Confirmar acción</h5>
          </div>
          <div className="dialog-body">
            <p>{message}</p>
          </div>
          <div className="dialog-footer">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="btn bg-lunalu"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      );
    },
    closeOnClickOutside: false,
  });
};
