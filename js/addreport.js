import { getUserInfoFromApi } from '/js/getUserInfoFromApi.js';

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


const insertObservationReport = async (event) => {
  event.preventDefault();

  const token = getTokenFromCookies('Login');

  if (!token) {
    alert("Header Login Not Found");
    return;
  }


  const targetURL = 'https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/InsertReport-1';

  const myHeaders = new Headers();
  myHeaders.append('Login', token);
  myHeaders.append('Content-Type', 'application/json');

   
  try {
    const userData = await getUserInfoFromApi(token);

    // Dapatkan informasi pengguna dari respons API
    const userFromApi = {
      Nipp: userData.nipp,
      Nama: userData.nama,
      Jabatan: userData.jabatan,
      Divisi: userData.divisi,
      Bidang: userData.bidang,
    };

    const selectedTypeDangerousActions = [];
    const reaksiOrangCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    reaksiOrangCheckboxes.forEach((checkbox) => {
        const typeName = "REAKSI ORANG"; 
        const subTypeName = checkbox.value;
  
        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });
  
     const alatPelindungDiriCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
     alatPelindungDiriCheckboxes.forEach((checkbox) => {
         const typeName = "ALAT PELINDUNG DIRI"; 
         const subTypeName = checkbox.value;
  
         selectedTypeDangerousActions.push({
             TypeName: typeName,
             SubTypes: [{ SubTypeName: subTypeName }],
         });
     });
   
    const posisiOrangCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    posisiOrangCheckboxes.forEach((checkbox) => {
        const typeName = "POSISI ORANG"; 
        const subTypeName = checkbox.value;
  
        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });
  
    const alatDanPerlengkapanCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    alatDanPerlengkapanCheckboxes.forEach((checkbox) => {
        const typeName = "ALAT DAN PERLENGKAPAN"; 
        const subTypeName = checkbox.value;
  
        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });
  
    const prosedurDanCaraKerjaCheckboxes = document.querySelectorAll('.checkbox-group input:checked');
    prosedurDanCaraKerjaCheckboxes.forEach((checkbox) => {
        const typeName = "PROSEDUR DAN CARA KERJA"; 
        const subTypeName = checkbox.value;
  
        selectedTypeDangerousActions.push({
            TypeName: typeName,
            SubTypes: [{ SubTypeName: subTypeName }],
        });
    });
  
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({
          Reportid: document.getElementById('nomorPelaporan').value,
          Date: document.getElementById('tanggalPelaporan').value,
          User: {
            Nipp: userFromApi.Nipp,
            Nama: userFromApi.Nama,
            Jabatan: userFromApi.Jabatan,
            Divisi: userFromApi.Divisi,
            Bidang: userFromApi.Bidang,
        },
          Location: {
              LocationName: document.getElementById('autoCompleteLocation').value,
          },
          Description: document.getElementById('deskripsiPengamatan').value,
          ObservationPhoto: fotoObservasiBase64, 
          TypeDangerousActions: selectedTypeDangerousActions,
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
      alert(data.message);
    } else {
      // Update the input fields with user information
      document.getElementById('namaPengawas').value = userFromApi.Nama;
      document.getElementById('jabatanPengawas').value = userFromApi.Jabatan;
  
      alert("Reporting data inserted successfully!");
    }
  } catch (error) {
    console.error('Error:', error);
  }
  };
  
  document.getElementById('newReportForm').addEventListener('submit', insertObservationReport);


