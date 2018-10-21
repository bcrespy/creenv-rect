# @creenv/rectangle 

A simpel Rectangle class, usually designed to be used as a Boudingt rectangle, but can fit other purposes including rectangles. It can be used with points of n-dimensions, as long as those points are instances of @creenv/Vector or of @creenv/Vector children (such as @creenv/Vector2, @creenv/Vector3, all available in the @creenv/vector package);

## How to use 

```js
import Vector from '@creenv/vector';
import Rectangle from '@creenv/rectangle';

// top left point
let p1 = new Vector(1.5,1.5),
    p2 = new Vector(3,3);

let rect = new Rectangle(p1, p2);

rect.topleft; // = p1
rect.bottomright; // = p2

rect.contains(new Vector(2,2)); // true
rect.contain(new Vector(-4,2)); // false
rect.contain(p1); // true
```

## Full doc 

Following is a full list of availaible methods via the **Rectangle** class.

___

### constructor (*pointA*: **Vector**, *pointB*: **Vector**)

The 2 points from opposite corners of the rectangle. It is used to describe a rectangle. **It is not required that pointA describes the TOP-LEFT point and pointB the BOTTOM-RIGHT one, but it is advised.**

| Name | Type | Def |
|---|---|---|
*pointA* | **Vector** | The top-left point of the rectangle |
*pointB* | **Vector** | The bottom-right point of the rectangle |

___ 

### class members

Javascript does not allow class members to be private, by definition they all are public. However, the members tagged as *private* should not be modified for reasons inherant to *Rectangle* class behavior.

| Name | Type | Accessibility | Def |
|---|---|---|---|
*.topleft* | **Vector** | private | pointA from the constructor first argument
*.bottomright* | **Vector** | private | pointB from the constructor second argument
*.size* | **Array.<number>** | private | a n-dimensions array, where n is the number of dimensions of pointA dimensions

___ 

### .contains (*point*: **Vector**)

Returns true if *point* is contained within the rectangle and false if it's not. It is required for such a test that *point* dimensions matches the number of dimensions of the rectangle.

| Name | Type | Def |
|---|---|---|
*point* | **Vector** | point with the same number of dimensions as *pointA* and *pointB*, that needs to be tested

*See example from part 1 for more informations on this function's usage.*