import { createInterface } from "readline";
import { createReadStream } from "fs";

type restriction = (input: number) => boolean;

const findAll = (length: number, restrictions: restriction[]): number[] => {
  const okayPasswords: number[] = [];
  for (let i = Math.pow(10, length - 1); i < Math.pow(10, length); i++) {
    let okay: boolean = true;
    // Apply all restrictions
    restrictions.forEach(r => {
      if (!r(i)) {
        okay = false;
      }
    });

    if (okay) {
      okayPasswords.push(i);
    }
  }
  return okayPasswords;
};

createInterface(createReadStream(process.argv[2])).on("line", l => {
  const minRestriction: restriction = n => n >= parseInt(l.split("-")[0]);
  const maxRestriction: restriction = n => n <= parseInt(l.split("-")[1]);
  const len = 6;

  const neverDecreaseRestriction: restriction = n => {
    const nStr = n.toString();
    let floor = 0;

    for (let i = 0; i < nStr.length; i++) {
      const digit = parseInt(nStr[i]);
      if (digit >= floor) {
        floor = digit;
      } else {
        return false;
      }
    }

    return true;
  };

  const atLeastTwoAdjacentEqual: restriction = n => {
    const nStr = n.toString();
    let last = "";

    for (let i = 0; i < nStr.length; i++) {
      const curr = nStr[i];
      if (curr == last) {
        return true;
      }
      last = curr;
    }

    return false;
  };

  console.log(
    findAll(len, [
      minRestriction,
      maxRestriction,
      neverDecreaseRestriction,
      atLeastTwoAdjacentEqual
    ]).length
  );
});
