import { useState, useMemo, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { hasPermission } from "@/utils/permissions";

export default function TallaColorTab({
  tallasAsignadas,
  coloresAsignados,
  onAddAsignacion,
  onDeleteAsignacion,
  combinaciones,
  loading,
}) {
  const [selectedTallaId, setSelectedTallaId] = useState(null);
  const { user } = useContext(AuthContext); // 🧠 acceso al usuario

  const coloresDisponibles = useMemo(
    () => coloresAsignados?.map((c) => c.color) || [],
    [coloresAsignados]
  );

  const tallasDisponibles = useMemo(
    () => tallasAsignadas?.map((t) => t.talla) || [],
    [tallasAsignadas]
  );

  const combinacionesMap = useMemo(() => {
    const map = new Map();
    combinaciones?.forEach((combo) => {
      map.set(combo.talla.id, combo.colores);
    });
    return map;
  }, [combinaciones]);

  const handleColorToggle = (color, esAsignado, tallaId) => {
    if (!tallaId) return;

    if (esAsignado) {
      if (!hasPermission(user, "delete_prendatallacolor")) return;

      const asignacionId = combinaciones
        ?.find((combo) => combo.talla.id === tallaId)
        ?.colores.find((c) => c.id === color.id)?.asignacionId;

      if (asignacionId) {
        onDeleteAsignacion(asignacionId);
      }
    } else {
      if (!hasPermission(user, "add_prendatallacolor")) return;

      onAddAsignacion({
        tallaId,
        colorIds: [color.id],
      });
    }
  };

  return (
    <div>
      <h6>Asignar colores a una talla</h6>
      <div className="accordion mb-4" id="accordionTallas">
        {tallasDisponibles.map((talla) => {
          const coloresAsignadosTalla = combinacionesMap.get(talla.id) || [];
          const idsAsignados = coloresAsignadosTalla.map((c) => c.id);

          const seleccionarTodos = () => {
            if (!hasPermission(user, "add_prendatallacolor")) return;

            const idsNoAsignados = coloresDisponibles
              .filter((color) => !idsAsignados.includes(color.id))
              .map((color) => color.id);

            if (idsNoAsignados.length > 0) {
              onAddAsignacion({
                tallaId: talla.id,
                colorIds: idsNoAsignados,
              });
            }
          };

          return (
            <div className="accordion-item" key={talla.id}>
              <h2 className="accordion-header" id={`heading-${talla.id}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse-${talla.id}`}
                  aria-expanded="false"
                  aria-controls={`collapse-${talla.id}`}
                  onClick={() => setSelectedTallaId(talla.id)}
                >
                  {talla.nombre}
                </button>
              </h2>
              <div
                id={`collapse-${talla.id}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading-${talla.id}`}
                data-bs-parent="#accordionTallas"
              >
                <div className="accordion-body">
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {coloresDisponibles.map((color) => {
                      const asignado = idsAsignados.includes(color.id);
                      const checkboxId = `color-${talla.id}-${color.id}`;
                      const permisoRequerido = asignado
                        ? "delete_prendatallacolor"
                        : "add_prendatallacolor";

                      return (
                        <div key={color.id} className="position-relative">
                          <input
                            type="checkbox"
                            id={checkboxId}
                            className="d-none"
                            checked={asignado}
                            onChange={() =>
                              handleColorToggle(color, asignado, talla.id)
                            }
                            disabled={
                              loading || !hasPermission(user, permisoRequerido)
                            }
                          />
                          <label
                            htmlFor={checkboxId}
                            className={`px-3 py-1 border rounded-pill cursor-pointer ${
                              asignado
                                ? "bg-lunalu text-white"
                                : "bg-white text-dark border-dark"
                            }`}
                            style={{
                              userSelect: "none",
                              borderColor: "#ccc",
                              backgroundColor: asignado ? "#f6a0a0" : "white",
                              transition: "all 0.2s ease-in-out",
                              display: "inline-block",
                              minWidth: "80px",
                              textAlign: "center",
                              opacity:
                                loading ||
                                !hasPermission(user, permisoRequerido)
                                  ? 0.5
                                  : 1,
                              pointerEvents:
                                loading ||
                                !hasPermission(user, permisoRequerido)
                                  ? "none"
                                  : "auto",
                            }}
                          >
                            {color.nombre}
                          </label>
                        </div>
                      );
                    })}

                    {/* 👉 Botón de seleccionar todos */}
                    {hasPermission(user, "add_prendatallacolor") && (
                      <div className="position-relative">
                        <label
                          onClick={seleccionarTodos}
                          className="px-3 py-1 border rounded-pill cursor-pointer bg-lunalu text-white"
                          style={{
                            userSelect: "none",
                            borderColor: "#ccc",
                            backgroundColor: "#f6a0a0",
                            transition: "all 0.2s ease-in-out",
                            display: "inline-block",
                            minWidth: "80px",
                            textAlign: "center",
                            opacity: loading ? 0.5 : 1,
                            pointerEvents: loading ? "none" : "auto",
                          }}
                        >
                          Seleccionar todos
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
