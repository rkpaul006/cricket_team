const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
let db = null;
const dbpath = path.join(__dirname, "cricketTeam.db");
const app = express();

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`DB error : ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.get("/players/", async (request, response) => {
  const getPLayerQuery = `SELECT * FROM cricket_team ORDER by player_id`;
  const playersArray = await db.all(getPlayerQuery);
  response.send(playersArray);
});
module.exports = app;

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayer = `INSERT INTO 
    cricket_team ( playerName, jerseyNumber, role)
    VALUES (
        ${playerName},
        ${jerseyNumber}
        ${role}
        );`;
  const playerResponse = await db.run(addPlayer);
  const playerId = playerResponse.lastID;
  response.send({ playerId: playerId });
});
module.exports = app;

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerId = `SELECT * FROM cricket_team ORDER by player_id = ${playerId};`;
  const playerArray = await db.get(getPlayerId);
  response.send(playerArray);
});
module.exports = app;

app.put("/players/:playerId/", async (request, response) => {
  const playerDetails = request.body;
  const { playerId } = request.params;
  const { PlayerName, jerseyNumber, role } = playerDetails;
  const updatePlayer = ` 
    UPDATE 
    cricket_team
    SET 
    PlayerName = ${PlayerName},
    jerseyNumber = ${jerseyNumber},
    role = ${role}
    WHERE 
    playerId = ${playerId};`;
  await db.run(updatePlayer);
  response.send("Player Updated Successfully");
});

module.exports = app;

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
  DELETE FROM cricket_team WHERE playerId = ${playerId};`;
  await db.run(deletePlayer);
  response.send("player Removed");
});

module.exports = app;
