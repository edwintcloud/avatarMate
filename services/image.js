const jimp = require("jimp");

module.exports = async (buffer, options) => {
  // use jimp to do stuff to image
  try {
    // set options based on passed in options or use defaults
    const opts = {
      width: Number(options.width) < 500 ? Number(options.width) : 100,
      height: Number(options.height) < 500 ? Number(options.height) : 100,
      quality: Number(options.quality) || 50,
      brightness: Number(options.brightness) || 0,
      contrast: Number(options.contrast) || 0,
      greyscale: Boolean(options.greyscale) || false,
      invert: Boolean(options.invert) || false,
      sepia: Boolean(options.sepia) || false,
      rotate: Number(options.rotate) || 0,
      flipH: Boolean(options.flipH) || false,
      flipV: Boolean(options.flipV) || false,
      format: options.format || "image/png"
    };
    const img = await jimp.read(buffer);

    await img.resize(opts.width, opts.height);
    await img.quality(opts.quality);
    await img.brightness(opts.brightness);
    await img.contrast(opts.contrast);
    if (opts.greyscale) await img.greyscale();
    if (opts.invert) await img.invert();
    if (opts.sepia) await img.sepia();
    await img.rotate(opts.rotate);
    await img.flip(opts.flipH, opts.flipV);

    return await img.getBase64Async(opts.format);
  } catch (e) {
    return Promise.reject(e);
  }
};
