function fetchOrder() {
  fetch("https://coffee-web-api-dkrq.onrender.com/orders")
    .then((response) => response.json())
    .then((data) => {
      var listOrderTable = document.getElementById("list_order");
      var tableBody = listOrderTable.createTBody();
      data.forEach((order, index) => {
        var row = tableBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.name}</td>
            <td>${order.email}</td>
            <td>${order.phoneNumber}</td>
            <td>${order.address}</td>
            <td>${order.province}</td>
            <td>${order.district}</td>
            <td>${order.productName}</td>
            <td>${order.productPrice}</td>
            <td>${order.quantity}</td>
            <td>${order.totalPrice}</td>
            <td>${order.date}</td>
          `;
      });
    })
    .catch((error) => {});
}

fetchOrder();
