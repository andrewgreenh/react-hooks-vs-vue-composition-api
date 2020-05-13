import React from "react";
import { getMemberDetails } from "../server/apiClient";
import { useAsync } from "./useAsync";

export function Details(props: {
  name: string;
  onBack: () => void;
}) {
  const data = useAsync(
    "details",
    [props.name],
    getMemberDetails,
    { suspense: true }
  );
  return (
    <div className="page">
      <h1>
        Details{" "}
        <span className="link" onClick={props.onBack}>
          back
        </span>
      </h1>
    </div>
  );
}
