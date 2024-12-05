function createPiano() {
    const piano = document.getElementById('piano');
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
    const blackKeys = [1, 3, 6, 8, 10];
    let note = 21; // Starting from A0 (MIDI note 21)
    for (let i = 0; i < 52; i++) {
        const key = document.createElement('div');
        key.classList.add('key');
        key.dataset.note = note;
        piano.appendChild(key);
        if (blackKeys.includes(note % 12)) {
            const blackKey = document.createElement('div');
            blackKey.classList.add('key', 'black');
            key.appendChild(blackKey);
        }
        note++;
        if (whiteKeys.includes(note % 12)) {
            note++;
        }
    }
}

function highlightKey(note, on) {
    const key = document.querySelector(`.key[data-note="${note}"]`);
    if (key) {
        if (on) {
            key.classList.add('pressed');
        } else {
            key.classList.remove('pressed');
        }
    }
}

function onMIDIMessage(event) {
    const [command, note, velocity] = event.data;
    if (command === 144) { // Note on
        highlightKey(note, true);
    } else if (command === 128) { // Note off
        highlightKey(note, false);
    }
}

function onMIDISuccess(midiAccess) {
    if (midiAccess.inputs.size > 0) {
        document.getElementById('midi-status').innerText = "MIDI device connected!";
    
        // Get the inputs
        const inputs = midiAccess.inputs.values();
        for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
          console.log("Input:", input.value);
        }
      } else {
        document.getElementById('midi-status').innerText = "No MIDI devices connected.";
      }
    const inputs = midiAccess.inputs.values();
    for (let input of inputs) {
        input.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure() {
    document.getElementById('midi-status').innerText = 'Failed to Access MIDI Device';
}

document.addEventListener('DOMContentLoaded', () => {
    createPiano();
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        document.getElementById('midi-status').innerText = 'Web MIDI API not supported in this browser';
    }
});