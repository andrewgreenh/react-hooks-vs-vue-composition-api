import React, { useEffect, useState } from "react";
import { getInfo } from "../server/apiClient";
import { PokemonInfo } from "../server/db";

export function Search(props: {
  onAdd: (name: string) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [info, setInfo] = useState(
    null as null | PokemonInfo
  );

  useEffect(() => {
    setInfo(null);
    if (searchValue.length < 3) return;

    let cancelled = false;
    getInfo(searchValue).then(info => {
      if (cancelled) return;
      setInfo(info);
    });

    return () => {
      cancelled = true;
    };
  }, [searchValue]);

  return (
    <div className="search">
      <h2>Search Pokemon</h2>

      <input
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
      />
    </div>
  );
}
