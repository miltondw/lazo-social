import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import filterSearch from "../../utils/filterSearch";
import { getData } from "../../utils/fetchData";
export default function Filter({ state }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState(""); 
  const [club, setClub] = useState("");

  const { clubs } = state;
  const handleClub = (e) => {
    setClub(e.target.value);
    filterSearch({ router, club: e.target.value });
  };
  const handleSort = (e) => {
    setSort(e.target.value);
    filterSearch({ router, sort: e.target.value });
  };
  useEffect(() => {
    filterSearch({ router, search: search ? search : "all" });
  }, [search]);
  const router = useRouter();
  return (
    <div className="input-group">
      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          className="form-select text-capitalize"
          value={club}
          onChange={handleClub}
        >
          <option value="all">Todos los Clubs</option>

          {clubs.map((item) => (
            <option key={item._id} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <form autoComplete="off" className="mt-2 col-md-8 px-0">
        <input
          type="text"
          className="form-control"
          list="title_votante"
          value={search.toLowerCase()}
          onChange={(e) => setSearch(e.target.value)}
        />
      </form>

      <div className="input-group-prepend col-md-2 px-0 mt-2">
        <select
          className="form-select text-capitalize"
          value={sort}
          onChange={handleSort}
        >
          <option value="-createdAt">Nuevos</option>
          <option value="oldest">Antiguos</option>
          {/* <option value="-sold">Best sales</option>
          <option value="-price">Price: Hight-Low</option>
          <option value="price">Price: Low-Hight</option> */}
        </select>
      </div>
    </div>
  );
}
