import { createInterface } from "readline";
import { createReadStream } from "fs";
import { isNumber } from "util";

const run = async (memory: number[]) => {
  let programCounter: number = 0;

  while (true) {
    if (memory[programCounter] == 99) {
      // HALT
      return memory;
    }

    const resolveOperand = (mode: number, operand: number): number => {
      if (mode === 0 || mode === undefined) {
        //Position Mode
        return memory[operand];
      } else if (mode === 1) {
        //Immediate Mode
        return operand;
      } else {
        throw new Error("Invalid Parameter Mode: " + mode);
      }
    };

    const operator = memory[programCounter] % 100;
    const modeArr: number[] = Math.floor(memory[programCounter] / 100)
      .toString()
      .split("")
      .map(s => parseInt(s))
      .reverse();
    let pcIncr: number;

    switch (operator) {
      case 1:
        // ADD
        memory[memory[programCounter + 3]] =
          resolveOperand(modeArr[0], memory[programCounter + 1]) +
          resolveOperand(modeArr[1], memory[programCounter + 2]);
        pcIncr = 4;
        break;
      case 2:
        // MULTIPLY
        memory[memory[programCounter + 3]] =
          resolveOperand(modeArr[0], memory[programCounter + 1]) *
          resolveOperand(modeArr[1], memory[programCounter + 2]);
        pcIncr = 4;
        break;
      case 3:
        const input = await getInput();
        if (!Number.isInteger(parseInt(input.trim()))) {
          throw new Error(`Input ${input} is not an integer`);
        }
        memory[memory[programCounter + 1]] = parseInt(input.trim());
        pcIncr = 2;
        break;
      case 4:
        console.log(resolveOperand(modeArr[0], memory[programCounter + 1]));
        pcIncr = 2;
        break;
      default:
        throw Error(
          "Invalid operator " +
            memory[programCounter].toString() +
            " at position " +
            programCounter.toString()
        );
    }
    programCounter += pcIncr;
  }
};

const getInput = async (): Promise<string> => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  rl.setPrompt("IN:");
  rl.prompt();
  for await (const l of rl) {
    rl.close();
    return l;
  }
};

createInterface(createReadStream(process.argv[2])).on("line", l => {
  run(l.split(",").map(s => parseInt(s)))
    .then(finalMem => console.log("FINAL MEMORY DUMP:\n" + finalMem.toString()))
    .catch(e => console.error(e));
});
