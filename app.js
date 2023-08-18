import { Chatroom } from "./chat.js";
import { ChatUI } from "./ui.js";

let btnSend = document.getElementById("send");
let textAreaMessage = document.getElementById("message");
let btnUpdate = document.getElementById("update");
let inputUsername = document.getElementById("update-username");
let uList = document.querySelector("ul");
let ul = document.querySelector("#ui");
let section = document.querySelector("section");
let inputColor = document.getElementById("color-picker");
let btnColor = document.getElementById("color");
let chatEffect = new Audio("sound/chat-effect.mp3");
let login = new Audio("sound/login.mp3");
let deleteMessage = new Audio("sound/delete-message.mp3");

let usernameFromLocalStorage = localStorage.getItem("username");
if (!usernameFromLocalStorage) {
  usernameFromLocalStorage = "Anonymous";
  localStorage.setItem("username", usernameFromLocalStorage);
}

let roomFromLocalStorage = localStorage.getItem("room");
if (!roomFromLocalStorage) {
  roomFromLocalStorage = "#js";
}
document.getElementById(roomFromLocalStorage).classList.add("active");

let colorFromLocalStorage = localStorage.getItem("color");
if (colorFromLocalStorage) {
  section.style.backgroundColor = colorFromLocalStorage;
}

let chatroom = new Chatroom(roomFromLocalStorage, usernameFromLocalStorage);
let chatUI = new ChatUI(ul);

let divShowUsername = document.getElementById("show-username");
divShowUsername.style.display = "none";

chatroom.getChats((data) => {
  ul.innerHTML += chatUI.templateLI(data);
});

btnSend.addEventListener("click", function (e) {
  e.preventDefault();

  let value = textAreaMessage.value;

  if (value !== "" && value !== " ") {
    chatroom
      .addChat(value)
      .then(() => {
        textAreaMessage.value = "";
        chatEffect.play();
        ul.lastChild.scrollIntoView();
      })
      .catch((err) => {
        console.log(err);
      });
  }
});

btnUpdate.addEventListener("click", function (e) {
  e.preventDefault();

  let value = inputUsername.value;
  chatroom.updateUsername(value);

  if (value.length > 2 && value.length <= 10) {
    localStorage.setItem("username", value);
    login.play();
  }

  if (
    inputUsername.value !== "" &&
    inputUsername.value.length > 2 &&
    inputUsername.value.length <= 10
  ) {
    divShowUsername.style.display = "block";
    divShowUsername.innerHTML = value;
  }
  inputUsername.value = "";

  setTimeout(() => {
    divShowUsername.style.display = "none";
  }, 3000);

  let currentMessages = document.querySelectorAll("li.right");

  currentMessages.forEach((cm) => {
    cm.classList.remove("right");
  });

  document.querySelectorAll(`li[name='${value}']`).forEach((li) => {
    li.classList.add("right");
  });
});

uList.addEventListener("click", function (e) {
  if (e.target.tagName == "LI") {
    if (!e.target.classList.contains("active")) {
      let chatrooms = document.querySelectorAll("li");
      chatrooms.forEach((c) => {
        c.classList.remove("active");
      });
      e.target.classList.add("active");
    }

    let newRoom = e.target.textContent;

    chatroom.updateRoom(newRoom);

    localStorage.setItem("room", newRoom);

    chatUI.clearUl();

    chatroom.getChats((data) => {
      ul.innerHTML += chatUI.templateLI(data);
    });
  }
});

btnColor.addEventListener("click", function (e) {
  e.preventDefault();

  let value = inputColor.value;

  setTimeout(() => {
    section.style.backgroundColor = value;
  }, 1000 - 500);

  localStorage.setItem("color", value);
});

ul.addEventListener("click", function (e) {
  if (e.target.tagName == "IMG") {
    let id = e.target.closest("li").id;

    let username = localStorage.getItem("username");

    if (e.target.closest("li").getAttribute("name") === username) {
      if (confirm("Da li zelite trajno da obrisete poruku?") == true) {
        chatroom
          .removeChat(id)
          .then(() => {
            console.log("Chat deleted");
            deleteMessage.play();
            e.target.closest("li").remove();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    } else {
      deleteMessage.play();
      e.target.closest("li").remove();
    }
  }
});
