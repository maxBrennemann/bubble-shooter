
class BubbleShooter {
    constructor(width, height, setX, setY) {
        this.width = width;
        this.height = height;

        this.field = this.createField(setX, setY);

        this.canvas = new Canvas();
        this.showArrowCanvas = new Canvas("showArrowCanvas");

        this.showNextColor = document.createElement("span");

        this.drawField();
        this.bindEventListeners();

        this.nextBubble = new Field(-1, -1, false);
    }

    createField(setX, setY) {
        var field = [],
            row = [],
            singleField,
            offset = true;

        for (var i = 0; i < this.height; i++) {
            row = [];
            for (var n = 0; n < this.width; n++) {
                if (i < setY && n < setX)
                    singleField = new Field(n, i, offset);
                else
                    singleField = new Field(n, i, offset, true)
                row.push(singleField);
            }
            field.push(row);
            offset = !offset;
        }

        return field;
    }

    drawField() {
        var offset = true,
            currField;
        for (var i = 0; i < this.height; i++) {
            for (var n = 0; n < this.width; n++) {
                currField = this.field[i][n];
                if (!currField.isEmpty) {
                    if (offset) {
                        this.canvas.drawCircle(n * 40 + 40, i * 40 + 20, 18, currField.color, 0, currField.color);
                    } else {
                        this.canvas.drawCircle(n * 40 + 20, i * 40 + 20, 18, currField.color, 0, currField.color);
                    }
                }
            }
            offset = !offset;
        }
    }

    removeByHit(posX, posY) {
        var currField = this.field[posY][posX];

        var isCheckedBuffer = [];
        var removeBuffer = [];
        var toCheckBuffer = [currField];

        var currElement;
        var neighbors;

        while (toCheckBuffer.length > 0) {
            currElement = toCheckBuffer[0];

            if (currElement.color == currField.color) {
                neighbors = currElement.getNeighbors();

                for (var i = 0; i < neighbors.length; i++) {
                    if (!isCheckedBuffer.includes(neighbors[i]) && !toCheckBuffer.includes(neighbors[i])) {
                        toCheckBuffer.push(neighbors[i]);
                    }
                }

                removeBuffer.push(currElement);
            }

            isCheckedBuffer.push(currElement);
            toCheckBuffer.shift();
        }

        if (removeBuffer.length >= 3) {
            for (var i = 0; i < removeBuffer.length; i++) {
                this.remove(removeBuffer[i].x, removeBuffer[i].y);
            }
        }
    }

    /* removes a specific field from the field array */
    remove(posX, posY) {
        var offset = this.field[posY][posX].isOffset;
        this.field[posY][posX] = new Field(posX, posY, offset, true);

        if (offset) {
            this.canvas.drawCircle(posX * 40 + 40, posY * 40 + 20, 20, "white", 0, "white");
        } else {
            this.canvas.drawCircle(posX * 40 + 20, posY * 40 + 20, 20, "white", 0, "white");
        }
    }

    bindToHTML() {
        document.body.appendChild(this.canvas.canvas);
        document.body.appendChild(this.showArrowCanvas.canvas);
        document.body.appendChild(this.showNextColor);
        this.displayNextColor();
    }

    displayNextColor() {
        this.showNextColor.innerHTML = this.nextBubble.color;
    }

    bindEventListeners() {
        this.showArrowCanvas.canvas.addEventListener("mousemove", function(event) {
            var mousePos = this.showArrowCanvas.getMousePos(event);
            this.showArrowCanvas.clear();
            this.showArrowCanvas.drawLine(410, 820, mousePos.x, mousePos.y);

            let m = (mousePos.y - 820) / (mousePos.x - 410);
            let t = -420 * m + 820;
            
            if (mousePos.x < 410) {
                this.showArrowCanvas.drawLine(410, 820, 0, t);
                m = (-1) * m;
                let x = (-t) / m;
                this.showArrowCanvas.drawLine(0, t, x, 0);
            } else {
                let y = m * 820 + t;
                this.showArrowCanvas.drawLine(410, 820, 820, y);

                this.showArrowCanvas.drawLine(410, 820, 0, y);
                this.showArrowCanvas.drawLine(820, y, 410, y - (820 - y));
            }
        }.bind(this), false);

        this.showArrowCanvas.canvas.addEventListener("click", function(event) {
            console.log("clicking");
            var mousePos = this.showArrowCanvas.getMousePos(event);

            this.shoot(mousePos.x, mousePos.y)
        }.bind(this), false);
    }

