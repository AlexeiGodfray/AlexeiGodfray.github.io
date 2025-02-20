// Inject CSS to ensure header and section elements sit above the red ball.
document.addEventListener("DOMContentLoaded", function() {
    const element = document.getElementById("typewriter");
    const text = " and Welcome to my website!";
    let index = 0;
    
    function type() {
      if(index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, 100); // Adjust typing speed here.
      }
    }
    
    type();
  });
