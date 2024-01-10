import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";

class AppDB {
  constructor() {
    this.db = null;
    this.isAvailable = false;
  }

  open() {
    return new Promise((resolve, reject) => {
      try {
        const firebaseConfig = {
          apiKey: "AIzaSyByhKc6jQmM4rhc5BSD-IBL71O4VX97CXA",
          authDomain: "pwa-labs-4220f.firebaseapp.com",
          projectId: "pwa-labs-4220f",
          storageBucket: "pwa-labs-4220f.appspot.com",
          messagingSenderId: "279631297462",
          appId: "1:279631297462:web:9d63c90a514ed299ff9f17",
          measurementId: "G-C0PXRC2HBZ",
        };
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        if (db) {
          this.db = db;
          this.isAvailable = true;
          resolve();
        } else {
          reject("The database is not available");
        }
      } catch (error) {
        reject(error.message);
      }
    });
  }

  add(title, artist, likes) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not opened!");
      }
      const dbCollection = collection(this.db, "songs");
      addDoc(dbCollection, {
        title: title,
        artist: artist,
        likes: likes,
      })
        .then((docRef) => {
          console.log("Success: ", docRef);
          resolve();
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not opened!");
      }
      const dbCollection = collection(this.db, "songs");
      getDocs(dbCollection)
        .then((querySnapshot) => {
          const result = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.id = doc.id;
            result.push(data);
          });
          resolve(result);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  addALike(song, likes) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not opened!");
      }
      const docRef = doc(this.db, "songs", song.id);
      updateDoc(docRef, { likes: likes })
        .then(() => resolve())
        .catch((error) => {
          reject(error.message);
        });
    });
  }

  delete(id) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable) {
        reject("Database not opened!");
      }
      const docRef = doc(this.db, "songs", id);
      deleteDoc(docRef)
        .then(() => resolve())
        .catch((error) => {
          reject(error.message);
        });
    });
  }
}

export default new AppDB();
