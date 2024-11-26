let currentSource = null;

function playSound(sound, direction) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (currentSource) {
        currentSource.stop();
    }

    fetch(sound)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            const panner = audioContext.createStereoPanner();
            panner.pan.setValueAtTime(direction, audioContext.currentTime);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(panner).connect(audioContext.destination);

            source.start();
            currentSource = source;

            source.onended = () => {
                currentSource = null;
            };
        })
        .catch(error => console.error('Error fetching or decoding audio:', error));
}
