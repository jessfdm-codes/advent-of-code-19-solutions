import { createReadStream } from "fs";
import { createInterface } from "readline";

const mass = (m: number) => {
  return Math.floor(m / 3) - 2;
};

let f = 0;

createInterface(createReadStream(process.argv[2]))
  .on("line", l => (f += mass(Number.parseInt(l))))
  .on("close", () => {
    console.log(f);
  });
