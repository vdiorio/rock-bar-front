import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { login, validateToken } from "../../helpers/serverCalls";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../helpers/toasts";
import "./loginStyles.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loaded, setLoaded] = useState(false);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login({ email, password })
      .then(({ id, token, role }) => {
        localStorage.setItem("id", id);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        navigate(`/${role.toLowerCase()}`);
      })
      .catch(({ message }) => errorToast(message));
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      window.location.href = `/${role.toLowerCase()}`;
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <div className="login-container">
      {loaded && (
        <>
          <img
            style={{ height: "45vh" }}
            src={require("../../fotos/LOGO.png")}
            alt="Logo do rock bar"
          />
          <div className="row justify-content-center">
            <div className="card bg-dark text-light border-secondary">
              <h3 className="card-title text-center mb-4">
                Entre com seu email e senha
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label text-light">
                    Email
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label text-light">
                    Senha
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Log In
                  </button>
                  <button
                    className="btn btn-secondary mx-2"
                    onClick={() => navigate("/register")}
                  >
                    Cadastrar
                  </button>
                </div>
                <div className="mb-3 text-center">
                  <a
                    href="/forgot-password"
                    className="text-light text-decoration-none"
                  >
                    Esqueceu a senha?
                  </a>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
