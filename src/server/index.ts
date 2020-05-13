import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { init } from "./db";

async function main() {
  const app = express();
  const db = await init();

  app.use(cors());
  app.options("*", cors());
  app.use(bodyParser.json());

  app.get("/team", async (req, res) => {
    const team = await db.getTeam();

    const teamNames = await Promise.all(
      team.map(p => p.name)
    );

    res.send(teamNames);
  });

  app.post("/team", async (req, res) => {
    const name = req.body.name;
    if (typeof name !== "string") {
      return res.sendStatus(400);
    }

    await db.addToTeam(name);
    res.sendStatus(200);
  });

  app.put("/team/:name", async (req, res) => {
    const updates = req.body;
    const name = updates.name;
    if (
      typeof updates !== "object" ||
      typeof name !== "string"
    ) {
      return res.sendStatus(400);
    }

    await db.updateMember(updates);
    res.sendStatus(200);
  });

  app.get("/team/:name", async (req, res) => {
    const name = req.params.name;

    const member = await db.getMember(name);

    if (!member) {
      return res.send(JSON.stringify(null));
    }

    const info = await db.getInfo(req.params.name);

    res.send({
      ...info,
      ...member
    });
  });

  app.delete("/team/:name", async (req, res) => {
    await db.removeFromTeam(req.params.name);
    res.sendStatus(200);
  });

  app.get("/poke-info/:name", async (req, res) => {
    const info = await db.getInfo(req.params.name);
    if (!info) {
      res.setHeader("Content-Type", "application/json");
      return res.send(JSON.stringify(null));
    }
    res.send(info);
  });

  app.listen(3001, () =>
    console.log("Server running at http://localhost:3001")
  );
}

main().catch(err => {
  console.error(err);
});
