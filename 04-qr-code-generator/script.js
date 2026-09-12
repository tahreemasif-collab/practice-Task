const qrForm = document.getElementById('qrForm');
const contentInput = document.getElementById('content');
const sizeInput = document.getElementById('size');
const fgInput = document.getElementById('fg');
const bgInput = document.getElementById('bg');
const qrcodeEl = document.getElementById('qrcode');
const downloadBtn = document.getElementById('download');

let currentQR = null;

function generate(){
  const text = contentInput.value.trim();
  if (!text) return;

  const size = Number(sizeInput.value);

  try {
    currentQR = new QRCodeCanvas(qrcodeEl, {
      text: text,
      width: size,
      height: size,
      colorDark: fgInput.value,
      colorLight: bgInput.value,
      correctLevel: QRErrorCorrectLevel.M
    });
  } catch (err) {
    qrcodeEl.innerHTML = `<p style="color:#a6432f; font-size:0.9rem; max-width:220px; text-align:center;">Could not generate a code for this text (too long). Try shortening it.</p>`;
    currentQR = null;
  }
}

qrForm.addEventListener('submit', (e) => {
  e.preventDefault();
  generate();
});

downloadBtn.addEventListener('click', () => {
  if (!currentQR) return;
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = currentQR.toDataURL('image/png');
  link.click();
});

// generate one on load with the default value
generate();
