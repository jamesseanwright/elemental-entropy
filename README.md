# Elemental Extravaganza

A HTML5 canvas game for [JS1K 2016](http://js1k.com/2016-elemental/). Uses Web Audio API's [`OscillatorNode`](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) for sound. Protect the combustable oxygen from heat and fuel!


## Play Online

Will provide a link once it has been submitted and accepted


## How to Play

Simply move the mouse left and right to rotate the shield around the oxygen particle. You'll score 10 points for every full and heat particle you deflect.


## Browser Support

This goes without saying really, but FYI - mouse === desktop only :(
	
* Chrome/Chromium - version 43+
* Firefox - 


## Technical Stuff

### Tasks

#### `./tasks/build-pre-crush.sh`

Runs [Closure Compiler](https://developers.google.com/closure/compiler/) (`closure-compiler` must be set on `$PATH`) against the pre-minified script. This is configured to use the JS1K externs and apply advanced optimisations to the code. The script results in the pre-crushed script.

None of the other steps are automated. Once `index.pre-crush.js`is built, everything else is manual; remove the four `var` declarations from the file, and then run it through the incredible [RegPack](http://siorki.github.io/regPack.html) (I couldn't get the npm module to work, unfortunately) with these options:

* Attempt method hashing and renaming for *2D canvas context*
* Assume global variable *c* is a *2D canvas context*
* Reassign variable names to produce consecutive character blocks, except for variables *a c*
* Score = 1
* Gain = 0
* Length = 0


### The Scripts

