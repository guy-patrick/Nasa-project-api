const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

const parser = parse({
  comment: "#",
  columns: true,
});

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(parser)
      .on("data", (planetObj) => {
        if (isHabitablePlanet(planetObj)) {
          habitablePlanets.push(planetObj);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", (end) => {
        console.log(`${habitablePlanets.length} habitable planets`);
        resolve();
      });
  });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
