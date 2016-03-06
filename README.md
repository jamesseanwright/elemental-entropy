# Elemental Entropy

A HTML5 canvas game for [JS1K 2016](http://js1k.com/2016-elemental/). Uses Web Audio API's [`OscillatorNode`](https://developer.mozilla.org/en-US/docs/Web/API/OscillatorNode) for sound. Protect the combustible oxygen from heat and fuel!


## Play Online

Will provide a link once it has been submitted and accepted


## How to Play

Simply move the mouse left and right to rotate the shield around the oxygen particle. You'll score 10 points for every fuel and heat particle you deflect.


## Browser Support

This goes without saying really, but FYI - mouse === desktop only :(
	
* Chrome/Chromium
* Firefox
* Edge
* Maybe Safari (TBC)

For the smoothest gameplay possible, ensure that hardware acceleration is enabled in your browser.


## Technical Stuff

### Tasks

#### `./tasks/build-pre-crush.sh`

Runs [Closure Compiler](https://developers.google.com/closure/compiler/) (`closure-compiler` must be set on `$PATH`) against the pre-minified script. This is configured to use the JS1K externs and apply advanced optimisations to the code. The script results in the pre-crushed script.

None of the other steps are automated. Once `index.pre-crush.js`is built, everything else is manual; remove the four `var` declarations from the file, and then run it through the incredible [RegPack](http://siorki.github.io/regPack.html) (I couldn't get the npm module to work, unfortunately) with these options:

* Attempt method hashing and renaming for **2D canvas context**
* Assume global variable **c** is a **2D canvas context**
* Reassign variable names to produce consecutive character blocks, except for variables **a c**
* Score = **1**
* Gain = **0**
* Length = **0**


### The Scripts

#### `index.original.js`

The original source code. Follows best practices for code reuse and maintainability.


#### `index.pre-min.js`

A version of the original source that contains all of the logic in the game loop, favouring repetition and magic values over clean code.


#### `index.pre-crush.js`

The result of running the `build-pre-crush.sh` script against `index.pre-min.js`. Additionally, all instances of the `var` keyword are removed by hand, thus placing everything on the global object.


#### `index.crushed.js`

The result of running RegPack against `index.pre-crush.js`.


### The Final Output

Size: 950 bytes

```
for(_='l[d]~~.`=-1*`_on^functi^Zc.YYarc(WrequeV5:-25U00N(4N-L&&KK(JstHe.G24EStyle=DD"#fff";||-26>,YshadowColor=atMh.PI/4`y`x),random());(E0-YHrokefill0,Y5,2*()YbeginPh()	(b.currentTime+.5|0GclientXan2(-E-4N)Blur=10	,W,e=b.creeOscillor(GfVncy.value=10>sqrt(L)*L)+)*))KGc^nect(b.deHini^GHartGHop+b=new AudioC^text,f=g=k=l=[],m=n=["#f60","#088"];a.^mousemove=Z(e){1N<K7N>Jk=(-8N)/8N**2+)};p=!0;Z q(e){N0";Rect(80480if(e-m>=15N-1N*g){h=!(r=h?8N*:?82U,h=h??50U:?480-(80-80*):80-80*random(l.push({x:r,y:h,b:Lr)/4N*5,f:h)/E0*3,:n[*n.length|0]}m=e}pJNf""#Nf"40E4for(d in l)~JD``,,2,+=`b,+=`f,pK7(p=!152)pK!`gK10>=k-K<=k+J`g=!`b_b,`f_f,f+=10===f%1NKg++9.1)826<||506<)J~=void 0	;W40E75,k-,k+(Yf^t="26px Arial";Text(f,240VHAnimi^Frame(q)}q(';G=/[^ -CFIMO-TX[\]a-}]/.exec(_);)with(_.split(G))_=join(shift());eval(_)
```