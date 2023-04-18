const Jimp = require("jimp");

const get_processed_img = async (img1, img2, img3, txt_big, txt_small) => {
  // Load the images using Jimp
  const image1 = await Jimp.read(img1);
  const image2 = await Jimp.read(img2);
  const image3 = await Jimp.read(img3);

  // Resize the images to the same dimensions
  const width = 800;
  const height = 600;
  image1.resize(width, height);
  image2.resize(width, height);
  image3.resize(width, height);

  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const font1 = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  const font2 = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

  // Add the big text to the first image
  image1.print(
    font1,
    100,
    100,
    { text: txt_big, alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER },
    width - 200,
    height - 200
  );

  // Add the small text to the second image
  image2.print(
    font2,
    50,
    height - 50,
    { text: txt_small, alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT },
    width - 100,
    height - 50
  );

  // Add a border to the third image
  //image3.border(10, "#000");

  // Combine the images horizontally
  const combinedImage = new Jimp(width * 3, height);
  combinedImage.composite(image1, 0, 0);
  combinedImage.composite(image2, width, 0);
  combinedImage.composite(image3, width * 2, 0);

  // Return the processed image as a Buffer
  return await combinedImage.getBufferAsync(Jimp.MIME_PNG);
};

// Example usage:
get_processed_img("res/image_1.png", "res/image_2.png", "res/image_3.png", "Hello world", "Welcome to my world")
  .then((processed_image) => {
    // Do something with the processed image, such as save it to a file
    
    console.log("Processed image size:", processed_image.length);

    // Save the processed image to a file
    const fs = require("fs");
    fs.writeFileSync("output.png", processed_image);
    
  })
  .catch((error) => {
    console.error("Error processing image:", error);
  });
