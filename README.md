# tops-vpn

An Angular app for comparing VPNs using data from <https://thatoneprivacysite.net>

Use this by doing all the normal stuff. The Angular stuff. All the normal Angular stuff is how you use this. Ahem:

    npm start

PS it barely works yet, I'm still building it OKAY

## UI Ideas

 - Click on any heading, and there's a dropdown for "must/must not be defined", "must/must not be XXXXX" (the user files it in)
 - A mini language, like wireshark's, exposed in a text box
 - Flyout sidebar for everything?
 - Good UI elements where appropriate: checkboxes, sliders, etc

## TODO

 - Instrumentation? Would be nice to know what's slow, initial page load suxx rn
 - Somehow fix slow vpn-list load, it's several seconds :/
 - Package all JS/CSS/HTML for prod in deploy2ghpages.js
 - Port deploy2ghpages.js to a gulp task
 - Design the UI
 - Can I use `gulp-watch` rather than karma to run my tests? I think I wouldn't have to list each JS file separately like I have to with karma if I could do that
