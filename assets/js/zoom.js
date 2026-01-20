document.addEventListener('DOMContentLoaded', () => {
    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    document.body.appendChild(zoomOverlay);

    const mockupImages = document.querySelectorAll('.mockup-image');

    mockupImages.forEach(img => {
        img.addEventListener('click', (e) => {
            zoomOverlay.innerHTML = '';
            const clonedImg = img.cloneNode();
            clonedImg.className = 'zoom-img';
            clonedImg.style.transform = 'scale(0.5)';
            zoomOverlay.appendChild(clonedImg);

            // Trigger animation
            zoomOverlay.classList.add('active');
            requestAnimationFrame(() => {
                clonedImg.style.transform = 'scale(1)';
            });
        });
    });

    zoomOverlay.addEventListener('click', () => {
        const zoomedImg = zoomOverlay.querySelector('.zoom-img');
        if (zoomedImg) {
            zoomedImg.style.transform = 'scale(0.5)';
        }
        zoomOverlay.classList.remove('active');

        // Cleanup after animation
        setTimeout(() => {
            if (!zoomOverlay.classList.contains('active')) {
                zoomOverlay.innerHTML = '';
            }
        }, 400);
    });
});
