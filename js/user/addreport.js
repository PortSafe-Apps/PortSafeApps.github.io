const getTokenFromCookies = (cookieName) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
};

const showAlert = (message, type = 'success') => {
  Swal.fire({
    icon: type,
    text: message,
    showConfirmButton: true,
    timer: 1500
  });
};

// Fungsi untuk mendapatkan URL data gambar dari elemen gambar
async function getDataURLFromImage(elementId) {
  const imageElement = document.getElementById(elementId);

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Dapatkan URL data gambar
      const dataURL = canvas.toDataURL(); // Default format adalah PNG, tetapi dapat diganti jika diperlukan
      resolve(dataURL);
    };

    image.onerror = function (error) {
      reject(error);
    };

    image.src = imageElement.src;
  });
}

const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    showAlert("Header Login Not Found", 'error');
    return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

  try {
    function getCheckedCheckboxes() {
      var checkboxes = document.querySelectorAll('#checkboxContainer input[type="checkbox"]:checked');
      var checkedValues = [];

      checkboxes.forEach(function (checkbox) {
        var typeId = checkbox.name;
        var typeName = checkbox.dataset.typeName; // Mengambil Type Name dari dataset

        checkedValues.push({
          TypeId: typeId,
          TypeName: typeName,
          SubTypes: [checkbox.value]
        });
      });

      return checkedValues;
    }

    const fotoObservasiBase64 = await getDataURLFromImage('hasilFotoObservasi');
    const fotoPerbaikanBase64 = await getDataURLFromImage('hasilFotoPerbaikan');
    
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
        Reportid: document.getElementById('nomorPelaporan').value,
        Date: document.getElementById('tanggalPelaporan').value,
        User: {},
        Location: {
          LocationName: document.getElementById('autoCompleteLocation').value,
        },
        Description: document.getElementById('deskripsiPengamatan').value,
        ObservationPhoto: fotoObservasiBase64,
        TypeDangerousActions: getCheckedCheckboxes(),
        Area: {
          AreaName: document.getElementById('newAreaName').value,
        },
        ImmediateAction: document.getElementById('deskripsiPerbaikanSegera').value,
        ImprovementPhoto: fotoPerbaikanBase64,
        CorrectiveAction: document.getElementById('deskripsiPencegahanTerulangKembali').value,
      }),
      redirect: 'follow',
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === false) {
      showAlert(data.message, 'error');
    } else {
      showAlert("Data Pelaporan Berhasil di Input!", 'success');
      window.location.href = 'https://portsafe-apps.github.io/pages/user/listreport.html';
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);
