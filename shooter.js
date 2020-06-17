
class BubbleShooter {
    constructor(width, height) {
        this.width = width;
        this.height = height;

        this.field = this.createField();

        this.canvas = new Canvas();
        this.showArrowCanvas = new Canvas("showArrowCanvas");

        this.drawField();
        this.bindEventListeners();
    }

    createField() {
        var field = [],
            row = [],
            singleField,
            offset = true;

        for (var i = 0; i < this.height; i++) {
            row = [];
            for (var n = 0; n < this.width; n++) {
                singleField = new Field(n, i, offset);
                row.push(singleField);
            }
            field.push(row);
            offset = !offset;
        }

        return field;
    }

    drawField() {
        var offset = true;
        for (var i = 0; i < this.height; i++) {
            for (var n = 0; n < this.width; n++) {
                if (offset) {
                    this.canvas.drawCircle(n * 40 + 40, i * 40 + 20, 18, this.field[i][n].color, 0, this.field[i][n].color);
                } else {
                    this.canvas.drawCircle(n * 40 + 20, i * 40 + 20, 18, this.field[i][n].color, 0, this.field[i][n].color);
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

        for (var i = 0; i < removeBuffer.length; i++) {
            this.remove(removeBuffer[i].x, removeBuffer[i].y);
        }
    }

    /* removes a specific field from the field array */
    remove(posX, posY) {
        var index = this.field.indexOf(posY),
            offset = this.field[posY][posX].isOffset;
        if (index > -1) {
            index = this.field[posY].indexOf(posX);
            if (index > -1) {
                this.field[posY].splice(index, 1);
            }
        }

        if (offset) {
            this.canvas.drawCircle(posX * 40 + 40, posY * 40 + 20, 20, "white", 0, "white");
        } else {
            this.canvas.drawCircle(posX * 40 + 20, posY * 40 + 20, 20, "white", 0, "white");
        }
    }

    bindToHTML() {
        document.body.appendChild(this.canvas.canvas);
        document.body.appendChild(this.showArrowCanvas.canvas);
    }

    bindEventListeners() {
        this.showArrowCanvas.canvas.addEventListener("mousemove", function(event) {
            var mousePos = this.showArrowCanvas.getMousePos(event);
            this.showArrowCanvas.clear();
            this.showArrowCanvas.drawLine(410, 800, mousePos.x, mousePos.y);
        }.bind(this), false);

        this.showArrowCanvas.canvas.addEventListener("click", function(event) {
            console.log("clicking");
        }.bind(this), false);
    }

}

class Field {
    constructor(posX, posY, isOffset) {
        this.x = posX;
        this.y = posY;
        this.isOffset = isOffset;

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
