/**
 * Layout Classes and buildLayout declaration.
 */

/**
 * Return a new layout with the provided type
 * @param {String} type booting, desktop
 * @param {Function} callback Depending on the layout, is utilized at a certain time
 * @returns {Layout} A new layout
 */
function buildLayout(type, callback=()=>{}) {
    switch(type) {
        case "login":
            return new LoginLayout(callback);
        case "matrix":
            return new MatrixLayout(callback);
        case "booting":
            return new BootingLayout(callback);
        case "desktop":
            return new DesktopLayout(callback);
        case "aboutWindow":
            return new AboutLayout(callback);
        case "browserWindow":
            return new BrowserLayout(callback);
        case "experienceWindow":
            return new ExperiencesLayout(callback);
        case "educationWindow":
            return new EducationLayout(callback);
        case "projectsWindow":
            return new ProjectsLayout(callback);
        default:
            return new Layout(callback);
    }
}


class Layout {
    constructor() {
        // Draw Command Storage
        this.shapeCommands = [];
        // Redraw Variable 
        this.canvasDim = null;
        // Frame Count
        this.frameCount = 0;
        // Canvas Background
        this.background = "";
        // Dim Change Element Drawing
        this.dimElements = [];
    }

    /**
     * @param {p5Canvas} canvas
     * @returns True if the dimensions of the canvas changed, false otherwise.
     */
    dimChange(canvas) {
        return this.canvasDim == null || 
        this.canvasDim[0] != canvas.screenWidth ||
        this.canvasDim[1] != canvas.screenHeight;
    }

    /**
     * Store the dimensions of the canvas. Should be used
     * in conjuction with dimChange.
     * @param {p5Canvas} canvas 
     */
    storeDim(canvas) {
        this.canvasDim = [canvas.screenWidth, canvas.screenHeight];
    }

    draw(canvas) {
        this.frameCount++;

        if (this.background != "") {
            canvas.background(this.background);
        }

        if (this.dimChange(canvas)) {
            canvas.removeElements();
            for (let dimCommand of this.dimElements) {
                dimCommand(canvas);
            }
        }

        for (let shapeCommand of this.shapeCommands) {
            shapeCommand(canvas);
        }

        this.storeDim(canvas);
    }

    push(command) {
        this.dimElements.push(command);
    }
}

class LoginLayout extends Layout {
    constructor(callback) {
        super();

        this.background = "gray";

        // Draw the inputs and logo onto the screen
        let loginElements = (canvas) => {
            // Draw Logo
            let logo = canvas.createImg("img/lavilogo.png");
            logo.position(canvas.screenWidth / 2 - 50, canvas.screenHeight / 2 - 150);
            logo.size(100, 100);
            
            // Draw Guest Header
            let guest = canvas.createP("Guest");
            guest.elt.style["font-size"] = "2em";
            guest.elt.style["width"] = "min-content";
            guest.elt.style["margin"] = 0;
            guest.position(canvas.screenWidth / 2 - guest.elt.offsetWidth / 2,
                           canvas.screenHeight / 2 - guest.elt.offsetHeight);
            
            // Draw Input
            let input = canvas.createInput('');
            input.elt.placeholder = "Password";
            input.elt.style["font-size"] = "1em";
            input.elt.style["padding"] = "5px";
            input.elt.style["width"] = "min-content";
            input.elt.style["margin"] = 0;
            input.elt.type = "password";
            input.size(200); // Sets width
            input.position(canvas.screenWidth / 2 - input.elt.offsetWidth / 2,
                           canvas.screenHeight / 2 + 20);

            // Input Event Listener
            input.elt.addEventListener('keyup', (evt) => {
                if (input.elt.value.length >= 10) {
                    callback();
                    return;
                }
            });

            // Draw Hint
            let hint = canvas.createP("Hint: Type random keys to proceed!");
            hint.elt.style["font-size"] = "1em";
            hint.elt.style["width"] = "231px";
            hint.elt.style["margin"] = 0;
            hint.position(canvas.screenWidth / 2 - hint.elt.offsetWidth / 2,
                          canvas.screenHeight / 2 + 70);
        }

        this.dimElements.push(loginElements);
    }
}

