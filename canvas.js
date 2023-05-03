import { Vector } from "./vector.js";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasHover = document.querySelector(".canvas-hover");
const ctxHover = canvasHover.getContext("2d");
canvasHover.width = window.innerWidth;
canvasHover.height = window.innerHeight;

// 1. Draw three points in the shape of a triangle (vertices of the triangle)
// 2. Pick a point anywhere within the triangle and draw it
// 3. Randomly select one of the three vertices of the triangle
// 4. Draw a point at the midpoint between the point and the chosen vertex
// 5. Repeat steps 3 and 4

function createEquilateralTriangle(height = undefined, length = undefined) {
  height = height ? height : ctx.canvas.height;
  length = length ? length : ctx.canvas.width;

  const heightLengthRatio = Math.sqrt(3) / 2; // ratio of height / side
  if (height / length < heightLengthRatio) {
    // height is limiting
    length = height / heightLengthRatio;
  } else {
    // width is limiting
    height = length * heightLengthRatio;
  }

  const centroid = new Vector(
    ctx.canvas.width / 2,
    (ctx.canvas.height * 2) / 3
  );
  const v1 = centroid.subtract(new Vector(0, (height * 2) / 3));
  const v2 = centroid.add(new Vector((-1 * length) / 2, (height * 1) / 3));
  const v3 = centroid.add(new Vector(length / 2, (height * 1) / 3));
  // console.log(height);
  // console.log(length)
  // console.log(centroid)
  // console.log(v1);
  // console.log(v2);
  // console.log(v3);
  return [v1, v2, v3];
}

function getRandomPoint(vertexArray) {
  const v1 = vertexArray[0];
  const v2 = vertexArray[1];
  const v3 = vertexArray[2];

  const a = v1.subtract(v2);
  const b = v3.subtract(v2);
  let u1 = Math.random();
  let u2 = Math.random();

  if (u1 + u2 > 1) {
    u1 = 1 - u1;
    u2 = 1 - u2;
  }

  return v2.add(
    a.multiply(new Vector(u1, u1)).add(b.multiply(new Vector(u2, u2)))
  ); // v2 + (u1 * a + u2 * b)
}

function getRandomVertex(vertexArray) {
  const i = Math.floor(Math.random() * 3);
  return vertexArray[i];
}

function drawPoint(x, y, radius, context, color = "black") {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.fillStyle = color;
  context.fill();
}

let i = 0;

const vertexArray = createEquilateralTriangle(500);
const pointsArray = [];

// // test
// function animate() {
//     setTimeout(() => {
//         requestAnimationFrame(animate);
//     }, 10)

//     i++;
//     let p;

//     if (i === 1) {
//         for (const v of vertexArray) {
//             drawPoint(v.x, v.y, 5, ctx);
//         }
//         ctx.beginPath;
//         ctx.moveTo(vertexArray[0].x,vertexArray[0].y);
//         ctx.lineTo(vertexArray[1].x,vertexArray[1].y);
//         ctx.lineTo(vertexArray[2].x,vertexArray[2].y);
//         ctx.lineTo(vertexArray[0].x,vertexArray[0].y);
//         ctx.stroke();
//     } else {
//         p = getRandomPoint(vertexArray);
//     }

//     if (p) {
//         pointsArray.push(p);
//         console.log(p);
//         drawPoint(p.x, p.y, 1, ctx);
//     }
// }

const batchSize = 100;

function animate() {
  if (pointsArray.length < 500000) {
    // setTimeout(() => {
    requestAnimationFrame(animate);
    // },100);
  }

  //   ctx.clearRect(0, 0, canvas.width, canvas.height);

  i++;
  const batchArray = [];

  if (i === 1) {
    for (const v of vertexArray) {
      drawPoint(v.x, v.y, 1, ctx);
    }
  } else if (i === 2) {
    const pRand = getRandomPoint(vertexArray);
    const vRand = getRandomVertex(vertexArray);
    batchArray.push(Vector.midpoint(pRand, vRand));
  } else {
    let pLast = pointsArray[pointsArray.length - 1];
    for (let j = 0; j < batchSize; j++) {
      const vRand = getRandomVertex(vertexArray);
      pLast = Vector.midpoint(pLast, vRand);
      batchArray.push(pLast);
    }
  }

  pointsArray.push(...batchArray);
  batchArray.forEach((p) => {
    drawPoint(p.x, p.y, 0.5, ctx);
  });
}

