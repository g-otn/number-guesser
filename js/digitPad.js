(() => {

  function DigitPad($element, options) {
    const o = options;
    const width = o.columns * o.cellSize;
    const height = o.rows * o.cellSize;

    this.init = () => {
      console.log('Initalizing digit display at', $element, 'with options:', options);
      // Init canvas
      this.canvas = document.createElement('canvas');
      this.canvas.width = width;
      this.canvas.height = height;

      this.canvas = this.canvas;
      this.ctx = this.canvas.getContext('2d');

      $element.append(this.canvas);

      if (!o.disablePad) {
        this.pad = new SignaturePad(this.canvas, {
          minWidth: o.brushWidth,
          maxWidth: o.brushWidth,
          dotSize: o.brushWidth,
          penColor: 'white',
          onBegin: o.onBegin,
          onEnd: o.onStroke
        });
      }

    };

    // Create matrice of canvas pixels RGBA values
    this.getPixelValues = () => {
      const imageData = this.ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const pixels = [];

      let i = 0;
      for (let y = 0; y < height; y++) {
        pixels[y] = [];
        for (let x = 0; x < width; x++) {
          pixels[y][x] = { red: data[i], green: data[i + 1], blue: data[i + 2], alpha: data[i + 3] }; // color value (from 0 to 255)
          i += 4; // Skip 4 positions in array (move to next pixel)
        }
      }
      
      return pixels;
    }

    // Get average color value from all the pixels in a single cell
    this.getCellAverageValue = (x, y, pixels) => {
      const offsetX = x * o.cellSize, offsetY = y * o.cellSize;
      const pixelsInCell = o.cellSize * o.cellSize;

      let sum = 0;
      for (let i = offsetY; i < offsetY + o.cellSize; i++) {
        for (let j = offsetX; j < offsetX + o.cellSize; j++) {
          sum += pixels[i][j].red; // Since brush color is white, any RGB value works
        }
      }
      
      return sum / pixelsInCell / 255; // From [0-255] to [0-1]
      // return sum / pixelsInCell;
    }

    // Average color value pixels contained in each cell and squish each value to interval from 0 to 1
    this.getGrid = () => {
      const pixels = this.getPixelValues();

      const rows = [];
      for (let y = 0; y < o.rows; y++) {
        rows[y] = [];
        for (let x = 0; x < o.columns; x++) {
          rows[y][x] = this.getCellAverageValue(x, y, pixels);
        }
      }

      return rows;
    }

    this.clear = () => {
      if (this.pad) {
        this.pad.clear();
      }
    }

    this.drawGrid = (rows = this.getRowValues()) => {
      this.clear();

      // Draw each cell with grey color
      for (let y = 0; y < o.rows; y++) {
        for (let x = 0; x < o.columns; x++) {
          this.ctx.fillStyle = `rgb(${rows[y][x] * 255}, ${rows[y][x] * 255}, ${rows[y][x] * 255})`;
          this.ctx.fillRect(x * o.cellSize, y * o.cellSize, o.cellSize, o.cellSize);
        }
      }
    }
  }

  window.DigitPad = DigitPad;

})();