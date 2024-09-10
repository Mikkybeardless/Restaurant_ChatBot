# Restaurant chatbot

## A chatbot made with express ejs and web socket.

## Overview: 
This project was an assignment project on working with `socket.io`. I did this project while still a student of Altschool Africa using `expressjs`, `ejs` and `socket.io `.  The restaurant bot is designed to perform the following tasks:


* It has a login page that grabs the customer's name and sends it in the request query
  
* Attend to customers, taking and giving replies to orders based on a select menu.

* The query is grabbed from the frontend and sent to the server using a query string parser (qs CDN)

* When a user joins, the server sends a message to the frontend after saving the username and giving the user a session ID. The frontend then sends the welcome message with the user name to the customer

* The bot has specified valid inputs that output a message to the customer using a switch statement

* Embedded switch for placing an order allowing the user to select meal type and store the data in an in-memory storage system.


## Link to the live server
follow this link to view and interact with the live bot - https://bot.hostless.app/
 
## Known issues
The bot was made with an in-memory database which means user details get forgotten once the user leaves the chat. Still working on adding a mongoDB database to save users and selected items/orders.

  
