import { Vector } from "./vector.js";

let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 1. Draw three points in the shape of a triangle (vertices of the triangle)
// 2. Pick a point anywhere within the triangle and draw it
// 3. Randomly select one of the three vertices of the triangle
// 4. Draw a point at the midpoint between the point and the chosen vertex
// 5. Repeat steps 3 and 4

function createEquilateralTriangle(height = undefined, length = undefined) {
    height = height ? height : ctx.canvas.height;
    length = length ? length : ctx.canvas.width;

    const heightLengthRatio = Math.sqrt(3) / 2 // ratio of height / side
    if (height / length < heightLengthRatio) { // height is limiting 
        length = height / heightLengthRatio;
    } else { // width is limiting
        height = length * heightLengthRatio;
    }

    const centroid = new Vector(ctx.canvas.width / 2, ctx.canvas.height * 2 / 3);
    const v1 = centroid.subtract(new Vector(0, height * 2 / 3));
    const v2 = centroid.add(new Vector(-1 * length / 2, height * 1 / 3));
    const v3 = centroid.add(new Vector(length / 2, height * 1 / 3));
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

    return v2.add(a.multiply(new Vector(u1, u1)).add(b.multiply(new Vector(u2, u2)))); // v2 + (u1 * a + u2 * b)
}

function getRandomVertex(vertexArray) {
    const i = Math.floor(Math.random() * 3);
    return vertexArray[i];
}

function drawPoint(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "black";
    ctx.fill();
}

let i = 0;

const vertexArray = createEquilateralTriangle();
const pointsArray = [];

// function animate() {
//     setTimeout(() => {
//         requestAnimationFrame(animate);
//     }, 10)

//     i++;
//     let p;

//     if (i === 1) {
//         for (const v of vertexArray) {
//             drawPoint(v.x, v.y, 5);
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
//         drawPoint(p.x, p.y, 1);
//     }
// }

const batchSize = 100;

function animate() {
    if (pointsArray.length < 25000) {
        requestAnimationFrame(animate);
    }
    i++;
    const batchArray = []

    if (i === 1) {
        for (const v of vertexArray) {
            drawPoint(v.x, v.y, 1);
        }
    } else if (i === 2) {
        const pRand = getRandomPoint(vertexArray);
        const vRand = getRandomVertex(vertexArray);
        batchArray.push(Vector.midpoint(pRand, vRand))
    } else {
        let pLast = pointsArray[pointsArray.length - 1];
        for (let j = 0; j < batchSize; j++) {
            const vRand = getRandomVertex(vertexArray);
            pLast = Vector.midpoint(pLast, vRand)
            batchArray.push(pLast);
        }
    }

    if (batchArray.length !== 0) {
        pointsArray.push(...batchArray);
        batchArray.forEach((p) => {
            drawPoint(p.x, p.y, 0.5);
        })
    }
}

animate();


