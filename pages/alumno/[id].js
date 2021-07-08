import Head from "next/head";
import { useState, useRef, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";
import Image from "next/image";

export default function DetailProduct(props) {
  const [alumno] = useState(props.alumno);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const IMC = (alumno.weight / Math.pow(alumno.size / 100, 2)).toFixed(2);

  const imgRef = useRef();

  const isActive = (index) => {
    if (tab === index) return "active";
    return "";
  };

  return (
    <div className="row detail_page product_detail">
      <Head>
        <title>Detalle del Alumno</title>
      </Head>
      <div className="col-md-6">
        <Image
          src={alumno.images[tab].url}
          alt={alumno.title}
          width={400}
          height={350}
          className="card-img-top"
        />
        <div className="row mx-0" ref={imgRef}>
          {alumno.images.map((i, index) => (
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
        <h2 className="text-uppercase">
          {alumno.nombre} {alumno.lastName}
        </h2>
        {alumno.exonerado ? <h3 className="text-info">Exonerado</h3> : ""}
        <div className="col-md-8">
          <div className="my-3 table-responsive">
            <table
              className="table-bordered table-hover  text-capitalize table"
              style={{ minWidth: "600px", cursor: "pointer" }}
            >
              <thead className="bg-light font-weight-bold">
                <tr>
                  <td className="p-1 text-center">Club</td>
                  <td className="p-1 text-center">C.I</td>
                  <td className="p-1 text-center">Teléfono</td>
                  <td className="p-1 text-center">Peso</td>
                  <td className="p-1 text-center">Estatura</td>
                  <td className="p-1 text-center">Observaciones</td>
                  <td className="p-1 text-center">Edad</td>
                  <td className="p-1 text-center">Fecha de nacimiento</td>
                  <td className="p-1 text-center">Fecha de entrada</td>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="p-1 text-center">{alumno.club}</td>
                  <td className="p-1 text-center">{alumno.cc}</td>
                  <td className="p-1 text-center">{alumno.phone}</td>
                  <td className="p-1 text-center">{alumno.weight}Kg</td>
                  <td className="p-1 text-center">{alumno.size / 100}Mts</td>
                  <td className="p-1 text-center">{alumno.observations}</td>
                  <td className="p-1 text-center">{alumno.age}Años</td>
                  <td className="p-1 text-center">
                    {new Date(alumno.dateOfBirth).toLocaleDateString()}
                  </td>
                  <td className="p-1 text-center">
                    {new Date(alumno.dateOfEntry).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* <div className="row mx-0 d-flex justify-content-between">
          <h6 style={{ width: "auto", textTransform: "capitalize" }}>
            Club: {alumno.club}
          </h6>

          <h6 style={{ width: "auto" }}>Edad: {alumno.age}</h6>

          <h6 style={{ width: "auto" }}>
            IMC:{" "}
            <span
              className={
                IMC > 18.5 && IMC < 24.9 ? "text-normal" : "text-danger"
              }
            >
              {IMC}
            </span>
          </h6>
        </div>
        <div className="row mx-0 d-flex justify-content-between">
          <h6 style={{ width: "auto", textTransform: "capitalize" }}>
            <i className="fas fa-phone-alt"></i>teléfono: {alumno.phone}
          </h6>
          <h6 style={{ width: "auto" }}>C.I: {alumno.cc}</h6>
          <h6 style={{ width: "auto" }}>Peso: {alumno.weight}Kg</h6>
          <h6 style={{ width: "auto" }}>Estatura: {alumno.size / 100}Mts</h6>
        </div>

        <div className="my-2">{alumno.observations}</div> */}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`alumno/${id}`);
  return {
    props: { alumno: res.alumno },
  };
}
