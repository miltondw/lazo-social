import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";

export default function VotanteItem({ votante }) {
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;

  const adminLink = () => {
    return (
      <>
        <Link href={`/crear/${votante._id}`}>
          <a className="btn btn-info">Editar</a>
        </Link>
        <button
          style={{ position: "relative", left: " 50%" }}
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
                  id: votante._id,
                  title: votante.firstName,
                  type: "DELETE_VOTANTE",
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
          checked={votante.checked}
          className="position-absolute"
          style={{
            height: "20px",
            width: "20px",
            zIndex: "10",
            cursor: "pointer",
          }}
          onChange={() => handleCheck(votante._id)}
        />
      )}
      <Image
        src={votante.images[0].url}
        alt={votante.firstName}
        width={100}
        height={240}
        className="card-img-top"
      />

      <div className="card-body">
        <div className="row justify-content-between mx-0">
          <h6
            style={{
              width: "auto",
              textTransform: "capitalize",
              textAlign: "left",
            }}
          >
            {votante.firstName} {votante.firstLastName}
          </h6>

          <h6 style={{ width: "auto", textTransform: "capitalize" }}>
            Club:{votante.club}
          </h6>
        </div>

        <div className="row justify-content-between mx-0">
          <h6 style={{ width: "auto" }}>Edad:{votante.age} Años</h6>
        </div>

        <p className="card-text" title={votante.oservations}>
          {votante.oservations}
        </p>

        <div className="row justify-content-between mx-0">
          <Link href={`/votante/${votante._id}`}>
            <a className="btn btn-info">Ver</a>
          </Link>
          {!auth.user || auth.user.role !== "admin" ? "" : adminLink()}
        </div>
      </div>
    </div>
  );
}
