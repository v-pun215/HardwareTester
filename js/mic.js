async function listaudiodevices() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter(device => device.kind === 'audioinput');
        const dropdown = document.getElementById('audioselector');

        audioDevices.forEach(device => {
            const option = document.createElement('option');
            option.value = device.deviceId;
            option.text = device.label || `Device ${dropdown.options.length}`;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error accessing devices: ', error);
        alert('Error accessing audio devices. Please give permission to access your audio devices.');
    }

navigator.mediaDevices.getUserMedia({ audio: true })
.then(stream => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const sampleRate = audioContext.sampleRate;
    const track = stream.getAudioTracks()[0]
    const channels = track.getSettings().channelCount;

    const constraints = track.getConstraints();
    const autoGainControl = constraints.autoGainControl || 'Not Available';
    const echoCancellation = constraints.echoCancellation || 'Not Available';


    const startTime = audioContext.currentTime;
    setTimeout(() => {
    const endTime = audioContext.currentTime;
    const latency = endTime - startTime;
    document.getElementById("la").innerHTML = latency;
    }, 1000);
    var sr = document.getElementById("sr");
    var ch = document.getElementById("ch");
    var agc = document.getElementById("agc");
    var ec = document.getElementById("ec");
    sr.innerHTML = sampleRate;
    ch.innerHTML = channels;
    agc.innerHTML = autoGainControl;
    ec.innerHTML = echoCancellation;
    
})
.catch(err => {
    console.error('Error accessing microphone: ', err);
    document.getElementById("properties").innerHTML = `<p>Error: ${err.message}</p>`;
});
let mediaRecorder;
let audioChunks = [];
let selectedDeviceId = null;
const startRecordingButton = document.getElementById('start');
const stopRecordingButton = document.getElementById('stop');
const audioPlayback = document.getElementById('audio');
const audioDevicesSelect = document.getElementById('audioselector');
async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDeviceId }
      });

      // Create MediaRecorder instance
      mediaRecorder = new MediaRecorder(stream);

      // Collect audio data during recording
      mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
      };

      // When recording is stopped, create a Blob and set it for playback
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
      };

      // Start recording
      mediaRecorder.start();
      audioChunks = []; // Reset chunks
      startRecordingButton.disabled = true;
      stopRecordingButton.disabled = false;
      console.log('Recording started...');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Failed to start recording.');
    }
  }

  // Stop recording
  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      startRecordingButton.disabled = false;
      stopRecordingButton.disabled = true;
      console.log('Recording stopped...');
    }
  }

  // Handle device selection change
  audioDevicesSelect.addEventListener('change', (event) => {
    selectedDeviceId = event.target.value;
    console.log('Selected device:', selectedDeviceId);
  });

  // Event listeners for recording buttons
  startRecordingButton.addEventListener('click', startRecording);
  stopRecordingButton.addEventListener('click', stopRecording);

}