import React, {
  Suspense,
  unstable_useTransition,
  useState
} from "react";
import {
  addToTeam,
  getTeamNames,
  removeFromTeam
} from "../server/apiClient";
import { Details } from "./Details";
import { TeamList } from "./TeamList";
import { useAsync } from "./useAsync";

export function App() {
  const membersResult = useAsync(
    "team-names",
    [],
    getTeamNames
  );

  const [selectedMember, setSelectedMember] = useState(
    null as string | null
  );
  const [startTransition] = unstable_useTransition({
    timeoutMs: 5000
  });

  function onRemove(name: string) {
    removeFromTeam(name).then(membersResult.refetch);
  }

  if (selectedMember) {
    return (
      <Suspense fallback={<h1>Details Loading</h1>}>
        <Details
          name={selectedMember}
          onBack={() => setSelectedMember(null)}
        ></Details>
      </Suspense>
    );
  }

  return (
    <>
      <Suspense fallback={<h1>List Loading</h1>}>
        <TeamList
          names={membersResult.data ?? []}
          onSelect={name => {
            startTransition(() => {
              setSelectedMember(name);
            });
          }}
          onAdd={name =>
            addToTeam(name).then(membersResult.refetch)
          }
          onRemove={onRemove}
        ></TeamList>
      </Suspense>
    </>
  );
}
