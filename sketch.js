let video;
let handpose;
let predictions = [];

let catcherX = 300;
let ball;
let score = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => {
    console.log("Handpose loaded");
  });

  handpose.on("predict", (results) => {
    predictions = results;
  });

  ball = new Ball();
}

function draw() {
  background(200);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    let hand = predictions[0].landmarks;
    let palmX = hand[9][0]; // 手掌中心
    catcherX = width - palmX; // 鏡像處理
  }

  fill(0, 100, 255);
  rect(catcherX - 40, height - 20, 80, 10); // 接盤

  ball.update();
  ball.display();

  // 判斷接到球
  if (
    ball.y > height - 30 &&
    ball.x > catcherX - 40 &&
    ball.x < catcherX + 40
  ) {
    if (ball.correct) score++;
    else score--;
    ball = new Ball();
  }

  // 沒接到重來
  if (ball.y > height) {
    ball = new Ball();
  }

  fill(0);
  textSize(20);
  text("分數：" + score, 10, 30);
}

class Ball {
  constructor() {
    this.x = random(50, width - 50);
    this.y = 0;
    this.speed = 3;
    this.text = random(["2+2=4", "2+2=5"]);
    this.correct = this.text === "2+2=4";
  }

  update() {
    this.y += this.speed;
  }

  display() {
    fill(this.correct ? "green" : "red");
    ellipse(this.x, this.y, 40);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    text(this.text, this.x, this.y);
  }
}
