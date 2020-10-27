window.onload = initialize;

var global = {
    shooter : null
};

function initialize() {
    global.shooter = new BubbleShooter(20, 20, 20, 10);
    global.shooter.bindToHTML();
}

function initAnimation(args) {
    if (args != null) {
        global.animationArgs = {
            xpos : args[0],
            ypos : args[1],
            color : args[2],
            currx : 0,
            curry : 0,
            hitField : args[3]
        };
    }
}

async function drawAnimation() {
    let args = global.animationArgs;
    let m = (args.ypos - 820) / (args.xpos - 410);
    let t = -420 * m + 820;

    if (args.currx == 0) {
        args.currx = 410;
        args.curry = 820;
    } else {
        args.curry = args.curry - 10;
        args.currx = (args.curry - t) / m;
    }

    console.log(args.curry + " " + args.ypos);
    if (args.curry > args.ypos) {
        global.shooter.showArrowCanvas.clear();
        global.shooter.showArrowCanvas.drawCircle(args.currx, args.curry, 18, args.color, 0, args.color);
        window.requestAnimationFrame(drawAnimation);
    } else {
        global.shooter.showArrowCanvas.clear();
        global.shooter.continueShoot(args.hitField);
    }
}
