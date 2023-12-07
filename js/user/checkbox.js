var data = {
    "TypeDangerousActions": [
      {
        "TypeId": "1",
        "TypeName": "REAKSI ORANG",
        "SubTypes": [
          "Merubah Fungsi Alat Pelindung Diri",
          "Merubah Posisi",
          "Merubah Cara Kerja",
          "Menghentikan Pekerjaan",
          "Jatuh ke Lantai",
          "Terkunci"
        ]
      },
      {
        "TypeId": "2",
        "TypeName": "ALAT PELINDUNG DIRI",
        "SubTypes": [
          "Kepala",
          "Mata dan Wajah",
          "Telinga",
          "Sistem Pernafasan",
          "Tangan dan Lengan",
          "Dagu",
          "Kaki dan Betis"
        ]
      },
      {
        "TypeId": "3",
        "TypeName": "POSISI ORANG",
        "SubTypes": [
          "Terbentur Pada",
          "Tertabrak oleh",
          "Terjepit didalam, pada atau diantara",
          "Terjatuh",
          "Terkena Temperatur Tinggi",
          "Tersengat Arus Listrik",
          "Terhirup",
          "Terisap, Terserap",
          "Tertelan Benda Berbahaya",
          "Memaksakan Pekerjaan yang Terlalu Berat"
        ]
      },
      {
        "TypeId": "4",
        "TypeName": "ALAT DAN PERLENGKAPAN",
        "SubTypes": [
          "Tidak Sesuai Dengan Jenis Pekerjaan",
          "Digunakan Secara Tidak Benar",
          "Dalam Kondisi yang Tidak Aman"
        ]
      },
      {
        "TypeId": "5",
        "TypeName": "PROSEDUR DAN CARA KERJA",
        "SubTypes": [
          "Tidak Memenuhi",
          "Tidak diketahui/dimengerti",
          "Tidak diikuti"
        ]
      }
    ]
  };

// Function to create checkboxes
function createCheckboxes(data) {
    var container = document.getElementById("checkboxContainer");

    data.TypeDangerousActions.forEach(function (action) {
        var actionDiv = document.createElement("div");
        actionDiv.className = "element-heading form-label";
        actionDiv.innerHTML = "<h6>" + action.TypeName + "</h6>";

        var subTypesArray = [];

        action.SubTypes.forEach(function (subType) {
            var checkboxContainer = document.createElement("div");
            checkboxContainer.className = "form-check";

            var checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.name = action.TypeId;
            checkbox.value = subType;
            checkbox.id = action.TypeId + "_" + subType.replace(/\s+/g, "_");

            checkbox.dataset.typeName = action.TypeName; // Menyimpan TypeName dalam dataset

            var label = document.createElement("label");
            label.className = "form-check-label";
            label.htmlFor = checkbox.id;
            label.appendChild(document.createTextNode(subType));

            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);

            actionDiv.appendChild(checkboxContainer);

            subTypesArray.push(subType);
        });

        container.appendChild(actionDiv);
    });
}


// Call the function with your data
createCheckboxes(data);