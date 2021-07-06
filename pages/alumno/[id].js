import Head from "next/head";
import { useState, useRef, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";
import { addToCart } from "../../store/Actions";
import Image from "next/image";

export default function DetailProduct(props) {
  const [product] = useState(props.product);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const { cart } = state;

  const imgRef = useRef();

  const isActive = (index) => {
    if (tab === index) return "active";
    return "";
  };

  return (
    <div className="row detail_page product_detail">
      <Head>
        <title>Detail Product</title>
      </Head>
      <div className="col-md-6">
        <Image
          src={product.images[tab].url}
          alt={product.title}
          width={400}
          height={350}
          className="card-img-top"
        />
        <div className="row mx-0" ref={imgRef}>
          {product.images.map((i, index) => (
            <Image
              key={index}
              src={i.url}
              alt={i.title}
              height={80}
              width={100}
              className={`img-thumbnail rounded ${isActive(index)}`}
              style={{ width: "20%" }}
              onClick={() => setTab(index)}
            />
          ))}
        </div>
      </div>

      <div className="col-md-6 mt-3">
        <h2 className="text-uppercase">{product.title}</h2>
        <h5 className="text-danger">${product.price}</h5>

        <div className="row mx-0 d-flex justify-content-between">
          {product.inStock > 0 ? (
            <h6 className="text-danger">In Stock: {product.inStock}</h6>
          ) : (
            <h6 className="text-danger">Out Stock</h6>
          )}

          <h6 className="text-danger">Sold: {product.sold}</h6>
        </div>

        <div className="my-2">{product.description}</div>
        <div className="my-2">{product.content}</div>
        <button
          type="button"
          className="btn btn-dark d-block my-3 px-5"
          onClick={() => dispatch(addToCart(product, cart))}
        >
          Buy
        </button>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`product/${id}`);
  return {
    props: { product: res.product },
  };
}
