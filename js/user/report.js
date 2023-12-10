// Fungsi untuk mendapatkan token dari cookie
function getTokenFromCookies(cookieName) {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  return null;
}

// Fungsi untuk mendapatkan semua laporan pengguna dengan token
const getAllUserReport = async () => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    // Tangani kesalahan autentikasi jika tidak ada token
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'Kamu Belum Login!',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
    return;
  }

  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      // Tampilkan laporan pengguna dalam bentuk kartu
      displayReportData(data.data, 'reportContainer');
    } else {
      console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Fungsi untuk menampilkan laporan pengguna dalam bentuk kartu
const displayReportData = (reportData, cardContainerId) => {
  const reportContainer = document.getElementById(cardContainerId);

  reportContainer.innerHTML = '';

  if (reportData && reportData.length > 0) {
    reportData.forEach((report) => {
      const newCard = document.createElement('div');
      newCard.className = 'card timeline-card bg-dark';
      newCard.innerHTML = `
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div class="timeline-text mb-2">
                <h6 class="element-heading fw-bolder">${report.reportid}</h6>
                <span>${report.location.locationName}</span>
              </div>
              <div class="timeline-text mb-2">
                <span class="badge mb-2 rounded-pill bg-dark">${report.date}</span>
              </div>
            </div>
            <div class="divider mt-0"></div>
            <div class="timeline-text mb-2">
              <h6 class="mb-0">Jenis Ketidaksesuaian</h6>
              <div class="timeline-tags">
                ${report.typeDangerousActions.map(action => `<span class="badge bg-light text-dark">${action.typeName}</span>`).join('')}
              </div>
            </div>
            <div class="timeline-text mb-0">
              <h6 class="mb-0">Pengawas</h6>
              <span class="fw-normal">${report.user.nama}</span> <br> <span class="fw-normal">${report.user.jabatan}</span>
            </div>
          </div>
        `;

      // Tambahkan event listener klik pada kartu
      newCard.addEventListener('click', () => {
        // Panggil fungsi untuk mengambil dan menampilkan informasi laporan detail
        getDetailedReport(report.reportid);
      });

      reportContainer.appendChild(newCard);
    });
  } else {
    reportContainer.innerHTML = '<p>No report data found.</p>';
  }
};



// Fungsi untuk menampilkan detail pelaporan
const getDetailedReport = async (reportid) => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    // Tangani kesalahan autentikasi jika tidak ada token
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'Kamu Belum Login!',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
    return;
  }

  const targetURL = `https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/oneReport-1`;

  const myHeaders = new Headers();
  myHeaders.append('Login', token);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({ reportid }), // Pass reportid in the request body
    redirect: 'follow',
  };

  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      // Tampilkan informasi detail laporan
      displayDetailedReport(data.data);
    } else {
      console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};



