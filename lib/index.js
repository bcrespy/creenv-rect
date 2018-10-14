"use strict";

/**
 * [https://en.wikipedia.org/wiki/HSL_and_HSV]
 * HSL and HSV
 *
 * [http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/] 
 * Seven grayscale conversion algorithms (with pseudocode and VB6 source code)
 * Tanner Helland
 * 
 * [https://www.w3.org/TR/WCAG20]
 * Web Content Accessibility Guidelines (WCAG) 2.0
 * Ben Caldwell, Trace R&D Center, University of Wisconsin-Madison
 * Michael Cooper, W3C
 * Loretta Guarino Reid, Google, Inc.
 * Gregg Vanderheiden, Trace R&D Center, University of Wisconsin-Madison
 *
 */

import colorstring from 'color-string';


class Color {
  /**
   * 
   * @param {*} red 
   * @param {*} green 
   * @param {*} blue 
   * @param {*} alpha 
   */
  constructor (red = 0, green = 0, blue = 0, alpha = 1) {  

    /**
     * a 4-dimensions array stocking the rgba components of the color
     * @type {Array.<number>} 
     * @private
     */
    this.components = new Array(4).fill(0);
    this.components[3] = 1;

    // we first test if it's a color 
    if (arguments.length >= 3) {
      this.rgba = [red, green, blue, alpha];
    } else if (arguments.length === 1) {
      let typeofRed = typeof red;
      if (typeofRed === "string") {
        // we try to parse the color as a string
        let color = colorstring.get(red);
        if (color === null) {
          return Color.invalidColor(arguments);
        } else {
          switch (color.model) {
            case "hsl":
              return Color.fromHSL(color.value[0], color.value[1]/100, color.value[2]/100);
            break;

            case "rgb":
              return new Color(...color.value);
            break;

            default: 
              return Color.invalidColor(arguments);
            break;
          }
        }
      } else if (typeofRed === "number") {
        // hexadecimal, we need to handle this case 
      } else if (red instanceof Color) {
        return red.copy();
      } else if (red instanceof Array) {
        this.rgba = red;
      }
    } else if (arguments.length === 0) {
      this.rgba = [red, green, blue, alpha];
    }
  }

  /**
   * @return {number} the red component value [0;255]
   */
  get r () { return this.components[0]; }

  /**
   * @return {number} the green component value [0;255]
   */
  get g () { return this.components[1]; }

  /**
   * @return {number} the blue component value [0;255]
   */
  get b () { return this.components[2]; }

  /**
   * @return {number} the alpha component value [0;1]
   */
  get a () { return this.components[3]; }

  /**
   * @param {number} value the red component value [0;255]
   */
  set r (value) { this.components[0] = value; }

  /**
   * @param {number} value the green component value [0;255]
   */
  set g (value) { this.components[1] = value; }

  /**
   * @param {number} value the blue component value [0;255]
   */
  set b (value) { this.components[2] = value; }

  /**
   * @param {number} value the alpha component value [0;1]
   */
  set a (value) { this.components[3] = value; }

  /**
   * @return {Array.<number>} the color in a 4 dimensions array
   */
  get rgb () {
    return this.components.slice(0,3);
  }

  /**
   * Sets the 4 components [r;g;b] of the color from the array 
   * @param {Array.<number>} color a 3 dimensions array [r;g;b]
   */
  set rgb (color) {
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
  }

  /**
   * @return {Array.<number>} the color in a 4 dimensions array
   */
  get rgba () {
    return this.components;
  }

  /**
   * Sets the 4 components [r;g;b;a] of the color from the array 
   * @param {Array.<number>} color a 3 or 4 dimensions array [r;g;b;?a]
   */
  set rgba (color) {
    this.r = color[0];
    this.g = color[1];
    this.b = color[2];
    if (color[3] !== undefined) this.a = color[3];
  }

