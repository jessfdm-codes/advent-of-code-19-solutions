import { createReadStream } from "fs";
import { createInterface } from "readline";

const mass = (m: number) => {
  const required = Math.floor(m / 3) - 2;
  return required <= 0 ? 0 : required + mass(required);
};

// To meet requirement of adding all up at the end I define the modules as an array:
let f: number[] = [];

createInterface(createReadStream(process.argv[2]))
  .on("line", l => f.push(mass(Number.parseInt(l))))
  .on("close", () => {
    console.log(f.reduce((p, c) => p + c, 0));
  });

/*
The solution can be made fully recursive with the following implementation:
let f : number = 0;

createInterface(createReadStream(process.argv[2]))
  .on("line", l => (f += mass(Number.parseInt(l))))
  .on("close", () => {
    console.log(f);
  });
 */
