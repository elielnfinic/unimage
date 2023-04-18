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

const { createCanvas, loadImage, registerFont } = require("canvas");
const Jimp = require("jimp");
const path = require("node:path");

/**
 * @description
 * @param {ImageOptions} params
 * @param {boolean} contain to contain image size or not
 * @returns {Promise<Buffer>}
 */
const get_processed_img = async (params) => {
  const [image1, image2, image3] = await Promise.all([
    loadImage(params.images[0]),
    loadImage(params.images[1]),
    loadImage(params.images[2]),
  ]);

  const canvas = createCanvas(image1.width * 3, image1.height);
  const ctx = canvas.getContext("2d");

  const width = 500;
  const height = 500;

  ctx.drawImage(image1, 0, 0, width, height);
  ctx.drawImage(image2, width, 0, width, height);
  ctx.drawImage(image3, width * 2, 0, width, height);

  registerFont("res/fonts/Montserrat-Black.ttf", { family: "Roboto" });
  registerFont("res/fonts/Montserrat-Bold.ttf", {
    family: "Roboto",
    weight: "bold",
  });

  ctx.font = "bold 120px Roboto";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText(params.txtbig, width / 2, height / 2);

  ctx.font = "36px Roboto";
  ctx.fillStyle = "#000000";
  ctx.textAlign = "left";
  ctx.fillText(params.txtsmall, 50, height - 50);

  // add Jimp functionality
  const jimpCanvas = await new Jimp(
    canvas.toBuffer(),
    canvas.width,
    canvas.height
  );
  const bigfont = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
  const smallfont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  jimpCanvas.print(
    bigfont,
    params.textPosition.x1,
    params.textPosition.y1,
    params.txtbig
  );
  jimpCanvas.print(
    smallfont,
    params.textPosition.x2,
    params.textPosition.y2,
    params.txtsmall
  );

  const processed_image = await jimpCanvas.getBufferAsync(Jimp.MIME_PNG);
  return processed_image;
};
const params = {
  images: [
    path.dirname(__dirname) + "/res/image_1.png",
    path.dirname(__dirname) + "/res/image_2.png",
    path.dirname(__dirname) + "/res/image_3.png",
  ],
  txt_big: "Hello world",
  txt_small: "Welcome to my world",
  textPosition: {
    x1: 100,
    y1: 100,
    x2: 50,
    y2: 800,
  },
};

get_processed_img(params)
  .then((processed_image) => {
    // Faites quelque chose avec l'image finale
  })
  .catch((err) => {
    console.log(err);
  });
