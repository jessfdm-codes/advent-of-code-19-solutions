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

  const atLeastOneInstanceOfExactlyTwoDigitsEqual: restriction = n => {
    /* While this does not check for digits next to each other, 
      when combined with neverDecreaseRestriction, 
      it will only be able to count adjacent digits of the same 
      type since they can't decrease, only go up (and not be able 
      to return back down) or stay the same (causing an additional 
      adjacency). */

    const nStr = n.toString();
    const adjacentMatrix: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let last = -1;

    for (let i = 0; i < nStr.length; i++) {
      const curr = parseInt(nStr[i]);
      adjacentMatrix[curr]++;
      last = curr;
    }

    return adjacentMatrix.filter(r => r === 2).length > 0;
  };

  console.log(
    findAll(len, [
      minRestriction,
      maxRestriction,
      neverDecreaseRestriction,
      atLeastOneInstanceOfExactlyTwoDigitsEqual
    ]).length
  );
});
