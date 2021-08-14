import { getData } from "../utils/fetchData";
import filterSearch from "../utils/filterSearch";
import { DataContext } from "../store/GlobalState";
import VotanteItem from "../components/VotanteItem/VotanteItem";
import Filter from "../components/Filter/Filter";
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
export default function Home(props) {
  const [votantes, setVotantes] = useState(props.votantes);
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  useEffect(() => {
    setVotantes(props.votantes);
  }, [props.votantes]);

  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);

  const handleCheck = (id) => {
    votantes.forEach((p) => {
      if (p._id === id) p.checked = !p.checked;
    });
    setVotantes([...votantes]);
  };
  const handleCheckAll = () => {
    votantes.forEach((p) => (p.checked = !isCheck));
    setVotantes([...votantes]);
    setIsCheck(!isCheck);
  };
  const handleDeleteAll = () => {
    let deleteArr = [];
    votantes.forEach((p) => {
      if (p.checked) {
        deleteArr.push({
          data: "",
          id: p._id,
          title: "¿Eliminar todos los votanes seleccionados? ",
          type: "DELETE_VOTANTE",
        });
      }
      dispatch({ type: "ADD_MODAL", payload: deleteArr });
    });
  };
  const handleLoadmore = () => {
    setPage(page + 1);
    filterSearch({ router, page: page + 1 });
  };

  return (
    <div className="home_page">
      <Head>
        <title>Lazo Social</title>
      </Head>
      <Filter state={state} />
      {auth.user &&
        auth.user.role === "admin" &&
        (votantes.length !== 0 ? (
          <div
            className="delete_all btn btn-danger mt-2"
            style={{ marginBottom: "-10px" }}
          >
            <input
              type="checkbox"
              style={{
                width: "25px",
                height: "25px",
                transform: "translateY(8px)",
              }}
              onChange={handleCheckAll}
            />

            <button
              className="btn btn-danger ml-2"
              aria-hidden="true"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={handleDeleteAll}
            >
              ELIMINAR TODOS
            </button>
          </div>
        ) : (
          ""
        ))}
      {auth.user ? (
        <>
          <div className="votantes">
            {votantes.length === 0 ? (
              <h2>No Hay Votantes</h2>
            ) : (
              votantes.map((v) => (
                <VotanteItem
                  key={v._id}
                  votante={v}
                  handleCheck={handleCheck}
                />
              ))
            )}
          </div>
          {props.result < page * 6 ? (
            ""
          ) : (
            <button
              className="btn btn-outline-info d-block mx-auto mb-4"
              onClick={handleLoadmore}
            >
              Carga más
            </button>
          )}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const club = query.club || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `votante?limit=${page * 6}&club=${club}&sort=${sort}&firstName=${search}`
  );

  // server side rendering
  return {
    props: {
      votantes: res.votantes,
      result: res.result,
    }, // will be passed to the page component as props
  };
}
