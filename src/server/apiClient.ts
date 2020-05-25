import { DBPokemonData, PokemonData, PokemonInfo } from "./db";

const apiOrigin = "http://localhost:3001";

export async function getTeamNames(): Promise<string[]> {
  return fetch(apiOrigin + "/team").then(x => x.json());
}

export async function addToTeam(name: string) {
  return fetch(apiOrigin + "/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  }).then(x => undefined);
}

export async function getMemberDetails(name: string): Promise<PokemonData> {
  await new Promise(r => setTimeout(r, 2000));
  return fetch(apiOrigin + "/team/" + name).then(x => x.json());
}

export async function removeFromTeam(name: string) {
  return fetch(apiOrigin + "/team/" + name, {
    method: "DELETE"
  }).then(x => undefined);
}

export async function updateTeamMember(
  updates: Partial<Omit<DBPokemonData, "name">> & {
    name: string;
  }
) {
  return fetch(apiOrigin + "/team/" + updates.name, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates)
  }).then(x => undefined);
}

export async function getInfo(name: string): Promise<PokemonInfo> {
  return fetch(apiOrigin + "/poke-info/" + name.toLowerCase(), {
    method: "GET"
  })
    .then(x => x.json())
    .then(r => {
      if (r === null) {
        throw new Error(`No Pokemon with name ${name} found.`);
      }
      return r;
    });
}
