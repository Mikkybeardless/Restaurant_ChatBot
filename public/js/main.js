const socket = io();

const chatMessage = document.querySelector(".chat-messages");
const chatForm = document.getElementById("chat-form");

// Get username and room from url
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Join chat
socket.emit("Customer join", { username });
// output welcome
socket.on("welcome", (message) => {
  outPutWelcome(message);
  outPutSelectMenue(message);

  // auto scroll down
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// output Reply from bot
socket.on("message", (message) => {
  console.log(message);
  outPutReply(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // emit message to server
  socket.emit("selected option", msg);

  // clear and focus input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outPutWelcome(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span> ${message.time} </span></p>
						<p class="text">
						${message.text}
							
						</p>`;

  chatMessage.appendChild(div);
}

function outPutSelectMenue(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  div.innerHTML = `<p class='meta'> ${message.username}<span> ${message.time} </span></p>`;

  const ul = document.createElement("ul");
  // ul.classList.add("message");
  ul.innerHTML = ` 
  <strong>Select an option:</strong>
  <li> 1. Place an order </li>
  <li> 99. Checkout order </li>
  <li> 98. See order history </li>
  <li> 97. See current order </li>
  <li> 0. Cancel order </li>`;
  div.appendChild(ul);
  chatMessage.appendChild(div);
}

function outPutReply(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class='meta'> ${message.username} <span> ${message.time} </span></p>
                   <p class='text'>
                   ${message.text}
                   </p>`;
  chatMessage.appendChild(div);
}
