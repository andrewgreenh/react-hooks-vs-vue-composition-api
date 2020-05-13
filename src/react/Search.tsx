import React, { useState } from "react";
import { getInfo } from "../server/apiClient";
import { useAsync } from "./useAsync";

export function Search(props: {
  onAdd: (name: string) => void;
}) {
  const [searchValue, setSearchValue] = useState("");

  const infoResult = useAsync(
    "info",
    searchValue.length >= 3 && [searchValue],
    getInfo
  );

  return (
    <div className="search">
      <h2>Search Pokemon</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (infoResult.state !== "done") return;
          props.onAdd(infoResult.data.name);
          setSearchValue("");
        }}
      >
        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />

        {infoResult.state === "done" && (
          <div className="search-info">
            <img src={infoResult.data.img} />
            <button>Add to Team</button>
          </div>
        )}
      </form>
    </div>
  );
}
