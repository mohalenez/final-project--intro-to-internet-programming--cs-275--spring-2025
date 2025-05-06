(() => {
    let diamondContainer = document.getElementById(`diamond-container`);
    let size = 5; // Default diamond size
    let position = 0;
    let direction = 1; // 1 = right, -1 = left
    let animationId;
    let maxPosition;

    // Create UI elements
    const createUI = () => {
        let displayArea = document.createElement(`div`);
        displayArea.id = `display-area`;
        diamondContainer.appendChild(displayArea);

        let diamond = document.createElement(`div`);
        diamond.id = `diamond`;
        displayArea.appendChild(diamond);

        displayArea = document.getElementById(`display-area`);
        diamond = document.getElementById(`diamond`);

        // Calculate maximum position for animation
        maxPosition = displayArea.offsetWidth - 100;
        window.addEventListener(`resize`, updateMaxPosition);
    };

    const updateMaxPosition = () => {
        const displayArea = document.getElementById(`display-area`);
        maxPosition = displayArea.offsetWidth - 100;
    };

    // Create and show dialog for size input
    const showDialog = () => {
        // Create dialog overlay
        let overlay = document.createElement(`div`);
        overlay.className = `dialog-overlay`;

        // Create dialog box
        let dialog = document.createElement(`div`);
        dialog.className = `dialog`;

        // Dialog content
        dialog.innerHTML = `
        <h3>Enter the size of your diamond as a number.</h3>
        <input type="text" id="size-input" value="${size}">
        <div class="dialog-buttons">
          <button id="cancel-button">Cancel</button>
          <button id="ok-button">OK</button>
        </div>
      `;

        // Add dialog components to DOM
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        // Focus on input
        let input = document.getElementById(`size-input`);
        input.focus();

        // Add event listeners
        document
            .getElementById(`cancel-button`)
            .addEventListener(`click`, () => {
                document.body.removeChild(overlay);
            });

        document.getElementById(`ok-button`).addEventListener(`click`, () => {
            let newSize = parseInt(input.value, 10);
            size = newSize;
            generateDiamond();
            document.body.removeChild(overlay);
        });
    };

    // Generate diamond pattern
    const generateDiamond = () => {
        let diamond = document.getElementById(`diamond`);
        diamond.innerHTML = ``;

        // Generate diamond pattern
        for (let i = 0; i < size / 2; i++) {
            let row = document.createElement(`div`);
            row.className = `diamond-row`;

            let stars;

            stars = 2 * i + 1;
            let spaces = Math.floor(size / 2 - i);

            row.innerHTML = `${`&nbsp;`.repeat(spaces)}${`★`.repeat(stars)}`;
            diamond.appendChild(row);
        }
        for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
            let row = document.createElement(`div`);
            row.className = `diamond-row`;

            let stars;

            stars = Math.floor(2 * i + 1);
            console.log(i);
            let spaces = Math.floor(size / 2 - i);

            row.innerHTML = `${`&nbsp;`.repeat(spaces)}${`★`.repeat(stars)}`;
            diamond.appendChild(row);
        }
        // Reset animation
        position = 0;
        startAnimation();
    };

    // Animate diamond horizontally
    const startAnimation = () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }

        const animate = () => {
            let diamond = document.getElementById(`diamond`);

            // Update position
            position += 2 * direction;

            // Change direction if hitting boundaries
            if (position >= maxPosition) {
                position = maxPosition;
                direction = -1;
            } else if (position <= 0) {
                position = 0;
                direction = 1;
            }

            // Apply new position
            diamond.style.left = `${position}px`;

            // Continue animation
            animationId = requestAnimationFrame(animate);
        };

        animate();
    };

    // Initialize the application
    const init = () => {
        createUI();
        showDialog();
        generateDiamond();
    };

    // Start the app when DOM is fully loaded
    document.addEventListener(`DOMContentLoaded`, init);
})();
