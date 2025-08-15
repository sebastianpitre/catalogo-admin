import { NavLink } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getAllItems } from "../services/dashboard";

const Dashboard = () => {
  const [summaryData, setSummaryData] = useState({
    categorias: {
      count: 0,
      icon: "fa-table-list",
      color: "#4e73df",
      bg: "rgba(78, 115, 223, 0.1)",
    },
    colores: {
      count: 0,
      icon: "fa-palette",
      color: "#e83e8c",
      bg: "rgba(232, 62, 140, 0.1)",
    },
    descripciones: {
      count: 0,
      icon: "fa-comment-dots",
      color: "#fd7e14",
      bg: "rgba(253, 126, 20, 0.1)",
    },
    notificaciones: {
      count: 0,
      icon: "fa-bell",
      color: "#20c997",
      bg: "rgba(32, 201, 151, 0.1)",
    },
    preguntas: {
      count: 0,
      icon: "fa-question",
      color: "#6f42c1",
      bg: "rgba(111, 66, 193, 0.1)",
    },
    prendas: {
      count: 0,
      icon: "fa-tshirt",
      color: "#f03e3e",
      bg: "rgba(240, 62, 62, 0.1)",
    },
    tallas: {
      count: 0,
      icon: "fa-tags",
      color: "#17a2b8",
      bg: "rgba(23, 162, 184, 0.1)",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllItems();
        setSummaryData((prevData) => {
          const updated = {};
          for (const key in data) {
            if (prevData[key]) {
              updated[key] = {
                ...prevData[key],
                count: data[key],
              };
            }
          }
          return {
            ...prevData,
            ...updated,
          };
        });
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className="row m-0">
        <div className="col-12 px-0">
          <Carousel fade indicators={false} controls={false}>
            <Carousel.Item interval={3000}>
              <div
                className="d-block w-100"
                style={{
                  height: "200px",
                  background:
                    "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                }}
              >
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white">
                  <h3>Bienvenido a Tu App</h3>
                  <p className="text-center w-75">
                    Gestiona todas tus categorías de productos en un solo lugar
                  </p>
                </div>
                <div className="position-absolute w-100 bottom-0" style={{ zIndex: 9 }}>
                  <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 40"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                  >
                    <defs>
                      <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 
                        58-18 88-18 58 18 88 18 v44h-352z"
                      />
                    </defs>
                    <g className="moving-waves">
                      <use xlinkHref="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40)" />
                      <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)" />
                      <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)" />
                      <use xlinkHref="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)" />
                      <use xlinkHref="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)" />
                      <use xlinkHref="#gentle-wave" x="48" y="16" fill="#fff" />
                    </g>
                  </svg>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <div
                className="d-block w-100"
                style={{
                  height: "200px",
                  background:
                    "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                }}
              >
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white">
                  <h3>Control Total</h3>
                  <p className="text-center w-75">
                    Administra inventarios, tallas y características de
                    productos
                  </p>
                </div>
                <div className="position-absolute w-100 bottom-0" style={{ zIndex: 9 }}>
                  <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 40"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                  >
                    <defs>
                      <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 
                        58-18 88-18 58 18 88 18 v44h-352z"
                      />
                    </defs>
                    <g className="moving-waves">
                      <use xlinkHref="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40)" />
                      <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)" />
                      <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)" />
                      <use xlinkHref="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)" />
                      <use xlinkHref="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)" />
                      <use xlinkHref="#gentle-wave" x="48" y="16" fill="#fff" />
                    </g>
                  </svg>
                </div>
              </div>
            </Carousel.Item>
            <Carousel.Item interval={3000}>
              <div
                className="d-block w-100"
                style={{
                  height: "200px",
                  background:
                    "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
                }}
              >
                <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white">
                  <h3>Reportes en Tiempo Real</h3>
                  <p className="text-center w-75">
                    Monitorea todas las actividades de tu negocio
                  </p>
                </div>
                <div className="position-absolute w-100 bottom-0" style={{ zIndex: 9 }}>
                  <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 40"
                    preserveAspectRatio="none"
                    shapeRendering="auto"
                  >
                    <defs>
                      <path
                        id="gentle-wave"
                        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 
                        58-18 88-18 58 18 88 18 v44h-352z"
                      />
                    </defs>
                    <g className="moving-waves">
                      <use xlinkHref="#gentle-wave" x="48" y="-1" fill="rgba(255,255,255,0.40)" />
                      <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.35)" />
                      <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.25)" />
                      <use xlinkHref="#gentle-wave" x="48" y="8" fill="rgba(255,255,255,0.20)" />
                      <use xlinkHref="#gentle-wave" x="48" y="13" fill="rgba(255,255,255,0.15)" />
                      <use xlinkHref="#gentle-wave" x="48" y="16" fill="#fff" />
                    </g>
                  </svg>
                </div>
              </div>
            </Carousel.Item>
            
          </Carousel>
        </div>
      </div>
    <div className="container-fluid">
      {/* Carrusel */}
      

      {/* Cards */}
      <div className="row p-4">
        <h4 className="mb-4">Resumen General</h4>

        {Object.entries(summaryData).map(
          ([key, { count, icon, color, bg }]) => (
            <div key={key} className="col-md-4 col-lg-3 mb-4">
              <NavLink to={`/${key}`} className="text-decoration-none">
                <div className="card shadow-sm border h-100 hover-scale">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="text-muted text-capitalize">{key}</h6>
                        <h3 className="mb-0">{count}</h3>
                      </div>
                      <div
                        className="p-3 rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "50px",
                          height: "50px",
                          backgroundColor: bg,
                        }}
                      >
                        <i className={`fas ${icon} fs-4`} style={{ color }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </NavLink>
            </div>
          )
        )}
      </div>
    </div>
    </>
    
  );
};

export default Dashboard;
