function fetchProducts() {
  fetch("https://coffee-web-api-dkrq.onrender.com/products")
    .then((response) => response.json())
    .then((data) => {
      var list_product = document.getElementById("list_product");
      data.forEach((product) => {
        var row = document.createElement("tr");
        var imageCell = document.getElementById("imageCell");
        row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td id="imageCell"></td>
          <td>${product.newPrice}</td>
          <td>${product.quantity}</td>
          <td>${product.description}</td>
          <td>
          <button id="btn_update_cus" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal_add" onclick="edit_product(${product.id})">Update</button>
            <button class="delete_btn_product btn btn-danger" data-product-id="${product.id}" onclick="deleteProduct(${product.id})">Delete</button>
          </td>
        `;
        var img = document.createElement("img");
        img.src = product.image1;
        img.width = 250;
        row.querySelector("td:nth-child(3)").appendChild(img);
        list_product.appendChild(row);
      });
      var deleteButtons = document.getElementsByClassName("delete_btn_product");
      for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener("click", deleteProduct);
      }
    });
}

fetchProducts();
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}
function refreshModal() {
  document.getElementById("title").innerHTML = "Create Product";
  document.getElementById("sub_pro").innerHTML = "Create";
  document.getElementById("sub_pro").style.backgroundColor = "#4caf50";
  document.getElementById("modal-header").style.backgroundColor = "#4caf50";
  // Thực hiện các thao tác cần thiết để refresh modal tại đây
  var form = document.getElementById("add_product_form"); // Thay "myForm" bằng ID của form thực tế
  form.reset(); // Reload form bằng cách reset lại các giá trị của các trường input
}

const customerForm = document.getElementById("add_product_form");
customerForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const submitButton = document.getElementById("sub_pro");

  if (submitButton.innerHTML === "Create") {
    addProducts();
  } else if (submitButton.innerHTML === "Update") {
    const productId = submitButton.getAttribute("data-id");
    edit_product(productId);
  }
});
// thêm sản phẩm vào datta
function addProducts() {
  var add_productId = document.querySelector("#add_productID").value;
  var name_addproduct = document.querySelector("#nameInput_add").value;
  var quantity = document.querySelector("#qtyInput_add").value;
  var newPrice = document.querySelector("#newPriceInput_add").value;
  var oldPrice = document.querySelector("#oldPriceInput_add").value;
  const image1Input = document.getElementById("imageFileInput1_add");
  const image2Input = document.getElementById("imageFileInput2_add");
  const image3Input = document.getElementById("imageFileInput3_add");
  const description = document.getElementById("descriptionInput_add").value;
  const content_des = document.querySelector("#myModal_add #content-des").value;
  const imageFileName1 = image1Input.value.split("\\").pop();
  const imageFileName2 = image2Input.value.split("\\").pop();
  const imageFileName3 = image3Input.value.split("\\").pop();
  console.log(imageFileName1);
  var data = {
    name: name_addproduct,
    quantity: quantity,
    newPrice: parseInt(newPrice),
    oldPrice: parseInt(oldPrice),
    image1: `/images/img_product/${imageFileName1}`,
    image2: `/images/img_product/${imageFileName2}`,
    image3: `/images/img_product/${imageFileName3}`,
    description: description,
    type: "",
    productReviews: 4,
  };

  fetch("https://coffee-web-api-dkrq.onrender.com/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(() => {
    Swal.fire("Cập nhật thành công", "", "success");
    fetchProducts();
  });
}

function deleteProduct(id) {
  fetch(`https://coffee-web-api-dkrq.onrender.com/products/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      fetchProducts();
      Swal.fire({
        icon: "success",
        title: "Product deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
      });
    })
    .catch(() => {
      alert("Delete fail");
    });
}
function edit_product(id) {
  // Get the product by ID
  fetch(`https://coffee-web-api-dkrq.onrender.com/products/${id}`)
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      console.log(product.description);
      // Set values in the input fields of the edit modal
      document.querySelector("#add_productID").value = product.id;
      document.querySelector("#nameInput_add").value = product.name;
      document.querySelector("#qtyInput_add").value = product.quantity;
      document.querySelector("#newPriceInput_add").value = product.newPrice;
      document.querySelector("#oldPriceInput_add").value = product.oldPrice;
      document.querySelector("#descriptionInput_add").value =
        product.description;
      document.querySelector("#myModal_add #content-des").value =
        product.content_des;
      document.getElementById("title").innerHTML = "Update Product";
      document.getElementById("sub_pro").innerHTML = "Update";
      document.getElementById("sub_pro").style.backgroundColor =
        "rgb(50, 50, 216)";
      document.getElementById("modal-header").style.backgroundColor =
        "rgb(50, 50, 216)";
      document.querySelector("#img_1").src = product.image1;
      document.querySelector("#img_2").src = product.image2;
      document.querySelector("#img_3").src = product.image3;

      // Update the product with the data from the input fields
      document.getElementById("sub_pro").addEventListener("click", function () {
        const description = document.getElementById(
          "descriptionInput_add"
        ).value;
        const content_des = document.querySelector(
          "#myModal_add #content-des"
        ).value;
        const image1Input = document.querySelector("#imageFileInput1_add");
        const image2Input = document.querySelector("#imageFileInput2_add");
        const image3Input = document.querySelector("#imageFileInput3_add");
        const imageFileName1 = image1Input.value.split("\\").pop();
        const imageFileName2 = image2Input.value.split("\\").pop();
        const imageFileName3 = image3Input.value.split("\\").pop();

        const updatedProduct = {
          id: document.querySelector("#add_productID").value,
          name: document.querySelector("#nameInput_add").value,
          quantity: document.querySelector("#qtyInput_add").value,
          newPrice: document.querySelector("#newPriceInput_add").value,
          oldPrice: document.querySelector("#oldPriceInput_add").value,
          description: description,
          content_des: content_des,
          productReviews: 5,
          image1: `/images/img_product/${imageFileName1}`,
          image2: `/images/img_product/${imageFileName2}`,
          image3: `/images/img_product/${imageFileName3}`,
        };

        fetch(
          `https://coffee-web-api-dkrq.onrender.com/products/${updatedProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
          }
        ).then(() => {
          // Show a success message using SweetAlert2 when the product is updated successfully
          Swal.fire("Cập nhật thành công", "", "success");
          // Refresh the list of products
          fetchProducts();
          // Reset the form
          var form = document.getElementById("add_product_form");
          form.reset();
          // Close the modal
          $("#myModal_add").modal("hide");
        });
      });
    })
    .catch(() => {
      alert("Get product fail");
    });
}
function increment() {
  var inputQty = document.getElementById("input__qty");
  var currentQty = parseInt(inputQty.value) || 0;
  var newQty = currentQty + 1;
  if (newQty < 1) {
    newQty = 1;
  }
  inputQty.value = newQty;
}
function decrement() {
  var inputQty = document.getElementById("input__qty");
  var currentQty = parseInt(inputQty.value) || 0;
  var newQty = currentQty - 1;
  if (newQty < 1) {
    newQty = 1;
  }
  inputQty.value = newQty;
}

// JavaScript code
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

fetch("https://coffee-web-api-dkrq.onrender.com/products")
  .then((res) => res.json())
  .then((data) => {
    var product = false;
    data.forEach((element) => {
      if (productId == element.id) {
        product = true;
        if (product) {
          document.getElementById("product__name").innerHTML = element.name;
          document.getElementById("main__img").src = element.image1;
          document.getElementById("item__img1").src = element.image2;
          document.getElementById("item__img2").src = element.image3;
          document.getElementById("item__img3").src = element.image1;
          document.getElementById("new__price").innerHTML =
            element.newPrice + " VND";
          document.getElementById("old__price").innerHTML =
            element.oldPrice + " VND";
          document.getElementById("describe").innerHTML = element.description;
          var rating = element.productReviews;
          var stars = document.getElementsByClassName("star");
          for (var i = 0; i < rating; i++) {
            stars[i].classList.add("selected");
          }
        } else {
          document.getElementById("product-detail").innerHTML =
            "Product not found.";
        }
      }
    });
  });
function choise_product(imgs) {
  main__img.src = imgs.src;
}
