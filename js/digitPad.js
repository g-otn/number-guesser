(() => {

  function DigitPad($element, options) {
    const o = options;
    const width = o.columns * o.cellSize;
    const height = o.rows * o.cellSize;

    this.init = () => {
      // console.log('Initalizing digit display at', $element, 'with options:', options);
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
        this.canvas.style.cursor = 'crosshair';
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

    this.drawGrid = (rows = this.getGrid()) => {
      this.clear();

      // Draw each cell with grey color
      for (let y = 0; y < o.rows; y++) {
        for (let x = 0; x < o.columns; x++) {
          const value = rows[y][x] || 0;
          this.ctx.fillStyle = `rgb(${value * 255}, ${value * 255}, ${value * 255})`;
          this.ctx.fillRect(x * o.cellSize, y * o.cellSize, o.cellSize, o.cellSize);
        }
      }
    }

    this.drawGridColor = (rows = this.getGrid(), colorPositive = [0, 204, 0], colorNegative = [204, 0, 0]) => {
      this.clear();

      // Draw each cell with grey color
      for (let y = 0; y < o.rows; y++) {
        for (let x = 0; x < o.columns; x++) {
          let value = rows[y][x] || 0;
          let color = value > 0 ? colorPositive : colorNegative; 
          this.ctx.fillStyle = `rgba(${color[0] * 255}, ${color[1] * 255}, ${color[2] * 255}, ${Math.abs(value)})`;
          this.ctx.fillRect(x * o.cellSize, y * o.cellSize, o.cellSize, o.cellSize);
        }
      }
    }

    // Centers drawing in canvas (calculate grid values only, no ctx manipulation)
    // (Checks the 'corners' of the drawing and moves the values towards the middle of the grid)
    this.getCenteredPositiveGrid = (rows = this.getGrid()) => {
      // console.log('rows:', rows)

      // Calulate corners
      let top = o.rows - 1, bottom = 0, left = o.columns - 1, right = 0;
      for (let y = 0; y < o.rows; y++) {
        for (let x = 0; x < o.columns; x++) {
          let value = rows[y][x];
          if (value > 0) {
            if (y < top) top = y;
            if (y > bottom) bottom = y;
            if (x < left) left = x;
            if (x > right) right = x;
          }
        }
      }
      // console.log('Corners:', top, bottom, left, right);
      

      const drawingWidth = right - left, drawingHeight = bottom - top;

      
      // Calculate starting position
      const centerTopLeft = { // position of the drawing most top-left pixel in the whole canvas
        x: Math.floor((o.columns - 1) / 2) - Math.floor(drawingWidth / 2),
        y: Math.floor((o.rows - 1) / 2) - Math.floor(drawingHeight / 2)
      }
      // console.log('centerTopLeft:', centerTopLeft);


      // 'Move' grid values to its center
      const rowsWithCenteredDrawing = [];
      for (let y = 0; y < o.rows; y++) {
        rowsWithCenteredDrawing[y] = [];
        for (let x = 0; x < o.columns; x++) {
          rowsWithCenteredDrawing[y][x] = 0;  // Initialize matrice (undefined & NaN values don't work well with the neural network)
        }
      }
      for (let y = centerTopLeft.y; y < centerTopLeft.y + drawingHeight + 1; y++) {
        for (let x = centerTopLeft.x; x < centerTopLeft.x + drawingWidth + 1; x++) {
          rowsWithCenteredDrawing[y][x] = rows[top + (y - centerTopLeft.y)][left + (x - centerTopLeft.x)]; // 'Draw' drawing at center
        }
      }

      // console.log('rowsWithCenteredDrawing:', rowsWithCenteredDrawing)
      return rowsWithCenteredDrawing;
    }
  }

  window.DigitPad = DigitPad;

})();