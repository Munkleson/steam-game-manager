# README

This is my Rails app made to practice CRUD operations

Questions to ask
- For storing the API instead of calling it every time a page is loaded:
  - Are there any legal issues anyway?
  - Is it a good idea?
  - Would it be good to refresh it daily so new games are updated and loaded in, or is there a better way?
Currently I have to load the list of all steam games, and then check in each game's specific api if it is a success or not. What's a good way to not make loading time so bad?

How do I bypass the CORs issue so I can just fetch in my frontend instead of passing from backend to frontend like I am right now via data attributes

Stats
- Make progress bar movemenet rather than static jumps between progress
Sort games by

Solved the var issue (where declarations happening again when a page was navigated to in the same session led to conflicts due to let and const declarations already being done, resulting in having to do them as var instead). This was done by wrapping everything in one function and calling it on the page (which should occur every time it loads?)
- Is this good though?


Playlist adding
- Add one
- Add many
  - Creates a selection and confirm at the end
  - Seems pointless to have add one if you have add many

Search function
- Can search by just games
- Can search by just DLC
- Can search by both
