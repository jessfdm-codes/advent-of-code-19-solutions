import { createInterface } from "readline";
import { createReadStream } from "fs";

type coord = [number, number];
const coordEql = (a: coord, b: coord) => {
  return a[0] == b[0] && a[1] == b[1];
};
type segment = [coord, coord];

//Trace first path

//Recursively trace other path, and in return up call stack append intersections

//Iterate over intersections and find Manhattan Distance

const nearestIntersect = (line1: string[], line2: string[]) => {
  const tracedPath1 = traverse([], line1);
  const tracedPath2 = traverse([], line2);

  console.log("Path 1:" + tracedPath1.length);
  console.log("Path 2:" + tracedPath2.length);

  let lowestManhattanCrossover: coord;
  let lowestManhattanValue = Number.MAX_SAFE_INTEGER;

  for (let i = 0; i < tracedPath1.length; i++) {
    for (let j = 0; j < tracedPath2.length; j++) {
      //console.log(i + " " + j);
      let intersect = checkIntersect(tracedPath1[i], tracedPath2[j]);

      if (intersect !== null) {
        let m = manhattan([0, 0], intersect);
        if (m < lowestManhattanValue && !coordEql([0, 0], intersect)) {
          lowestManhattanCrossover = intersect;
          lowestManhattanValue = m;
        }
      }
    }
  }

  console.log(
    "Point: (" +
      lowestManhattanCrossover[0] +
      "," +
      lowestManhattanCrossover[1] +
      ")"
  );
  console.log("Distance: " + lowestManhattanValue);
};

const checkIntersect = (seg1: segment, seg2: segment): coord => {
  // Check if any segments touch at ends

  if (coordEql(seg1[0], seg2[0])) {
    return seg1[0];
  }

  if (coordEql(seg1[0], seg2[1])) {
    return seg1[0];
  }

  if (coordEql(seg1[1], seg2[0])) {
    return seg1[1];
  }

  if (coordEql(seg1[1], seg2[1])) {
    return seg1[1];
  }

  // Get horizontal
  let horizontal: segment;
  let vertical: segment;
  if (seg1[0][0] != seg1[1][0] && seg2[0][0] == seg2[1][0]) {
    horizontal = seg1;
    vertical = seg2;
  } else if (seg1[0][0] == seg1[1][0] && seg2[0][0] != seg2[1][0]) {
    horizontal = seg2;
    vertical = seg1;
  } else {
    // They are parallel
    return null;
  }

  if (vertical[0][1] < horizontal[0][1] != vertical[1][1] < horizontal[0][1]) {
    if (
      horizontal[0][0] < vertical[0][0] !=
      horizontal[1][0] < vertical[0][0]
    ) {
      return [vertical[0][0], horizontal[0][1]];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const manhattan = (a: coord, b: coord) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
};

const traverse = (
  pathSoFar: segment[],
  remainingInstructions: string[]
): segment[] => {
  let finalPoint: coord;
  // First Case
  if (pathSoFar.length === 0) {
    finalPoint = [0, 0];
  } else {
    finalPoint = pathSoFar[pathSoFar.length - 1][1];
  }

  // --Base case--
  if (remainingInstructions.length === 0) {
    return pathSoFar;
  }

  // --Recursive Case--
  // Next Point
  const nextSegment = resolveDirection(finalPoint, remainingInstructions[0]);

  return traverse(
    pathSoFar.concat([nextSegment]),
    remainingInstructions.slice(1)
  );
};

const resolveDirection = (currPoint: coord, instruction: string): segment => {
  const direction = instruction[0];
  const distance: number = parseInt(instruction.slice(1));

  let newEndPoint: coord;

  switch (direction) {
    case "U":
      newEndPoint = [currPoint[0], currPoint[1] + distance];
      break;
    case "D":
      newEndPoint = [currPoint[0], currPoint[1] - distance];
      break;
    case "L":
      newEndPoint = [currPoint[0] - distance, currPoint[1]];
      break;
    case "R":
      newEndPoint = [currPoint[0] + distance, currPoint[1]];
      break;
  }

  return [currPoint, newEndPoint];
};

const inputLines: string[][] = [];

createInterface(createReadStream(process.argv[2]))
  .on("line", l => {
    inputLines.push(l.split(","));
  })
  .on("close", () => {
    nearestIntersect(inputLines[0], inputLines[1]);
  });
