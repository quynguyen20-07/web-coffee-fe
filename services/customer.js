function fetchCustomers() {
  fetch("https://coffee-web-api-dkrq.onrender.com/users")
    .then((response) => response.json())
    .then((data) => {
      var listCustomerTable = document.getElementById("list_customer");
      var tableBody = listCustomerTable.createTBody();
      data.forEach((users) => {
        var row = tableBody.insertRow();
        row.innerHTML = `
          <td>${users.id}</td>
          <td>${users.name}</td>
          <td>${users.email}</td>
          <td>${users.phoneNumber}</td>
          <td>${users.address}</td>
          <td>
          <button id="update_btn_product" class="btn btn-primary" onclick="update_customer(${users.id})">Update</button>
            <button id="delete_btn_product" onclick="delete_customer(${users.id})">Delete</button>
         
          </td>
        `;
      });
    });
}

fetchCustomers();

function createCustomer() {
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const roleId = document.getElementById("role_id").value;
  const address = document.getElementById("address").value;

  const users = {
    name: name,
    password: password,
    phoneNumber: phone,
    email: email,
    roleId: parseInt(roleId),
    address: address,
  };

  fetch("https://coffee-web-api-dkrq.onrender.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(users),
  })
    .then((response) => {
      if (response.ok) {
        Swal.fire("Thêm khách hàng thành công!", "", "success");
      } else {
        Swal.fire("Thêm khách hàng thất bại!", "", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Lỗi", "Đã xảy ra lỗi khi thêm khách hàng", "error");
    });
}

function delete_customer(id) {
  Swal.fire({
    title: "Xác nhận xóa",
    text: "Bạn có chắc chắn muốn xóa khách hàng này?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    confirmButtonColor: "rgb(50, 50, 216)",
    cancelButtonColor: "rgb(220, 53, 69)",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`https://coffee-web-api-dkrq.onrender.com/users/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          fetchCustomers();
          Swal.fire("Xóa thành công", "", "success");
        })
        .catch(() => {
          Swal.fire("Xóa thất bại", "", "error");
        });
    }
  });
}

function update_customer(id) {
  fetch(`https://coffee-web-api-dkrq.onrender.com/users/${id}`)
    .then((response) => response.json())
    .then((users) => {
      document.getElementById("name").value = users.name;
      document.getElementById("password").value = users.password;
      document.getElementById("phone").value = users.phoneNumber;
      document.getElementById("email").value = users.email;
      document.getElementById("role_id").value = users.roleId;
      document.getElementById("address").value = users.address;

      fetch(`https://coffee-web-api-dkrq.onrender.com/users/${id}`)
        .then((response) => response.json())
        .then((customer) => {
          document.getElementById("name").value = customer.name;
          document.getElementById("password").value = customer.password;
          document.getElementById("phone").value = customer.phoneNumber;
          document.getElementById("email").value = customer.email;
          document.getElementById("role_id").value = customer.roleId;
          document.getElementById("address").value = customer.address;
          document.getElementById("main_title").innerHTML = "Update Customer";
          document.getElementById("sub").innerHTML = "Update";
          document.getElementById("sub").style.backgroundColor =
            "rgb(50, 50, 216)";
          document.getElementById("modal-header").style.backgroundColor =
            "rgb(50, 50, 216)";
          var modal = new bootstrap.Modal(document.getElementById("myModal"));
          modal.show();

          document.getElementById("cusForm").onsubmit = function (event) {
            event.preventDefault();
            var updatedCustomer = {
              name: document.getElementById("name").value,
              password: document.getElementById("password").value,
              phoneNumber: document.getElementById("phone").value,
              email: document.getElementById("email").value,
              role_id: parseInt(document.getElementById("role_id").value),
              address: document.getElementById("address").value,
            };

            fetch(`https://coffee-web-api-dkrq.onrender.com/users/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedCustomer),
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
          };
        })
        .catch(() => {
          alert("Error retrieving users data");
        });
    });
}

customerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const submitButton = document.getElementById("sub");

  if (submitButton.innerHTML === "Create") {
    createCustomer();
  } else if (submitButton.innerHTML === "Update") {
    const customerId = submitButton.getAttribute("data-id");
    updateCustomer(customerId);
  }
});

function refreshModal() {
  document.getElementById("main_title").innerHTML = "Create Customer";
  document.getElementById("sub").innerHTML = "Create";
  document.getElementById("sub").style.backgroundColor = "#4caf50";
  document.getElementById("modal-header").style.backgroundColor = "#4caf50";
  // Thực hiện các thao tác cần thiết để refresh modal tại đây
  var form = document.getElementById("cusForm"); // Thay "myForm" bằng ID của form thực tế
  form.reset(); // Reload form bằng cách reset lại các giá trị của các trường input
}
