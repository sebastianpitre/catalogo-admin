import { RiGitRepositoryPrivateLine } from "react-icons/ri";
import nombresPersonalizados from "../../utils/permLabels";
export default function PermisosList({ loading, permisos, searchTerm }) {
  const excludedModels = [
    "blacklisted token",
    "outstanding token",
    "session",
    "log entry",
  ];

  const permisosValidos = permisos
    .filter((per) => nombresPersonalizados.hasOwnProperty(per.name))
    .filter(
      (per) =>
        !excludedModels.some((model) => per.name.toLowerCase().includes(model))
    );

  const filteredPermisos = permisosValidos.filter((per) =>
    nombresPersonalizados[per.name]
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-2">Cargando permisos...</p>
      </div>
    );
  }

  if (filteredPermisos.length === 0) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <h5 className="text-muted">
            {searchTerm
              ? "No se encontraron permisos con ese nombre"
              : "No hay permisos registrados"}
          </h5>
        </div>
      </div>
    );
  }

  return (
    <div className="row m-0 row-cols-2 row-cols-sm-4 row-cols-md-4 row-cols-lg-5 row-cols-xl-6 g-2">
      {filteredPermisos.map((per) => (
        <div className="col" key={per.id}>
          <div className="card h-100 shadow-sm position-relative">
            <div className="card-body">
              {/* ICONO ARRIBA A LA DERECHA */}
              <RiGitRepositoryPrivateLine
                className="position-absolute"
                style={{
                  top: "10px",
                  left: "10px",
                  fontSize: "1.2rem",
                  color: "#f6a0a0",
                }}
                title="Color de fondo"
              />
              <div className="d-flex p-4 justify-content-between align-items-start">
                <h6 className="card-title mb-0 text-center w-100">
                  {nombresPersonalizados[per.name] || per.name}
                </h6>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
