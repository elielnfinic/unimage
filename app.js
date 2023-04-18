const { createCanvas, loadImage, registerFont } = require('canvas');
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
