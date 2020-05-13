import React, { useEffect, useState } from "react";
import { getTeamNames } from "../server/apiClient";
import { Details } from "./Details";
import { TeamList } from "./TeamList";

export function App() {
  const [members, setMembers] = useState([] as string[]);

  useEffect(() => {
    getTeamNames().then(names => setMembers(names));
  }, []);

  return (
    <>
      <TeamList
        names={members}
        onSelect={name => console.log(name)}
      ></TeamList>
      <Details></Details>
    </>
  );
}
