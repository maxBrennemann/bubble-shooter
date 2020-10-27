window.onload = initialize;

var global = {
    shooter : null
};

function initialize() {
    global.shooter = new BubbleShooter(20, 20, 20, 10);
    global.shooter.bindToHTML();
}

function startAnimation(args) {
    if (args != null) {
        global.animationArgs = {
            xpos : args[0],
            ypos : args[1],
            color : args[2],
            currx : 0,
            curry : 0
        };
    }

    window.requestAnimationFrame(drawAnimation);
}

function drawAnimation() {
    let args = global.animationArgs;
    let startx = 410;
    let m = (args.ypos - 820) / (args.xpos - 410);
    let t = -420 * m + 820;
    
    if (args.currx == 0) {
        args.currx = startx;
        args.curry = m * args.currx + t;
    } else {
        args.currx = args.currx - 5;
        args.curry = m * args.currx + t;
    }

    if (args.curry > args.ypos) {
        global.shooter.showArrowCanvas.drawCircle(args.currx, args.curry, 18, args.color, 0, args.color);
        window.requestAnimationFrame(drawAnimation);
    }
}
