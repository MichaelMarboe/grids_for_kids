/* --- GLOBAL CONTROLS ---

buttons: Holder variable for every buttons (later an array, can't be defined before page has loaded)
animationPlayTime: How long the animation takes to complete its' loop (hard-coded to 5 seconds - DO NOT ALTER)
animationSeeds: Amount of animations to run at once (per animation cycle)
masterDelay: Delay between each animation seed (for example, play 3 at once with a 500ms delay between each to create cascading animation feel)
masterInterval: Interval between animation cascades (ie. 5 seconds + the delay times amount of animations).  
gameTime: How many miliseconds the secret game runs before scoring and returning to the grid.
gameDarkness: How dark the background gets while game runs (0.0 - 1 where 1 is totally black).
*/

/* --- Game to-do: ---

Improvements/ideas/polish: 
1. Cursor size needs to be a function of window size or it might be too big
2. Could use the entire backgroundCover variable as the "game board"

Missing elements:
1. Script to generate a star
2. Expand to generate set amount of stars
3. Position them randomly
4. Animate them to move slightly and then disappear (setTimeout + .animate + position) - destroy them once done or just disable pointer events
5. Detect collision (when mouse hovers - worry about mobile device later, should be onclick here so 2 game modes are needed)
6. Count points (one-time event that fires on hover, event will need to remove itself from star to avoid overloading call stack if object cannot be destroyed/remove from DOM immediately)
7. Display points and reset everything in preparation for another run (might need to buy a bit of time, fiddle with grid container fade-in/re-activation of pointer events here if more time is needed).
*/

// Background
document.body.style.backgroundImage = "url('https://danes-online.dk/Sprogstimulering/assets/backgrounds/bg1.jpg')";

// Animation control
let buttons;
const animationPlayTime = 5000; 
let masterDelay = 500; 
let animationSeeds = 4; 
const masterInterval = animationPlayTime + masterDelay * animationSeeds; 

// Game control
let gameTime = 5000;
let gameDarkness = 0.8;

/* --- DEV MODE --- 

Only used for testing. Can enable but not disable (just reload page to disable). 

*/

let intervalPlayId;
let devModeEnabled = false;
let devButton = document.getElementById("devModeButton");

// Evoke from browser console
const toggleDevMode = () => {
    if (devModeEnabled == false){
        document.getElementById("devTools").style.display = "block";
        devModeEnabled = true;
        return("DevMode enabled");
    } else {
        document.getElementById("devTools").style.display = "none";
        devModeEnabled = false;
        return("DevMode disabled");
    } 
}

// Stops all animations and enables playOnClick function to be possible on each animation
let clickToPlayEnabled = false;
const enableClickToPlay = () => {
    console.log("clicked")
    clearInterval(intervalPlayId);

    /* --- DEBUGGED --- 
    
    1. Can't execute onclick function from lottieplayer element if container divs (id item + number) have onclick functions (they somehow block it)
    2. Solution: Get all container divs and remove onclick attribute from them. While loop because more may be added in the future so it's uknown how many iterations it needs.

    */

    let i = 1;
    holder = getItemsAsIds();
    holder.forEach(element => {
        element.removeAttribute("onclick");
        // Enable play on "empty" class elements (animations that can't be clicked but just decorate)
        element.style.pointerEvents = "all";
    })

    // Stop and reset all animations and append playOnClick function
    for (let i = 0; i < buttons.length; i++){
        buttons[i].stop();
        buttons[i].setAttribute("onclick", "playOnClick(event)");
    }
    return console.log("playOnClick events added to player elements.")
}

const playOnClick = event => {
    event.target.stop();
    event.target.play();
}

/* --- HELPER FUNCTIONS ---
    getRandomNumber: Returns one random number that can't be the same as the numbers in forbiddenNumbers array (second argument). Recurses if duplicate found.
    triggerPlay: Triggers play and resets animation ( .stop() ) once full animationPlayTime has been reached.
    gapToggler: Inserts gap in grid style document. Only used for testing.
*/

const getRandomNumber = (max, forbiddenNumbers) => {
    let randomNumber = Math.floor(Math.random()*max);
    if (forbiddenNumbers.includes(randomNumber) !== false) {
        return getRandomNumber(max, forbiddenNumbers);
    } else {
        return randomNumber;
    } 
}