class MatrixLayout extends Layout {
    constructor(callback) {
        super();

        this.background = "black";

        this.allText = ["> ssh 219.1.111.65",
                        "> cd master",
                        "Enter Password: ",
                        "> •••••••••••",
                        "Permission Denied",
                        "> npm install git",
                        "> git pull jacktheripper",
                        "> 1233014002",
                        "> load jacktheripper > master",
                        "Cracking..............Cracked!",
                        "Permission Granted",
                        "> ./virtualportfolio",
                        "Welcome to LaviOS!",
                        "Accessing Pirjot Atwal's Virtual Portfolio Desktop",
                        ".................................................",
                        ".................................................",
                        "Previous Login Session Corrupted (╯°□°)╯︵ ┻━┻ ",
                        "Entering Boot State Momentarily",
                        "................................................",
                        "................................................"];

        this.spacer = 20;

        let matrixElement = (canvas) => {
            canvas.removeElements();
            this.frameCount += 6; // Accelerate Draw Rate

            // Reset Spacer if needed
            if (this.dimChange(canvas)) {
                this.spacer = 20;
            }

            // Calculate Text to Display
            let displayLines = 0;
            let sum = 0;
            for (let i = 0; i < this.allText.length; i++) {
                sum += this.allText[i].length;
                if (this.frameCount < sum) {
                    break;
                } 
                displayLines++;
            }

            // End Condition
            if (this.frameCount >= sum) {
                callback();
                return;
            }
            
            // Extend spacer definition
            let spacer = this.spacer;
            function displayLine(textContent) {
                let matrixLine = canvas.createP(textContent);
                matrixLine.elt.style["color"] = "green";
                matrixLine.elt.style["margin"] = 0;
                matrixLine.elt.style["font-family"] = "Courier";
                matrixLine.elt.style["font-size"] = "1em";
                matrixLine.position(20, spacer);
                spacer += matrixLine.elt.offsetHeight;
            }
            this.spacer = spacer;


            // Display All Lines Needed
            for (let i = 0; i < displayLines; i++) {
                displayLine(this.allText[i]);
            }
            // Display the last line
            displayLine(this.allText[displayLines].slice(0, this.frameCount - sum));
        }

        this.shapeCommands.push(matrixElement);
    }
}


class BootingLayout extends Layout {
    constructor(callback) {
        super();

        this.background = "gray";

        // Initialize the Booting menu
        let bootingLabel = (canvas) => {
            canvas.removeElements();
            
            let label = canvas.createP("Loading LaviOS...");
            // Set parameters
            label.elt.style["font-size"] = "2em";
            label.elt.style["width"] = "min-content";
            label.elt.style["margin"] = 0;
            let leftOffset = canvas.screenWidth / 2 - label.elt.offsetWidth / 2;
            let topOffset = canvas.screenHeight / 2 - label.elt.offsetHeight;
            
            label.position(leftOffset, topOffset);
        }
        let loadingBar = (canvas) => {
            if (this.frameCount >= 200) {
                callback();
                return;
            }
            this.frameCount += 4; // Accelerate Frame Count
            
            // Draw Rectangles for Loading Bar
            canvas.push();
            canvas.rect(canvas.screenWidth / 2 - 100, 
                        canvas.screenHeight / 2,
                        200, 
                        20);
            canvas.fill('blue');
            canvas.rect(canvas.screenWidth / 2 - 100, 
                        canvas.screenHeight / 2,
                        this.frameCount, 
                        20);
            canvas.pop();
        };
        
        this.shapeCommands.push(bootingLabel, loadingBar);
    }
}

