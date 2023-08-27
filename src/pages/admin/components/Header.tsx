export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="/admin">
        Estação Eskina Rock Bar
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarText"
        aria-controls="navbarText"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarText">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/admin">
              Comandas
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/orders">
              Pedidos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/admin/products">
              Produtos
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
