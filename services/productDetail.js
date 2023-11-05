function increment() {
  var inputQty = document.getElementById("input__qty");
  var currentQty = parseInt(inputQty.value) || 1;
  var newQty = currentQty + 1;
  if (newQty < 1) {
    newQty = 1;
  }
  inputQty.value = newQty;
}

function decrement() {
  var inputQty = document.getElementById("input__qty");
  var currentQty = parseInt(inputQty.value) || 1;
  var newQty = currentQty - 1;
  if (newQty < 1) {
    newQty = 1;
  }
  inputQty.value = newQty;
}

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const idUser = document.getElementById("product__btn__add");
idUser.addEventListener("click", function (event) {
  event.preventDefault();
  addToCart(Number(productId));
});

function detail() {
  fetch("https://coffee-web-api-dkrq.onrender.com/products")
    .then((res) => res.json())
    .then((data) => {
      const productHTML = data.map((product) => {
        return `
        <div class="product">
                <a target="_self" id="card" href="/page/product/ProductDetail/ProductDetail.html?id=${product.id}" onclick="loadContent(/page/product/ProductDetail/ProductDetail.html)">
                        <p id="evaluate1">${product.productReviews}<i class="material-symbols-outlined">star</i></p>
                        <img id="main_img" src="${product.image1}" alt="${product.name}">
                        <h2>${product.name}</h2>
                        <div class="price">
                            <p>${product.newPrice} VND</p>
                            <p>${product.oldPrice} VND</p>
                        </div>
                        </a>
                        <div class="descriptiom_and_btn">
                            <p>${product.description}</p>
                            <div>
                            <a target="_self" href="/page/product_detail/product_detail.html?id=${product.id}">
                            <button id="btn_view">View</button>
                            </a>
                            <a><button onclick="redirectToOrderPage(${product.id})"><i id="icon_cart" class="fas fa-shopping-cart"></i>Buy</button></a>

                            </div>
                            </div>
                        </div>
                   
                `;
      });

      document.getElementById("product2").innerHTML = `
                <div class="product-container">
                    ${productHTML.join("")}
                </div>
            `;
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
            // Đánh giá sản phẩm (từ 1 đến 5)

            var rating = element.productReviews;
            var stars = document.getElementsByClassName("star");
            for (var i = 0; i < rating; i++) {
              stars[i].classList.add("selected");
            }

            document
              .getElementById("product__btn__buy")
              .addEventListener("click", function () {
                var quantity = document.getElementById("input__qty").value;
                var orderUrl =
                  "/page/order/order.html?id=" +
                  element.id +
                  "&quantity=" +
                  quantity;
                window.location.href = orderUrl;
                // var orderUrl1 = "/page/purcha_list/purcha_list.html?id=" + element.id;
                // window.location.href = orderUrl1;
              });
          } else {
            document.getElementById("product-detail").innerHTML =
              "Product not found.";
          }
        }
      });
    });
}

detail();

function choise_product(imgs) {
  main__img.src = imgs.src;
}

// Get all like and dislike buttons
const likeButtons = document.querySelectorAll(".like-button");
const dislikeButtons = document.querySelectorAll(".dislike-button");

// Attach click event listener to each like button
likeButtons.forEach((likeButton) => {
  likeButton.addEventListener("click", () => {
    likeButton.classList.add("clicked");
    dislikeButtons.forEach((dislikeButton) => {
      dislikeButton.classList.remove("clicked");
    });
  });
});

// Attach click event listener to each dislike button
dislikeButtons.forEach((dislikeButton) => {
  dislikeButton.addEventListener("click", () => {
    dislikeButton.classList.add("clicked");
    likeButtons.forEach((likeButton) => {
      likeButton.classList.remove("clicked");
    });
  });
});

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
var userId = userData.id;

