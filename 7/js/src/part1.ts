import { createInterface } from "readline";
import { createReadStream } from "fs";
import { isNumber } from "util";

const run = (memory: number[], inputs: number[]): number[] => {
  let programCounter: number = 0;
  const outputs: number[] = [];

  while (true) {
    if (memory[programCounter] == 99) {
      // HALT
      return outputs;
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

    switch (operator) {
      case 1:
        // ADD
        memory[memory[programCounter + 3]] =
          resolveOperand(modeArr[0], memory[programCounter + 1]) +
          resolveOperand(modeArr[1], memory[programCounter + 2]);
        programCounter += 4;
        break;
      case 2:
        // MULTIPLY
        memory[memory[programCounter + 3]] =
          resolveOperand(modeArr[0], memory[programCounter + 1]) *
          resolveOperand(modeArr[1], memory[programCounter + 2]);
        programCounter += 4;
        break;
      case 3:
        const input = inputs.shift();
        memory[memory[programCounter + 1]] = input;
        programCounter += 2;
        break;
      case 4:
        outputs.push(resolveOperand(modeArr[0], memory[programCounter + 1]));
        programCounter += 2;
        break;
      case 5:
        //JumpIfTrue
        if (resolveOperand(modeArr[0], memory[programCounter + 1]) != 0) {
          //Jump
          programCounter = resolveOperand(
            modeArr[1],
            memory[programCounter + 2]
          );
        } else {
          programCounter += 3;
        }
        break;
      case 6:
        //JumpIfFalse
        if (resolveOperand(modeArr[0], memory[programCounter + 1]) == 0) {
          //Jump
          programCounter = resolveOperand(
            modeArr[1],
            memory[programCounter + 2]
          );
        } else {
          programCounter += 3;
        }
        break;
      case 7:
        //LessThan
        const isLT =
          resolveOperand(modeArr[0], memory[programCounter + 1]) <
          resolveOperand(modeArr[1], memory[programCounter + 2])
            ? 1
            : 0;
        memory[memory[programCounter + 3]] = isLT;
        programCounter += 4;
        break;
      case 8:
        //Equals
        const isEq =
          resolveOperand(modeArr[0], memory[programCounter + 1]) ===
          resolveOperand(modeArr[1], memory[programCounter + 2])
            ? 1
            : 0;
        memory[memory[programCounter + 3]] = isEq;
        programCounter += 4;
        break;
      default:
        throw Error(
          "Invalid operator " +
            memory[programCounter].toString() +
            " at position " +
            programCounter.toString()
        );
    }
  }
};

const runAgainstConfiguration = (
  config: number[],
  program: number[]
): number => {
  let lastOutput = 0;
  for (let i = 0; i < config.length; i++) {
    lastOutput = run(program.slice(), [config[i], lastOutput])[0];
  }
  return lastOutput;
};

createInterface(createReadStream(process.argv[2])).on("line", l => {
  const program = l.split(",").map(s => parseInt(s));
  const results: [number[], number][] = [];
  heaps([0, 1, 2, 3, 4], 5, p => {
    results.push([p, runAgainstConfiguration(p, program.slice())]);
  });

  console.log(results.join("\n"));

  console.log(
    "=-=-=-=-=-=-=-=-=\n" +
      results.reduce((prev, curr) => (prev[1] < curr[1] ? curr : prev))
  );
});

//Heap's Algorithm
const heaps = (
  arr: number[],
  n: number,
  outputFunc: (permutation: number[]) => void
) => {
  if (n === 1) {
    outputFunc(arr);
  } else {
    for (let i = 0; i <= n - 1; i++) {
      heaps(arr, n - 1, outputFunc);
      if (n % 2 === 0) {
        idxSwap(arr, i, n - 1);
      } else {
        idxSwap(arr, 0, n - 1);
      }
    }
  }
};

const idxSwap = (arr: number[], i: number, j: number): number[] => {
  const t = arr[i];
  arr[i] = arr[j];
  arr[j] = t;
  return arr;
};
