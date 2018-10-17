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
  constructor (onChangeCallback = () => {}) {
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
     * called when a change is made to the selector 
     * @type {function}
     * @public
     */
    this.onChangeCallback = onChangeCallback;

    this.generateDom();
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
   * sets the color of the background
   * 
   * @param {Color} color the color of the background
   */
  color (color) {
    this.dom.style.backgroundColor = color.string;
  }

  setupListeners () {
    document.body.addEventListener("mousemove", event => {
      if (this.active) {
        // we want to compute the position of the picker 
        let position = new Vector2(event.pageX, event.pageY),
            rect = this.dom.getBoundingClientRect();
        position.substract(rect.left, rect.top);

        // clamp between rect.x and rect.x+rect.width
        position.x = Math.max(0, Math.min(position.x, rect.width));
        position.y = Math.max(0, Math.min(position.y, rect.height));

        this.mousePicker.style.left = position.x+"px";
        this.mousePicker.style.top = position.y+"px";

        this.mousePickerPos = position;

        if (this.picking) {
          // we update the colro luminosity / saturation given the position  
          let saturation = position.x / this.dom.clientWidth,
              luminosity = position.y / this.dom.clientHeight;
          
          // change is triggered 
          this.onChangeCallback({saturation, luminosity});
        }
      }
    });

    this.dom.addEventListener("mousedown", () => {
      this.picking = true;
      this.dom.classList.add("picking");
    });

    document.body.addEventListener("mouseup", () => {
      this.picking = false;
      this.dom.classList.remove("picking");
    });
  }
}

export default SaluPicker;