import Head from "next/head";
import { useState, useRef, useContext } from "react";
import { DataContext } from "../../store/GlobalState";
import { getData } from "../../utils/fetchData";
import Image from "next/image";

export default function DetailVotante(props) {
  const [votante] = useState(props.votante);
  const [tab, setTab] = useState(0);

  const { state, dispatch } = useContext(DataContext);
  const imgRef = useRef();
  const isActive = (index) => {
    if (tab === index) return "active";
    return "";
  };

  return (
    <div className="row detail_page votante_detail">
      <Head>
        <title>Detalle del Votante</title>
      </Head>
      <div className="col-md-6">
        <Image
          src={votante.images[tab].url}
          alt={votante.firstName}
          width={400}
          height={350}
          className="card-img-top"
        />
        <div className="row mx-0" ref={imgRef}>
          {votante.images.map((i, index) => (
            <Image
              key={index}
              src={i.url}
              alt={i.firstName}
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
        <h2 className="text-uppercase content-dbVotantes__nombre">
          {votante.firstName} {votante.firstLastName}
        </h2>
        <div className="col-md-8">
          <div className="content-dbVotantes">
            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                {" "}
                <i class="fas fa-cubes"></i>Club
              </h3>
              <p className="content-dbVotantes__parapraph">{votante.club}</p>
            </div>
            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                {" "}
                <i class="fas fa-id-badge"></i>C.I
              </h3>
              <p className="content-dbVotantes__parapraph">{votante.cc}</p>
            </div>
            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                <i class="fas fa-phone-alt"></i>Teléfono
              </h3>
              <p className="content-dbVotantes__parapraph">
                +57 {votante.phone}
              </p>
            </div>

            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                {" "}
                <i class="fas fa-bullseye"></i>Observaciones
              </h3>
              <p className="content-dbVotantes__parapraph">
                {votante.observations}
              </p>
            </div>
            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                {" "}
                <i class="fas fa-hourglass-start"></i>Edad
              </h3>
              <p className="content-dbVotantes__parapraph">
                {votante.age} Años
              </p>
            </div>
            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                {" "}
                <i class="fas fa-calendar-alt"></i>Fecha de nacimiento
              </h3>
              <p className="content-dbVotantes__parapraph">
                {new Date(votante.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
            <div className="content-dbVotantes_cart">
              <h3 className="content-dbVotantes__title">
                {" "}
                <i class="fas fa-calendar-alt"></i>Fecha de entrada
              </h3>
              <p className="content-dbVotantes__parapraph">
                {new Date(votante.dateOfEntry).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await getData(`votante/${id}`);
  return {
    props: { votante: res.votante },
  };
}
