import { createInterface } from "readline";
import { createReadStream } from "fs";

type map = boolean[][];
type coords = [number, number];
const coordsEq = (a: coords, b: coords): boolean => {
  return a[0] === b[0] && a[1] === b[1];
};

const parseMap = (embeddedMap: string): [map, coords[]] => {
  const lines = embeddedMap.split("\n").reverse();

  const coordsList: coords[] = [];
  let map: map = Array(lines[0].length).fill([]);

  //Assumption: Map is well formatted with all lines equal length

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] === "#") {
        map[x][y] = true;
        coordsList.push([x, y]);
      } else {
        map[x][y] = false;
      }
    }
  }

  return [map, coordsList];
};

let wholeInput: string = "";

createInterface(createReadStream(process.argv[2]))
  .on("line", l => {
    wholeInput += (wholeInput === "" ? "" : "\n") + l;
  })
  .on("close", () => {
    const parsed = parseMap(wholeInput);
    const coordsList = parsed[1];

    const seeCountDir: { [coordsStr: string]: number } = {};

    coordsList.forEach(candidate => {
      let canSeeCount: number = 0;
      coordsList.forEach(observeToCheck => {
        if (coordsEq(candidate, observeToCheck)) {
          return;
        }
        //Create line equation (y = mx + c)
        //Find Gradient
        const m =
          (observeToCheck[1] - candidate[1]) /
          (observeToCheck[0] - candidate[0]); // Change in y over change in x

        //Find y offset
        const c = candidate[1] - m * candidate[0];

        const boxMinX = Math.min(candidate[0], observeToCheck[0]),
          boxMaxX = Math.max(candidate[0], observeToCheck[0]),
          boxMinY = Math.min(candidate[1], observeToCheck[1]),
          boxMaxY = Math.max(candidate[1], observeToCheck[1]);
        let canSee: boolean = true;
        coordsList.forEach(intersectToCheck => {
          if (
            coordsEq(candidate, intersectToCheck) ||
            coordsEq(observeToCheck, intersectToCheck)
          ) {
            return;
          }
          if (
            coordsEq([4, 0], candidate) &&
            coordsEq([4, 2], observeToCheck) &&
            coordsEq([4, 1], intersectToCheck)
          ) {
            debugger;
          }

          let diffC = Math.abs(
            intersectToCheck[1] - m * intersectToCheck[0] - c
          );

          if (
            (diffC <= 0.000000001 ||
              (isNaN(diffC) && intersectToCheck[0] === candidate[0])) &&
            boxMinX <= intersectToCheck[0] &&
            intersectToCheck[0] <= boxMaxX &&
            boxMinY <= intersectToCheck[1] &&
            intersectToCheck[1] <= boxMaxY
          ) {
            canSee = false;
          }
        });

        if (canSee) {
          canSeeCount++;
        }
      });
      seeCountDir[candidate.toString()] = canSeeCount;
    });

    console.log(seeCountDir);
    console.log("=-=-=-=-=-=-=-=-=-=-=-=-=");
    let maxVal = 0;
    Object.keys(seeCountDir).forEach(key => {
      if (seeCountDir[key] > maxVal) {
        maxVal = seeCountDir[key];
      }
    });
    console.log(maxVal);
  });
