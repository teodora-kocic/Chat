class Chatroom {
  constructor(room, username) {
    this.room = room;
    this.username = username;
    this.chats = db.collection("chats");
    this.unsub; // Bice undefined prilikom kreiranja objekta
  }

  set room(r) {
    if (r.length > 0) {
      this._room = r;
    }
  }

  get room() {
    return this._room;
  }

  set username(u) {
    if (u.length > 2 && u.length < 10 && u !== "") {
      this._username = u;
    } else {
      alert("Invalid username!");
    }
  }

  get username() {
    return this._username;
  }

  // Update sobe
  updateRoom(ur) {
    this.room = ur;

    if (this.unsub) {
      this.unsub();
    }
  }

  updateUsername(un) {
    this.username = un;
  }

  async addChat(message) {
    let date = new Date();
    let ts = firebase.firestore.Timestamp.fromDate(date);

    let docChat = {
      message: message,
      username: this.username,
      room: this.room,
      created_at: ts,
    };

    // db.collection("chats").add(docChat);
    let response = await this.chats.add(docChat);
    return response; // Vracamo Promise i od njega mozemo potrazivati .then() i .catch()
  }

  async removeChat(id) {
    let response = await this.chats.doc(id).delete();
    return response;
  }

  // Pracenje poruka u bazi i ispis dodatih poruka
  getChats(callback) {
    this.unsub = this.chats
      .orderBy("created_at")
      .where("room", "==", this.room)
      .onSnapshot((snapshot) => {
        // console.log(snapshot.docChanges); // Vraca niz promena
        snapshot.docChanges().forEach((change) => {
          if (change.type == "added") {
            // console.log(change.doc.data()); // Vraca cele dokumente
            callback(change.doc);
          }
        });
      });
  }
}

export { Chatroom };
