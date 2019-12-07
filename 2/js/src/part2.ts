import { createInterface } from "readline";
import { createReadStream } from "fs";

const run = (memory: number[]) => {
  let programCounter: number = 0;

  while (true) {
    if (memory[programCounter] == 99) {
      return memory;
    }

    const operator = memory[programCounter];
    const operand1Addr = memory[programCounter + 1];
    const operand2Addr = memory[programCounter + 2];
    const resultAddr = memory[programCounter + 3];

    switch (operator) {
      case 1:
        memory[resultAddr] = memory[operand1Addr] + memory[operand2Addr];
        break;
      case 2:
        memory[resultAddr] = memory[operand1Addr] * memory[operand2Addr];
        break;
      default:
        throw Error(
          "Invalid operator " +
            memory[programCounter].toString() +
            " at position " +
            programCounter.toString()
        );
    }
    programCounter += 4;
  }
};

createInterface(createReadStream(process.argv[2])).on("line", l => {
  const initialMemory = l.split(",").map(s => parseInt(s));

  for (let noun = 0; noun <= 99; noun++) {
    for (let verb = 0; verb <= 99; verb++) {
      const thisMemory = initialMemory.slice();
      thisMemory[1] = noun;
      thisMemory[2] = verb;

      if (run(thisMemory)[0] == 19690720) {
        console.log(100 * noun + verb);
        return;
      }
    }
  }
});
