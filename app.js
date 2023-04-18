/* const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

const get_processed_img = async (img1, img2, img3, txt_big, txt_small) => {
  // Load the images using loadImage
  const image1 = await loadImage(img1);
  const image2 = await loadImage(img2);
  const image3 = await loadImage(img3);

  // Create a canvas with the same dimensions as the images
  const canvas = createCanvas(image1.width * 3, image1.height);
  const ctx = canvas.getContext('2d');

  // Resize the images to the same dimensions
  const width = 800;
  const height = 600;

  // Draw the images on the canvas
  ctx.drawImage(image1, 0, 0, width, height);
  ctx.drawImage(image2, width, 0, width, height);
  ctx.drawImage(image3, width * 2, 0, width, height);

  // Load the fonts
  registerFont('res/fonts/Montserrat-Black.ttf', { family: 'Roboto' });
  registerFont('res/fonts/Montserrat-Bold.ttf', { family: 'Roboto', weight: 'bold' });

  // Add the big text to the first image
  ctx.font = 'bold 120px Roboto';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(txt_big, width / 2, height / 2);

  // Add the small text to the second image
  ctx.font = '36px Roboto';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'left';
  ctx.fillText(txt_small, 50, height - 50);

  // Add a border to the third image
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 10;
  ctx.strokeRect(width * 2 + 5, 5, width - 10, height - 10);

  //Draw a red rectange with rounded corners 
    ctx.fillStyle = '#ff0000';
    //fill with gradient color
    var grd = ctx.createLinearGradient(0, 0, 200, 0);
    grd.addColorStop(0, 'red');
    grd.addColorStop(1, 'violet');
    ctx.fillStyle = grd;
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 100);
    ctx.quadraticCurveTo(300, 100, 300, 200);
    ctx.lineTo(300, 300);
    ctx.quadraticCurveTo(300, 400, 200, 400);
    ctx.lineTo(100, 400);
    ctx.quadraticCurveTo(0, 400, 0, 300);
    ctx.lineTo(0, 200);
    ctx.quadraticCurveTo(0, 100, 100, 100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();


  // Return the processed image as a Buffer
  return canvas.toBuffer();
};

// Example usage:
get_processed_img('res/image_1.png', 'res/image_2.png', 'res/image_3.png', 'Hello world', 'Welcome to my world')
  .then((processed_image) => {
    // Do something with the processed image, such as save it to a file
    console.log('Processed image size:', processed_image.length);

    // Save the processed image to a file
    fs.writeFileSync('output.png', processed_image);
  })
  .catch((error) => {
    console.error('Error processing image:', error);
  });
 */

const Jimp = require("jimp");
const path = require("node:path");

/**
 * Represents the color Options.
 * @typedef {Object} colorOptions
 * @property {string} bg_color - The background color of canvas
 * @property {string} txt_color - the color of the text
 */

/**
 * Represents a textPosition options.
 * @typedef {Object} textPosition
 * @property {number} x1 - Position X of the first text
 * @property {number} y1 - Position Y of the first text
 * @property {number} x2 - Position X of the second text
 * @property {number} y2 - Position Y of the second text
 */

/**
 * Represents a imageOptions.
 * @typedef {Object} ImageOptions
 * @property {string[]} images - Images Array
 * @property {string} txt_big - the begger text
 * @property {string} txt_small - the small text
 * @property {colorOptions} colorOptions - colors Of background and text
 * @property {textPosition} textPosition - positions for text
 */

const img1 = path.dirname(__filename) + "/res/image_1.png";
const img2 = path.dirname(__filename) + "/res/image_2.png";
const img3 = path.dirname(__filename) + "/res/image_3.png";

const txt_big = "Hello world";
const txt_small = "Welcome to my world";

/**
 * @description
 * @param {ImageOptions} params
 * @param {boolean} contain to contain image size or not
 * @returns {Promise<Buffer>}
 */
const get_processed_img = async (params, contain = false) => {
  // Chargez les images
  const [image1, image2, image3] = await Promise.all(
    params.images.map((img) => Jimp.read(img))
  );

  // Créez un canvas Jimp avec les dimensions requises
  const canvas = new Jimp(1000, 1000, params.colorOptions.bg_color);

  // Dessinez les images et les textes sur le canvas
  if (contain) {
    canvas.composite(image1.contain(500, 500), 0, 0);
    canvas.composite(image2.contain(500, 500), 500, 0);
    canvas.composite(image3.contain(500, 500), 0, 500);
  } else {
    canvas.composite(image1, 0, 0);
    canvas.composite(image2, 500, 0);
    canvas.composite(image3, 0, 500);
  }

  const big_font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  const small_font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  canvas.print(
    big_font,
    params.textPosition.x1,
    params.textPosition.y1,
    txt_big
  );

  canvas.print(
    small_font,
    params.textPosition.x2,
    params.textPosition.y2,
    params.txt_small
  );

  // Exportez le canvas en tant qu'image finale
  const processed_image = await canvas.getBufferAsync(Jimp.MIME_PNG);
  const uuid = (Math.random() + 1).toString(36).substring(2);
  const canvasFilePaht = path.dirname(__filename);
  console.log(canvasFilePaht);
  canvas.write(`${canvasFilePaht}/res/canvas/edit-canvas-${uuid}.png`);
  return processed_image;
};

// Utilisez la fonction pour obtenir l'image finale
get_processed_img({
  images: [img1, img2, img3],
  txt_big,
  txt_small,
  colorOptions: {
    bg_color: "#00ff00",
    txt_color: "#0000",
  },
  textPosition: {
    x1: 100,
    y1: 100,
    x2: 100,
    y2: 300,
  },
})
  .then((processed_image) => {
    // Faites quelque chose avec l'image finale
  })
  .catch((err) => {
    console.log(err);
  });
