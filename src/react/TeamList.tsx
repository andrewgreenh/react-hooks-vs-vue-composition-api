import React from "react";
import { Search } from "./Search";

export function TeamList(props: {
  names: string[];
  onSelect: (name: string) => void;
}) {
  return (
    <div className="page">
      <h1>My Pokemon Team</h1>
      <ul className="team-list">
        {props.names.map(name => (
          <li key={name}>
            <span className="name">{name}</span>
            <span className="remove">remove</span>
          </li>
        ))}
      </ul>
      <Search onAdd={name => console.log(name)} />
    </div>
  );
}
