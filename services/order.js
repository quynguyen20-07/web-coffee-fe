//location
const provinceSelect = document.getElementById("province__order");
const districtSelect = document.getElementById("district__order");
const provinceUrl = "https://coffee-web-api-dkrq.onrender.com/provinces";
const districtUrl = "https://coffee-web-api-dkrq.onrender.com/districts";

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

const userIdentity = getUserData();

fetch(provinceUrl)
  .then((data) => data.json())
  .then((data) => {
    console.log(data);
    const provinces = data;
    provinces.forEach(function (province) {
      var option = document.createElement("option");
      option.value = province.code;
      option.text = province.name;
      provinceSelect.appendChild(option);
    });

    provinceSelect.addEventListener("change", function () {
      var selectedProvinceCode = provinceSelect.value;

      // Fetch dữ liệu huyện từ localhost dựa trên mã tỉnh đã chọn
      fetch(`${districtUrl}?parent_code=${selectedProvinceCode}`)
        .then((data) => data.json())
        .then((data) => {
          const districts = data;
          // Xóa tất cả các option cũ trong select huyện
          districtSelect.innerHTML = "";

          // Đẩy dữ liệu huyện vào select huyện
          districts.forEach(function (district) {
            var option = document.createElement("option");
            option.value = district.code;
            option.text = district.name;
            districtSelect.appendChild(option);
          });
        });
    });
  });
//chuyển về trang order khi nhất button

const urlParams3 = new URLSearchParams(window.location.search);
const productId1 = urlParams3.get("id");
const list_id = [];
list_id.push(productId1);

function product_order_detail() {
  // JavaScript code
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  fetch("https://coffee-web-api-dkrq.onrender.com/products")
    .then((res) => res.json())
    .then((data) => {
      var product = false;
      const productList = data;

      productList.forEach((element) => {
        if (productId == element.id) {
          product = true;
          var productDetailHTML = "";

          if (product) {
            document.getElementById("price__order").innerHTML =
              element.newPrice * quantity_order_after + " VND";
            document.getElementById("product__img__order").src = element.image1;
            document.getElementById("procuct__name__order").innerHTML =
              element.name;
            document.getElementById("product__price__order").innerHTML =
              element.newPrice + " VND";
            document.getElementById("product__quantity__order").innerHTML =
              document.get("input__qty").value;
          } else {
            document.getElementById("product-detail").innerHTML =
              "Product not found.";
          }
        }
      });
    });
}
var urlParams1 = new URLSearchParams(window.location.search);
var quantity_detail = urlParams1.get("quantity");

if (quantity_detail == null || quantity_detail == NaN) {
  var quantity_order_after = (document.getElementById(
    "quantity_order"
  ).innerHTML = 1);
} else {
  var quantity_order_after = (document.getElementById(
    "quantity_order"
  ).innerHTML = quantity_detail);
}

