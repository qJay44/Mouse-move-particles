const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mouse = {
    x : undefined,
    y : undefined,
}

var hue = 0;

var w = canvas.width = window.innerWidth;
var h = canvas.height= window.innerHeight;

window.onresize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}


class Particle {
    constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 20 + 1;
        this.speedX = Math.random() * (5 + 5 + 1) - 5;
        this.speedY = Math.random() * (5 + 5 + 1) - 5;
        this.color = `hsla(${hue}, 100%, 50%, 1)`;
    }
    
    // draw circle
    drawParticle() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x + this.size >= w) this.speedX *= -1;
        if (this.x - this.size <= 0) this.speedX *= -1;

        if (this.y + this.size >= h) this.speedY *= -1;
        if (this.y - this.size <= 0) this.speedY *= -1;

        this.size -= 0.15;
    }
}

var particlesArray = [];

// creating particles
canvas.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
    for (let i = 0; i < 2; i++) {
        particlesArray.push(new Particle());
    }
});

// updating circle positions
function updateParticle() {
    for (let i = 0; i < particlesArray.length; i++) {
        // removing emelent from the array when size <= 0
        if (particlesArray[i].size <= 0) {
            particlesArray.splice(i, 1);
            i--
            continue;
        }

        particlesArray[i].drawParticle();

        // drawing lines
        for (let j = 0; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx ** 2 + dy ** 2);
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = changeOpacity(particlesArray[i].color, distance);
                ctx.lineWidth = 1;
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                ctx.stroke();
                ctx.closePath();
            }
        }
    }
}

// opacity that depends on the distance between circles
function changeOpacity(color, distance) {
    let opacityScale = Math.floor(distance / 100 * 10) / 10;
    return `${color.substring(0, color.indexOf('1)'))}${1 - opacityScale})`;
}

// animation loop
function animate() {
    ctx.fillStyle = 'hsla(0, 0%, 7%, 0.01)';
    ctx.fillRect(0, 0, w, h);
    updateParticle();
    hue != 360 ? hue++ : hue = 0;

    requestAnimationFrame(animate);
}

animate();