const triggerPlay = (seed, delay) => {
    setTimeout(() => {
        buttons[seed].play();   
    }, delay);

    setTimeout( () => {
        buttons[seed].stop();
    }, animationPlayTime+delay);    
}

let gapEnabled = false;
const gapToggler = () => {
    if (!gapEnabled) {
        document.getElementById("container").style.gap = "3px";
        gapEnabled = true;
    } else {
        document.getElementById("container").style.gap = "0px";
        gapEnabled = false;
    }
}

// helper function > return array of all grid elements as ids for later ease of reference
const getItemsAsIds = () => {
    let holder = [];
    let iterator = 1;
    let targetElement = document.getElementById("item" + iterator);
    while(targetElement !== null) {
        holder.push(targetElement);
        iterator += 1;
        targetElement = document.getElementById("item" + iterator);
    }
    return holder;
}
 
/* --- LAUNCH ---

1. Pauses animation (just because it looks sweet) and fades every grid element out except the one the user clicked (variable fadeException is passed in by the grid elements onclick). 
2. Then, redirects user to another page with a delay of 1 second so fading can complete before redirect occurs.
3. gameMode turns the grid into a game board where you have to swipe stars. It occurs only when you click the stars and is kind of a secret.

*/


const launch = (fadeException, link, gameMode) => {  
    // Used to fade every individual item except the one clicked
    items = getItemsAsIds();

    // Game mode fades entire container - if it fades every item in grid, jQuery overrides and disables CSS hover effects once the grid fades back, so fade container instead to avoid this conflict
    let container = document.getElementById("container");
    let backgroundCover = document.getElementById("background-cover");

    if (gameMode != true && devModeEnabled == false){
        pauseAnimation();
        fadeException = document.getElementById(fadeException);
        items.forEach(element => {
            // prevent additional clicks/calls to launch()
            element.style.pointerEvents = "none";
            if (element != fadeException) {
                $(element).animate({ opacity: 0 })
            } 
            setTimeout(() => {
                window.top.location.href = link;
            }, 1000)
        })
    } else if (gameMode == true && devModeEnabled == false){
        // Game entry events here 
        $(container).animate({opacity:0});
        $(backgroundCover).animate({opacity:gameDarkness});
        document.body.style.cursor = "url(Game_time/cursor_star.png), auto"
        container.style.pointerEvents = "none";
        
        // Game exit events
        setTimeout(() => {
            $(container).animate({opacity:1});
            document.body.style.cursor = "auto";
            container.style.pointerEvents = "auto";
            $(backgroundCover).animate({opacity:0});
        }, gameTime);
    }
}


const pauseAnimation = () => {
    for (let i = 0; i < buttons.length; i++){
        buttons[i].pause();
        clearInterval(intervalPlayId);
    }
}

/* --- RUNTIME --- */

$( document ).ready(function() {
    buttons = document.getElementsByClassName("animBox");
    const maxAnimationSeeds = buttons.length - 1; 
    
    /* --- RUNTIME FUNCTIONS ---

    getRandomSeeds: Generates an array of random numbers without duplicates (ie. previousNumbers).
    triggerButtonAnimation: Calls getRandomSeeds() and triggers .play() on given seeds (amount of seeds defined globally - see variable animationSeeds).

    Both functions need to be defined post-load beecause they refer to maxAnimationSeeds (which in turn needs to refer the initialized buttons collection).

    */

    const getRandomSeeds = max => {
        let holder = [];
        let previousNumbers = []; 
        for (let i = 0; i < max; i++) {
            let randomNumber = getRandomNumber(maxAnimationSeeds, previousNumbers);
            holder.push(randomNumber);
            previousNumbers.push(randomNumber);
        }
        return holder;
    }
    
    const triggerButtonAnimation = () => {
        let delay = masterDelay; // pull from global control variable and iterate upon
        let seeds = getRandomSeeds(animationSeeds);
        seeds.forEach(seed => {
            triggerPlay(seed, delay);
            delay+=masterDelay;
        })
    }

    /* --- INITIALIZE:
    
    Call for a one-time play here to run immediately before interval countdown is reached. Or don't? Might feel smoother on initial load.   
    intervalPlayId is stored (setInterval returns an ID but it also launches in the code below). Required for devMode to stop animations.

    --- */

    triggerButtonAnimation();
    intervalPlayId = setInterval(triggerButtonAnimation, masterInterval); 
});