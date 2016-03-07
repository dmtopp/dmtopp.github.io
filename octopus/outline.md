# Octopus Game

You, the player, control the actions of an unfortunate deep-sea diver who has encountered a terrible monster.  You must dodge the tentacles and stay alive for as long as possible!

##### Minimum Goals

* The user has basic control of the diver's movement using the arrow or WASD keys
* When the 'Diver' character touches at tentacle, animation stops and a life is lost
* Score is dependent on the amount of time the player lives.  At certain intervals, the game gets harder by adding more tentacles that move faster

##### Optional Objectives

* The player can collect coins/objects/bubbles to increase their score
* 2-player mode!  Players switch off levels mario-bros style.  Each player has their own score and number of lives.  The level ends when more tentacles are added.
* "It's simple physics, really." Pressing keys gives the character acceleration and velocity instead of simply moving the character's position.  The character floats to the bottom of the level by default.

### Pseudocode

Running the game is stored inside its own function:

```js
function playOctopus(){
  /// Run the animation over a set interval
  var loop = setInterval(animationLoop,interval)
}
```

Inside the animationLoop function, several things happen:

```js
  // listen for a key press
  window.addEventListener('keydown',whatKey,true)
  function whatKey(event){
    // switch over up/right/left/down
    // if pressed, move in that direction
  }
```

```js
  drawPlayer(); // draw the character at its new position
```

```js
  // draw the tentacles at their current position
  // (already implemented mostly)
  drawTentacles();  
```

```js
  collideDetect();
```

The collideDetect function will be the hardest to implement.  The plan is to check rectangles around the character for pixels of a certain color like so:

![picture]

```js
context.getImgData(x-dx, y-dy, w+2*dw, dh);
context.getImgData(x-dx, y, dw, h);
context.getImgData(x+w, y, dw, h);
context.getImgData(x-dx, y+h, w+2*dw, dh);  
```
The above commands will return an array of RGBA values for the pixels in the rectangles around the character.  Finding a color that matches with tentacles will trigger the loss of a life.  Optionally, finding the color of a coin or powerup will have additional effects.

```js
if(finds color of tentacle){
  clearInterval(loop);
  lives -= 1;
  characterPosition = (initialPosition);
}
```
