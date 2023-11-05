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

const tableId = document.querySelector("#tableCart");

fetch("https://coffee-web-api-dkrq.onrender.com/carts")
  .then((response) => response.json())
  .then((data) => {
    const dataArray = Array.isArray(data) ? data : [data];
    let cart = "";
    let totalPrice = 0;
    let totalItems = 0;

    const localUserID = getUserData().id;
    const cartItems = dataArray.filter(
      (item) => Number(item.userId) === Number(localUserID)
    );

    cartItems.forEach((item) => {
      tableId.innerHTML = `
        <tr id="row_${item.id}">
          <td>
            <div class="product-info">
              <img src="${item.image1}" alt="coffee">
              <div class="product-details">
                <h3>${item.name}</h3>
                <p>Drink</p>
              </div>
            </div>
          </td>
          <td>
            <div class="quantity-container">
              <button class="quantity-button decrease" onclick="decreaseQuantity(${item.id})">-</button>
              <span class="quantity" id="quantity_${item.id}">${item.quantity}</span>
              <button class="quantity-button increase" onclick="increaseQuantity(${item.id})">+</button>
            </div>
          </td>
          <td id="new_price_${item.id}">${item.newPrice}</td>
          <td class="total-price" id="total_price_${item.id}">${item.totalPrice}</td>
          <td><i class="fa-regular fa-trash-can" onclick="deleteItem(${item.id})"></i></td> 
          <td><input type="checkbox" class="custom-checkbox" data-itemid="${item.id}" onchange="calculateTotalPrice()"></td>
        </tr>      
        `;
      totalPrice += item.totalPrice;
      totalItems++;
    });

    document.getElementById("totalItems").textContent = totalItems;
    document.getElementById("allTotalPrice").textContent =
      "Total Price: " + totalPrice + " VND";
  });
// Hàm để cập nhật giá tổng
function updateTotalPrice(itemId, quantity) {
  const newPriceElement = document.getElementById(`new_price_${itemId}`);
  const totalPriceElement = document.getElementById(`total_price_${itemId}`);

  const newPrice = parseFloat(newPriceElement.textContent);
  const totalPrice = newPrice * quantity;
  totalPriceElement.textContent = totalPrice;

  calculateTotalPrice();
}

function increaseQuantity(itemId) {
  const quantityElement = document.getElementById("quantity_" + itemId);
  let quantity = parseInt(quantityElement.textContent);
  quantity += 1;
  quantityElement.textContent = quantity;

  updateCartItem(itemId, quantity);
}

// Hàm để giảm số lượng sản phẩm
function decreaseQuantity(itemId) {
  const quantityElement = document.getElementById("quantity_" + itemId);
  let quantity = parseInt(quantityElement.textContent);
  if (quantity > 1) {
    quantity -= 1;
    quantityElement.textContent = quantity;

    updateCartItem(itemId, quantity);
  }
}

// Hàm để cập nhật giá trị `quantity` trong JSON của mục giỏ hàng
function updateCartItem(itemId, quantity) {
  const quantityElement = document.getElementById("quantity_" + itemId);
  let newPriceElement = document.getElementById("new_price_" + itemId);
  let totalPriceElement = document.getElementById("total_price_" + itemId);

  const newPrice = parseFloat(newPriceElement.textContent);
  const totalPrice = newPrice * quantity;

  quantityElement.textContent = quantity;
  totalPriceElement.textContent = totalPrice;

  calculateTotalPrice();
}

function deleteItem(itemId) {
  // Gửi yêu cầu DELETE đến máy chủ
  fetch(`https://coffee-web-api-dkrq.onrender.com/carts/${itemId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Xóa thành công trên máy chủ, xóa giao diện người dùng
        const rowElement = document.getElementById("row_" + itemId);
        const checkboxElement = rowElement.querySelector(".custom-checkbox");
        const isChecked = checkboxElement.checked;

        rowElement.remove();

        if (isChecked) {
          calculateTotalPrice();
        }
      } else {
        // Xử lý lỗi nếu có
        console.error("Lỗi xóa sản phẩm");
      }
    })
    .catch((error) => {
      // Xử lý lỗi nếu có
      console.error("Lỗi xóa sản phẩm", error);
    });
}

function calculateTotalPrice() {
  const checkboxes = document.getElementsByClassName("custom-checkbox");
  const totalPriceElements = document.getElementsByClassName("total-price");
  const allTotalPriceElement = document.getElementById("allTotalPrice");
  let totalPrice = 0;
  let selectedItems = 0;
  let selectedIds = [];
  let selectedQuantities = [];

  // Lặp qua tất cả các sản phẩm
  for (let i = 0; i < checkboxes.length; i++) {
    const checkbox = checkboxes[i];
    const totalElement = totalPriceElements[i];
    // Trong vòng lặp for
    const quantityElement = document.getElementById(
      "quantity_" + checkbox.dataset.itemid
    );
    const quantity = parseInt(quantityElement.textContent);
    selectedQuantities.push(quantity);
    // Lắng nghe sự kiện thay đổi trạng thái của checkbox
    checkbox.addEventListener("change", function () {
      if (checkbox.checked) {
        const price = parseFloat(totalElement.textContent);
        totalPrice += price;
        selectedItems++;
        selectedIds.push(checkbox.dataset.itemid); // Lưu ID của sản phẩm vào mảng selectedIds
      } else {
        const price = parseFloat(totalElement.textContent);
        totalPrice -= price;
        selectedItems--;
        const index = selectedIds.indexOf(checkbox.dataset.itemid);
        if (index > -1) {
          selectedIds.splice(index, 1);
        }
      }

      // Cập nhật tổng giá và số lượng sản phẩm được chọn vào phần tử HTML
      allTotalPriceElement.textContent = "Total Price: " + totalPrice + " VND";
      localStorage.setItem("selectedIds", JSON.stringify(selectedIds)); // Lưu mảng selectedIds vào localStorage
    });

    // Kiểm tra ban đầu trạng thái của checkbox
    if (checkbox.checked) {
      const price = parseFloat(totalElement.textContent);
      totalPrice += price;
      selectedItems++;
      selectedIds.push(checkbox.dataset.itemid); // Lưu ID của sản phẩm vào mảng selectedIds
    }
  }

  localStorage.setItem("selectedIds", JSON.stringify(selectedIds)); // Lưu mảng selectedIds vào localStorage
  localStorage.setItem(
    "selectedQuantities",
    JSON.stringify(selectedQuantities)
  );

  // Cập nhật tổng giá và số lượng sản phẩm được chọn vào phần tử HTML
  allTotalPriceElement.textContent = "Total Price: " + totalPrice + " VND";

  return {
    totalPrice: totalPrice,
    selectedItems: selectedItems,
    selectedIds: selectedIds,
  };
}
