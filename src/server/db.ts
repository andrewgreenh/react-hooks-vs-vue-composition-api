import { promises as fs } from "fs";
import fetch from "node-fetch";
import path from "path";

export async function init() {
  const dbPath = path.join(__dirname, "db-data.json");
  const dbBuffer = await fs.readFile(dbPath);
  const db = JSON.parse(
    dbBuffer.toString("utf8")
  ) as DBData;

  async function getTeam() {
    return db.team;
  }

  async function addToTeam(name: string) {
    if (db.team.some(p => p.name === name)) {
      return;
    }
    db.team.push({
      name,
      comment: "",
      nickname: ""
    });
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  }

  async function removeFromTeam(name: string) {
    db.team = db.team.filter(p => p.name !== name);
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  }

  async function updateMember(
    updates: Partial<Omit<DBPokemonData, "name">> & {
      name: string;
    }
  ) {
    db.team = db.team.map(p =>
      p.name === updates.name ? { ...p, ...updates } : p
    );
    await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
  }

  async function getInfo(
    name: string
  ): Promise<PokemonInfo | null> {
    const apiRes = await fetch(
      "https://pokeapi.co/api/v2/pokemon/" + name
    );
    if (!apiRes.ok) {
      return null;
    }
    const apiData = await apiRes.json();
    return {
      name: apiData.name,
      number: apiData.order,
      img: apiData.sprites.front_default
    };
  }

  return {
    getTeam,
    addToTeam,
    removeFromTeam,
    updateMember,
    getInfo
  };
}

export type DB = ReturnType<typeof init> extends Promise<
  infer T
>
  ? T
  : never;

export type DBPokemonData = {
  name: string;
  comment: string;
  nickname: string;
};

export type DBData = {
  team: DBPokemonData[];
};

export type PokemonInfo = {
  name: string;
  number: number;
  img: string;
};
export type PokemonData = DBPokemonData & PokemonInfo;
