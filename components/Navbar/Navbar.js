import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import Image from "next/image";
import Cookie from "js-cookie";

export default function Navbar() {
  const router = useRouter();
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const isActivo = (r) => {
    if (r === router.pathname) {
      return "active";
    } else {
      return "";
    }
  };
  const handleLogout = () => {
    Cookie.remove("refreshtoken", { path: "api/auth/accesToken" });
    localStorage.removeItem("firstLogin");
    dispatch({ type: "AUTH", payload: {} });
    dispatch({ type: "NOTIFY", payload: { success: "¡Desconectado!" } });
    return router.push("/");
  };
  const adminRouter = () => {
    return (
      <>
        <Link href="/usuarios">
          <a className="dropdown-item">Usuarios</a>
        </Link>
        <Link href="/crear">
          <a className="dropdown-item">Crear Votante</a>
        </Link>
        <Link href="/clubs">
          <a className="dropdown-item">Clubs</a>
        </Link>
      </>
    );
  };
  const loggedRouter = () => {
    return (
      <li className="nav-item dropdown">
        <a
          className="nav-link  dropdown-toggle"
          href="#"
          id="navbarDropdownMenuLink"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          style={{ justifyContent: "space-around", width: " 10em" }}
        >
          <Image
            src={auth.user.avatar}
            alt={auth.user.name}
            width={30}
            height={30}
            className="avatar"
          />
          {auth.user.name}
        </a>
        <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <li>
            <Link href="/perfil">
              <a className="dropdown-item">Perfil</a>
            </Link>
            {auth.user.role === "admin" && adminRouter()}
          </li>
          <li>
            <div className="dropdown-divider"></div>
            <button className="dropdown-item" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </li>
        </ul>
      </li>
    );
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">
          <a>
            <Image
              src="https://res.cloudinary.com/daekebmip/image/upload/v1625269819/2F07089413BE4E9492D6B2302A63F5A0_grt44t.jpg"
              alt="Logo Fundación Lazo Social"
              width={120}
              height={120}
              className="logo"
            />
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNavDropdown"
        >
          <ul className="navbar-nav">
            {Object.keys(auth).length === 0 ? (
              <li className="nav-item">
                <Link href="/signin">
                  <a className={"nav-link " + isActivo("/signin")}>
                    <i className="fas fa-user mx-1"></i>
                    Iniciar sesión
                  </a>
                </Link>
              </li>
            ) : (
              loggedRouter()
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
