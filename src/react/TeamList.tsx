import React from "react";
import { Search } from "./Search";

export function TeamList(props: {
  names: string[];
  onSelect: (name: string) => void;
  onRemove: (name: string) => void;
  onAdd: (name: string) => void;
}) {
  return (
    <div>
      <h1>My Pokemon Team</h1>
      <ul className="team-list">
        {props.names.map(name => (
          <li key={name}>
            <span className="link" onClick={() => props.onSelect(name)}>
              {name}
            </span>
            <span className="link" onClick={() => props.onRemove(name)}>
              remove
            </span>
          </li>
        ))}
      </ul>
      <Search onAdd={props.onAdd} />
    </div>
  );
}
