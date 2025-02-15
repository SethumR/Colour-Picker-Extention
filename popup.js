// Get references to the DOM elements
const colorPreview = document.getElementById('colorPreview');
const hexValue = document.getElementById('hexValue');
const rgbValue = document.getElementById('rgbValue');
const hslValue = document.getElementById('hslValue');
const cmykValue = document.getElementById('cmykValue');
const recentColorsList = document.getElementById('recentColorsList');
const pickColorButton = document.getElementById('pickColor');

// Initialize an array to store recent colors
let recentColors = [];

// Function to format RGB to HSL
function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [
    Math.round(h * 360),
    Math.round(s * 100),
    Math.round(l * 100)
  ];
}

// Function to convert RGB to CMYK
function rgbToCmyk(r, g, b) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, Math.min(m, y));
  
  c = (c - k) / (1 - k) * 100;
  m = (m - k) / (1 - k) * 100;
  y = (y - k) / (1 - k) * 100;
  k *= 100;

  return [Math.round(c), Math.round(m), Math.round(y), Math.round(k)];
}

// Function to update color values
function updateColorValues(color) {
  colorPreview.style.backgroundColor = color;
  
  const hex = color;
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  hexValue.textContent = hex;
  rgbValue.textContent = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  hslValue.textContent = `${hsl[0]}°, ${hsl[1]}%, ${hsl[2]}%`;
  cmykValue.textContent = `${cmyk[0]}, ${cmyk[1]}, ${cmyk[2]}, ${cmyk[3]}`;
  
  // Add to recent colors
  addRecentColor(color);
}

// Function to add recent color
function addRecentColor(color) {
  if (!recentColors.includes(color)) {
    if (recentColors.length >= 5) recentColors.shift(); // Keep only the last 5 colors
    recentColors.push(color);
    
    // Display recent colors
    recentColorsList.innerHTML = recentColors.map(col => `<div class="color-box" style="background-color: ${col};"></div>`).join('');
  }
}

// Function to convert hex to RGB
function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Handle color picking using the EyeDropper API
pickColorButton.addEventListener('click', () => {
  if ('EyeDropper' in window) {
    const eyeDropper = new EyeDropper();

    eyeDropper.open().then(result => {
      const color = result.sRGBHex;
      updateColorValues(color);
    }).catch(e => {
      console.error('Failed to pick color:', e);
    });
  } else {
    alert('EyeDropper API is not supported in your browser.');
  }
});

// Function to copy color value to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Color code copied!');
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.classList.add('toast');
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');
    document.body.removeChild(toast);
  }, 3000);
}

// Add event listeners to copy color values to clipboard when clicked
hexValue.addEventListener('click', () => copyToClipboard(hexValue.textContent));
rgbValue.addEventListener('click', () => copyToClipboard(rgbValue.textContent));
hslValue.addEventListener('click', () => copyToClipboard(hslValue.textContent));
cmykValue.addEventListener('click', () => copyToClipboard(cmykValue.textContent));
