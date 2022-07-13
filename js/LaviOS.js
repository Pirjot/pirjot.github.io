/**
 * LaviOS class declaration
 */


import buildLayout from "./Layout.js";

/**
 * The main driver class that handles the canvas draw and setup,
 * as well as handling the interaction of the user and the various
 * possible layouts.
 */
class LaviOS {
    static os = null;
    constructor() {
        LaviOS.os = this;
        this.c = new p5((canvas) => {
            canvas.setup = () => LaviOS.os.setup();
            canvas.draw = () => LaviOS.os.draw();
        }, "canvas");

        
        this.updateDimensions();
    }

    updateDimensions() {
        this.c.screenWidth = document.documentElement.clientWidth;
        this.c.screenHeight = document.documentElement.clientHeight;
    }

    resizeCanvas() {
        this.updateDimensions();
        this.c.resizeCanvas(this.c.screenWidth, this.c.screenHeight)
    }

    setup() {
        this.c.createCanvas(this.c.screenWidth, this.c.screenHeight);
        this.c.background("white");

        let resizeTimer = null;
        document.body.onresize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => this.resizeCanvas(), 500);
        };

        this.layout = buildLayout("login", () => {
            this.layout = buildLayout("matrix", () => {
                this.layout = buildLayout("booting", () => {
                    this.layout = buildLayout("desktop", (iconName) => this.handleDesktopWindow(iconName));
                });
            });
        });
    }

    draw() {
        this.layout.draw(this.c);
    }

    handleDesktopWindow(iconName) {
        let callback = (iconName) => this.handleDesktopWindow(iconName);
        switch (iconName) {
            case "img/about.png":
                this.layout = buildLayout("aboutWindow", callback);
                break;
            case "img/browser.png":
                this.layout = buildLayout("browserWindow", callback);
                break;
            case "img/education.png":
                this.layout = buildLayout("educationWindow", callback);
                break;
            case "img/experiences.png":
                this.layout = buildLayout("experienceWindow", callback);
                break;
            case "img/projects.png":
                this.layout = buildLayout("projectsWindow", callback);
                break;
            default:
                this.layout = buildLayout("desktop", callback);
        }
    }
}


export default LaviOS;