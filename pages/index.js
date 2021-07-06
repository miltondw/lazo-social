import { getData } from "../utils/fetchData";
import filterSearch from "../utils/filterSearch";
import { DataContext } from "../store/GlobalState";
import ProductItem from "../components/Product/ProductItem";
import Filter from "../components/Filter/Filter";
import { useState, useContext, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
export default function Home(props) {
  const [products, setProducts] = useState(props.products);
  const { state, dispatch } = useContext(DataContext);
  const { auth } = state;
  const [isCheck, setIsCheck] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  useEffect(() => {
    setProducts(props.products);
  }, [props.products]);
  useEffect(() => {
    if (Object.keys(router.query).length === 0) setPage(1);
  }, [router.query]);
  const handleCheck = (id) => {
    products.forEach((p) => {
      if (p._id === id) p.checked = !p.checked;
    });
    setProducts([...products]);
  };
  const handleCheckAll = () => {
    products.forEach((p) => (p.checked = !isCheck));
    setProducts([...products]);
    setIsCheck(!isCheck);
  };
  const handleDeleteAll = () => {
    let deleteArr = [];
    products.forEach((p) => {
      if (p.checked) {
        deleteArr.push({
          data: "",
          id: p._id,
          title: "Delete all selected products?",
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
        <title>Home Page</title>
      </Head>
      <Filter state={state} />
      {auth.user &&
        auth.user.role === "admin" &&
        (products.length !== 0 ? (
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
              DELETE ALL
            </button>
          </div>
        ) : (
          ""
        ))}
      <div className="products">
        {products.length === 0 ? (
          <h2>No products</h2>
        ) : (
          products.map((p) => (
            <ProductItem key={p._id} product={p} handleCheck={handleCheck} />
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
          Load more
        </button>
      )}
    </div>
  );
}
export async function getServerSideProps({ query }) {
  const page = query.page || 1;
  const category = query.category || "all";
  const sort = query.sort || "";
  const search = query.search || "all";

  const res = await getData(
    `product?limit=${
      page * 6
    }&category=${category}&sort=${sort}&title=${search}`
  );
  // server side rendering
  return {
    props: {
      products: res.products,
      result: res.result,
    }, // will be passed to the page component as props
  };
}
