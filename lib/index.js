/**
 * @license MIT
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 **/

import "./style.scss";
import SaluPicker from './salu-picker';
import Color from '@creenv/color';
import Slider from '@creenv/slider';
import uniqid from 'uniqid';
import clamp from 'clamp';


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

    this.hsl = {
      h: 0,
      s: 0,
      l: 0
    };

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
     * the hue slider
     * @type {Slider}
     * @private
     */
    this.hueSlider = null;

    /**
     * the alpha slider 
     * @type {Slider}
     * @private
     */
    this.alphaSlider = null;

    /**
     * the dom element of the box used to display the current / active color depending 
     * on the scenario
     * @type {HTMLElement}
     * @public
     */
    this.displayBoxDom = null;

    /**
     * the dom element of the whole color picking box, hidden by default 
     * @type {HTMLElement}
     * @private
     */
    this.pickingBoxDom = null;

    this.handleAlphaChange = this.handleAlphaChange.bind(this);
    this.handleHueChange = this.handleHueChange.bind(this);

    this.generateDOM();

    document.body.appendChild(this.dom);
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

    this.pickingBoxDom = document.createElement("div");
    this.pickingBoxDom.classList.add(classname("picking-box"));

    let selectorsContainer = document.createElement("div");
    selectorsContainer.classList.add(classname("selectors"));
    this.pickingBoxDom.appendChild(selectorsContainer);

    
    let picker = new SaluPicker(new Color(255,0,255), (test) => { console.log(test)});
    selectorsContainer.appendChild(picker.dom);

    if (this.alphacontrol ) {
      let alphaContainer = document.createElement("div");
      alphaContainer.classList.add(classname("alpha-container"));
      this.alphaSlider = new Slider(0, 1, 0.01, 1, this.handleAlphaChange, ()=>{}, true);
      alphaContainer.appendChild(this.alphaSlider.dom);
      selectorsContainer.appendChild(alphaContainer);
    }

    let hueContainer = document.createElement("div");
    hueContainer.classList.add(classname("hue-container"));
    this.hueSlider = new Slider(0, 360, 1, 50, this.handleHueChange, ()=>{}, true);
    hueContainer.appendChild(this.hueSlider.dom);
    selectorsContainer.appendChild(hueContainer);

    this.dom.appendChild(this.displayBoxDom);
    this.dom.appendChild(this.pickingBoxDom);
  }

  /**
   * handles the change when alpha changer returns a value 
   * 
   * @param {number} alpha 
   */
  handleAlphaChange (alpha) {
    this.handleComponentChange("alpha", alpha);
  }

  /**
   * handles the change when hue slider returns a new value
   * 
   * @param {number} hue 
   */
  handleHueChange (hue) {
    console.log(hue);
  }

  /**
   * 
   * @param {string} component red||green||blue||alpha
   * @param {*} value 
   */
  handleComponentChange (component, value) {
    switch (component) {
      case "red": 
        value = clamp(value, 0, 255);
        this.current.r = value;
      break;
        
      case "green": 
        value = clamp(value, 0, 255);
        this.current.g = value;
      break;

      case "blue": 
        value = clamp(value, 0, 255);
        this.current.b = value;
      break;

      case "alpha": 
        value = clamp(value, 0, 1);
        this.current.a = value;
      break;
    }

    this.updateGraphics();
  }

  /**
   * This method updates the graphics so that they match the current color 
   */
  updateGraphics () {
    console.log("update des graphiques");
  }
}

export default Colorpicker;

let slider = new Slider(0, 360, 1, 10, ()=>{}, ()=>{}, true);
document.getElementsByClassName("creenv-colorpicker-hue-container")[0].appendChild(slider.dom);

let slider2 = new Slider(0, 360, 1, 10, ()=>{}, ()=>{}, true);
document.getElementsByClassName("creenv-colorpicker-alpha-container")[0].appendChild(slider2.dom);