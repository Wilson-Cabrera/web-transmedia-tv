// Modal
const modal = document.getElementById("myModal");
const closeModalButton = document.getElementById("closeModal");

// Canvas - Cielo Estrellado con Nebulosa
const canvas = document.getElementById('skyCanvas');
const ctx = canvas.getContext('2d');

// Configuración inicial
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Parámetros
const numStars = 150; // Número de estrellas
const numConstellations = 5; // Número de constelaciones

let stars = [];
let constellations = [];
let mouseX = 0;
let mouseY = 0;
let clickedConstellation = null;
let soundWaves = [];

// Crear estrellas
function createStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
        });
    }
}

// Crear constelaciones
function createConstellations() {
    constellations = [];
    const rows = Math.ceil(Math.sqrt(numConstellations));
    const cols = Math.ceil(numConstellations / rows);
    const cellWidth = canvas.width / cols;
    const cellHeight = canvas.height / rows;

    const verticalMargin = canvas.height * 0.3;

    for (let i = 1; i <= numConstellations; i++) {
        const image = new Image();
        image.src = `images/constellation${i}.png`;
        image.onload = () => {
            const row = Math.floor((i - 1) / cols);
            const col = (i - 1) % cols;

            const x = col * cellWidth + (cellWidth - image.width * 0.5) / 2;
            const y = row * cellHeight + (cellHeight - image.height * 0.5) / 2 + verticalMargin;

            constellations.push({
                img: image,
                x,
                y,
                width: image.width * 0.2,
                height: image.height * 0.2,
                scale: 0.2,
                isOrion: i === 1,
            });
        };
    }
}

// Detectar clic en constelaciones
function checkClick() {
    for (let i = 0; i < constellations.length; i++) {
        const con = constellations[i];

        if (
            mouseX >= con.x &&
            mouseX <= con.x + con.width &&
            mouseY >= con.y &&
            mouseY <= con.y + con.height
        ) {
            clickedConstellation = i;
            createSoundWaves(con.x + con.width / 2, con.y + con.height / 2);
            openModal();
        }
    }
}

// Crear ondas sonoras
function createSoundWaves(x, y) {
    for (let i = 0; i < 5; i++) {
        soundWaves.push({
            x,
            y,
            radius: 20 + i * 10,
            opacity: 1 - i * 0.2,
        });
    }
}

// Dibujar ondas sonoras
function drawSoundWaves() {
    soundWaves.forEach((wave, index) => {
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${wave.opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Expansión y desvanecimiento de las ondas
        wave.radius += 1.5;
        wave.opacity -= 0.02;

        // Eliminar ondas que desaparecieron
        if (wave.opacity <= 0) {
            soundWaves.splice(index, 1);
        }
    });
}

// Declaramos el sonido de escritura a nivel global
let typingSound = new Audio('typing-sound.mp3');  // Asegúrate de que la ruta del archivo de sonido sea correcta
typingSound.loop = false; // No necesitamos loop, se sincroniza con el tiempo

function openModal() {
    const modalContent = document.querySelector(".modal-content");
    const modal = document.getElementById("myModal");

    let content = '';
    switch (clickedConstellation) {
        case 0:
            content = `
                <h2>Constelación 1: Orión</h2>
                <p id="typingEffect">¡Bienvenido a la famosa constelación de Orión! Aquí está el contenido de tu constelación 1.</p>
                <video id="videoOrion" controls>
                    <source src="video/orion1.mp4" type="video/mp4">
                    Tu navegador no soporta el formato de video.
                </video>
            `;
            break;
        case 1:
            content = `
                <h2>Constelación 2: Escorpión</h2>
                <p id="typingEffect">Explora la constelación de Escorpión, una de las más conocidas por su forma de "W".</p>
                <video id="videoEscorpion" controls>
                    <source src="video/cap2.mp4" type="video/mp4">
                    Tu navegador no soporta el formato de video.
                </video>
            `;
            break;
        case 2:
            content = `
                <h2>Constelación 3: Ursa Mayor</h2>
                <p id="typingEffect">La famosa Ursa Mayor, un punto de referencia en el cielo para muchos observadores.</p>
                <video id="videoUrsa" controls>
                    <source src="video/cap3.mp4" type="video/mp4">
                    Tu navegador no soporta el formato de video.
                </video>
            `;
            break;
        default:
            content = `<p id="typingEffect">Esta es una constelación misteriosa sin nombre.</p>`;
    }

    modalContent.innerHTML = content;
    modal.style.display = "block";

    // Reproducir el video automáticamente al abrir el modal
    const video = modal.querySelector("video");
    if (video) {
        video.play().catch(error => {
            console.log("Error al intentar reproducir el video:", error);
        });
    }

    // Aplica el efecto de escritura al párrafo con ID "typingEffect"
    const textToType = document.getElementById("typingEffect").innerText;
    typeEffect("typingEffect", textToType);
}

// Función para el efecto de escritura con sonido sincronizado
function typeEffect(elementId, text, speed = 100) {
    const element = document.getElementById(elementId);
    element.innerHTML = ""; // Limpia el contenido previo
    let i = 0;

    // Agrega el cursor parpadeante
    const cursor = document.createElement('span');
    cursor.id = 'cursor';
    cursor.innerText = '|';
    element.appendChild(cursor);

    // Calcular el tiempo total de escritura basado en el texto y la velocidad
    const totalTime = text.length * speed; // Tiempo total de escritura (en milisegundos)
    
    // Reproducir el sonido solo por el tiempo que dure la escritura
    typingSound.play();
    setTimeout(() => {
        typingSound.pause();  // Detener el sonido al final de la escritura
        typingSound.currentTime = 0;  // Resetea el tiempo de reproducción
    }, totalTime); // El sonido dura el mismo tiempo que tarda en escribirse el texto

    // Función para escribir un carácter
    function typeCharacter() {
        if (i < text.length) {
            element.innerHTML = text.slice(0, i) + "<span id='cursor'>|</span>"; // Escribe el texto con el cursor
            i++;
            setTimeout(typeCharacter, speed);
        } else {
            // Cuando se termine de escribir, eliminamos el cursor
            document.getElementById("cursor").style.display = "none";
        }
    }

    typeCharacter();
}

// Cerrar el modal y detener sonidos al cerrarlo
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
    
    // Detener el sonido de escritura si está en reproducción
    if (typingSound) {
        typingSound.pause();
        typingSound.currentTime = 0; // Resetea el tiempo de reproducción
    }

    // Detener cualquier video en el modal
    const video = modal.querySelector("video");
    if (video) {
        video.pause();  // Detener el video cuando se cierra el modal
        video.currentTime = 0;  // Resetea el tiempo de reproducción del video
    }
}

