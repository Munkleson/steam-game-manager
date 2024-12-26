# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

Questions to ask
- For storing the API instead of calling it every time a page is loaded:
  - Are there any legal issues anyway?
  - Is it a good idea?
  - Would it be good to refresh it daily so new games are updated and loaded in, or is there a better way?
Currently I have to load the list of all steam games, and then check in each game's specific api if it is a success or not. What's a good way to not make loading time so bad?

How do I bypass the CORs issue so I can just fetch in my frontend instead of passing from backend to frontend like I am right now via data attributes
