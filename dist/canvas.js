export default class Canvas {
    constructor() {
        this.BASE_WIDTH_HEIGHT = 200;
        this.WHITE = "#ffffff";
        this.PINK = '#fe52fc';
        this.BLACK = '#000000';
        this.BLUE = '#56faf7';
        // Clear the canvas.
        this.clear = () => {
            this.ctx.clearRect(0, 0, this.width, this.height);
        };
        // Background color canvas.
        this.setup = () => {
            this.ctx.fillStyle = this.BLACK;
            this.ctx.fillRect(0, 0, this.width, this.height);
        };
        // Select the elements on the page - canvas, reset button.
        const canvas = document.querySelector('#paratrooper');
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        document.querySelector('#instructions').addEventListener('click', () => { alert('Use arrow keys (left, right and up).'); });
    }
    // Get a random integer in a certain range.
    getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
    // Shuffle an array.
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
}
