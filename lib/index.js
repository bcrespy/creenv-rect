import Vector from "@creenv/vector";

class Rectangle {
  /**
   * the rectangle can be constructed by specifying 2 points from opposite
   * corners. the points can be of n-dimensions, the .contains() method will
   * test all the dimensions 
   * 
   * @param {Vector} a the "topleft" point of the rect
   * @param {Vector} b the "bottomright" point of the rect
   */
  constructor (a, b) {
    /**
     * @type {Vector}
     * @private
     */
    this.topleft = a;

    /**
     * @type {Vector}
     * @private
     */
    this.bottomright = b;
    
    /**
     * a n-dimensions array of the rectangle dimensions, on each axis 
     * @type {Array.<number>}
     * @public
     */
    this.size = [];

    for (let i = 0; i < a.dimensions; i++) {
      this.size.push(Math.abs(b.components[i]-a.components[i]));
    }
  }

  /**
   * @param {Vector} point any point with the same number of dimensions that the
   *                       points within the constructor
   * 
   * @returns {boolean} true if constructor the point is contained within the 
   * bounding rect, false if it's not
   */
  contains (point) {
    for (let d = 0; d < this.topleft.dimensions; d++) {
      let min = Math.min(this.topleft.components[d], this.bottomright.components[d]),
          max = Math.max(this.topleft.components[d], this.bottomright.components[d]);
      if (point.components[d] < min || point.components[d] > max) {
        return false;
      }
    }
    return true;
  }
}

export default Rectangle;