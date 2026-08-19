import { Jimp } from "jimp";

async function run() {
  const image = await Jimp.read("/Users/leandroniero/CLIENTS_files/Andromeda/andromeda/client/public/favicon_color.png");
  image.resize({ w: 256, h: 256 });
  await image.write("public/favicon_square.png");
}
run();
