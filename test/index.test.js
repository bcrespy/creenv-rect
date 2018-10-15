import Color from '../lib/index';


/**
 * Colors used for tests 
 * 
 * 1
 * r: 245, g: 51 , b: 111
 * #f5336f
 */

let expected1 = {
  r: 245, g: 51, b: 111, a: 1.0
};


test( "color instantiation using different inputs", () => {
  expect( new Color().toObject() ).toEqual( { r: 0, g: 0, b: 0, a: 1 } );
  expect( new Color(245,51,111).toObject() ).toEqual( expected1 );
  expect( Color.fromString("#f5336f").toObject() ).toEqual( expected1 );
  expect( Color.fromString("rgba(245,51,111,1.0)").toObject() ).toEqual( expected1 );
  expect( Color.fromArray([245,51,111]).toObject() ).toEqual( expected1 );
  expect( Color.fromHSL(341,0.91,0.58).rounded().toObject() ).toEqual( { r: 245, g: 50, b: 112, a: 1} );
  expect( Color.fromHSV(320,0.50,0.40).rounded().toObject() ).toEqual( { r: 102, g: 51, b: 85, a: 1 } );
});

test( "color getters", () => {
  let color = new Color(245,51,111);
  expect( color.rgb ).toEqual( [245, 51, 111] );
  expect( color.rgba ).toEqual([245, 51, 111, 1.0]);
  expect( color.toArray() ).toEqual( [ 245, 51, 111, 1.0 ] );
  expect( color.hex ).toEqual( "#f5336f" );
  expect( new Color( 135.1, 140.5, 120 ).rounded().toObject() ).toEqual({ r: 135, g: 141, b: 120, a: 1 });
});

test( "color setters", () => {
  let color = new Color();
  let magenta = [255,0,250],
      reddish = [200, 10, 50, 0.5];
  color.rgb = magenta;
  expect(color.toObject()).toEqual( { r: 255, g: 0, b: 250, a: 1 } );

  color.rgba = reddish;
  expect(color.toObject()).toEqual( { r: 200, g: 10, b: 50, a: 0.5 } );
});

test( "class convertion", () => {
  class Cheating { constructor(a,b,c){ this.x = a+b+c; } };
  let testClass = (r,g,b) => [r,g,b],
      testFunc = x => x*2;
  expect( new Color(20,25,30).convert(Cheating,testFunc).x ).toEqual( 150 );
  expect( new Color(20,30,40).apply(x => x-5).toObject() ).toEqual( { r: 15, g: 25, b: 35, a: 1 } );
});

test( "color operations", () => {
  let color1 = new Color(0,50,100),
      color2 = new Color(255,100,0),
      color3 = new Color(245,51,111);
  
      // need to add color operations tests
});