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
      return "<strong class='item'>Beans and Bread</strong>";
      break;
    case "d":
      return "<strong class='item'>Ebba and Egusi soup</strong>";
      break;
    case "e":
      return "<strong class='item'>Cat fish pepper soup</strong>";
      break;
    case "f":
      return "<strong class='item'>Shawama</strong>";
      break;
    default:
      return null;
      break;
  }
};

const handleUserInput = (botName, socket, sessionID, order, msg) => {
  const userOrder = order[sessionID];
  const options = `<ul>
  <strong>Select an option:</strong>
  <li> 1. Place an order </li>
  <li> 99. Checkout order </li>
  <li> 98. See order history </li>
  <li> 97. See current order </li>
  <li> 0. Cancel order </li>
  </ul>`;

  const menu = {
    a: {
      item: "<strong class='item'>Beans Porrage</strong>",
      price: 75,
    },
    b: { item: "<strong class='item'>Jollof Rice</strong>", price: 125 },
    c: {
      item: "<strong class='item'>Beans and Bread</strong>",
      price: 115,
    },
    d: {
      item: "<strong class='item'>Ebba and Egusi soup</strong>",
      price: 105,
    },
    e: {
      item: "<strong class='item'>Cat fish pepper soup</strong>",
      price: 85,
    },
    f: { item: "<strong class='item'>Shawama</strong>", price: 25 },
  };

  switch (msg) {
    case "1":
      const items = `<ul> <strong>Select an item to order</strong>:
      <li> a. Beans Porrage - $75 </li>
      <li> b. Jollof Rice - $125 </li>
      <li> c. Beans and Bread - $115 </li>
      <li> d. Ebba and Egusi soup - $105 </li>
      <li> e. Cat fish pepper soup - $85 </li>
      <li> f. Shawama - $25 </li>
      </ul>`;

      socket.emit("message", formatMessage(botName, items));
      break;
    case "99":
      if (userOrder.currentOrder.length > 0) {
        userOrder.orderHistory.push({
          order: [...userOrder.currentOrder],
          total: userOrder.total,
        });
        userOrder.currentOrder = [];
        userOrder.total = 0;

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
      if (userOrder.orderHistory.length > 0) {
        let historyMessage = userOrder.orderHistory.map((order, index) => {
          return `<strong class = 'orders'>Order ${index + 1}:</strong> ${
            order.order
          }. <strong class = 'total'>Total: $${order.total}. </strong>\n`;
        });
        socket.emit("message", formatMessage(botName, historyMessage));
      } else {
        socket.emit(
          "message",
          formatMessage(
            botName,
            `No Order in history. Select 99 to Checkout current orders and add them to order hisyory if you have made orders`
          )
        );
      }

      socket.emit("message", formatMessage(botName, options));
      break;

    case "97":
      if (userOrder.currentOrder.length > 0) {
        socket.emit(
          "message",
          formatMessage(botName, `Current orders: ${userOrders.currentOrder}`)
        );
      } else {
        socket.emit(
          "message",
          formatMessage(
            botName,
            `No current order, place an order <strong>Now!<strong> or select 98 to view order history`
          )
        );
      }
      socket.emit("message", formatMessage(botName, options));
      break;

    case "0":
      if (userOrder.currentOrder.length > 0) {
        userOrder.currentOrder = [];
        userOrder.total = 0;

        socket.emit("message", formatMessage(botName, `Order canceled`));
      } else {
        socket.emit("message", formatMessage(botName, `No order to cancel`));
      }
      socket.emit("message", formatMessage(botName, options));
      break;

    default:
      if (menu[msg]) {
        const item = menu[msg].item;
        const price = menu[msg].price;
        userOrder.currentOrder.push(item);
        userOrder.total += price;
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

      socket.emit("message", formatMessage(botName, options));
      break;
  }
};

module.exports = {
  handleUserInput,
};
