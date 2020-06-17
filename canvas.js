
class Canvas {
    constructor(className) {
        this.canvas = (new CanvasCreation()).createHiDPICanvas(820, 800);

        if (className != null) {
            this.canvas.classList.add(className);
        }

        this.canvasContext = this.canvas.getContext("2d");
    }

    drawCircle(xCoordinate, yCoordinate, radius, fillColor, lineWidth, lineColor) {
        this.canvasContext.beginPath();
        this.canvasContext.arc(xCoordinate, yCoordinate, radius, 0, 2 * Math.PI);
        if (fillColor != "unset") {
            this.canvasContext.fillStyle = fillColor;
            this.canvasContext.fill();
        }
        this.canvasContext.lineWidth = lineWidth;
        this.canvasContext.strokeStyle = lineColor;
        this.canvasContext.stroke();
    }

    drawLine(xStart, yStart, xEnd, yEnd) {
        this.canvasContext.beginPath();
        this.canvasContext.moveTo(xStart, yStart);
        this.canvasContext.lineTo(xEnd, yEnd);
        this.canvasContext.strokeStyle = "#000000";
        this.canvasContext.stroke();
    }

    getMousePos(evt) {
        var rect = this.canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    clear() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

}
