const colorPicker = document.getElementById('color-picker');
const selectedColor = document.getElementById('selected-color');
const hexValue = document.getElementById('hex-value');
const rgbValue = document.getElementById('rgb-value');
const hslValue = document.getElementById('hsl-value');
const cmykValue = document.getElementById('cmyk-value');
const pickColorBtn = document.getElementById('pick-color-btn');
const recentColorsList = document.getElementById('recent-colors-list');

let recentColors = [];

function updateColorDisplay(color) {
  selectedColor.style.backgroundColor = color;
  hexValue.textContent = `HEX: ${color}`;
  rgbValue.textContent = `RGB: ${hexToRgb(color)}`;
  hslValue.textContent = `HSL: ${hexToHsl(color)}`;
  cmykValue.textContent = `CMYK: ${hexToCmyk(color)}`;
}

function hexToRgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToHsl(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function hexToCmyk(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let k = 1 - Math.max(r, g, b);
  let c = (1 - r - k) / (1 - k) || 0;
  let m = (1 - g - k) / (1 - k) || 0;
  let y = (1 - b - k) / (1 - k) || 0;

  return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
}

function addToRecentColors(color) {
  if (!recentColors.includes(color)) {
    if (recentColors.length >= 5) {
      recentColors.shift();
    }
    recentColors.push(color);
    renderRecentColors();
  }
}

function renderRecentColors() {
  recentColorsList.innerHTML = '';
  recentColors.forEach(color => {
    const colorBox = document.createElement('div');
    colorBox.style.backgroundColor = color;
    colorBox.classList.add('recent-color-box');
    colorBox.onclick = () => {
      updateColorDisplay(color);
      addToRecentColors(color);
    };
    recentColorsList.appendChild(colorBox);
  });
}

// Eye Dropper API functionality to pick a color from the screen
if (window.EyeDropper) {
  pickColorBtn.addEventListener('click', () => {
    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
      const pickedColor = result.sRGBHex;
      updateColorDisplay(pickedColor);
      addToRecentColors(pickedColor);
    }).catch(e => {
      console.error('Failed to pick color:', e);
    });
  });
}

// Regular color picker input
colorPicker.addEventListener('input', (e) => {
  const color = e.target.value;
  updateColorDisplay(color);
  addToRecentColors(color);
});

// On load, render any stored recent colors
renderRecentColors();
