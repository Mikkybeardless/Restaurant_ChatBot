# This is a Restaurant chat bot built with node server, express, express session and web socket.

# what can this bot do:

- Attend to customers, taking and giving replies to orders based on a select menue.

# how it works:

- It has a login page that grabs the customer name and sends it in the request query

- This query is grabed from the frontend and sent to the server using a query string parser (qs CDN)

- When a user joins, the server send a message to the frontend after saving the username and giving the user a session id. The frontend then sends the welcome message with the user name to the customer

- The bot has specified valid inputs that output a message to the customer using a switch statement

- Embedded switch for placing an order allowing the user to select meal type.