// Evento para cerrar el modal cuando se hace clic en el botón de cerrar
document.addEventListener('DOMContentLoaded', () => {
    const closeModalButton = document.getElementById('closeModal');
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }

    // Evento para cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
        const modal = document.getElementById("myModal");
        if (event.target === modal) {
            closeModal();
        }
    };
});



// Dibujar estrellas
function drawStars() {
    stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    });
}

// Mover estrellas
function moveStars() {
    stars.forEach((star) => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
}

// Dibujar constelaciones con resplandor
function drawConstellations() {
    constellations.forEach((con) => {
        const isHovered = mouseX >= con.x && mouseX <= con.x + con.width && mouseY >= con.y && mouseY <= con.y + con.height;

        if (isHovered) {
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
            ctx.shadowBlur = 20;
        } else {
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
        }

        ctx.drawImage(con.img, con.x, con.y, con.width, con.height);
    });
}

// Animar
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveStars();
    drawStars();
    drawConstellations();
    drawSoundWaves();
    requestAnimationFrame(animate);
}

// Ajustar tamaño y reposicionar contenido
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    stars.forEach((star) => {
        star.x = Math.random() * canvas.width;
        star.y = Math.random() * canvas.height;
    });

    createConstellations();
}

// Evento de redimensionamiento
window.addEventListener('resize', resizeCanvas);

// Evento de movimiento del mouse
canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Evento de clic del mouse
canvas.addEventListener('click', () => {
    checkClick();
});


//tituloooooo
window.onload = function() {
    const title = document.getElementById('title');
    const text = title.innerText;
    title.innerHTML = '';  // Limpiar el contenido del título

    // Dividir el texto en letras y envolver cada una en un <span>
    for (let i = 0; i < text.length; i++) {
        const letter = document.createElement('span');
        letter.innerText = text[i];
        title.appendChild(letter);
    }

    const letters = title.querySelectorAll('span');

    // Función para aplicar un efecto de animación (sin distorsión)
    function applyAnimation() {
        letters.forEach(letter => {
            letter.style.transition = 'all 0.5s ease-in-out'; // Suaviza la animación
        });
    }

    // Llamar a la animación en un intervalo
    setInterval(applyAnimation, 500);  // Ajusta el tiempo de intervalo si es necesario
};




// Inicialización
createStars();
createConstellations();
animate();


