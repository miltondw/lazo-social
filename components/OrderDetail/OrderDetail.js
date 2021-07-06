import Link from "next/link";
import Image from "next/image";
import PaypalBtn from "../paypalBtn";
import { patchData } from "../../utils/fetchData";
import { updateItem } from "../../store/Actions";

export default function OrderDetail({ orderDetail, state, dispatch }) {
  const { auth, orders } = state;
  const handleDelivered = (order) => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData(`order/delivered/${order._id}`, null, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });

      dispatch(
        updateItem(
          orders,
          order._id,
          {
            ...order,
            ...res.result,
          },
          "ADD_ORDERS"
        )
      );
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
  };
  if (!auth.user) return null;

  return (
    <>
      {orderDetail.map((order) => (
        <div
          key={order._id}
          style={{ margin: "20px auto" }}
          className="row justify-content-around"
        >
          <div className="text-uppercase my-3" style={{ maxWidth: "600px" }}>
            <h2 className="text-break">Order {order._id}</h2>
            <div className="mt-4 text-secondary">
              <h3>Shipping</h3>
              <p>Name: {order.user.name}</p>
              <p>Email: {order.user.email}</p>
              <p>Address: {order.address}</p>
              <p>Mobile: {order.mobile}</p>
              <div
                className={`alert ${
                  order.delivered ? "alert-success" : "alert-danger"
                }
                        d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.delivered
                  ? `Deliverd on ${order.updatedAt}`
                  : "Not Delivered"}
                {auth.user.role === "admin" && !order.delivered && (
                  <button
                    className="btn btn-dark text-uppercase"
                    onClick={() => handleDelivered(order)}
                  >
                    Mark as delivered
                  </button>
                )}
              </div>
              <h3>Payment</h3>
              {order.method && (
                <h6>
                  Method: <em>{order.method}</em>{" "}
                </h6>
              )}
              {order.paymentId && (
                <p>
                  PaymentId: <em>{order.paymentId}</em>{" "}
                </p>
              )}

              <div
                className={`alert ${
                  order.paid ? "alert-success" : "alert-danger"
                }
                        d-flex justify-content-between align-items-center`}
                role="alert"
              >
                {order.paid ? `Paid on ${order.dateOfPayment}` : "Not Paid"}
              </div>
            </div>
            <div>
              <h3>Order Items</h3>
              {order.cart.map((item) => (
                <div
                  className="row border-bottom mx-0 p-2 justify-content-betwenn
                                    align-items-center"
                  key={item._id}
                  style={{ maxWidth: "550px" }}
                >
                  <Link href={`/product/${item._id}`}>
                    <a className="w-auto order_detail-image">
                      <Image
                        src={item.images[0].url}
                        alt={item.title}
                        width="66"
                        height="60"
                        style={{
                          objectFit: "cover",
                        }}
                        className="w-auto"
                      />
                    </a>
                  </Link>

                  <h5 className="flex-fill text-secondary px-3 m-0">
                    <Link href={`/product/${item._id}`}>
                      <a>{item.title}</a>
                    </Link>
                  </h5>
                  {item.quantity > 1 ? (
                    <table
                      className="table-bordered table-hover w-auto text-uppercase"
                      style={{ minWidth: "220px" }}
                    >
                      <thead className="bg-light font-weight-bold">
                        <tr>
                          <td className="p-2">Quantity</td>
                          <td className="p-2">Price</td>
                          <td className="p-2">Total</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">${item.price}</td>
                          <td className="p-2">${item.price * item.quantity}</td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    `$${item.price}`
                  )}
                </div>
              ))}
            </div>
          </div>
          {!order.paid && auth.user.role !== "admin" && (
            <div className="p-4 w-auto">
              <h2 className="mb-4 text-uppercase ">Total: ${order.total}</h2>
              <PaypalBtn order={order} />
            </div>
          )}
        </div>
      ))}
    </>
  );
}