function useCustomerData(customerId) {
  if (userIdentity?.roleId == 2) {
    fetch(`https://coffee-web-api-dkrq.onrender.com/users?id=${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((element) => {
          document.getElementById("name__order").value = element.name;
          document.getElementById("customerID__order").value = element.id;
          document.getElementById("email__order").value = element.email;
          document.getElementById("phone__order").value = element.phoneNumber;
          document.getElementById("address__order").value = element.address;
          // Gán giá trị mặc định cho các ô select province và district
          document.getElementById("date__order").value = getCurrentTime();
        });
      })
      .catch((error) => {});
  } else {
    fetch(`https://coffee-web-api-dkrq.onrender.com/users?id=${customerId}`)
      .then((res) => res.json())
      .then((data) => {
        data.forEach((element) => {
          document.getElementById("name__order").value = element.name;
          document.getElementById("customerID__order").value = element.id;
          document.getElementById("email__order").value = element.email;
          document.getElementById("phone__order").value = element.phoneNumber;
          document.getElementById("address__order").value = element.address;
          // Gán giá trị mặc định cho các ô select province và district
          document.getElementById("date__order").value = getCurrentTime();
        });
      })
      .catch((error) => {});
  }
}

useCustomerData(userIdentity.id);

function getDataFormOrder() {
  product_order_detail();
  var fullName = document.getElementById("name__order").value;
  var customerID = document.getElementById("customerID__order").value;

  var productId2;
  var productId_list_id = [];
  var cartItems = JSON.parse(localStorage.getItem("selectedIds"));
  if (cartItems && Array.isArray(cartItems)) {
    productId_list_id = cartItems;
    productId2 = productId_list_id;
  } else {
    productId2 = list_id;
  }
  var email = document.getElementById("email__order").value;
  var phoneNumber = document.getElementById("phone__order").value;
  var address = document.getElementById("address__order").value;
  var province = document.getElementById("province__order").value;
  var district = document.getElementById("district__order").value;
  var productName = document.getElementById("procuct__name__order").textContent;
  var productPrice = document.getElementById(
    "product__price__order"
  ).textContent;
  var quantity = document.getElementById("quantity_order").textContent;
  var totalPrice = document.getElementById("price__order").textContent;
  var date = document.getElementById("date__order").value;

  var data = {
    name: fullName,
    customerId: customerID,
    productId: productId2,
    email: email,
    phoneNumber: phoneNumber,
    address: address,
    province: province,
    district: district,
    productName: productName,
    productPrice: productPrice,
    quantity: quantity,
    totalPrice: totalPrice,
    date: date,
  };

  return data;
}
getDataFormOrder();

function placeOrder() {
  if (userIdentity.id) {
    var data = getDataFormOrder();

    if (
      !data.name ||
      !data.email ||
      !data.phoneNumber ||
      !data.address ||
      !data.province ||
      !data.district ||
      !data.quantity
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    // Gửi dữ liệu đi
    fetch("https://coffee-web-api-dkrq.onrender.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(() => {
        // Hiển thị thông báo thành công
        Swal.fire({
          icon: "success",
          title: "Đơn hàng của bạn đã được gửi thành công!",
          showConfirmButton: true,
        });
      })
      .catch((error) => {
        // Xử lý lỗi nếu có
      });

    // date time
    var date__order = "";
    function getCurrentTime() {
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();

      // Định dạng lại đối tượng thời gian
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }

      var formattedDate = year + "-" + month + "-" + day;
      date__order = formattedDate;
      document.getElementById("date__order").innerHTML = date__order;
    }

    getCurrentTime();
  } else {
    // Không có userId trong LocalStorage
    alert("Bạn phải đăng nhập!");
  }
}

// Xử lý sự kiện thay đổi Local Storage
// Lấy dữ liệu từ Local Storage
var selectedQuantities = JSON.parse(localStorage.getItem("selectedQuantities"));
var cartItems = JSON.parse(localStorage.getItem("selectedIds"));
function handleLocalStorageChange() {
  const updatedQuantities = JSON.parse(
    localStorage.getItem("selectedQuantities")
  );
  const updatedCartItems = JSON.parse(localStorage.getItem("selectedIds"));

  // Kiểm tra xem có sự thay đổi trong Local Storage không
  if (
    JSON.stringify(selectedQuantities) !== JSON.stringify(updatedQuantities) ||
    JSON.stringify(cartItems) !== JSON.stringify(updatedCartItems)
  ) {
    selectedQuantities = updatedQuantities;
    cartItems = updatedCartItems;

    // Cập nhật lại giao diện
    updateOrderPage();
  }
}

// Xử lý sự kiện storage khi có thay đổi trong Local Storage
window.addEventListener("storage", handleLocalStorageChange);

// Xử lý sự kiện beforeunload khi rời khỏi trang
window.addEventListener("beforeunload", () => {
  // Xóa dữ liệu trong Local Storage
  localStorage.removeItem("selectedQuantities");
  localStorage.removeItem("selectedIds");
});

// Cập nhật lại giao diện đơn hàng
function updateOrderPage() {
  const productOrderElement = document.getElementById("product__order1");
  const totalPriceElement = document.getElementById("price__order");
  let productsHTML = "";
  let totalPrice = 0;

  fetch("https://coffee-web-api-dkrq.onrender.com/products")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((element) => {
        cartItems.forEach((item, index) => {
          if (item == element.id) {
            const quantity = selectedQuantities[index];
            const price = element.newPrice * quantity;
            totalPrice += price;

            productsHTML += `
              <div class="product__infor__order">
                <div class="image__order">
                  <img id="product__img__order" src="${
                    element.image1
                  }" alt="Product">
                </div>
                <p id="procuct__name__order">${element.name}</p>
                <p id="product__price__order">${element.newPrice}</p>
                <p id="quantity_order">${quantity}</p>
                <p id="date__order">${getDate()}</p>
              </div>
            `;
          }
        });
      });

      // Thêm các sản phẩm vào phần tử HTML có id là "product__order"
      productOrderElement.innerHTML = productsHTML;

      // Hiển thị tổng số tiền
      totalPriceElement.textContent = `${totalPrice} VND`;
    });
}

// Hàm lấy ngày giờ hiện tại
function getDate() {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString();
  const time = currentDate.toLocaleTimeString();
  return `${date} ${time}`;
}

// Gọi hàm cập nhật giao diện ban đầu
updateOrderPage();
