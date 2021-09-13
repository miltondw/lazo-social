import Head from "next/head";
import { useContext, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import { updateItem } from "../../store/Actions";
import { postData, putData } from "../../utils/fetchData";
export default function Clubs() {
  const [name, setName] = useState("");
  const { state, dispatch } = useContext(DataContext);
  const { clubs, auth } = state;
  const [id, setId] = useState("");
  const createClub = async () => {
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "La autenticación no es válida." },
      });
    if (!name)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "El nombre no puede dejarse en blanco." },
      });
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let res;
    if (id) {
      res = await putData(`clubs/${id}`, { name }, auth.token);
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch(updateItem(clubs, id, res.club, "ADD_CLUBS"));
    } else {
      res = await postData("clubs", { name }, auth.token);
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({
        type: "ADD_CLUBS",
        payload: [...clubs, res.newClub],
      });
    }
    setName("");
    setId("");

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };
  const handleEditClub = (club) => {
    setId(club._id);
    setName(club.name);
  };
  return (
    <div className="col-md-6 mx-auto my-3">
      <Head>
        <title>Categorías</title>
      </Head>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Agregar una nueva Categoria"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={createClub}>
          {id ? "Actualizar" : "Crear"}
        </button>
      </div>
      {clubs.map((club) => (
        <div key={club._id} className="card my-2 text-capitalize">
          <div className="card-body d-flex justify-content-between">
            {club.name}
            <div style={{ cursor: "pointer" }}>
              <i
                className="fas fa-edit mr-3 text-info"
                onClick={() => handleEditClub(club)}
              ></i>
              <i
                className="fas fa-trash-alt text-danger mx-2"
                aria-hidden="true"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                onClick={() => {
                  dispatch({
                    type: "ADD_MODAL",
                    payload: [
                      {
                        data: clubs,
                        id: club._id,
                        title: club.name,
                        type: "ADD_CLUBS",
                      },
                    ],
                  });
                }}
              ></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
