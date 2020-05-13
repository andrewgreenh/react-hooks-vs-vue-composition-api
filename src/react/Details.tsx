import React from "react";
import {
  getMemberDetails,
  updateTeamMember
} from "../server/apiClient";
import { useBoolean, useInput } from "./base-hooks";
import { Image } from "./Image";
import { useAsync } from "./useAsync";

export function Details(props: {
  name: string;
  onBack: () => void;
}) {
  const { name, onBack } = props;

  const loading = useBoolean();

  const data = useAsync(
    "details",
    [name],
    getMemberDetails,
    { suspense: true }
  );

  const nickname = useInput(data.data?.nickname);
  const comment = useInput(data.data?.comment);

  return (
    <div>
      <div className="details-header">
        <h1>
          Details for {name} (#{data.data?.number})
        </h1>
        <span className="link" onClick={onBack}>
          back
        </span>
      </div>
      <form
        className="details-form"
        onSubmit={e => {
          e.preventDefault();

          loading.set(true);
          updateTeamMember({
            name,
            comment: comment.value,
            nickname: nickname.value
          })
            .then(data.refetch)
            .then(() => {
              loading.set(false);
            });
        }}
      >
        <Image src={data.data!.img} />
        <label>Nickname</label>
        <input {...nickname} />
        <br />
        <label>Comment</label>
        <input {...comment} />
        <br />
        <button disabled={loading.value}>
          {loading.value ? "Loading" : "Save"}
        </button>
      </form>
    </div>
  );
}
