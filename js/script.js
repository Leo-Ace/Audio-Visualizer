const container = document.getElementById('container');
const canvas = document.getElementById('canvas1');
const file = document.getElementById('fileupload');
const colorInp = document.getElementById("colorInp");
const imgBanner = document.getElementById("imgBanner");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let audioSource = 0;
let analyser;
let barHeight= 0;
let i = 0, listItem = [];
let radius, dfw, fftSize, colorDefault;
if(canvas.width >= canvas.height) {
  radius = canvas.width/10;
  container.style.width = `${radius*2 - 10}px`;
  container.style.height = `${radius*2 - 10}px`;
  dfw = 25;
  fftSize = 256;
} else {
  radius = canvas.width/5;
  container.style.width =  `${radius*2 - 10}px`;
  container.style.height =  `${radius*2 - 10}px`;
  dfw = 30;
  fftSize = 256;
};
ctx.drawImage(imgBanner, 0, 0, canvas.height*2, canvas.height);

colorInp.value = '#fa3200';
colorDefault = colorInp.value;
colorInp.addEventListener('input', ()=> {
  colorDefault = colorInp.value;
  drawDefault();
});
/*ctx.shadowBlur = 10;
  ctx.shadowColor = colorDefault;*/

document.getElementById('audio1').onplay = ()=> {
  boxHandle();
};
container.addEventListener('click', function() {
  boxHandle();
});
container.addEventListener('touchmove', function() {
  boxHandle();
});

function drawDefault() {
  let _width = (canvas.width/2)/200, _x=0;
  for(let i = 10; i < 200; i++) {
    barHeight = 0;
    /*let color = 'hsl('+ i * 20 +', 100%, 50%)';*/
    let color = colorDefault;
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(i * Math.PI * 2.4/ 200);
    ctx.strokeStyle = color;
    ctx.strokeRect(0, radius, _width +5, barHeight + 20);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(radius, radius/2 + dfw, 2, 0, Math.PI * 2);
    ctx.fill();
    _x += _width;
    ctx.restore();
  };
  const audio1 = document.getElementById('audio1');
};
drawDefault();
audio1.src = './audio/CoGaiNayLaCuaAi-KrixRushDoanQuocVinhNhiNhi-6926198.mp3';

function boxHandle() {
  const audio1 = document.getElementById('audio1');
  /*audio1.src = 'data:audio/x-wav;base64,';*/
  const audioContext = new AudioContext();
  audio1.play();
  if(!audioSource) {
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = fftSize;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width/2)/bufferLength;
    barHeight= 0;
    let x;
    function animate() {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
      listItem.push(new Partical(i));
      i++;
      for(let i = listItem.length -1; i>=0; i--) {
        /*let color = 'hsl(' + i + ',100%, 50%)';*/
        let color = '#fff';
        listItem[i].draw(color);
        listItem[i].update();
        if(listItem[i].x > canvas.width/2 && canvas.width >= canvas.height) listItem.splice(i, 1);
        if(listItem[i].y > canvas.height && canvas.width < canvas.height) listItem.splice(i, 1);
      };
      requestAnimationFrame(animate);
    };
    animate();
  };
};

file.addEventListener('change', function() {
  const files = this.files;
  const audio1 = document.getElementById('audio1');
  const audioContext = new AudioContext();
  audio1.src = URL.createObjectURL(files[0]);
  audio1.load();
  audio1.play();
  if(!audioSource) {
    audioSource = audioContext.createMediaElementSource(audio1);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = fftSize;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = (canvas.width/2)/bufferLength;
    barHeight=0;
    let x;
    function animate() {
      x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      analyser.getByteFrequencyData(dataArray);
      drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray);
      listItem.push(new Partical(i));
      i++;
      for(let i = listItem.length -1; i>=0; i--) {
        /*let color = 'hsl(' + i + ',100%, 50%)';*/
        let color = '#fff';
        listItem[i].draw(color);
        listItem[i].update();
        if(listItem[i].x > canvas.width/2 && canvas.width >= canvas.height) listItem.splice(i, 1);
        if(listItem[i].y > canvas.height && canvas.width < canvas.height) listItem.splice(i, 1);
      };
      requestAnimationFrame(animate);
    };
    animate();
  };
});

function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray) {
  ctx.drawImage(imgBanner, 0, 0, canvas.height*2, canvas.height);
  for(let i = 10; i < bufferLength; i++) {
    barHeight = dataArray[i];
    if(dataArray[i] > 100) barHeight = barHeight - dataArray[i]*0.5 -20;
    else barHeight += barHeight*0.03;
    /*let color = 'hsl('+ i * 20 +', 100%, 50%)';*/
    color = colorDefault;
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(i * Math.PI * 1.7/ bufferLength + 2);
    ctx.strokeStyle = color;
    ctx.strokeRect(0, radius, barWidth +5, barHeight + 20);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc((barWidth+5)/2, barHeight + radius + 30, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.1;
    ctx.arc(0, 0, radius + 20, 0, Math.PI * 2);
    ctx.stroke();
    x += barWidth;
    ctx.restore();
  };
  for(let i = 10; i < bufferLength; i++) {
    barHeight = dataArray[i];
    if(dataArray[i] > 100) barHeight = barHeight - dataArray[i]*0.5 -20;
    else barHeight += barHeight*0.03;
    /*let color = 'hsl('+ i * 20 +', 100%, 50%)';*/
    color = colorDefault;
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(i * Math.PI * 1.7/ bufferLength + 2);
    ctx.strokeStyle = color;
    ctx.strokeRect(0, -radius, barWidth +5 , -(barHeight + 20));
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc((barWidth+5)/2, -(barHeight + radius + 30), 2, 0, Math.PI * 2);
    ctx.fill();
    x += barWidth;
    ctx.restore();
  };
};

class Partical {
  constructor(i) {
    this.x = 200;
    this.y = 200;
    this.speedX = Math.random() * 2 + 1;
    this.speedY = Math.random() * 2 + 1;
    this.i = i;
    this.r = Math.random() * 2 + 1;
  };
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.r +=0.01;
  };
  draw(color) {
    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x * Math.cos(this.i), this.y * Math.sin(this.i), this.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
};

document.getElementById('fileImg').addEventListener('change', function() {
  const files = this.files;
  const _image = document.getElementById('imgUser');
  _image.src = URL.createObjectURL(files[0]);
});