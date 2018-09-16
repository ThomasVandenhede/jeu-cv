class Tilemap {
  constructor() {
    this.rows = 100;
    this.columns = 100;
    this.tileSize = 40;

    this.data = {
      tiles: [
        {
          row: -20,
          column: 0,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -20,
          column: 1,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -20,
          column: 2,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -20,
          column: 3,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -20,
          column: 3,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -20,
          column: 4,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -21,
          column: 4,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -21,
          column: 5,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -21,
          column: 6,
          src: "./assets/images/smoke1.png"
        },
        {
          row: -21,
          column: 7,
          src: "./assets/images/smoke1.png"
        },
        {
          row: -21,
          column: 8,
          src: "./assets/images/smoke1.png"
        },
        {
          row: -21,
          column: 9,
          src: "./assets/images/smoke2.png"
        },
        {
          row: -21,
          column: 10,
          src: "./assets/images/bootstrap-logo.png"
        },
        {
          row: -20,
          column: 10,
          src: "./assets/images/bootstrap-logo.png"
        },
        {
          row: -19,
          column: 10,
          src: "./assets/images/bootstrap-logo.png"
        },
        {
          row: -18,
          column: 10,
          src: "./assets/images/smoke2.png"
        }
      ]
    };
    this.tiles = [];
    for (var tileData of this.data.tiles) {
      var x = this.tileSize * tileData.column;
      var y = this.tileSize * tileData.row;
      var tile = new Tile(x, y, this.tileSize, tileData.src);
      this.tiles.push(tile);
    }
  }

  draw(ctx, camera) {
    this.tiles.forEach(tile => tile.draw(ctx, camera));
  }
}
