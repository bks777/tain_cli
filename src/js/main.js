"use strict";
import Utilities from './utilites';

import Game from './components/ui/Game';
import loader from './components/core/loader/Loader';
import App from './components/app/app';

var appInstance,
    promise = loader.httpGet({url:'../config/config.json'})
    .then((config)=>{
        appInstance = new App(JSON.parse(config), loader, Game, PIXI, Utilities);
    });
