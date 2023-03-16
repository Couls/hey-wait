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
    // Allow movement out of the tile without triggering if you start your movement inside the tile
    if (tokenX1 >= tileX1 && tokenX1 <= tileX2 && tokenY1 >= tileY1 && tokenY1 <= tileY2 && tile.flags['hey-wait']?.unlimited) {
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
    const intersectionPoints = [];

    if (tokenRay.intersectSegment([
      tileX1,
      tileY1,
      tileX2,
      tileY1,
    ])) {
      intersectionPoints.push(tokenRay.intersectSegment([
        tileX1,
        tileY1,
        tileX2,
        tileY1,
      ]));
    }
    if (tokenRay.intersectSegment([
      tileX2,
      tileY1,
      tileX2,
      tileY2,
    ])) {
      intersectionPoints.push(tokenRay.intersectSegment([
        tileX2,
        tileY1,
        tileX2,
        tileY2,
      ]));
    }
    if (tokenRay.intersectSegment([
      tileX2,
      tileY2,
      tileX1,
      tileY2,
    ])) {
      intersectionPoints.push(tokenRay.intersectSegment([
        tileX2,
        tileY2,
        tileX1,
        tileY2,
      ]));
    }
    if (tokenRay.intersectSegment([
      tileX1,
      tileY2,
      tileX1,
      tileY1,
    ])) {
      intersectionPoints.push(tokenRay.intersectSegment([
        tileX1,
        tileY2,
        tileX1,
        tileY1,
      ]));
    }
    if (!intersectionPoints.length) return false;
    // 4. Find the intersection point nearest to the token's initial position.
    let nearestIntersectionPoint = null;
    let nearestIntersectionDistanceSquared = Infinity;
    for (const intersectionPoint of intersectionPoints) {
      const distanceSquared = (intersectionPoint.x - tokenX1) ** 2
      + (intersectionPoint.y - tokenY1) ** 2;
      if (distanceSquared < nearestIntersectionDistanceSquared) {
        nearestIntersectionPoint = intersectionPoint;
        nearestIntersectionDistanceSquared = distanceSquared;
      }
    }
    // if we start right of the tile, nudge final position left
    if (tokenX1 > tileX2) {
      nearestIntersectionPoint.x -= global.canvas.grid.size;
    }
    // if we start below the tile, nudge final position up
    if (tokenY1 > tileY2) {
      nearestIntersectionPoint.y -= global.canvas.grid.size;
    }
    // snap to nearest point near intersection
    const finalintersectionpoint = global.canvas.grid.getSnappedPosition(
      nearestIntersectionPoint.x, nearestIntersectionPoint.y,
    );
    token.document.update({ x: finalintersectionpoint.x, y: finalintersectionpoint.y });

    return true;
  }
}
