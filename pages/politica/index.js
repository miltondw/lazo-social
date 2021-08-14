import { useState } from "react";
import { getData } from "../../utils/fetchData";
import Head from "next/head";
import VotanteItem from "../../components/VotanteItem/VotanteItem";
export default function Politica(props) {
  const [votantes, setVotantes] = useState(props.votantes);
  return (
    <div className="home_page">
      <Head>
        <title>Software Político</title>
      </Head>
      <div className="products">
        {votantes.length === 0 ? (
          <h2>No hay Votante</h2>
        ) : (
          votantes.map((votante) => (
            <VotanteItem key={votante._id} votante={votante} />
          ))
        )}
      </div>
    </div>
  );
}
export async function getServerSideProps() {
  const res = await getData("votante");
  return {
    props: {
      votantes: res.votantes,
      result: res.result,
    },
  };
}
