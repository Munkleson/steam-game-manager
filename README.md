# README

This is my Rails app made to practice CRUD operations

Questions to ask
- For storing the API instead of calling it every time a page is loaded:
  - Are there any legal issues anyway?
  - Is it a good idea?
  - Would it be good to refresh it daily so new games are updated and loaded in, or is there a better way?
Currently I have to load the list of all steam games, and then check in each game's specific api if it is a success or not. What's a good way to not make loading time so bad?

How do I bypass the CORs issue so I can just fetch in my frontend instead of passing from backend to frontend like I am right now via data attributes

Filter options at the top
Stats on the sides
  - Completion/played rates
Sort games by
