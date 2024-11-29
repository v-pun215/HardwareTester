document.addEventListener("DOMContentLoaded", function() {
    let easterEggTimer = null;

    function getControllerInfo() {
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                const gamepad = gamepads[i];
                const controllerName = gamepad.id;
                const supportsVibration = gamepad.vibrationActuator ? "Yes" : "No";
                const supportsHaptics = gamepad.hapticActuators && gamepad.hapticActuators.length > 0 ? "Yes" : "No";
                const mapping = gamepad.mapping || "standard";

                console.log(`Gamepad connected: ${controllerName}`);
                console.log(`Supports Vibration: ${supportsVibration}`);
                console.log(`Supports Haptics: ${supportsHaptics}`);
                console.log(`Mapping: ${mapping}`);

                document.getElementById('controller-name').innerText = controllerName;
                document.getElementById('controller-vibration').innerText = supportsVibration;
                document.getElementById('controller-haptics').innerText = supportsHaptics;
                document.getElementById('controller-mapping').innerText = mapping;

                updateControllerInfo();
                return;
            }
        }
        console.log('No gamepad connected');
        document.getElementById('controller-name').innerText = 'No gamepad connected';
        document.getElementById('controller-vibration').innerText = 'N/A';
        document.getElementById('controller-haptics').innerText = 'N/A';
        document.getElementById('controller-mapping').innerText = 'N/A';
    }

    function updateControllerInfo() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];

        if (gamepad) {
            const stick1Pos = document.getElementById('stick1-pos');
            const stick1Line = document.getElementById('stick1-line');
            const stick2Pos = document.getElementById('stick2-pos');
            const stick2Line = document.getElementById('stick2-line');

            // Update stick 1 position (axes 0 and 1)
            const x1 = (gamepad.axes[0] + 1) * 50; // Normalize to 0-100
            const y1 = (gamepad.axes[1] + 1) * 50; // Normalize to 0-100
            stick1Pos.style.left = `${x1}%`;
            stick1Pos.style.top = `${y1}%`;

            // Update stick 1 line
            const angle1 = Math.atan2(y1 - 50, x1 - 50) * (180 / Math.PI) - 90;
            const length1 = Math.sqrt(Math.pow(x1 - 50, 2) + Math.pow(y1 - 50, 2));
            stick1Line.style.height = `${length1}px`;
            stick1Line.style.transform = `rotate(${angle1}deg)`;

            // Update stick 2 position (axes 2 and 3)
            const x2 = (gamepad.axes[2] + 1) * 50; // Normalize to 0-100
            const y2 = (gamepad.axes[3] + 1) * 50; // Normalize to 0-100
            stick2Pos.style.left = `${x2}%`;
            stick2Pos.style.top = `${y2}%`;

            // Update stick 2 line
            const angle2 = Math.atan2(y2 - 50, x2 - 50) * (180 / Math.PI) - 90;
            const length2 = Math.sqrt(Math.pow(x2 - 50, 2) + Math.pow(y2 - 50, 2));
            stick2Line.style.height = `${length2}px`;
            stick2Line.style.transform = `rotate(${angle2}deg)`;

            const axesDiv = document.getElementById('axes');
            axesDiv.innerHTML = '<h2>Axes</h2>';
            gamepad.axes.forEach((axis, index) => {
                const axisElement = document.createElement('div');
                axisElement.className = 'axis';
                axisElement.innerHTML = `Axis ${index}: <progress class="progress-bar" max="2" value="${axis + 1}"></progress> ${axis.toFixed(2)}`;
                axesDiv.appendChild(axisElement);
            });

            const buttonsDiv = document.getElementById('buttons');
            buttonsDiv.innerHTML = '<h2>Buttons</h2>';
            const button6 = gamepad.buttons[6];
            const button7 = gamepad.buttons[7];
            if (button6) {
                const buttonElement = document.createElement('div');
                buttonElement.className = 'button';
                buttonElement.innerHTML = `B6: <progress class="progress-bar" max="1" value="${button6.value}"></progress> ${button6.value.toFixed(2)}`;
                buttonsDiv.appendChild(buttonElement);
            }
            if (button7) {
                const buttonElement = document.createElement('div');
                buttonElement.className = 'button';
                buttonElement.innerHTML = `B7: <progress class="progress-bar" max="1" value="${button7.value}"></progress> ${button7.value.toFixed(2)}`;
                buttonsDiv.appendChild(buttonElement);
            }
            gamepad.buttons.forEach((button, index) => {
                if (index !== 6 && index !== 7) {
                    const buttonElement = document.createElement('div');
                    buttonElement.className = 'button';
                    buttonElement.innerText = `B${index}: ${button.value.toFixed(2)}`;
                    buttonsDiv.appendChild(buttonElement);
                }
            });

            // Check for easter egg
            if (gamepad.buttons[1].pressed && gamepad.buttons[2].pressed) {
                if (!easterEggTimer) {
                    easterEggTimer = setTimeout(() => {
                        alert("Ye've uncovered a hidden treasure, matey! Hoist the sails, fer we be off to plunder the high seas! 🏴‍☠️💰🦜🌊");
                        easterEggTimer = null;
                    }, 1000); // 2 seconds
                }
            } else {
                if (easterEggTimer) {
                    clearTimeout(easterEggTimer);
                    easterEggTimer = null;
                }
            }

            requestAnimationFrame(updateControllerInfo);
        }
    }

    function vibrateController() {
        const gamepads = navigator.getGamepads();
        const gamepad = gamepads[0];

        if (gamepad && gamepad.vibrationActuator) {
            gamepad.vibrationActuator.playEffect("dual-rumble", {
                startDelay: 0,
                duration: 700, // 3 seconds
                weakMagnitude: 1.0,
                strongMagnitude: 1.0
            });
        }
    }

    window.addEventListener("gamepadconnected", getControllerInfo);
    window.addEventListener("gamepaddisconnected", getControllerInfo);

    // Initial check in case the gamepad is already connected
    getControllerInfo();

    // Example usage: Vibrate the controller for 3 seconds when a button is clicked
    document.getElementById('vibrate-button').addEventListener('click', vibrateController);
});