let cartItem = [];
fetch(`https://coffee-web-api-dkrq.onrender.com/carts`)
  .then((response) => response.json())
  .then((productData) => {
    cartItems = cartItem.concat(productData);
    console.log(productData, "dha9dyh89s");
  });

function addToCart(id) {
  if (!userId) {
    alert("Khách hàng chưa đăng nhập");
  }

  var existingItem = cartItems.find(
    (item) => item.id === id && item.userId === userId
  );

  if (existingItem) {
    alert("Sản phẩm đã tồn tại trong giỏ hàng");
    return;
  }
  console.log(productId, "id2222");

  fetch(`https://coffee-web-api-dkrq.onrender.com/products/${id}`)
    .then((response) => response.json())
    .then((productData) => {
      var quantity = document.getElementById("input__qty").value;

      const cartItem = {
        userId: userId,
        name: productData.name,
        oldPrice: productData.oldPrice,
        newPrice: productData.newPrice,
        quantity: quantity,
        description: productData.description,
        image1: productData.image1,
        image2: productData.image2,
        image3: productData.image3,
        totalPrice: Number(productData.newPrice) * Number(quantity),
      };

      fetch("https://coffee-web-api-dkrq.onrender.com/carts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItem),
      })
        .then((response) => {
          if (response.ok) {
            alert("Sản phẩm đã được thêm vào giỏ hàng");
          }
        })
        .catch((error) => {
          console.log("Đã xảy ra lỗi:", error);
        });
    })
    .catch((error) => {
      console.log("Đã xảy ra lỗi khi lấy thông tin sản phẩm:", error);
    });
}

function addComment() {
  // Lấy nội dung comment từ textarea
  var commentInput = document.getElementById("comment-input").value;

  // Kiểm tra xem nội dung comment có được nhập hay không
  if (commentInput.trim() === "") {
    alert("Vui lòng nhập nội dung comment.");
    return;
  }

  // Tạo các phần tử HTML để hiển thị comment mới
  var commentContainer = document.createElement("div");
  commentContainer.classList.add("comment");

  var commentContent = document.createElement("div");
  commentContent.classList.add("comment-content");

  var commentHeader = document.createElement("div");
  commentHeader.classList.add("comment-header");

  var profilePicture = document.createElement("img");
  profilePicture.classList.add("profile-picture");
  profilePicture.src = "/images/img_icon/user-removebg-preview.png";
  profilePicture.alt = "Profile Picture";

  var commenterName = document.createElement("h4");
  commenterName.textContent = "Người dùng  ";

  commentHeader.appendChild(profilePicture);
  commentHeader.appendChild(commenterName);

  var commentText = document.createElement("p");
  commentText.textContent = commentInput;

  var commentRating = document.createElement("div");
  commentRating.classList.add("comment-rating");

  var ratingSpan = document.createElement("span");
  ratingSpan.classList.add("rating");
  ratingSpan.innerHTML = "&#9733;&#9733;&#9733;&#9733;&#9734;";

  commentRating.appendChild(ratingSpan);

  var commentActions = document.createElement("div");
  commentActions.classList.add("comment-actions");

  var likeButton = document.createElement("button");
  likeButton.classList.add("like-button");
  likeButton.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';

  var dislikeButton = document.createElement("button");
  dislikeButton.classList.add("dislike-button");
  dislikeButton.innerHTML = '<i class="fas fa-thumbs-down"></i> Dislike';

  commentActions.appendChild(likeButton);
  commentActions.appendChild(dislikeButton);

  commentContent.appendChild(commentHeader);
  commentContent.appendChild(commentText);
  commentContent.appendChild(commentRating);
  commentContent.appendChild(commentActions);

  commentContainer.appendChild(commentContent);

  // Lấy danh sách comment hiện tại
  var commentList = document.getElementById("comment-list");

  // Thêm comment mới vào danh sách
  commentList.appendChild(commentContainer);

  // Xóa nội dung trong textarea sau khi comment được thêm
  document.getElementById("comment-input").value = "";
}
