# Assignment 3
### CS4344 AY14/15 Semester 2

This is a naive implementation of a massively multiplayer space battle.
To run the server
```node MMOServer.js```

To run the client, open the browser and point to the index.html on the
server.

You may configure the server address and port in ```Config.js```

To simulate massively number of players, you can populate the game
with bots.  Run
```node Bot.js```
to create a bot.  You can optionally pass in a command line argument
to indicate the number of bots.  For example,
```node Bot.js 300`` creates 300 bots.
