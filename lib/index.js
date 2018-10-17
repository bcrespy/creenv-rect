/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 **/

import "./style.scss";
import SaluPicker from './salu-picker';
import Color from '@creenv/color';
import Slider from '@creenv/slider';
import uniqid from 'uniqid';


const CLASS_PREFIX = "creenv-colorpicker-";
const classname = name => CLASS_PREFIX+name;

// the default display options 
const DEFAULT_OPTIONS = {
  alphaControl: true,
  textControls: true,
  suggestions: []
};


class Colorpicker {
  constructor (color = new Color(255,0,255), displayOptions = DEFAULT_OPTIONS) {
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

    displayOptions = Object.assign(DEFAULT_OPTIONS, displayOptions);

    /**
     * if alpha control is activated 
     * @type {boolean}
     * @public 
     */
    this.alphacontrol = displayOptions.alphaControl;

    /**
     * if inputs control is activated 
     * @type {boolean}
     * @public
     */
    this.inputsControl = displayOptions.textControls;

    /**
     * the dom element of the root container of the color picker. needs to be added
     * where the color display box needs to be
     * @type {HTMLElement}
     * @public
     */
    this.dom = null;

    /**
     * the dom element of the box used to display the current / active color depending 
     * on the scenario
     * @type {HTMLElement}
     * @public
     */
    this.displayBoxDom = null;

    this.generateDOM();
  }

  /**
   * Generates the dom and saves it into the class members
   */
  generateDOM () {
    // the parent container 
    this.dom = document.createElement("div");
    this.dom.classList.add(classname("container"));

    // display box, to show the current color 
    this.displayBoxDom = document.createElement("div");
    this.displayBoxDom.classList.add(classname("display-box"));

    let picker = new SaluPicker((test) => { console.log(test)});
    document.body.appendChild(picker.dom);
  }

  /**
   * This method updates the graphics so that they match the current color 
   */
  updateGraphics () {

  }
}

export default Colorpicker;

let slider = new Slider(0, 360, 1, 10, ()=>{}, ()=>{}, true);
document.getElementsByClassName("creenv-colorpicker-hue-container")[0].appendChild(slider.dom);

let slider2 = new Slider(0, 360, 1, 10, ()=>{}, ()=>{}, true);
document.getElementsByClassName("creenv-colorpicker-alpha-container")[0].appendChild(slider2.dom);