  /**
   * @return {string} rgba(r, g, b, a) string of the color, css compliant
   */
  get string () {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  /**
   * @return {string} #rrggbb hex string, if you want 0xrrggbb look for .hx
   */
  get hex () {
    return `#${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
  }

  /**
   * @return {string} 0xrrggbb hex string, if you want #rrggbb look for .hex
   */
  get hx () {
    return `0x${this.r.toString(16)}${this.g.toString(16)}${this.b.toString(16)}`;
  }

  /**
   * This method handles the behavior when parameter provided in the constructor 
   * don't match any known model 
   * 
   * @static 
   */
  static invalidColor () {
    throw {
      message: "Color creation given the following arguments was not possible.",
      args: arguments
    }
  }

  /**
   * Creates a Color class from a [h;s;l] array hue saturation luminosity
   * [https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSL]
   * 
   * @param {number} h hue in [0;360] range
   * @param {number} s saturation in [0;1] range
   * @param {number} l luminosty in [0;1] range
   * 
   * @return {Color}
   * @static
   */
  static fromHSL (h, s, l) {
    let c = (1 - Math.abs(2*l-1)) * s;
    let hp = h/60;
    let x = c * (1-Math.abs((hp%2)-1));
    let colors;

    if( 0 <= hp && hp < 1 )  colors = [c, x, 0];
    else if( 1 <= hp && hp < 2 ) colors = [x, c, 0];
    else if( 2 <= hp && hp < 3 ) colors = [0, c, x];
    else if( 3 <= hp && hp < 4 ) colors = [0, x, c]; 
    else if( 4 <= hp && hp < 5 ) colors = [x, 0, c];
    else if( 5 <= hp && hp <= 6 ) colors = [c, 0, x];

    let m = l - c / 2;
    return new Color( colors[0], colors[1], colors[2] ).apply(c => (c+m)*255);
  }

  /**
   * Creates a Color class from hue saturation value
   * [https://en.wikipedia.org/wiki/HSL_and_HSV#From_HSV]
   * 
   * @param {number} h hue in [0;360] range
   * @param {number} s saturation in [0;1] range
   * @param {number} v value in [0;1] range
   * 
   * @return {Color}
   * @static
   */
  static fromHSV (h, s, v) {
    let c = v * s;
    let hp = h / 60;
    let x = c * (1-Math.abs((hp%2)-1));
    let colors;

    if (0 <= hp && hp < 1)  colors = [c, x, 0];
    else if (1 <= hp && hp < 2) colors = [x, c, 0];
    else if (2 <= hp && hp < 3) colors = [0, c, x];
    else if (3 <= hp && hp < 4) colors = [0, x, c]; 
    else if (4 <= hp && hp < 5) colors = [x, 0, c];
    else if (5 <= hp && hp <= 6) colors = [c, 0, x];

    let m = v-c;
    return new Color( colors[0], colors[1], colors[2] ).apply(c => (c+m)*255);
  }

  /**
   * Parse a css color string and returns the Color object corresponding to 
   * that string 
   * [https://www.w3.org/TR/2018/REC-css-color-3-20180619/]
   * 
   * @param {string} colorString a css-valid string representation of a color
   * 
   * @return {Color|null} Color object if string is valid, otherwise null
   */
  static fromString (colorString) {
    let color;
    try {
      color = new Color(colorString);
      return color;
    } catch (e) {
      return null;
    }
  }

  /**
   * @return {Array.<number>} 4 components array of the color
   */
  toArray () {
    return this.components;
  }

  /**
   * @return {{r:number, g:number, b:number, a:number}} self explainatory
   */
  toObject () {
    return {
      r: this.r, g: this.g, b: this.b, a: this.a
    }
  }

  /**
   * @return {Color} color with rounded components
   */
  rounded () {
    return this.convert(Color, Math.round);
  }

  /**
   * Applies a function func to each of the components of the Color. If alpha is set
   * to true, the function will also be applied to the alpha channel 
   * 
   * @param {function} func the function to apply to each channel
   * @param {?boolean} alpha if the function will be applied to the alpha channel, default false
   * 
   * @return {Color} the modified color object
   */
  apply (func, alpha = false) {
    this.r = func(this.r);
    this.g = func(this.g);
    this.b = func(this.b);
    if( alpha ) this.a = func(this.a);

    return this;
  }

  /**
   * @template T
   * @param {T} Class a class with a 3 params constructor
   * @param {function(number)?} func a function which will be applied to all params
   * @return {T} 
   */
  convert (Class, func = x => x) {
    return new Class( func(this.r), func(this.g), func(this.b), func(this.a) );
  }

  /**
   * Update the values of the 
   */
  update () {

  }
  
  /**
   * Return a copy of this color
   */
  copy () {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * @param {Color} endColor the color to interpolate with
   * @param {number} t [0;1] interpolate factor
   * @return {Color} the resulting color of the interpolation between this and endColor
   */
  interpolateWith (endColor, t) {
    let newColor = [0,0,0];
    for( let i = 0; i < 3; i++ ) {
      newColor[i] = this.colors[i] + (endColor.colors[i] - this.colors[i]) * t;
    }
    this.rgb = newColor;

    return this;
  }

  /**
   * @return {Color} the modified Color, which values are inverted
   */
  invert () {
    this.r = 255-this.r;
    this.g = 255-this.g;
    this.b = 255-this.b;
    return this;
  }

  /**
   * Computes the average grayscale value (red+green+blue)/3
   * @return {Color} the grayscale resulting color
   */
  grayscale () {
    let gray = (this.r+this.g+this.b)/3;
    this.rgb = [gray, gray, gray];
    return this;
  }

  /**
   * Computes the grayscale value fo the color, using the grayscale luminance formula
   * grayscale = (Red * 0.2126 + Green * 0.7152 + Blue * 0.0722)
   * 
   * @return {Color} the grayscale resulting color
   */
  grayscaleLuminance () {
    let gray = this.r * 0.2126 + this.g * 0.7152 + this.b * 0.0722;
    this.rgb = [gray, gray, gray];
    return this;
  }

  /**
   * Green channel only is used to determine the grayscale value innacurate but fast,
   * can work with real images
   * 
   * @return {Color} the grayscale resulting color
   */
  grayscaleFastest () {
    this.rgb = [this.g, this.g, this.g];
    return this;
  }

  /**
   * Computes the relative luminance of the color
   * [https://www.w3.org/TR/WCAG20/#relativeluminancedef]
   * 
   * @return {number} the relative luminance of the color
   */
  relativeLuminance () {
    let ret = [];
    for( let i = 0; i < 3; i++ ) {
      let component = this.colors[i];
      ret[i] = component <= 10.0164 ? component / 12.92 : Math.pow( (component+14.025)/268.025, 2.4 );
    }
    return ret;
  }

  /**
   * Computes the contrast with the other color
   * [https://www.w3.org/TR/WCAG20/#contrast-ratiodef]
   * 
   * @param {Color} color the other color 
   * @return {number} contrast between the 2 colors 
   */
  contrastWith (color) {
    return (this.relativeLuminance()+0.05) / (color.relativeLuminance()+0.05);
  }
}


export default Color;