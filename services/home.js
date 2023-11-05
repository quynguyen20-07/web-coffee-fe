var isLoggedIn = localStorage.getItem("token");
if (!isLoggedIn) {
  window.location.href = "/page/login/login.html";
}

fetch("https://coffee-web-api-dkrq.onrender.com/products")
  .then((res) => res.json())
  .then((data) => {
    const productList = data;
    const productHTML = productList.map((product) => {
      return `
            <div class="product">
    <a target="_self" id="card" href="/page/product/ProductDetail/ProductDetail.html?id=${product.id}">
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
        <div class="icon-container">
       
        <button class="icon-btn" id="btn_favorite">
          <i class="fas fa-heart"></i>
      </button>
            <button id="btn_buy" onclick="redirectToOrderPage(${product.id})">
                <i id="icon_cart" class="fas fa-shopping-cart"></i>Buy
            </button>
        </div>
    </div>
</div>
                    `;
    });

    document.getElementById("product").innerHTML = `
                    <div class="product-container">
                        ${productHTML.join("")}
                    </div>
                `;
    document.getElementById("product1").innerHTML = `
                    <div class="product-container">
                        ${productHTML.join("")}
                    </div>
                `;
    document.getElementById("card_top").innerHTML = `
                    <div class="product-container_top">
                        ${productHTML.join("")}
                    </div>
                `;
  });

const menuIcon = document.querySelector(".navbar_menu-icon");
const navList = document.querySelector(".navbar__ul");
menuIcon.addEventListener("click", () => {
  menuIcon.classList.toggle("active");
  navList.classList.toggle("active");
});

const userData = getUserData();

if (userData.roleId === "2") {
  const managementElement = document.querySelector(".dropdown");
  const loginElement = document.querySelector(
    ".navbar__li--mobile a[href='/page/login/login.html']"
  );
  const signUpElement = document.querySelector(".navbar__li--mobile .border2");

  if (managementElement) {
    managementElement.style.display = "none";
  }

  if (loginElement) {
    loginElement.style.display = "none";
  }

  if (signUpElement) {
    signUpElement.style.display = "none";
  }
}

localStorage.removeItem("userId");
localStorage.clear();

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const productContainer = document.getElementById("product-container");

prevBtn.addEventListener("click", () => {
  productContainer.scrollLeft -= 200; // Điều chỉnh giá trị scrollLeft tùy thuộc vào kích thước sản phẩm
});

nextBtn.addEventListener("click", () => {
  productContainer.scrollLeft += 200; // Điều chỉnh giá trị scrollLeft tùy thuộc vào kích thước sản phẩm
});
function redirectToOrderPage(productId) {
  window.location.href = `/page/order/order.html?id=${productId}`;
}