    /*
    * https://math.stackexchange.com/questions/228841/how-do-i-calculate-the-intersections-of-a-straight-line-and-a-circle
    */
    shoot(currX, currY) {
        var gradient = (currY - 820) / (currX - 410),
            offsetY = 820 - gradient * 410,
            x;

        for (var i = 0; i < this.height; i++) {
            x = (820 - i * 40 - offsetY) / gradient;
            if (x > 0 ) {
                var hit = Math.floor(x / 40);
                var hitField;
                var collides;

                var flagBreak = false;

                for (var n = hit - 1; n <= hit + 1; n++) {
                    hitField = this.field[this.height - i - 1][n];
                    if (hitField != null && !hitField.isEmpty) {

                        if (hitField.isOffset) {
                            collides = this.checkColision(currX, currY, hitField.x * 40 + 40, hitField.y * 40 + 20, 18, -1);
                            collides = collides || this.checkColision(currX, currY, hitField.x * 40 + 40, hitField.y * 40 + 20, 18, 1);
                        } else {
                            collides = this.checkColision(currX, currY, hitField.x * 40 + 20, hitField.y * 40 + 20, 18, -1);
                            collides = collides || this.checkColision(currX, currY, hitField.x * 40 + 20, hitField.y * 40 + 20, 18, 1);
                        }
                    }

                    if (collides)
                        flagBreak = true;
                }

                if (flagBreak) {
                    hit = Math.round(x / 40) - 1;
                    hitField = this.field[this.height - i][hit];
                    this.nextBubble.x = hit;
                    this.nextBubble.y = this.height - i;
                    this.nextBubble.isOffset = hitField.isOffset;

                    hitField = this.field[this.height - i][hit] = this.nextBubble;
                    this.nextBubble = new Field(-1, -1, false);
                    this.displayNextColor();
                    if (hitField.isOffset) {
                        this.canvas.drawCircle(hitField.x * 40 + 40, hitField.y * 40 + 20, 18, hitField.color, 0, hitField.color);
                    } else {
                        this.canvas.drawCircle(hitField.x * 40 + 20, hitField.y * 40 + 20, 18, hitField.color, 0, hitField.color);
                    }

                    this.removeByHit(hitField.x, hitField.y);
                    startAnimation([hitField.x * 40, hitField.y * 40, hitField.color]);

                    break;
                }
            } else {
                console.log("negative number, implementation is coming soon");
            }
        }
    }

    checkColision(currX, currY, circleX, circleY, radius, margin) {
        currX = currX - margin * radius;

        var gradient = (currY - 820) / (currX - (410 - margin * radius)),
            offsetY = 820 - gradient * (410 - margin * radius),
            A = gradient * gradient + 1,
            B = 2 * (gradient * offsetY - gradient * circleY - circleX),
            C = circleY * circleY - radius * radius + circleX * circleX - 2 * offsetY * circleY + offsetY * offsetY,
            D = B * B - 4 * A * C;

        this.showArrowCanvas.drawLine(410 - margin * radius, 820, currX, currY);
            
        if (D < 0) {
            return false;
        } else {
            return true;
        }
    }

}

class Field {
    constructor(posX, posY, isOffset, isEmpty) {
        this.x = posX;
        this.y = posY;
        this.isOffset = isOffset;
        this.isEmpty = isEmpty == null ? false : isEmpty;

        if (!this.isEmpty)
            this.color = this.getRandomColor();

        this.neighborsPosNoOffset = [
            [-1,  0],
            [+1,  0],
            [-1, +1],
            [ 0, +1],
            [-1, -1],
            [ 0, -1]
        ];

        this.neighborsPosOffset = [
            [-1,  0],
            [+1,  0],
            [+1, +1],
            [ 0, +1],
            [+1, -1],
            [ 0, -1]
        ]
    }

    getRandomColor() {
        var colorArr = [
            "red", "green", "blue", "yellow", "black", "purple"
        ];

        var random = Math.floor((Math.random() * 6));
        return colorArr[random];
    }

    getNeighbors() {
        var neighbors = [];
        var neighborsPos = this.isOffset ? this.neighborsPosOffset : this.neighborsPosNoOffset;

        for (var i = 0; i < neighborsPos.length; i++) {
            var posX = this.x + neighborsPos[i][0];
            var posY = this.y + neighborsPos[i][1];
            if (posY >= 0 && posY < global.shooter.field.length) {
                var currField = global.shooter.field[posY][posX];
                if (currField != undefined) {
                    neighbors.push(currField);
                }
            }
        }

        return neighbors;
    }

}
