import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { addToCart } from "../../store/Actions";

export default function ProductItem({ product, handleCheck }) {
  const { state, dispatch } = useContext(DataContext);
  const { cart, auth } = state;
  const btnActive = (active) => {
    if (active) return "bt-active";
    return "";
  };
  const userLink = () => {
    return (
      <>
        <Link href={`/product/${product._id}`}>
          <a className="btn btn-info">View</a>
        </Link>
        <button
          className={`btn btn-success ${btnActive(
            product.inStock === 0 ? true : false
          )}`}
          onClick={() => dispatch(addToCart(product, cart))}
          // disabled={product.inStock === 0 ? true : false}
        >
          Buy
        </button>
      </>
    );
  };
  const adminLink = () => {
    return (
      <>
        <Link href={`create/${product._id}`}>
          <a className="btn btn-info">Edit</a>
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
                  id: product._id,
                  title: product.title,
                  type: "DELETE_PRODUCT",
                },
              ],
            });
          }}
        >
          Delete
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
          checked={product.checked}
          className="position-absolute"
          style={{
            height: "20px",
            width: "20px",
            zIndex: "10",
            cursor: "pointer",
          }}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <Image
        src={product.images[0].url}
        alt={product.title}
        width={100}
        height={240}
        className="card-img-top"
      />

      <div className="card-body">
        <h5 className="card-title text-capitalize" title={product.title}>
          {product.title}
        </h5>

        <div className="row justify-content-between mx-0">
          <h6 className="text-danger" style={{ width: "auto" }}>
            ${product.price}
          </h6>
          {product.inStock > 0 ? (
            <h6 className="text-danger" style={{ width: "auto" }}>
              In Stock: {product.inStock}
            </h6>
          ) : (
            <h6 className="text-danger" style={{ width: "auto" }}>
              Out Stock
            </h6>
          )}
        </div>

        <p className="card-text" title={product.description}>
          {product.description}
        </p>

        <div className="row justify-content-between mx-0">
          {!auth.user || auth.user.role !== "admin" ? userLink() : adminLink()}
        </div>
      </div>
    </div>
  );
}
