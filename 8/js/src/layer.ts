export default class Layer {
  public readonly w: number;
  public readonly h: number;

  private matrix: number[][];

  public getPixel = (x: number, y: number): number => {
    return this.matrix[y][x];
  };

  constructor(w: number, h: number, data: number[]) {
    this.w = w;
    this.h = h;

    if (data.length != w * h) {
      throw Error(
        `Data does not fit into layer dimensions. Width: ${w} Height: ${h} Size: ${data.length}`
      );
    }

    this.matrix = [];

    for (let i = 0; i < data.length; i++) {
      let pixelOnLine = i % w;
      let lineIdx = Math.floor(i / w);

      if (pixelOnLine === 0) {
        this.matrix.push([]);
      }

      this.matrix[lineIdx].push(data[i]);
    }
  }
}
