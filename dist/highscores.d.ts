import firebase from "firebase/app";
import "firebase/firestore";
import Score from "./score";
export default class Highscores {
    readonly score: Score;
    db: firebase.firestore.Firestore;
    highscoreSaved: boolean;
    constructor(score: Score);
    uuidv4(): string;
    writeHighscore: (e: Event) => void;
    getHighScores: () => Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>>;
}
