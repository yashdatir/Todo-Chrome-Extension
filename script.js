let data = localStorage.getItem('data')
  ? JSON.parse(localStorage.getItem('data'))
  : [];
var mediaRecorder = null;
const add = () => {
  data.push('');
  render();
};

const deleteChild = (index) => {
  data = [...data.slice(0, index), ...data.slice(index + 1, data.length)];
  render();
};

const change = ({ target: { name, value } }) => {
  data[parseInt(name.split('-')[1])] = value;
  render();
};

const render = () => {
  const carea = document.getElementById('carea');
  localStorage.setItem('data', JSON.stringify(data));
  carea.innerHTML = '';
  data.map((val, i) => {
    const inp = document.createElement('input');
    inp.name = `inp-${i}`;
    inp.id = 'text-box';
    inp.value = val;
    inp.onblur = change;
    inp.placeholder = 'Add text here';
    const btn = document.createElement('button');
    btn.innerHTML = 'X';
    btn.style = 'background-color: red; margin-left:1px';
    btn.onclick = () => deleteChild(i);
    carea.appendChild(inp);
    carea.appendChild(btn);
  });
};

const saveFile = (recordedChunks) => {
  const blob = new Blob(recordedChunks, {
    type: 'video/webm'
  });
  let filename = window.prompt('Enter file name'),
    downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${filename}.webm`;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  URL.revokeObjectURL(blob); // clear from memory
  document.body.removeChild(downloadLink);
};

const initiateRecorder = async () => {
  return await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: { mediaSource: 'screen' }
  });
};

const createRecorder = (stream, mimeType) => {
  // the stream data is stored in this array
  let recordedChunks = [];

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };
  mediaRecorder.onstop = function () {
    saveFile(recordedChunks);
    recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
};

const record = async () => {
  let stream = await initiateRecorder();
  let mimeType = 'video/webm';
  mediaRecorder = createRecorder(stream, mimeType);
  // After some time stop the recording by
  document.getElementById('stop-record-button').style = 'visibility: visible';
  document.getElementById('record-button').style = 'visibility: hidden';
};

const recorder = () => {
  mediaRecorder.stop();
  document.getElementById('stop-record-button').style = 'visibility: hidden';
  document.getElementById('record-button').style = 'visibility: visible';
};

document.getElementById('text-box').addEventListener('change', change);
document.getElementById('add-button').addEventListener('click', add);
document.getElementById('record-button').addEventListener('click', record);
document
  .getElementById('stop-record-button')
  .addEventListener('click', recorder);
(() => {
  document.getElementById('stop-record-button').style = 'visibility: hidden';
  render();
})();
