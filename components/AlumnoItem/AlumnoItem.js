import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";

export default function AlumnoItem({ alumno, handleCheck }) {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const userLink = () => {
    return (
      <>
        <Link href={`/alumno/${alumno._id}`}>
          <a className="btn btn-info">Ver</a>
        </Link>
      </>
    );
  };

  const imc = alumno.weight / Math.pow(alumno.size / 100, 2);
  const IMC = imc.toFixed(2);
  const adminLink = () => {
    return (
      <>
        <Link href={`crear/${alumno._id}`}>
          <a className="btn btn-info">Editar</a>
        </Link>
        <button
          className={`btn btn-danger `}
          aria-hidden="true"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => {
            dispatch({
              type: "ADD_MODAL",
              payload: [
                {
                  data: "",
                  id: alumno._id,
                  title: alumno.nombre,
                  type: "DELETE_PRODUCT",
                },
              ],
            });
          }}
        >
          Eliminar
        </button>
      </>
    );
  };
  // if (!auth.user) return null;
  return (
    <div className="card my-3" style={{ width: " 18rem" }}>
      {auth.user && auth.user.role === "admin" && (
        <input
          type="checkbox"
          checked={alumno.checked}
          className="position-absolute"
          style={{
            height: "20px",
            width: "20px",
            zIndex: "10",
            cursor: "pointer",
          }}
          onChange={() => handleCheck(alumno._id)}
        />
      )}
      <Image
        src={alumno.images[0].url}
        alt={alumno.nombre}
        width={100}
        height={240}
        className="card-img-top"
      />

      <div className="card-body">
        <div className="row justify-content-between mx-0">
          <h6 style={{ width: "auto", textTransform: "capitalize",textAlign:'center' }}>
            {alumno.nombre} {alumno.lastName}
          </h6>

          <h6 style={{ width: "auto", textTransform: "capitalize" }}>
            Club:{alumno.club}
          </h6>
        </div>

        <div className="row justify-content-between mx-0">
          <h6 style={{ width: "auto" }}>Edad:{alumno.age}</h6>

          <h6 style={{ width: "auto" }}>
            IMC:{" "}
            <span
              className={
                IMC > 18.5 && IMC < 24.9 ? "text-normal" : "text-danger"
              }
            >
              {IMC}
            </span>
          </h6>
        </div>

        <p className="card-text" title={alumno.oservations}>
          {alumno.oservations}
        </p>

        <div className="row justify-content-between mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
}
