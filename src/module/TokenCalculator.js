/**
 * A class for calculations relating to Tokens.
 */
export default class TokenCalculator {
  /**
   * Calculate the center coordinates of the Token in the Scene.
   * @param {Scene} scene
   *   The relevant Scene.
   * @param {Token} token
   *   The relevant Token.
   *
   * @return {x,y}
   *   The final X and Y coordinates.
   */
  calculateCoordinates(scene, token) {
    const coords = {};

    // In order to "center" our numbers, we'll need to get the in-between
    // based on the grid size.
    const gridSize = Number(scene.grid.size);
    const width = Number(token.document.width) * gridSize;
    const height = Number(token.document.height) * gridSize;

    // Take into account the width of the token - some may be larger than 1.
    coords.x = Math.round(
      token.x + (width / 2),
    );
    coords.y = Math.round(
      token.y + (height / 2),
    );

    return coords;
  }
}
