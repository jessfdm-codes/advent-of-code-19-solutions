import { createInterface } from "readline";
import { createReadStream } from "fs";

type layerHist = { [color: number]: number };

createInterface(createReadStream(process.argv[2])).on("line", line => {
  const input: number[] = line.split("").map(s => parseInt(s));

  const w: number = 25,
    h: number = 6,
    layerSize = w * h;

  let zerosInLayerWithFewestZeros = Infinity;
  let layerWithFewestZeros: layerHist;

  for (let l = 0; l < input.length / layerSize; l++) {
    const layer: layerHist = {};
    for (let pix = 0; pix < layerSize; pix++) {
      const pixColor = input[l * layerSize + pix];
      layer[pixColor] = layer[pixColor] + 1 || 1;
    }
    if (layer[0] < zerosInLayerWithFewestZeros) {
      layerWithFewestZeros = layer;
      zerosInLayerWithFewestZeros = layer[0];
    }
  }
  console.dir(layerWithFewestZeros);
  console.log(layerWithFewestZeros[1] * layerWithFewestZeros[2]);
});
