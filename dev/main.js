import Colorpicker from '../lib/index';
import Color from '@creenv/color';

let cp = new Colorpicker(new Color(220, 0, 240), (color) => {console.log(color.rgb); }, {
  suggestions: [
    new Color(30, 150, 20),
    new Color(255, 0, 255, 0.4),
    new Color(0, 255, 0)
  ],
  direction: Colorpicker.DIRECTION.TOP_RIGHT
});

document.body.appendChild(cp.dom);