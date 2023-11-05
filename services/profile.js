function goBack() {
  window.history.back();
}

function getUserData() {
  let userData;
  const hashKey = "Abcd123@";
  const token = localStorage.getItem("token");

  const decryptedUserInfo = CryptoJS.AES.decrypt(token, hashKey).toString(
    CryptoJS.enc.Utf8
  );

  if (decryptedUserInfo) {
    userData = JSON.parse(decryptedUserInfo);
  }

  return userData;
}

const userData = getUserData();

document.getElementById("updateBtn").style.display = "none";

function enableEdit() {
  const inputFields = document.querySelectorAll(".input_show");
  const editBtn = document.getElementById("editBtn");
  const updateBtn = document.getElementById("updateBtn");

  inputFields.forEach((input) => {
    input.readOnly = false;

    input.style.backgroundColor = "lightgray";
  });

  editBtn.style.display = "none";
  updateBtn.style.display = "inline-block";
}

function updateData() {
  const inputFields = document.querySelectorAll(".input_show");
  const editBtn = document.getElementById("editBtn");
  const updateBtn = document.getElementById("updateBtn");

  const data = {
    name: document.getElementById("show_name").value,
    roleId: 2,
    password: document.getElementById("show_password").value,
    phoneNumber: document.getElementById("show_phone").value,
    email: document.getElementById("show_email").value,
    address: document.getElementById("show_address").value,
    avatar: document.getElementById("upload-img").src,
  };

  update_cus(userData?.id, data);

  inputFields.forEach((input) => {
    input.readOnly = true;
    input.style.backgroundColor = "white";
  });

  editBtn.style.display = "inline-block";
  updateBtn.style.display = "none";
}

function fetch_cus() {
  if (userData.roleId == 1) {
    fetch(`https://coffee-web-api-dkrq.onrender.com/users/${userData?.id}`)
      .then((response) => response.json())
      .then((customer) => {
        document.getElementById("name_user1").innerHTML = customer.name;
        document.getElementById("upload-img").src = customer.avatar;
        document.getElementById("show_name").value = customer.name;
        document.getElementById("show_email").value = customer.email;
        document.getElementById("show_phone").value = customer.phoneNumber;
        document.getElementById("show_password").value = customer.password;
        document.getElementById("show_address").value = customer.address;
        document.getElementById("update").style.display = "none";
      });
  } else {
    fetch(`https://coffee-web-api-dkrq.onrender.com/users/${userData?.id}`)
      .then((response) => response.json())
      .then((customer) => {
        document.getElementById("name_user1").innerHTML = customer.name;
        document.getElementById("upload-img").src = customer.avatar;
        document.getElementById("show_name").value = customer.name;
        document.getElementById("show_email").value = customer.email;
        document.getElementById("show_phone").value = customer.phoneNumber;
        document.getElementById("show_password").value = customer.password;
        document.getElementById("show_address").value = customer.address;
        document.getElementById("update").style.display = "none";
      });
  }
}

fetch_cus();

function update_cus(id, data) {
  fetch(`https://coffee-web-api-dkrq.onrender.com/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire("Cập nhật thành công", "", "success");
        fetch("https://coffee-web-api-dkrq.onrender.com/users"); // Refresh the customer table
      } else {
        Swal.fire("Cập nhật thất bại", "", "error");
      }
    })
    .catch(() => {
      Swal.fire(
        "Lỗi",
        "Đã xảy ra lỗi khi cập nhật thông tin khách hàng",
        "error"
      );
    });
}

function uploadFile() {
  const uploadInput = document.getElementById("upload-input");
  const uploadImg = document.getElementById("upload-img");

  const file = uploadInput.files[0];
  const reader = new FileReader();

  reader.onload = function (event) {
    uploadImg.src = event.target.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}