animate();

// magnify
function inTriangle(p, vertexArray) {
  const v1 = vertexArray[0];
  const v2 = vertexArray[1];
  const v3 = vertexArray[2];

  // barycentric coordinates of P
  const d1 = sign(p, v1, v2);
  const d2 = sign(p, v2, v3);
  const d3 = sign(p, v3, v1);

  return d1 < 0 && d2 < 0 && d3 < 0;
}

function sign(p, v1, v2) {
  const a = v1.subtract(p);
  const b = v2.subtract(p);
  return a.cross(b);
}

function canvasClick(evt) {
  const rect = canvas.getBoundingClientRect();
  const x = evt.pageX - rect.left;
  const y = evt.pageY - rect.top;
  const p = new Vector(x, y);

  console.log([x, y]);
  console.log(inTriangle(p, vertexArray));
}

canvasHover.addEventListener("click", canvasClick);
var magnify = false;
canvasHover.addEventListener("mousedown", () => {
  magnify = true;
});
canvasHover.addEventListener("mouseup", () => {
  magnify = false;
});

let mouse = {
  x: undefined,
  y: undefined,
  dx: undefined,
  dy: undefined,
};

canvasHover.addEventListener("mouseleave", (e) => {
  mouse.x = undefined;
  mouse.y = undefined;
  mouse.dx = undefined;
  mouse.dy = undefined;
});

canvasHover.addEventListener("mousemove", (e) => {
  const rect = canvasHover.getBoundingClientRect();
  mouse.x = ((e.x - rect.left) * window.innerWidth) / rect.width;
  mouse.y = ((e.y - rect.top) * window.innerHeight) / rect.height;
  mouse.dx = e.movementX;
  mouse.dy = e.movementY;
});

function distFromMouse(v) {
  return Math.sqrt(Math.pow(v.x - mouse.x, 2) + Math.pow(v.y - mouse.y, 2));
}

const magnifyRadius = 20;

function animateHover() {
  requestAnimationFrame(animateHover);

  ctxHover.clearRect(0, 0, canvasHover.width, canvasHover.height);

  if (magnify) {
    ctxHover.beginPath();
    ctxHover.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2, false);
    ctxHover.stroke();
    ctxHover.fillStyle = "white";
    ctxHover.fill();

    const hoverArray = pointsArray.filter(
      (p) => distFromMouse(p) < magnifyRadius
    );
    hoverArray.forEach((p) =>
      drawPoint(
        mouse.x + ((p.x - mouse.x) * 100) / magnifyRadius,
        mouse.y + ((p.y - mouse.y) * 100) / magnifyRadius,
        1,
        ctxHover,
        "black"
      )
    );
  } else {
    if (mouse.x) {
      const hoverArray = pointsArray.filter(
        (p) => distFromMouse(p) < magnifyRadius
      );
      hoverArray.forEach((p) => drawPoint(p.x, p.y, 1, ctxHover, "green"));
    }
  }

  ctxHover.font = "20px Arial";
  const mouseVector = new Vector(mouse.x, mouse.y);
  ctxHover.fillStyle = inTriangle(mouseVector, vertexArray) ? "green" : "red";
  ctxHover.fillText(`[${Math.round(mouse.x)}, ${Math.round(mouse.y)}]`, 5, 20);
  // ctxHover.fillText(`${hoverArray.length}`, 5, 40);
  ctxHover.fillStyle = "black";
  ctxHover.fillText(
    `[${Math.round(vertexArray[0].x)}, ${Math.round(vertexArray[0].y)}]`,
    canvasHover.width - 120,
    20
  );
  ctxHover.fillText(
    `[${Math.round(vertexArray[1].x)}, ${Math.round(vertexArray[1].y)}]`,
    canvasHover.width - 120,
    40
  );
  ctxHover.fillText(
    `[${Math.round(vertexArray[2].x)}, ${Math.round(vertexArray[2].y)}]`,
    canvasHover.width - 120,
    60
  );
}

animateHover();
