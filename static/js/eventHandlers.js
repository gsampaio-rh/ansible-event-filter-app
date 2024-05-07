// eventHandlers.js

export function setupSystemBoxHover() {
    document.querySelectorAll('.system-box').forEach(box => {
        box.addEventListener('mouseenter', function () {
            this.querySelector('.system-modal').style.display = 'block';
        });
        box.addEventListener('mouseleave', function () {
            this.querySelector('.system-modal').style.display = 'none';
        });
    });
}
