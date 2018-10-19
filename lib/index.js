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
import roundto from 'round-to';


const CLASS_PREFIX = "creenv-colorpicker-";
const classname = name => CLASS_PREFIX+name;

// the default display options 
const DEFAULT_OPTIONS = {
  alphaControl: true,
  textControls: true,
  suggestions: [],
  direction: 2, // bottom left
  openCallback: () => {},
  closeCallback: () => {}
};


class Colorpicker {
  /**
   * displayed an expandable colorpicker that triggers the onChange method whenever a change is made 
   * to the inputs. displayOptions can be used to customize the available controllers
   * 
   * @param {Color} color the default color loaded within the picker
   * @param {?function} onCHange will be called whenever a color change is made
   * @param {{alphaControl:boolean, textControls:boolean, suggestions:Array.<Color>, direction:string}} displayOptions 
   */
  constructor (color = new Color(255,0,255), onChange, displayOptions = DEFAULT_OPTIONS) {
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
     * weither the picker is opened or not 
     * @type {boolean}
     * @public
     */
    this.opened = false;

    /**
     * the active color. can be different from current color if user cancels his
     * selection 
     * @type {Color}
     * @public
     */
    this.active = color;

    let hsv = this.current.hsv;
    this.hsv = {
      h: hsv[0], s: hsv[1], v: hsv[2]
    }

    /**
     * a list of suggested colors, displayed below the picker to ease the user 
     * selection through a set of predefined colors
     * @type {Array.<Color>}
     * @public
     */
    this.suggestions = [];

    /**
     * the height of the suggestions container 
     * @type {number}
     * @public
     */
    this.suggestionsHeight = 0;

    /**
     * the clickable box where active color is displayed
     * @type {HTMLElement}
     * @public
     */
    this.displayElement = null;

    displayOptions = Object.assign(DEFAULT_OPTIONS, displayOptions);
    this.suggestions = displayOptions.suggestions;
    this.direction = displayOptions.direction;
    this.closeCallback = displayOptions.closeCallback;
    this.openCallback = displayOptions.openCallback;

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
     * the 2d saturation-luminosity picker 
     * @type {SaluPicker}
     * @private
     */
    this.picker = null;

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
     * dom element of the transparent to colored background of the slider
     * @type {HTMLElement}
     * @private
     */
    this.alphaBackground = null;

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

    /**
     * the width of the element at its initialization
     * @type {number}
     * @private
     */
    this.pickingBoxWidth = 0;

    /**
     * key map of the inputs for the components
     * @type {Array.<HTMLElement>}
     * @private
     */
    this.inputsDom = {};

    /**
     * the callback method 
     * @type {function}
     * @private
     */
    this._onChange = onChange;

    this.handleAlphaChange = this.handleAlphaChange.bind(this);
    this.handleHueChange = this.handleHueChange.bind(this);
    this.handleSaluChange = this.handleSaluChange.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);

    this.generateDOM();
    setTimeout(() => {
      this.updateGraphics();
      this.picker.updateSV(this.hsv.s, this.hsv.v);
    }, 200);
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
    this.pickingBoxDom.classList.add(classname("picking-box"), ...classesFromDirection(this.direction).split(' '));

    this.displayBoxDom.addEventListener("click", () => {
      if (this.pickingBoxDom.classList.contains("opened")) {
        this.pickingBoxDom.style.width = 0+"px";
        this.pickingBoxDom.classList.remove("opened");
        this.opened = false;
        this.closeCallback();
      } else {
        this.openPickingBox();
      }
    });

    let selectorsContainer = document.createElement("div");
    selectorsContainer.classList.add(classname("selectors"));
    this.pickingBoxDom.appendChild(selectorsContainer);

    this.picker = new SaluPicker(this.current.hsv, this.handleSaluChange);
    selectorsContainer.appendChild(this.picker.dom);