// Fungsi untuk menampilkan informasi detail laporan ke dalam HTML
const displayDetailedReport = (detailedReport) => {
  const detailContainer = document.getElementById('detailContainer');

  detailContainer.innerHTML = '';

  if (detailedReport) {
    const detailCard = document.createElement('div');
    detailCard.className = 'card bg-light';
    detailCard.innerHTML = `
      <div class="card-body">
        <h6 class="mb-0">Nomor Pelaporan</h6>
        <p>${detailedReport.reportid}</p>
        
        <h6 class="mb-0">Tanggal Pelaporan</h6>
        <p>${detailedReport.date}</p>
        
        <h6 class="mb-0">Informasi Pengawas</h6>
        <p class="mb-0">${detailedReport.user.nama}</p>
        <p>${detailedReport.user.jabatan}</p>
        
        <h6 class="mb-0">Lokasi Kejadian</h6>
        <p>${detailedReport.location.locationName}</p>
        
        <h6 class="mb-0">Deskripsi Pengamatan</h6>
        <p>${detailedReport.description}</p>
        
        <h6>Foto Kejadian</h6>
        <div class="text-center">
          <img class="w-75 mb-4" src="${detailedReport.observationPhoto}" alt="Foto Kejadian">
        </div>
        
        <h6 class="mb-0">Tindakan Berbahaya yang Dilakukan</h6>
        <ul class="ps-0 fs-6">
          ${detailedReport.typeDangerousActions.map((action, index) => `
            <li><span>${index + 1}.</span> ${action.typeName}</li>
            <ul class="ps-3">
              ${action.subTypes.map(subType => `
                <li><i class="bi bi-dash me-2"></i>${subType}</li>
              `).join('')}
            </ul>
          `).join('')}
        </ul>

        <h6 class="mb-0">Area</h6>
        <p>${detailedReport.area.areaName}</p>

        <h6 class="mb-0">Tindakan Perbaikan Segera</h6>
        <p>${detailedReport.immediateAction}</p>

        <h6>Foto Tindakan Perbaikan</h6>
        <div class="text-center">
          <img class="w-75 mb-4" src="${detailedReport.improvementPhoto}" alt="Foto Tindakan Perbaikan">
        </div>

        <h6 class="mb-0">Tindakan Pencegahan Terulang Kembali</h6>
        <p>${detailedReport.correctiveAction}</p>
      </div>
    `;

    detailContainer.appendChild(detailCard);
  } else {
    detailContainer.innerHTML = '<p>Informasi detail tidak ditemukan.</p>';
  }
};

// Panggil fungsi untuk mendapatkan dan menampilkan laporan pengguna
getAllUserReport();

const getLatestReport = async () => {
  const token = getTokenFromCookies('Login');

  if (!token) {
    // Tangani kesalahan autentikasi jika tidak ada token
    Swal.fire({
      icon: 'warning',
      title: 'Authentication Error',
      text: 'Kamu Belum Login!',
    }).then(() => {
      window.location.href = 'https://portsafe-apps.github.io/';
    });
    return;
  }

  const targetURL = `https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReportbyUser`;

  const myHeaders = new Headers();
  myHeaders.append('Login', token);

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow',
  };


  try {
    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === 200) {
      // Tampilkan informasi detail laporan
      latestDisplayReportData(data.data, 'latestCardContainer');
    } else {
      console.error('Server response:', data.message || 'Data tidak dapat ditemukan');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Fungsi untuk menampilkan laporan pengguna terbaru dalam bentuk kartu
const latestDisplayReportData = (reportData, cardContainerId) => {
  const latestCardContainer = document.getElementById(cardContainerId);

  latestCardContainer.innerHTML = '';

  if (reportData && reportData.length > 0) {
    // Mengurutkan data berdasarkan tanggal secara descending
    reportData.sort((a, b) => new Date(b.date) - new Date(a.date));

    const latestReport = reportData[0]; // Mengambil elemen pertama setelah diurutkan

    const newCard = document.createElement('div');
    newCard.className = 'card timeline-card bg-dark';
    newCard.innerHTML = `
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <div class="timeline-text mb-2">
                <h6 class="element-heading fw-bolder">${latestReport.reportid}</h6>
                <span>${latestReport.location.locationName}</span>
              </div>
              <div class="timeline-text mb-2">
                <span class="badge mb-2 rounded-pill bg-dark">${latestReport.date}</span>
              </div>
            </div>
            <div class="divider mt-0"></div>
            <div class="text-content mb-2">
              <h6 class="mb-0">Jenis Ketidaksesuaian</h6>
              <div class="timeline-tags">
                ${latestReport.typeDangerousActions.map(action => `<span class="badge bg-light text-dark">${action.typeName}</span>`).join('')}
              </div>
            </div>
            <div class="text-content mb-0">
              <h6 class="mb-0">Pengawas</h6>
              <span class="fw-normal">${latestReport.user.nama}</span> <br> <span class="fw-normal">${latestReport.user.jabatan}</span>
            </div>
          </div>
        `;

    latestCardContainer.appendChild(newCard);
  } else {
    latestCardContainer.innerHTML = '<p>No report data found.</p>';
  }
};

getLatestReport();