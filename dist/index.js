import Services from "./services.js";
// Firebase App (the core Firebase SDK) is always required and must be listed first.
import * as firebase from "firebase";
export default class Game {
    constructor(container) {
        this.container = container;
        // Draw all the things.
        // TODO: later on, we will probably just loop through all our objects 
        // and call the draw() function.
        this.drawLoop = () => {
            let now = performance.now();
            let elapsed = now - this.lastUpdate;
            // We want to set a max FPS otherwise the game will run faster on 
            // superfast computers. It still will run (a bit) slower on machines 
            // which can't handle the desired FPS.
            if (elapsed > this.fpsInterval) {
                this.canvas.clear();
                this.canvas.setup();
                this.barrel.draw();
                this.flightController.run();
                this.trooperController.run();
                this.turret.draw();
                this.score.run();
                this.fps.run();
                this.overlay.run();
                this.lastUpdate = now - (elapsed % this.fpsInterval);
            }
            window.requestAnimationFrame(this.drawLoop);
        };
        this.canvas = container.get('canvas');
        this.turret = container.get('turret');
        this.trooperController = container.get('trooperController');
        this.flightController = container.get('flightController');
        this.score = container.get('score');
        this.barrel = container.get('barrel');
        this.overlay = container.get('overlay');
        // This shows the FPS on screen.
        this.fps = container.get('fps');
        this.lastUpdate = performance.now();
        this.fpsInterval = Math.round(1000 / Game.MAX_FPS);
        window.requestAnimationFrame(this.drawLoop);
    }
}
Game.MAX_FPS = 60;
// Dependency injection with a simple services container 
// inspired by: https://medium.com/@ismayilkhayredinov/building-a-scoped-ioc-container-for-node-express-8bf082d9887
// @TODO Might look into the "typescript way" to do this: 
// http://nicholasjohnson.com/blog/how-angular2-di-works-with-typescript/
window.game = new Game(Services());
// Your web app's Firebase configuration
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
const db = firebase.firestore();
// console.log(db);
// Add a new document in collection "highscores"
// db.collection("highscores").doc("score-2").set({
//   name: "Karolien",
//   score: 333
// })
//   .then(function () {
//     console.log("Document successfully written!");
//   })
//   .catch(function (error) {
//     console.error("Error writing document: ", error);
//   });
let citiesRef = db.collection('highscores');
let query = citiesRef.orderBy('score', 'desc').limit(10).get()
    .then(snapshot => {
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }
    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
    });
})
    .catch(err => {
    console.log('Error getting documents', err);
});
