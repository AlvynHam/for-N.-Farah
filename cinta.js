const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.particles = [];

        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: this.x,
                y: this.y,
                dx: (Math.random() - 0.5) * 6,
                dy: (Math.random() - 0.5) * 6,
                radius: Math.random() * 3 + 2,
                alpha: 1,
                fade: Math.random() * 0.03 + 0.01,
            });
        }
    }

    update() {
        this.particles.forEach((particle) => {
            particle.x += particle.dx;
            particle.y += particle.dy;
            particle.alpha -= particle.fade;
        });

        this.particles = this.particles.filter((p) => p.alpha > 0);
    }

    draw() {
        this.particles.forEach((particle) => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${particle.alpha})`;
            ctx.fill();
        });
    }
}

class Rocket {
    constructor(x, color) {
        this.x = x;
        this.y = canvas.height;
        this.color = color;
        this.dy = -(Math.random() * 2 + 4); // Speed upwards
        this.hasExploded = false;
    }

    update() {
        if (this.y < canvas.height / 2 + Math.random() * 100) {
            this.hasExploded = true;
        } else {
            this.y += this.dy;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`;
        ctx.fill();
    }
}

let rockets = [];
let fireworks = [];

function randomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw rockets
    rockets.forEach((rocket, index) => {
        rocket.update();
        rocket.draw();

        if (rocket.hasExploded) {
            fireworks.push(new Firework(rocket.x, rocket.y, rocket.color));
            rockets.splice(index, 1);
        }
    });

    // Update and draw fireworks
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();

        if (firework.particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    // Randomly add new rockets
    if (Math.random() < 0.1) {
        rockets.push(new Rocket(Math.random() * canvas.width, randomColor()));
    }

    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
