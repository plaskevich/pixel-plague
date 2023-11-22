const config = {
  size: 10,
  stepsPerFrame: 1,
  speed: 2,
  startingPoints: 2,
};

let w, h, points, step, arr;
let palette = [];
let sizeSlider, speedSlider, pointsSlider, resetButton;
let sizeLabel, speedLabel, pointsLabel;
let gameOver = false;
let dialogShown = false;

function setup() {
  const { size } = config;
  w = floor(windowWidth / size) * size;
  h = floor((windowHeight - 200) / size) * size;
  createCanvas(w, h);
  background(0);

  sizeSlider = createSlider(2, 20, config.size, 2);
  sizeSlider.position(10, h + 20);
  sizeSlider.input(() => sizeLabel.html('Size: ' + sizeSlider.value()));
  sizeSlider.class('slider');
  sizeLabel = createDiv('Size: ' + sizeSlider.value());
  sizeLabel.position(150, h + 14);
  sizeLabel.class('label');

  speedSlider = createSlider(1, 60, config.speed);
  speedSlider.position(10, h + 60);
  speedSlider.input(() => speedLabel.html('Speed: ' + speedSlider.value()));
  speedSlider.class('slider');
  speedLabel = createDiv('Speed: ' + speedSlider.value());
  speedLabel.position(150, h + 54);
  speedLabel.class('label');

  pointsSlider = createSlider(1, 10, config.startingPoints);
  pointsSlider.position(10, h + 100);
  pointsSlider.input(() =>
    pointsLabel.html('Starting Points: ' + pointsSlider.value())
  );
  pointsSlider.class('slider');
  pointsLabel = createDiv('Starting Points: ' + pointsSlider.value());
  pointsLabel.position(150, h + 94);
  pointsLabel.class('label');

  resetButton = createButton('Reset');
  resetButton.position(10, h + 140);
  resetButton.mousePressed(startDrawing);
  resetButton.class('reset-button');

  palette = [
    color(255, 255, 0), // yellow
    color(255, 0, 255), // magenta
    color(255, 0, 0), // red
    color(0, 255, 255), // cyan
    color(0, 255, 0), // green
    color(0, 0, 255), // blue
    color(128, 0, 0), // dark red
    color(0, 128, 0), // dark green
    color(0, 0, 128), // dark blue
    color(0, 128, 128), // dark cyan
    color(128, 0, 128), // dark magenta
    color(128, 128, 0), // dark yellow
  ];

  startDrawing();
}

function startDrawing() {
  gameOver = false;
  dialogShown = false;
  const size = sizeSlider.value();
  w = floor(w / size) * size;
  h = floor(h / size) * size;
  createCanvas(w, h);
  background(0);
  arr = new Array(w * h).fill(false);

  points = Array(pointsSlider.value())
    .fill()
    .map(() => ({
      x: floor(random(w / size)) * size,
      y: floor(random(h / size)) * size,
    }));
  step = 0;

  noStroke();
  frameRate(speedSlider.value());
  config.size = size;

  sizeLabel.html('Size: ' + size);
  speedLabel.html('Speed: ' + speedSlider.value());
  pointsLabel.html('Starting Points: ' + pointsSlider.value());
}

function draw() {
  if (!gameOver) {
    for (let i = 0; i < config.stepsPerFrame; i += 1) {
      if (step >= w * h) {
        return;
      }

      points.forEach((point) => {
        movePoint(point);
        drawPoint(point);
      });
    }
  }
}
function movePoint(point) {
  const size = config.size;
  let attempts = 0;
  const maxAttempts = 100;

  while (true) {
    attempts += 1;
    if (attempts > maxAttempts) {
      gameOver = true;
      if (!dialogShown) {
        let isReset = confirm('GAME OVER. Do you want to reset?');
        if (isReset) {
          startDrawing();
        } else {
          dialogShown = true;
        }
      }
      return;
    }

    let [rx, ry] = [floor(random(2)), floor(random(2))];
    [rx, ry] = [rx + ry - 1, rx - ry];
    let maxSteps = floor(random(w + h));

    for (let i = 0; i < maxSteps; i += 1) {
      point.x = (point.x + rx * size + w) % w;
      point.y = (point.y + ry * size + h) % h;
      if (!arr[point.x + point.y * w]) {
        break;
      }
    }

    if (!arr[point.x + point.y * w]) {
      break;
    }
  }
}

function drawPoint(point) {
  const { size } = config;
  const { x, y } = point;

  arr[x + y * w] = true;
  step += 1;
  fill(random(palette));
  rect(x, y, size, size);
  console.log(arr.length);
}
