Test SLOT game for TAIN.
It's a very basic solution was made from scratch in approximately 10 hrs.
The main thing is to show module solution with minimum visual effects.

I used such technologies as: 
* npm as a package runner: www.npmjs.com
* Bower as a libs packager: www.bower.io
* ES6 as a language: www.ecma-international.org/ecma-262/6.0/
* WebPack as ES6 builder and compiler: www.webpack.github.io
* PIXI as a 2D renderer: www.pixijs.com

Before the installation you need:
 * npm to be installed.
 * any local web server must be installed
 * CORS must be allowed from **server**

All you need to install this app:
Go to root folder of this project and 
1. Run: "npm install"to install base packages
2. Run: "sudo npm run package" from unix system, or
"node_modules\.bin\bower install" from windows to install libraries
3. Run: "sudo npm build" or "npm build" for compile the code

After this 3 short manipulations you will be able to run index.html from /src/ folder.