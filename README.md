# GridsForKids

GridsForKids was a fun little design project I did for Danes Worldwide. In essence, it's a landing page for a language course for kids (contained within a web application that handles the rest of the interface). The page itself is a grid of animated buttons with a visual style intended for children - it's colorful, bold and very alive.

**Animation**
Animations were developed from vector assets using Adobe After Effects and can loop and scale indefinetely. Using the Lottie Player plugin for Adobe, they're seamlessly converted to a web format that runs smoothly on most any device.

All the animations use a format of 300x300, 300x600 or 600x300. The grid is hard-coded to fit these measurements and it is not flexible in this regard. What goes where and how large it is must be designed before implementing a new button. It is, however, easy enough to expand the grid should more content be needed. The grid has two window size-scales with different settings for each breakpoint. 

A devMode feature is also available for ease of animation testing. It can be called from the browser console using toggleDevMode() function and enables a user to play animations on click instead of automatically. Very useful when wanting to view the same animation repeatedly while developing and polishing it.

**Control**
Which animations are run, how many at a time and when can all be controlled from the global control variables within staging_animationControl.js.

In practice, the script is cycle-based meaning x amount of animations (one button is one animation) is set to play each animation cycle. Upon the end of one animation cycle, a new one begins continuing as long as the page is open selecting which animations to play at random.

Script details are explained throughout staging_animationControl.js. 

Enjoy!