import { getData } from "../utils/fetchData";
import filterSearch from "../utils/filterSearch";
import { DataContext } from "../store/GlobalState";
import AlumnoItem from "../components/AlumnoItem/AlumnoItem";
import Filter from "../components/Filter/Filter"; 
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
export default function Home(props) {
  const [alumnos, setProducts] = useState(props.alumnos);
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  useEffect(() => {
    setProducts(props.alumnos);
  }, [props.alumnos]);
  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);
  const handleCheck = (id) => {
    alumnos.forEach((p) => {
      if (p._id === id) p.checked = !p.checked;
    });
    setProducts([...alumnos]);
  };
  const handleCheckAll = () => {
    alumnos.forEach((p) => (p.checked = !isCheck));
    setProducts([...alumnos]);
    setIsCheck(!isCheck);
  };
  const handleDeleteAll = () => {
    let deleteArr = [];
    alumnos.forEach((p) => {
      if (p.checked) {
        deleteArr.push({
          data: "",
          id: p._id,
          title: "¿Eliminar todos los productos seleccionados? ",
          type: "DELETE_PRODUCT",
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
        (alumnos.length !== 0 ? (
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
      <div className="products">
        {alumnos.length === 0 ? (
          <h2>No Hay Alumnos</h2>
        ) : (
          alumnos.map((p) => (
            <AlumnoItem key={p._id} alumno={p} handleCheck={handleCheck} />
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
    </div>
  );
}
export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const club = query.club || "all";
  const sort = query.sort || "";
  const search = query.search || "all";
  

  const res = await getData(
    `alumno?limit=${page * 6}&club=${club}&sort=${sort}&nombre=${search}`
  );
 
  // server side rendering
  return {
    props: {
      alumnos: res.alumnos,
      result: res.result,
    }, // will be passed to the page component as props
  };
}
