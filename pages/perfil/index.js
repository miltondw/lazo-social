import Head from "next/head";
import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import valid from "../../utils/valid";
import { patchData } from "../../utils/fetchData";
import ImageUpload from "../../utils/ImageUpload";
import Link from 'next/link'
export default function Profile() {
  const initialState = {
    avatar: "",
    name: "",
    password: "",
    cf_password: "",
  };
  const [data, setData] = useState(initialState);
  const { avatar, name, password, cf_password } = data;

  const { state, dispatch } = useContext(DataContext);
  const { auth, orders, notify } = state;

  useEffect(() => {
    if (auth.user) setData({ ...data, name: auth.user.name });
  }, [auth.user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (password) {
      const errMsg = valid(name, auth.user.email, password, cf_password);
      if (errMsg)
        return dispatch({ type: "NOTIFY", payload: { error: errMsg } });
      updatePassword();
    }
    if (name !== auth.user.name || avatar) updateInfo();
  };
  const updatePassword = () => {
    dispatch({ type: "NOTIFY", payload: { loading: true } });
    patchData("user/resetPassword", { password }, auth.token).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
    });
    setData({ ...data, password: "", cf_password: "" });
  };
  const changeAvatar = (e) => {
    const file = e.target.files[0];
    if (!file)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "File does not exist." },
      });

    if (file.size > 1024 * 1024)
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "The largest image size is 1mb." },
      });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Image format is incorrect." },
      });

    // let blob = new Blob([file], { type: "image/jpg" }),
    //   url = URL.createObjectURL(blob);
    setData({ ...data, avatar: file });
  };
  const updateInfo = async () => {
    let media;
    // dispatch({ type: "NOTIFY", payload: { loading: true } });
    if (avatar) media = await ImageUpload([avatar]);
    patchData(
      "user",
      {
        name,
        avatar: avatar ? media[0].url : auth.user.avatar,
      },
      auth.token
    ).then((res) => {
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
      dispatch({
        type: "AUTH",
        payload: { token: auth.token, user: res.user },
      });
      return dispatch({
        type: "NOTIFY",
        payload: { success: res.msg },
      });
    });
  };
  if (!auth.user) return null;
  return (
    <div className="profile_page">
      <Head>
        <title>Profile</title>
      </Head>
      <section className="row text-secondary my3">
        <div className="col-md-4">
          <h3 className="text-center text-uppercase">
            {auth.user.role === "user" ? "User Profile" : "Admin Profile"}
          </h3>
          <div className="avatar">
            {/* <Image
              src={'blob:http://localhost:3000/e6d82acf-ef76-45a5-9022-97950480ae26'}
              alt={auth.user.name}
              width={150}
              height={150}
            /> */}
            <img
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt={auth.user.name}
              width={150}
              height={150}
            />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
                accept="image/*"
              />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">
              Name
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Your name"
                className="form-control"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Email
              <input
                type="text"
                name="email"
                defaultValue={auth.user.email}
                disabled={true}
                className="form-control"
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="password">
              New Password
              <input
                type="password"
                name="password"
                placeholder="New password"
                className="form-control"
                value={password}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="cf_password">
              Confirm New Password
              <input
                type="password"
                name="cf_password"
                placeholder="Confirm password"
                className="form-control"
                value={cf_password}
                onChange={handleChange}
              />
            </label>
          </div>
          <button
            className="btn btn-info mt-2 "
            disabled={notify.loading}
            onClick={handleUpdateProfile}
          >
            Update
          </button>
        </div>
        <div className="col-md-8">
          <h3 className="text-uppercase">Orders</h3>

          <div className="my-3 table-responsive">
            <table
              className="table-bordered table-hover w-100 text-uppercase"
              style={{ minWidth: "600px", cursor: "pointer" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-2">id</td>
                  <td className="p-2">date</td>
                  <td className="p-2">total</td>
                  <td className="p-2">delivered</td>
                  <td className="p-2">paid</td>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Link href={`/order/${order._id}`}>
                        <a>{order._id}</a>
                      </Link>
                    </td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-2">${order.total}</td>
                    <td className="p-2">
                      {order.delivered ? (
                        <i className="fas fa-check text-success"></i>
                      ) : (
                        <i className="fas fa-times text-danger"></i>
                      )}
                    </td>
                    <td className="p-2">
                      {order.paid ? (
                        <i className="fas fa-check text-success"></i>
                      ) : (
                        <i className="fas fa-times text-danger"></i>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
