// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase, { FirebaseError } from "firebase/app";
import "firebase/firestore";
import Score from "./score";

export default class Highscores {

  db: firebase.firestore.Firestore;
  highscoreSaved: boolean;

  constructor(readonly score: Score) {

    // Your web app's Firebase configuration.
    const firebaseConfig = {
      apiKey: "AIzaSyADcpqiJ-igwgFdDJsuArjjrUY179TfEv4",
      authDomain: "paratrooper-leaderboard.firebaseapp.com",
      databaseURL: "https://paratrooper-leaderboard.firebaseio.com",
      projectId: "paratrooper-leaderboard",
      storageBucket: "paratrooper-leaderboard.appspot.com",
      messagingSenderId: "831739944011",
      appId: "1:831739944011:web:61cc3f577e1e5d418601ce"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();

    this.highscoreSaved = false;
  }

  uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  writeHighscore = (e: Event): void => {
    e.preventDefault();
    const button = <HTMLElement>e.target;
    const form = button.parentElement;
    const name = <HTMLInputElement>form.querySelector('input[type="text"]');
    // Add a new document in collection "highscores".
    this.db.collection("highscores").doc(this.uuidv4()).set({
      name: name.value,
      score: this.score.score
    })
      .then(() => {
        this.highscoreSaved = true;
      })
      .catch((error) => {
        console.error("Error saving highscore: ", error);
      });

  }

  getHighScores = async () => {
    const highscores = this.db.collection('highscores');
    return await highscores.orderBy('score', 'desc').limit(10).get()
  }

}