    // the alpha slider controller
    if (this.alphacontrol ) {
      let alphaContainer = document.createElement("div");
      alphaContainer.classList.add(classname("alpha-container"));
      this.alphaSlider = new Slider(0, 1, 0.01, 1, this.handleAlphaChange, ()=>{}, true);
      this.alphaBackground = document.createElement("div");
      this.alphaBackground.classList.add(classname("alpha-bg"));
      this.alphaSlider.container.appendChild(this.alphaBackground);
      alphaContainer.appendChild(this.alphaSlider.dom);
      selectorsContainer.appendChild(alphaContainer);
    }

    // the hue slider controller
    let hueContainer = document.createElement("div");
    hueContainer.classList.add(classname("hue-container"));
    this.hueSlider = new Slider(0, 360, 1, Math.round(this.hsv.h), this.handleHueChange, ()=>{}, true);
    hueContainer.appendChild(this.hueSlider.dom);
    selectorsContainer.appendChild(hueContainer);

    // the input controllers
    let inputsContainer = document.createElement("div");
    inputsContainer.classList.add(classname("colorinfos-container"));
    selectorsContainer.appendChild(inputsContainer);
    inputsContainer.appendChild(this.generateComponentInput("red"));
    inputsContainer.appendChild(this.generateComponentInput("green"));
    inputsContainer.appendChild(this.generateComponentInput("blue"));
    inputsContainer.appendChild(this.generateComponentInput("alpha"));

    // suggestions 
    if (this.suggestions.length) {
      let suggestionsContainer = document.createElement("div");
      suggestionsContainer.classList.add(classname("suggestions"));

      let expand = document.createElement("div");
      expand.classList.add(classname("expand"));
      expand.innerHTML = "Suggested colors";
      suggestionsContainer.appendChild(expand);

      let suggestedColorsDom = document.createElement("div");
      suggestedColorsDom.classList.add(classname("suggested-colors"));

      expand.addEventListener("click", () => {
        if (suggestedColorsDom.classList.contains("opened")) {
          suggestedColorsDom.style.height = 0;
          suggestedColorsDom.classList.remove("opened");
        } else {
          suggestedColorsDom.style.height = this.suggestionsHeight+"px";
          suggestedColorsDom.classList.add("opened");
        }
      });

      this.suggestions.forEach(suggestion => {
        let suggestionDom = document.createElement("div");
        suggestionDom.classList.add(classname("suggested-color"));
        suggestionDom.style.backgroundColor = suggestion.string;
        suggestionDom.addEventListener("click", () => {
          this.handleColorChange(suggestion);
        });
        suggestedColorsDom.appendChild(suggestionDom);
      });

      suggestionsContainer.appendChild(suggestedColorsDom);
      this.pickingBoxDom.appendChild(suggestionsContainer);

      setTimeout(()=>{
        this.suggestionsHeight = suggestedColorsDom.clientHeight;
        suggestedColorsDom.style.height = 0;
      }, 200);
    }

    this.dom.appendChild(this.displayBoxDom);
    this.dom.appendChild(this.pickingBoxDom);

    setTimeout(() => {
      this.pickingBoxWidth = this.pickingBoxDom.clientWidth;
      this.pickingBoxDom.style.width = 0;
      this.pickingBoxDom.classList.remove("hidden");
    }, 200);

