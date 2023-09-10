import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { login } from "../../helpers/serverCalls";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../helpers/toasts";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      .then(({ token, role }) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        navigate(`/${role.toLowerCase()}`);
      })
      .catch(({ message }) => errorToast(message));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card bg-dark text-light border-secondary">
            <div className="card-body">
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
        </div>
      </div>
    </div>
  );
}
