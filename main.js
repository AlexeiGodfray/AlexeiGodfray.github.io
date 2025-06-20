// main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- EFFECT 1: STAGGERED FADE-IN ANIMATION ---
    const bentoItems = document.querySelectorAll('.bento-item');
    bentoItems.forEach((item, index) => {
        // We calculate a delay based on the item's index in the grid
        const delay = index * 100; // 100ms delay between each item
        setTimeout(() => {
            item.classList.add('visible');
        }, delay);
    });

    // --- EFFECT 2: TYPEWRITER FOR PROFILE TEXT ---
    const nameEl = document.getElementById('typewriter-name');
    const subtitleEl = document.getElementById('typewriter-subtitle');
    const nameText = "Alexei Godfray";
    const subtitleText = "Software Engineer & Computer Science Student";

    // Reusable typewriter function
    function typeWriter(element, text, speed, callback) {
        let i = 0;
        element.innerHTML = ''; // Clear element content
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        element.appendChild(cursor);

        function type() {
            if (i < text.length) {
                // Insert character before the cursor
                element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback(); // Execute callback when done
            }
        }
        type();
    }

    // Start typing the name, then the subtitle in a chain
    typeWriter(nameEl, nameText, 75, () => {
        // After name is typed, start typing subtitle
        typeWriter(subtitleEl, subtitleText, 50, () => {
             // Optional: remove cursor after everything is typed
            const cursor = subtitleEl.querySelector('.typewriter-cursor');
            if(cursor) cursor.style.display = 'none';
        });
    });


    // --- EFFECT 3: INTERACTIVE 3D TILT ON HOVER ---
    bentoItems.forEach(item => {
        const maxTilt = 8; // Max tilt in degrees

        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse x position within the element.
            const y = e.clientY - rect.top;  // Mouse y position within the element.

            // Calculate tilt based on mouse position
            const tiltX = (maxTilt / 2) - (y / rect.height) * maxTilt;
            const tiltY = (x / rect.width) * maxTilt - (maxTilt / 2);

            // Apply a 3D transform. 'perspective' is key for the 3D effect.
            item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            item.style.transition = 'transform 0.1s ease-out';
        });

        item.addEventListener('mouseleave', () => {
            // Reset transform when mouse leaves
            item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            item.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
        });
    });
});