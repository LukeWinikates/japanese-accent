const button = document.querySelector('.start-stop');
const visualization = document.querySelector('.visualization');
const clips = document.querySelector('.clips');

let recording = false;

function visualize({recording, error}) {
    if (error) {
        visualization.innerText = `error: ${error}`;
        return;
    }
    visualization.innerText = recording ? "recording..." : "stopped"
}


function saveRecording(recordingData) {
    const clipContainer = document.createElement('article');
    clipContainer.classList.add('clip');

    const clipLabel = document.createElement('p');
    const audio = document.createElement('audio');
    const deleteButton = document.createElement('button');

    audio.setAttribute('controls', '');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';

    clipLabel.textContent = `${new Date().valueOf()}`;

    clipContainer.appendChild(audio);
    clipContainer.appendChild(clipLabel);
    clipContainer.appendChild(deleteButton);
    clips.appendChild(clipContainer);

    audio.controls = true;
    const blob = new Blob(recordingData, {'type': 'audio/ogg; codecs=opus'});
    audio.src = window.URL.createObjectURL(blob);
    audio.play();

}

if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');

    const constraints = {audio: true};
    let recordingData = [];

    let onSuccess = function (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function (e) {
            recordingData.push(e.data);
        };

        mediaRecorder.onstop = function () {
            saveRecording(recordingData);
            recordingData = [];
        };

        visualize({recording});

        button.onclick = function () {
            if (recording) {
                mediaRecorder.stop();
            } else {
                mediaRecorder.start();
            }
            recording = !recording;
            visualize({recording});
        };

    };

    let onError = function (error) {
        visualize({recording, error})
    };

    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);


} else {
    visualize({error: "user media not supported"})
}