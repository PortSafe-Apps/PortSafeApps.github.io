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
  