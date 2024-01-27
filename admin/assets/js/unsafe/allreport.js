const reportDataBody = document.querySelector("#datatablesSimple tbody");

const showAlert = (message, type) => {
  Swal.fire({
    icon: type,
    title: 'Gagal',
    text: message,
  });
};

const getTokenFromCookies = (cookieName) => {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === cookieName) {
      return value;
    }
  }
  return null;
};

const getUnsafeReports = async () => {
  try {
    const token = getTokenFromCookies("Login");

    if (!token) {
      showAlert('Kamu Belum Login!', 'warning');
      window.location.href = 'https://portsafe-apps.github.io/';
      return;
    }

    const targetURL = "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/GetAllReport";

    const myHeaders = new Headers();
    myHeaders.append("Login", token);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    const response = await fetch(targetURL, requestOptions);
    const data = await response.json();

    if (data.status === true) {
      displayReportData(data.data, reportDataBody);
    } else {
      showAlert(data.message, "error");
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const displayReportData = (reportData, reportDataBody) => {
  try {
    console.log("reportData:", reportData);

    if (reportDataBody) {
      reportDataBody.innerHTML = "";

      if (reportData && reportData.length > 0) {
        reportData.forEach((report) => {
          const newRow = document.createElement("tr");
          newRow.innerHTML = `
            <td>${report.reportid}</td>
            <td>${report.date}</td>
            <td>${report.time}</td>
            <td>${report.location.locationName}</td>
            <td>${report.area}</td>
            <td>
                <button class="btn btn-datatable btn-icon btn-transparent-dark detail-link" data-reportid="${report.reportid}" data-action="detailReport"><i data-feather="eye"></i> Detail</button>
                <button class="btn btn-datatable btn-icon btn-transparent-dark delete-link" data-reportid="${report.reportid}" data-action="deleteReport"><i data-feather="trash-2"></i> Delete</button>
            </td>
          `;
          reportDataBody.appendChild(newRow);
        });
      } else {
        const emptyRow = document.createElement("tr");
        emptyRow.innerHTML = '<td colspan="6">No report data found.</td>';
        reportDataBody.appendChild(emptyRow);
      }

      feather.replace();
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

const deleteReport = async (reportid) => {
    try {
      const token = getTokenFromCookies("Login");
  
      if (!token) {
        Swal.fire({
          icon: 'warning',
          title: 'Authentication Error',
          text: 'Kamu Belum Login!',
        }).then(() => {
          window.location.href = 'https://portsafe-apps.github.io/';
        });
        return;
      }
  
      const targetURL =
        "https://asia-southeast2-ordinal-stone-389604.cloudfunctions.net/DeleteReportUnsafe"; // Adjust the API endpoint
  
      const myHeaders = new Headers();
      myHeaders.append("Login", token);
      myHeaders.append("Content-Type", "application/json");
  
      const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: JSON.stringify({ reportid: reportid }),
        redirect: "follow",
      };
  
      const response = await fetch(targetURL, requestOptions);
      const data = await response.json();
  
      if (data.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Report deleted successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          getUnsafeReports();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  const detailReport = (reportid) => {
    window.location.href = `https://portsafe-apps.github.io/detail-report.html?reportid=${reportid}`;
  };
  
  const deleteReportHandler = (reportid) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReport(reportid);
      }
    });
  };
  

document.getElementById("datatablesSimple").addEventListener("click", (event) => {
  const target = event.target;
  const detailButton = target.closest("[data-action='detailReport']");
  const deleteButton = target.closest("[data-action='deleteReport']");

  if (detailButton) {
    const reportid = detailButton.getAttribute("data-reportid");
    detailReport(reportid);
  } else if (deleteButton) {
    const reportid = deleteButton.getAttribute("data-reportid");
    deleteReportHandler(reportid);
  }
});

// Initial call to get all reports when the page loads
getUnsafeReports();

