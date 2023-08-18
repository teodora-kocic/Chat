export class ChatUI {
  constructor(li) {
    this.li = li;
  }

  set li(l) {
    this._li = l;
  }

  get li() {
    return this._li;
  }

  formatDate(date) {
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let h = date.getHours();
    let min = date.getMinutes();

    d = String(d).padStart(2, "0");
    m = String(m).padStart(2, "0");
    h = String(h).padStart(2, "0");
    min = String(min).padStart(2, "0");

    let time = `${d}.${m}.${y}. - ${h}:${min}`;

    if (
      Number(d) == new Date().getDate() &&
      Number(m) == new Date().getMonth() + 1 &&
      y == new Date().getFullYear()
    ) {
      time = `Today - ${h}:${min}`;
    }
    return time;
  }

  templateLI(data) {
    let id = data.id;
    let date = data.data().created_at.toDate();
    let strDate = this.formatDate(date);

    let currentUser = localStorage.getItem("username");

    let messageClass = currentUser == data.data().username ? "right" : "";

    let htmlLi = `
    <li id="${id}" class="messages ${messageClass}" name="${
      data.data().username
    }">
        <span class="username">${data.data().username} : </span>
        <span class="message">${data.data().message} </span>
        <p class="date">${strDate} </p>
        <img src="./images/trash.png" class="trash">
    </li>`;

    return htmlLi;
  }

  clearUl() {
    this.li.innerHTML = "";
  }
}
