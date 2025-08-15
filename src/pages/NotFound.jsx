import logo from "@/assets/favicon.svg";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <img src={logo} alt="Logo" style={styles.image} />
      <h1 style={styles.title}>404 - Página no encontrada</h1>
      <p style={styles.text}>
        Ups... Parece que esta página no existe o fue movida.
      </p>
      <a href="/" className="bg-lunalu" style={styles.button}>
        Volver al inicio
      </a>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "60px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "#333",
  },
  image: {
    width: "60vw", // Imagen super grandota, ocupa 60% del viewport width
    maxWidth: "600px", // Para que no se pase de lanza
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.8rem",
    marginBottom: "10px",
  },
  text: {
    fontSize: "1.2rem",
    marginBottom: "30px",
    color: "#666",
  },
  button: {
    display: "inline-block",
    padding: "12px 24px",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    transition: "transform 0.2s ease",
  },
};

export default NotFound;
