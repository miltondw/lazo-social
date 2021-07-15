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
              height={100}
              width={100}
              className={`img-thumbnail rounded ${isActive(index)}`}
              style={{ width: "20%" }}
              onClick={() => setTab(index)}
            />
          ))}
        </div>
      </div>

      <div className="col-md-6 mt-3">
        <h2 className="text-uppercase content-dbAlumnos__nombre">
          {alumno.firstName} {alumno.lastName}
        </h2>
        {alumno.exonerado ? <h3 className="text-info">Exonerado</h3> : ""}
        <div className="col-md-8">
          <div className="content-dbAlumnos">
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-cubes"></i>Club
              </h3>
              <p className="content-dbAlumnos__parapraph">{alumno.club}</p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-id-badge"></i>C.I
              </h3>
              <p className="content-dbAlumnos__parapraph">{alumno.cc}</p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                <i class="fas fa-phone-alt"></i>Teléfono
              </h3>
              <p className="content-dbAlumnos__parapraph">+57 {alumno.phone}</p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-weight"></i>Peso
              </h3>
              <p className="content-dbAlumnos__parapraph">{alumno.weight} Kg</p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-arrows-alt-v"></i>Estatura
              </h3>
              <p className="content-dbAlumnos__parapraph">
                {alumno.size / 100} Mts
              </p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-bullseye"></i>Observaciones
              </h3>
              <p className="content-dbAlumnos__parapraph">
                {alumno.observations}
              </p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-hourglass-start"></i>Edad
              </h3>
              <p className="content-dbAlumnos__parapraph">{alumno.age} Años</p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-calendar-alt"></i>Fecha de nacimiento
              </h3>
              <p className="content-dbAlumnos__parapraph">
                {new Date(alumno.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div className="content-dbAlumnos_cart">
              <h3 className="content-dbAlumnos__title">
                {" "}
                <i class="fas fa-calendar-alt"></i>Fecha de entrada
              </h3>
              <p className="content-dbAlumnos__parapraph">
                {new Date(alumno.dateOfEntry).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
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
