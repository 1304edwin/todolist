import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../login.css";

function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const BASE_URL = "https://todolist-beei.onrender.com";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "register" : "login";

    try {
      const res = await fetch(`${BASE_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Algo salió mal");
        return;
      }
      if (isRegister) {
        //Despues de registrar, vuelve al modo login

        setIsRegister(false);
        setPassword("");
        setError("Usuario registrado correctamente. Ahora inicia sesión.");
        return;
      }

      //Login correcto
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (error) {
      setError("Error de conexión con el servidor");
      console.error(error);
    }
  };

  return (
    <div className="login">
      <div>
        <h1>{isRegister ? "Crear una cuenta" : "Iniciar una sesión"}</h1>
        <form onSubmit={handleSubmit} className=" login-form">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />

          <input
            type="password"
            className="auth-input"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isRegister ? "Registrarse" : "Entrar"}</button>
        </form>
        {error && <p className="error-message">{error}</p>}

        <p className="toggle-mode">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Iniciar sesión" : "Registrarse"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
