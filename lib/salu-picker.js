/**
 * @author Baptiste Crespy <baptiste.crespy@gmail.com>
 * @license MIT 
 * 
 * This class handles the saturation / luminosity 2D picker 
 */

import Vector2 from "@creenv/vector/vector2";
import Color from "@creenv/color";

const CLASS_PREFIX = "creenv-colorpicker-";
const classname = name => CLASS_PREFIX+name;

class SaluPicker {
  constructor (hsv, onChangeCallback = () => {}) {
    /**
     * the parent element of the picker 
     * @type {HTMLElement}
     * @public
     */
    this.dom = null;

    /**
     * the size of the container, used to compute S/L values 
     * @type {Vector2}
     * @private
     */
    this.size = new Vector2();

    /**
     * the picker which is not influenced by the mouse 
     * @type {HTMLElement}
     * @public
     */
    this.staticPicker = null;

    /**
     * the picker always following the mouse  
     * @type {HTMLElement}
     * @public
     */
    this.mousePicker = null;

    /**
     * the position of the mouse picker relative to the top-left corner 
     * @type {Vector2}
     * @private
     */
    this.mousePickerPos = new Vector2();

    /**
     * the variable is set to true when the user clicks in the area
     * when it's on false, picking is off
     * @type {boolean}
     * @public 
     */
    this.picking = false;

    /**
     * if the picker is active, computation will be made within the event 
     * listeners. we don't want to compute too much in there to leave as much
     * computation power as we can to the rest of the application 
     * @type {boolean}
     * @public
     */
    this.active = true;

    /**
     * the current hue, required to compute the color given the saturation and
     * luminosity, in real time
     */

    /**
     * called when a change is made to the selector 
     * @type {function}
     * @public
     */
    this.onChangeCallback = onChangeCallback;

    this.generateDom();
    this.updateHue(hsv[0]);
    this.setupListeners();
  }

  /**
   * because we want to optimize the listeners, we will enable or disable
   * the picker depending on the app state 
   */
  enable () {
    this.active = true;
  }

  /**
   * see enable()
   */
  disable () {
    this.active = false;
  }

  /**
   * creates the dom elements required for picking the color and 
   * add them to the class members 
   */
  generateDom () {
    this.dom = document.createElement("div");
    this.dom.classList.add(classname("gradient-container"));
    this.dom.innerHTML = `<div class="${classname("gradient")}"></div>`;

    this.staticPicker = document.createElement("div");
    this.staticPicker.classList.add(classname("picker"));

    this.mousePicker = document.createElement("div");
    this.mousePicker.classList.add(classname("mouse-picker"));

    this.dom.appendChild(this.staticPicker);
    this.dom.appendChild(this.mousePicker);
  }

  /**
   * updates the hue, which will update the background color
   * 
   * @param {Color} color the color of the background
   */
  updateHue (hue) {
    let convert = Color.fromHSV(hue, 1, 1);
    this.dom.style.backgroundColor = convert.string;
  }

  /**
   * updates the position on the cursor given the saturation / value 
   * 
   * @param {number} saturation 
   * @param {number} value 
   */
  updateSV (saturation, value) {
    let pos = new Vector2(saturation, 1-value).multiplyScalar(this.dom.clientWidth);
    console.log(pos);
    this.staticPicker.style.left = pos.x+"px";
    this.staticPicker.style.top = pos.y+"px";
  }

  /**
   * sets the color of the mouse picker 
   * 
   * @param {Color} color the color of the picker
   */
  updatePicker (color) {
    this.staticPicker.style.backgroundColor = color.string;
    this.staticPicker.style.left = this.mousePickerPos.x+"px";
    this.staticPicker.style.top = this.mousePickerPos.y+"px";

    this.mousePicker.style.backgroundColor = color.string;
  }

  /**
   * starts the listeners requires for the colorpicker to work
   * of course
   */
  setupListeners () {
    document.addEventListener("mousemove", event => {
      if (this.active) {
        // we want to compute the position of the picker 
        let position = new Vector2(event.pageX, event.pageY),
            rect = this.dom.getBoundingClientRect();
        
        this.updateValuesFromMouse(position);
      }
    });

    this.dom.addEventListener("mousedown", (event) => {
      this.picking = true;
      // we want to compute the position of the picker 
      let position = new Vector2(event.pageX, event.pageY),
      rect = this.dom.getBoundingClientRect();
      this.updateValuesFromMouse(position);
      this.dom.classList.add("picking");
    });

    document.addEventListener("mouseup", () => {
      this.picking = false;
      this.mousePicker.style.backgroundColor = "transparent";
      this.dom.classList.remove("picking");
    });
  }

  /**
   * computes the saturation and luminosity and triggers, if required, the
   * callbacks and stuff
   * 
   * @param {Vector2} position the absolute position of the mouse, in px
   */
  updateValuesFromMouse (position) {
    let rect = this.dom.getBoundingClientRect();

    position.substract(rect.left, rect.top);

    // clamp between rect.x and rect.x+rect.width
    position.x = Math.max(0, Math.min(position.x, rect.width));
    position.y = Math.max(0, Math.min(position.y, rect.height));

    this.mousePicker.style.left = position.x+"px";
    this.mousePicker.style.top = position.y+"px";

    if (this.picking) {
      this.mousePickerPos = position;
      
      // we update the color luminosity / saturation given the position  
      let saturation = position.x / this.dom.clientWidth,
          luminosity = 1 - (position.y / this.dom.clientHeight);
      
      //luminosity = luminosity*(1.9-luminosity);

      // change is triggered 
      this.onChangeCallback({saturation, luminosity});
    }
  }
}

export default SaluPicker;