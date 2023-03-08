/* global Ray */

/**
 * A class to determine collision between relevant Entitys.
 */
export default class Collision {
  /**
   * Collision constructor.
   *
   * @param {number} gridSize
   *   The grid size of the canvas for our calculations.
   */
  constructor(gridSize) {
    this.gridSize = gridSize;
  }

  /**
   * Check if a Tile and a Token collide.
   *
   * @param {Tile} tile
   *   The Tile to check.
   * @param {Token} token
   *   The Token to check.
   * @param {x,y} initTokenPos
   *   The initial position of the Token before it was updated. X and Y values.
   *
   * @return {boolean}
   *   If the Tile and Token collide.
   */
  checkTileTokenCollision(tile, token, initTokenPos) {
    // 1. Get all the tile's vertices. X and Y are position at top-left corner
    // of tile.
    const tileX1 = tile.x;
    const tileY1 = tile.y;
    const tileX2 = tile.x + tile.width;
    const tileY2 = tile.y + tile.height;
    const tokenCanvasWidth = token.document.width * this.gridSize;
    const tokenCanvasHeight = token.document.height * this.gridSize;

    const tokenX1 = initTokenPos.x + (tokenCanvasWidth / 2);
    const tokenY1 = initTokenPos.y + (tokenCanvasHeight / 2);
    // Allow movement out of the tile without triggering it if you start the movement inside the tile
    if (initTokenPos.x === tileX1 && initTokenPos.y === tileY1 && tile.flags['hey-wait']?.unlimited) {
      return false;
    }
    const tokenX2 = token.document.x + (tokenCanvasWidth / 2);
    const tokenY2 = token.document.y + (tokenCanvasHeight / 2);
    // 2. Create a new Ray for the token, from its starting position to its
    // destination.
    const tokenRay = new Ray(
      {
        x: tokenX1,
        y: tokenY1,
      },
      {
        x: tokenX2,
        y: tokenY2,
      },
    );

    // 3. Create four intersection checks, one for each line making up the
    // tile rectangle. If any of these pass, that means it has intersected at
    // some point.
    return Boolean(tokenRay.intersectSegment([
      tileX1,
      tileY1,
      tileX2,
      tileY1,
    ]))
      || Boolean(tokenRay.intersectSegment([
        tileX2,
        tileY1,
        tileX2,
        tileY2,
      ]))
      || Boolean(tokenRay.intersectSegment([
        tileX2,
        tileY2,
        tileX1,
        tileY2,
      ]))
      || Boolean(tokenRay.intersectSegment([
        tileX1,
        tileY2,
        tileX1,
        tileY1,
      ]));
  }
}