class DesktopLayout extends Layout {
    constructor(callback) {
        super(callback);

        // Constants
        this.spacer = 30;
        this.iconSize = 60;
        this.bottomBarSize = 75;
        this.gridSpacer = 30;


        // Draw the Desktop
        this.icons = ["img/lavilogo.png", 
                     "img/about.png", 
                     "img/projects.png"];
        this.desktopIcons = ["img/experiences.png", 
                            "img/browser.png", 
                            "img/education.png",
                            // "img/music.png"
                        ];

        let drawIcons = (canvas) => {
            // Draw Icons in Lower Bar
            let tracker = this.spacer;
            for (let icon of this.icons) {
                let newIcon = canvas.createImg(icon);
                newIcon.position(tracker, canvas.screenHeight - this.bottomBarSize + (this.bottomBarSize - this.iconSize) / 2);
                newIcon.elt.style["height"] = this.iconSize + "px";
                newIcon.elt.classList.add("icon");
                newIcon.elt.addEventListener("click", (evt) => callback(icon));
                
                tracker += this.iconSize + this.spacer; 
            }

            // Draw Background
            canvas.loadImage("img/purplebackground.jpg", (img) => {
                canvas.image(img, 0, 0, canvas.screenWidth, canvas.screenHeight - this.bottomBarSize);
            });
        }

        let drawGrid = (canvas) => {
            // Calculate the amount of icons that can fit in a column (using gridSpacer, iconSize, and bottomBarSize)
            let pixelSum = this.gridSpacer + this.iconSize;
            let columnAmount = Math.floor((canvas.screenHeight - this.bottomBarSize) / pixelSum);


            // Draw Icons by Column
            let ySpacer = this.gridSpacer;
            let xSpacer = this.gridSpacer;
            let currentColumn = 0;
            for (let i = 0; i < this.desktopIcons.length; i++) {
                if (currentColumn >= columnAmount) {
                    currentColumn = 0;
                    ySpacer = this.gridSpacer;
                    xSpacer += this.iconSize + this.gridSpacer;
                }

                let newIcon = canvas.createImg(this.desktopIcons[i]);
                newIcon.position(xSpacer, ySpacer);
                newIcon.elt.style["height"] = this.iconSize + "px";
                newIcon.elt.classList.add("icon");
                newIcon.elt.addEventListener("click", (evt) => callback(this.desktopIcons[i]));

                ySpacer += this.iconSize + this.gridSpacer;
                currentColumn++;
            }
        }

        this.timeTimer = null;
        let drawTime = (canvas) => {
            // Get the time, Draw the Element
            let timer = canvas.createP();
            timer.position(canvas.screenWidth - 200,
                           canvas.screenHeight - this.bottomBarSize / 2 - 9);
            timer.size(180, 18);
            timer.style("margin", "0");

            clearInterval(this.timeTimer);
            this.timeTimer = setInterval(() => {
                let date = new Date();
                timer.html(date.toDateString() + " " + date.toTimeString().slice(0, 8));
            }, 500);
        }

        let lowerBar = (canvas) => {
            canvas.push();
            // Draw Large Rectangle
            canvas.rect(0,
                        canvas.screenHeight - this.bottomBarSize,
                        canvas.screenWidth,
                        this.bottomBarSize);
            canvas.pop();
        }

        this.dimElements.push(drawIcons, drawGrid, drawTime);
        this.shapeCommands.push(lowerBar);
    }
}

class WindowLayout extends DesktopLayout {
    constructor(callback) {
        super(callback);
        
        this.XOffset = 100;
        this.YOffset = 20;

        let setDimensions = (canvas) => {
            this.browserWidth = canvas.screenWidth - this.XOffset - 20;
            this.browserHeight = canvas.screenHeight - (this.bottomBarSize + this.YOffset + 20);
        }

        let drawXBox = (canvas) => {
            let size = 30;

            let xDiv = canvas.createDiv();
            xDiv.position(this.XOffset + this.browserWidth - size, this.YOffset + 2);
            xDiv.size(size, size);
            xDiv.elt.style["z-index"] = 999;

            let icon = document.createElement("i");
            icon.classList.add("fa", "fa-times", "fa-xl");
            icon.classList.add("xIcon");

            icon.addEventListener("click", (evt) => {
                callback();
            });

            xDiv.elt.append(icon);
        }

        let drawBrowser = (canvas) => {
            this.browserDiv = canvas.createDiv();
            this.browserDiv.position(this.XOffset, this.YOffset);
            this.browserDiv.style("background-color", "lightblue");
            this.browserDiv.style("padding", "0");
            this.browserDiv.style("overflow", "auto")
            this.browserDiv.style("border-radius", "2%");
            this.browserDiv.size(this.browserWidth, this.browserHeight);
        }

        let drawBackground = (canvas) => {
            // canvas.rect(this.XOffset, this.YOffset, this.browserWidth,
            //     this.browserHeight);
        }

        this.dimElements.push(setDimensions, drawXBox, drawBrowser);
        this.shapeCommands.push(drawBackground);
    }

    loadHTML(fileName) {
        let drawFunction = async (canvas) => { 
            let html = await (await fetch(fileName)).text();
            this.browserDiv.html(html);
        };
        
        this.dimElements.push(drawFunction);
    }
}

class AboutLayout extends WindowLayout {
    constructor(callback) {
        super(callback);
        
        this.loadHTML("htmlLayouts/about.html");
    }
}

class BrowserLayout extends WindowLayout {
    constructor(callback) {
        super(callback);

        this.loadHTML("htmlLayouts/browser.html");
    }
}

class ExperiencesLayout extends WindowLayout {
    constructor(callback) {
        super(callback);

        this.loadHTML("htmlLayouts/experiences.html");
    }
}

class EducationLayout extends WindowLayout {
    constructor(callback) {
        super(callback);

        this.loadHTML("htmlLayouts/education.html");
    }
}

class ProjectsLayout extends WindowLayout {
    constructor(callback) {
        super(callback);

        this.loadHTML("htmlLayouts/projects.html");
    }
}

export default buildLayout;