    document.addEventListener("click", (event) => {
      if (this.active && this.opened) {
        for (let path of event.path) {
          if (path === this.dom) {
            return;
          }
        }
        this.pickingBoxDom.style.width = 0+"px";
        this.pickingBoxDom.classList.remove("opened");
        this.opened = false;
        this.closeCallback();
      }
    })
  }

  openPickingBox () {
    this.pickingBoxDom.style.width = this.pickingBoxWidth+"px";
    this.pickingBoxDom.classList.add("opened");
    this.opened = true;
    this.openCallback();
  }

  generateComponentInput (component) {
    let first = component.slice(0,1);
    let container = document.createElement("div");
    container.classList.add(classname("component-infos"));
    container.innerHTML = `<label class="creenv-colorpicker-component-name" for="creenv-colorpicker-component-${component}-${this.id}">${component.slice(0,1)}</label>`
    let input = document.createElement("input");
    input.setAttribute("id", `creenv-colorpicker-component-${component}-${this.id}`);
    input.setAttribute("type", "number");
    if (component === "alpha")
      input.setAttribute("step", "0.01");
    input.addEventListener("keyup", event => {
      this.handleComponentChange(component, event.target.value);
    });
    container.appendChild(input);
    this.inputsDom[component] = input;
    return container;
  }

  /**
   * can be called when a full color needs to be changed 
   * 
   * @param {Color} color the new color to dispatch
   */
  handleColorChange (color) {
    this.current = color.copy();
    let hsv = this.current.hsv;
    this.hsv = {
      h: hsv[0], s: hsv[1], v: hsv[2]
    }

    this.updateGraphics();
    this.picker.updateSV(this.hsv.s, this.hsv.v);

    this.hueSlider.value = this.hsv.h;
    this.hueSlider.updateGraphics();

    this.alphaSlider.value = this.current.a;
    this.alphaSlider.updateGraphics();

    this._onChange(this.current);
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
    this.hsv.h = hue;
    let converted = Color.fromHSV(hue, this.hsv.s, this.hsv.v);
    this.current.rgb = converted.rgb;
    this.updateGraphics();
    this._onChange(this.current);
  }

  handleSaluChange ({saturation, luminosity}) {
    this.hsv.s = saturation;
    this.hsv.v = luminosity;
    let converted = Color.fromHSV(this.hsv.h, saturation, luminosity);
    this.current.rgb = converted.rgb;
    this.updateGraphics();
    this._onChange(this.current);
  }

  /**
   * 
   * @param {string} component red||green||blue||alpha
   * @param {*} value 
   */
  handleComponentChange (component, value) {
    value = Number(value);

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

    let hsv = this.current.hsv;
    this.hsv = {
      h: hsv[0], s: hsv[1], v: hsv[2]
    }

    this.updateGraphics();
    this.picker.updateSV(this.hsv.s, this.hsv.v);

    this.hueSlider.value = this.hsv.h;
    this.hueSlider.updateGraphics();

    this.alphaSlider.value = this.current.a;
    this.alphaSlider.updateGraphics();

    this._onChange(this.current);
  }

  /**
   * This method updates the graphics so that they match the current color 
   */
  updateGraphics () {
    this.displayBoxDom.style.backgroundColor = this.current.string;
    let pure = Color.fromHSV(this.hsv.h, 1, 1);
    this.alphaBackground.style.background = `linear-gradient(to bottom, transparent 0%, ${pure.string} 100%)`;
    this.hueSlider.cursor.style.backgroundColor = `rgb(${pure.rgb.join(',')})`;
    this.picker.updatePicker(this.current);
    this.picker.updateHue(this.hsv.h);
    ["red", "green", "blue", "alpha"].forEach((key, idx) => {
      this.inputsDom[key].value = key==="alpha" ? roundto(this.current.a,2) : Math.round(this.current.components[idx]);
    })
  }
}

Colorpicker.DIRECTION = {
  TOP_LEFT: 0,
  TOP_RIGHT: 1,
  BOTTOM_RIGHT: 2,
  BOTTOM_LEFT: 3,
};

const classesFromDirection = direction => {
  switch (direction) {
    case Colorpicker.DIRECTION.TOP_LEFT: return "bottom right";
    case Colorpicker.DIRECTION.TOP_RIGHT: return "bottom left";
    case Colorpicker.DIRECTION.BOTTOM_RIGHT: return "top left";
    case Colorpicker.DIRECTION.BOTTOM_LEFT: return "top right";
    default: return "top left";
  }
}

export default Colorpicker;