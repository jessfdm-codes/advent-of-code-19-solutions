import { createInterface } from "readline";
import { createReadStream } from "fs";

const run = (memory: number[], inputs: number[]): number[] => {
  let programCounter: number = 0;
  const outputs: number[] = [];
  let relativeBase = 0;

  const resolveOperand = (mode: number, operand: number): number => {
    let ret: number;
    if (mode === 0 || mode === undefined) {
      //Position Mode
      ret = memory[operand];
    } else if (mode === 1) {
      //Immediate Mode
      ret = operand;
    } else if (mode === 2) {
      ret = memory[operand + relativeBase];
    } else {
      throw new Error("Invalid Parameter Mode: " + mode);
    }
    if (ret === undefined) {
      return 0;
    }
    return ret;
  };

  const write = (mode: number, addr: number, val: number) => {
    switch (mode) {
      case 0:
      case undefined:
        //Position
        memory[memory[addr]] = val;
        break;
      case 2:
        //Relative
        memory[memory[addr] + relativeBase] = val;
        break;
      default:
        throw Error("Unsupported write mode " + mode);
    }
  };

  while (true) {
    if (memory[programCounter] == 99) {
      // HALT
      return outputs;
    }

    const operator = memory[programCounter] % 100;
    const modeArr: number[] = Math.floor(memory[programCounter] / 100)
      .toString()
      .split("")
      .map(s => parseInt(s))
      .reverse();

    switch (operator) {
      case 1:
        // ADD
        const val_add =
          resolveOperand(modeArr[0], memory[programCounter + 1]) +
          resolveOperand(modeArr[1], memory[programCounter + 2]);
        write(modeArr[2], programCounter + 3, val_add);
        programCounter += 4;
        break;
      case 2:
        // MULTIPLY
        const val_mul =
          resolveOperand(modeArr[0], memory[programCounter + 1]) *
          resolveOperand(modeArr[1], memory[programCounter + 2]);

        write(modeArr[2], programCounter + 3, val_mul);
        programCounter += 4;
        break;
      case 3:
        const val_in = inputs.shift();
        write(modeArr[0], programCounter + 1, val_in);
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
        const val_isLT =
          resolveOperand(modeArr[0], memory[programCounter + 1]) <
          resolveOperand(modeArr[1], memory[programCounter + 2])
            ? 1
            : 0;
        write(modeArr[2], programCounter + 3, val_isLT);
        programCounter += 4;
        break;
      case 8:
        //Equals
        const val_isEq =
          resolveOperand(modeArr[0], memory[programCounter + 1]) ===
          resolveOperand(modeArr[1], memory[programCounter + 2])
            ? 1
            : 0;
        write(modeArr[2], programCounter + 3, val_isEq);
        programCounter += 4;
        break;
      case 9:
        relativeBase += resolveOperand(modeArr[0], memory[programCounter + 1]);
        programCounter += 2;
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

createInterface(createReadStream(process.argv[2])).on("line", l => {
  const program = l.split(",").map(s => parseInt(s));
  console.log(run(program, [1]));
});
