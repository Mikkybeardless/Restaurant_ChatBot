const formatMessage = require("./messages");

const getItemFromSelection = (select) => {
  switch (select) {
    case "a":
      return "<strong class='item'>Beans Porrage</strong>";
      break;
    case "b":
      return "<strong class='item'>Jollof Rice</strong>";
      break;
    case "c":
      return "<strong class='item'>Shawama</strong>";
      break;
    case "d":
      return "<strong class='item'>Ebba and Egusi soup</strong>";
      break;
    case "e":
      return "<strong class='item'>Cat fish pepper soup</strong>";
      break;
    default:
      return null;
      break;
  }
};

const handleUserInput = (botName, socket, sessionID, orders, msg) => {
  const userOrders = orders[sessionID];
  const options = `<ul>
  <strong>Select an option:</strong>
  <li> 1. Place an order </li>
  <li> 99. Checkout order </li>
  <li> 98. See order history </li>
  <li> 97. See current order </li>
  <li> 0. Cancel order </li>
  </ul>`;

  switch (msg) {
    case "1":
      const items = `<ul> <strong>Select an item to order</strong>:
      <li> a. Beans Porrage </li>
      <li> b. Jollof Rice </li>
      <li> c. Beans and Bread </li>
      <li> d. Ebba and Egusi soup </li>
      <li> e. Cat fish pepper soup </li>
      </ul>`;

      socket.emit("message", formatMessage(botName, items));
      break;
    case "99":
      if (userOrders.currentOrder.length > 0) {
        userOrders.orderHistory.push(userOrders.currentOrder);
        userOrders.currentOrder = [];

        socket.emit(
          "message",
          formatMessage(
            botName,
            "Order placed! Would like to place a new order? Select 1."
          )
        );
      } else {
        socket.emit(
          "message",
          formatMessage(
            botName,
            "No order placed, place an order <strong>Now<strong>"
          )
        );
      }

      socket.emit("message", formatMessage(botName, options));
      break;

    case "98":
      if (userOrders.orderHistory.length > 0) {
        socket.emit(
          "message",
          formatMessage(
            botName,
            `<strong class = 'orders'>Placed orders:</strong> ${userOrders.orderHistory}`
          )
        );
      } else {
        socket.emit(
          "message",
          formatMessage(
            botName,
            `No Order in history. Select 99 to Checkout placed orders and add them to order hisyory if you have added orders`
          )
        );
      }

      socket.emit("message", formatMessage(botName, options));
      break;

    case "97":
      if (userOrders.currentOrder.length > 0) {
        socket.emit(
          "message",
          formatMessage(botName, `Current orders: ${userOrders.currentOrder}`)
        );
      } else {
        socket.emit(
          "message",
          formatMessage(
            botName,
            `No order placed, place an order <strong>Now<strong>`
          )
        );
      }
      socket.emit("message", formatMessage(botName, options));
      break;

    case "0":
      if (userOrders.currentOrder.length > 0) {
        userOrders.currentOrder = [];

        socket.emit("message", formatMessage(botName, `Order canceled`));
      } else {
        socket.emit("message", formatMessage(botName, `No order to cancel`));
      }
      socket.emit("message", formatMessage(botName, options));
      break;

    default:
      const validInputs = ["a", "b", "c", "d", "e"];

      if (validInputs.includes(msg)) {
        const item = getItemFromSelection(msg);
        if (item) {
          userOrders.currentOrder.push(item);
          socket.emit(
            "message",
            formatMessage(
              botName,
              `${item} added to your order. You can place more order`
            )
          );
        } else {
          socket.emit("message", formatMessage(botName, `Invalid selection`));
        }
      } else {
        socket.emit("message", formatMessage(botName, `Invalid selection`));
      }

      socket.emit("message", formatMessage(botName, options));
      break;
  }
};

module.exports = {
  handleUserInput,
};
