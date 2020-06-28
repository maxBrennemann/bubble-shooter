window.onload = initialize;

var global = {
    shooter : null
};

function initialize() {
    global.shooter = new BubbleShooter(20, 20, 20, 10);
    global.shooter.bindToHTML();
}
