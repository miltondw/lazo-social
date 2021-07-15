import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import ImageUpload from "../../utils/ImageUpload";
import { postData, getData, putData } from "../../utils/fetchData";
import getAge from "../../utils/getAge";
export default function ProductsManager() {
  // Alumno
  const initialStateAlumno = {
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    cc: 0,
    dateOfBirth: "",
    age: 0,
    club: "",
    phone: 0,
    dateOfEntry: "",
    weight: 0,
    size: 0,
    sexo: "",
    exonerado: false,
    observations: "",
    nameFather: "",
    lastNameFather: "",
    secondNameFather: "",
    secondLastNameFather: "",
    nameMother: "",
    lastNameMother: "",
    secondNameMother: "",
    secondLastNameMother: "",
    phoneFather: 0,
    phoneMother: 0,
  };
  const [alumno, setAlumno] = useState(initialStateAlumno);

  const {
    firstName,
    secondName,
    age,
    firstLastName,
    secondLastName,
    cc,
    club,
    phone,
    weight,
    size,
    observations,
    exonerado,
    dateOfBirth,
    dateOfEntry,
    nameFather,
    secondNameFather,
    lastNameFather,
    secondLastNameFather,
    nameMother,
    secondNameMother,
    lastNameMother,
    secondLastNameMother,
    phoneFather,
    phoneMother,
  } = alumno;
  const [images, setImages] = useState([]);
  useEffect(() => {
    setAlumno({ ...alumno, age: getAge(dateOfBirth) });
  }, [dateOfBirth]);

  // General
  const { state, dispatch } = useContext(DataContext);
  const { clubs, auth } = state;
  const router = useRouter();
  const { id } = router.query;
  const [onEdit, setOnEdit] = useState(false);
  // Petición de alumos y Padres
  useEffect(() => {
    if (id) {
      setOnEdit(true);
      getData(`alumno/${id}`).then((res) => {
        setAlumno(res.alumno);
        setImages(res.alumno.images);
      });
    } else {
      setOnEdit(false);
      setAlumno(initialStateAlumno);
      setImages([]);
    }
  }, [id]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setAlumno({ ...alumno, [name]: value });
    dispatch({ type: "NOTIFY", payload: {} });
  };
  const handleUploadInput = (e) => {
    dispatch({ type: "NOTIFY", payload: {} });
    let newImages = [];
    let num = 0;
    let err = "";
    const files = [...e.target.files];
    if (files.length === 0)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Los archivos no existen." },
      });

    files.forEach((file) => {
      if (file.size > 1024 * 1024)
        return (err = "El tamaño de imagen maximo es de 1 MB");

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return (err = "El formato de la imagen es incorrecto.");

      num += 1;
      if (num <= 5) newImages.push(file);
      return newImages;
    });
    if (err) dispatch({ type: "NOTIFY", payload: { error: err } });
    const imgCount = images.length;
    if (imgCount + newImages.length > 5)
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Seleccione hasta 5 imágenes." },
      });
    setImages([...images, ...newImages]);
  };
  const deleteImage = (index) => {
    const newArr = [...images];
    newArr.splice(index, 1);
    setImages(newArr);
  };
  const handleCheck = (check) => {
    setAlumno({ ...alumno, exonerado: check });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (auth.user.role !== "admin")
      return dispatch({
        type: "NOTIFY",
        payload: { error: "La autenticación no es válida." },
      });

    if (!firstName || !age || !firstLastName )
      return dispatch({
        type: "NOTIFY",
        payload: { error: "Agregue todos los campos." },
      });

    dispatch({ type: "NOTIFY", payload: { loading: true } });
    let media = [];
    const imgNewURL = images.filter((img) => !img.url);
    const imgOldURL = images.filter((img) => img.url);

    if (imgNewURL.length > 0) media = await ImageUpload(imgNewURL);

    let res;
    if (onEdit) {
      res = await putData(
        `alumno/${id}`,
        { ...alumno, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    } else {
      res = await postData(
        "alumno",
        { ...alumno, images: [...imgOldURL, ...media] },
        auth.token
      );
      if (res.err)
        return dispatch({ type: "NOTIFY", payload: { error: res.err } });
    }

    return dispatch({ type: "NOTIFY", payload: { success: res.msg } });
  };
  if (auth.user) {
    if (!auth.user.root) return null;
  }
  if (!auth.user) return null;
  return (
    <div className="alumnos_manager">
      <Head>
        <title>Crear Alumno </title>
      </Head>
      <form className="row my-4" onSubmit={handleSubmit}>
        <div className="col-md-6 ">
          <h2 className="text-normal p-1">Alumno</h2>

          <div className="row ">
            <label htmlFor="names">Nombres</label>

            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="firstName"
                value={firstName}
                placeholder="Primer Nombre"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="secondName"
                value={secondName}
                placeholder="Segundo Nombre"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <label htmlFor="lastNames">Apellidos</label>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="firstLastName"
                value={firstLastName}
                placeholder="Primer Apellido"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="secondLastName"
                value={secondLastName}
                placeholder="Segundo Apellido"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="cc">C.I</label>
              <input
                type="number"
                className="d-block my-4 w-100 p-2"
                name="cc"
                value={cc}
                placeholder="C.I"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="phone">Télefono</label>

              <input
                type="number"
                className="d-block my-4 w-100 p-2"
                name="phone"
                value={phone}
                placeholder="Télefono"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="dateOfBirth">Fecha de nacimiento</label>
              <input
                type="date"
                className="d-block my-4 w-100 p-2"
                name="dateOfBirth"
                value={dateOfBirth}
                placeholder="Fecha de nacimento"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="dateOfEntry">Fecha de Entrada</label>

              <input
                type="date"
                className="d-block my-4 w-100 p-2"
                name="dateOfEntry"
                value={dateOfEntry}
                placeholder="Fecha de Entrada"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="weight">Peso</label>
              <input
                type="number"
                className="d-block my-4 w-100 p-2"
                name="weight"
                value={weight}
                placeholder="Peso"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="size">Estatura en "cm"</label>

              <input
                type="number"
                className="d-block my-4 w-100 p-2"
                name="size"
                value={size}
                placeholder="Estatura"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <h4>Sexo</h4>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexo"
                  id="inlineRadio1"
                  value="m"
                  onChange={handleChangeInput}
                />
                <label className="form-check-label" htmlFor="inlineRadio1">
                  Masculino
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="sexo"
                  id="inlineRadio2"
                  value="f"
                  onChange={handleChangeInput}
                />
                <label className="form-check-label" htmlFor="inlineRadio2">
                  Femenino
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <h4>Exonerado</h4>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="exonerado"
                  id="inlineRadio1"
                  checked={exonerado}
                  onChange={() => handleCheck(!exonerado)}
                />

                <label className="form-check-label" htmlFor="inlineRadio1">
                  Sí
                </label>
              </div>
            </div>
          </div>

          <textarea
            name="observations"
            id="observations"
            cols="30"
            rows="4"
            placeholder="Observaciones"
            onChange={handleChangeInput}
            className="d-block my-4 w-100 p-2"
            value={observations}
          />

          <div className="input-group-prepend px-0 my-2">
            <select
              name="club"
              id="club"
              value={club}
              onChange={handleChangeInput}
              className="form-select text-capitalize"
            >
              <option value="all">Todos los Clubs</option>
              {clubs.map((item) => (
                <option value={item.name} key={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text">Subir</span>
            <input
              type="file"
              className="form-control"
              onChange={handleUploadInput}
              multiple
              accept="image/*"
            />
          </div>
          <div className="row img-up mx-0">
            {images.map((img, index) => (
              <div key={index} className="file_img my-1">
                <img
                  src={img.url ? img.url : URL.createObjectURL(img)}
                  alt={img.name}
                  className="img-thumbnail rounded"
                />
                <span onClick={() => deleteImage(index)}>x</span>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-6">
          <h2 className="text-normal p-1">Padres</h2>

          <div className="row ">
            <label htmlFor="names">Nombres del Padre</label>

            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="nameFather"
                value={nameFather}
                placeholder="Primer Nombre"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="secondNameFather"
                value={secondNameFather}
                placeholder="Segundo Nombre"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row ">
            <label htmlFor="names">Apellidos del Padre</label>

            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="lastNameFather"
                value={lastNameFather}
                placeholder="Primer Apellido"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="secondLastNameFather"
                value={secondLastNameFather}
                placeholder="Segundo Apellido"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="phone">Télefono del Padre</label>
              <input
                type="number"
                className="d-block my-4 w-100 p-2"
                name="phoneFather"
                value={phoneFather}
                placeholder="Télefono"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row ">
            <label htmlFor="names">Nombres de la Madre</label>

            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="nameMother"
                value={nameMother}
                placeholder="Primer Nombre"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="secondNameMother"
                value={secondNameMother}
                placeholder="Segundo Nombre"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row ">
            <label htmlFor="names">Apellidos de la Madre</label>

            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="lastNameMother"
                value={lastNameMother}
                placeholder="Primer Apellido"
                onChange={handleChangeInput}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="d-block my-4 w-100 p-2"
                name="secondLastNameMother"
                value={secondLastNameMother}
                placeholder="Segundo Apellido"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <label htmlFor="phone">Télefono de la Madre</label>
              <input
                type="number"
                className="d-block my-4 w-100 p-2"
                name="phoneMother"
                value={phoneMother}
                placeholder="Télefono"
                onChange={handleChangeInput}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-info mb-3 w-100 px-4 ">
            {onEdit ? "Actualizar" : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}
