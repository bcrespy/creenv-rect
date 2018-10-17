/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 **/

import "./style.scss";
import Color from '@creenv/color';
import Slider from '@creenv/slider';
import uniqid from 'uniqid';


const CLASS_PREFIX = "creenv-colorpicker-";
const classname = name => CLASS_PREFIX+name;


class Colorpicker {
  constructor (color = new Color(255,0,255)) {
    /**
     * unique identifier, used for html id prop identification
     * @type {string}
     * @public
     */
    this.id = uniqid();

    /**
     * the current color, displayed in real-time
     * @type {Color}
     * @public
     */
    this.current = color.copy();

    /**
     * the active color. can be different from current color if user cancels his
     * selection 
     * @type {Color}
     * @public
     */
    this.active = color;

    /**
     * a list of suggested colors, displayed below the picker to ease the user 
     * selection through a set of predefined colors
     * @type {Array.<Color>}
     * @public
     */
    this.suggestions = [];

    /**
     * the clickable box where active color is displayed
     * @type {HTMLElement}
     * @public
     */
    this.displayElement = null;
  }

  /**
   * Generates the dom and saves it into the class members
   */
  generateDOM () {

  }
}

export default Colorpicker;

let slider = new Slider(0, 360, 1, 10, ()=>{}, ()=>{}, true);
document.getElementsByClassName("creenv-colorpicker-hue-container")[0].appendChild(slider.dom);

let slider2 = new Slider(0, 360, 1, 10, ()=>{}, ()=>{}, true);
document.getElementsByClassName("creenv-colorpicker-alpha-container")[0].appendChild(slider2.dom);