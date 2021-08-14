import Head from "next/head";
import { useContext, useState, useEffect } from "react";
import { DataContext } from "../../store/GlobalState";
import valid from "../../utils/valid";
import { patchData } from "../../utils/fetchData";
import ImageUpload from "../../utils/ImageUpload";
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
  const { auth, notify } = state;

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
        payload: { error: "El archivo no existe." },
      });

    if (file.size > 1024 * 1024)
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "El tamaño de imagen maximo es de 1 MB." },
      });

    if (file.type !== "image/jpeg" && file.type !== "image/png")
      //1mb
      return dispatch({
        type: "NOTIFY",
        payload: { error: "El formato de la imagen no es soportado." },
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
        <title>Perfil</title>
      </Head>
      <section className="row text-secondary my3">
        <div className="col-md-4">
          <h3 className="text-center text-uppercase">
            {auth.user.role === "user"
              ? "Perfil de usuario"
              : "Perfil de Profesor"}
          </h3>
          <div className="avatar">
            <img
              src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar}
              alt={auth.user.name}
              width={150}
              height={150}
            />
            <span>
              <i className="fas fa-camera"></i>
              <p>Cambiar</p>
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
              Nombre
              <input
                type="text"
                name="name"
                value={name}
                placeholder="Tú nombre"
                className="form-control"
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Correo
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
              Nueva contraseña
              <input
                type="password"
                name="password"
                placeholder="Nueva contraseña"
                className="form-control"
                value={password}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="cf_password">
              Confirmar contraseña
              <input
                type="password"
                name="cf_password"
                placeholder="Confirmar contraseña"
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
            Actualizar
          </button>
        </div>
        <div className="col-md-8">
          <h3 className="text-uppercase">
            {auth.user.role === "user" ? "Datos" : "Votantes"}
          </h3>
        </div>
      </section>
    </div>
  );
}
