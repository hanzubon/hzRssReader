// some usefull settings from https://joshmobley.net/writing/2016/12/24/gesture-support-in-your-angular-2-app-with-hammerjs.html
delete Hammer.defaults.cssProps.userSelect;     // restore text highlight on desktop
Hammer.defaults.inputClass = Hammer.TouchInput; // only recognize gestures on touch inputs
Hammer.defaults.touchAction = 'pan-x pan-y';    // allow touch to scroll
