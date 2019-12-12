import { createInterface } from "readline";
import { createReadStream } from "fs";
import Layer from "./layer";

const flattenLayers = (layers: Layer[]): Layer => {
  const finalImageData: number[] = [];
  const w = layers[0].w;
  const h = layers[0].h;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (let l = 0; l < layers.length; l++) {
        const pix = layers[l].getPixel(x, y);
        finalImageData[w * y + x] = pix;
        if (pix != 2) {
          break;
        }
      }
    }
  }

  return new Layer(w, h, finalImageData);
};

const renderLayer = (layer: Layer): void => {
  for (let y = 0; y < layer.h; y++) {
    for (let x = 0; x < layer.w; x++) {
      process.stdout.write(layer.getPixel(x, y) == 1 ? "█" : " ");
    }
    process.stdout.write("\n");
  }
};

createInterface(createReadStream(process.argv[2])).on("line", line => {
  const w = 25;
  const h = 6;
  const layerLength = h * w;
  const layerDataFrames: number[][] = [];

  line
    .split("")
    .map(s => parseInt(s))
    .forEach((val, idx) => {
      const layerNo = Math.floor(idx / layerLength);
      const idxInLayer = idx % layerLength;

      if (idxInLayer === 0) {
        layerDataFrames[layerNo] = [];
      }

      layerDataFrames[layerNo][idxInLayer] = val;
    });

  const importedLayers: Layer[] = layerDataFrames.map(
    df => new Layer(w, h, df)
  );

  const finalImage: Layer = flattenLayers(importedLayers);

  renderLayer(finalImage);
});
