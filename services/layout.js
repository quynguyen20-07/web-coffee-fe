window.onload = function () {
  const header = document.createElement("div");
  header.innerHTML = `
  <div class="header" id="header">
  <!-- navbar -->
  <nav class="navbar">
    <!-- logo -->
    <div class="navbar_logo">
    <a href="/page/home/home.html"> <img src="/images/img_icon/logo_cofe.png" alt=""></a>
    </div>
    <!-- search -->
    <div class="search-container">
    <input
      id="searchInput"
      class="search-container__input"
      type="text"
      placeholder="Tìm kiếm..."
   
    />
    <button id="searchButton" type="submit">
      <i style="font-size: 20px" class="fa fa-search"></i>
    </button>
  </div>
  <ul id="suggestionList"></ul>
    <!-- elements of navbar -->
    <div style="font-size:30px;cursor:pointer" id="open_sideBar" onclick="openNav()">&#9776;</div>
    <div id="opacity" onclick="closeNav()"></div>
    <ul class="navbar__ul" id="navbar__ul">
      <!-- all element choose -->
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <li class="ul_li"><a href="/page/home/home.html"><i class="fas fa-home"></i>Home</a></li>
      <li class="ul_li"><a href="/page/contact_us/contact_us.html"><i class="fas fa-envelope"></i>Contact Us</a></li>
      <li class="ul_li"><a href="/page/product/ShoppingCart/ShoppingCart.html"><i class="fas fa-shopping-cart"></i>Order</a></li>
      <li class="ul_li"><a href="/page/purcha_list/purcha_list.html"><i class="fas fa-history"></i>History</a></li>
     
      <li class="dropdown" id="management">
        <a href="#" class="dropdown-link" >
          <i class="fas fa-cog"></i> Management
        </a>
        <ul class="dropdown-menu">
          <li><a href="/page/customer/CustomerList/CustomerList.html">Customer Management</a></li>
          <li><a href="/page/product/ProductList/ProductList.htm">Product Management</a></li>
          <li><a href="/page/order/order_list/order_list.html">Order Management</a></li>
        </ul>
      </li>
      <li class="navbar__li--mobile" id="login"><a href="/page/login/login.html"><button>Login</button></a></li>
      <li class="navbar__li--mobile">
        <div class="border2">
          <a class="navbar__li__a" href="/page/register/register.html" id="sign_up"><button>Sign up</button></a>
        </div>
      </li>
      <!-- profile -->
      <li class="profile" id="profile">
      <a href="/page/customer/profile/profile.html">
      <img src="/images/img_icon/user-removebg-preview.png" alt="Profile Picture" id="avatar_layout" class="profile__picture">
      </a>
      </li>
      <!-- logout -->
      <li class="navbar__li--mobile">
        <a><button onclick="logout()" id="log_out">Logout</button></a>
      </li>
    </ul>
  </nav>
</div>
    `;

  document.body.insertBefore(header, document.body.firstChild);
  document.getElementById("log_out").style.display = "none";
  document.getElementById("profile").style.display = "none";
  document.getElementById("management").style.display = "none";

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

    document.getElementById("avatar_layout").src = userData.avatar
      ? userData.avatar
      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4CRKPij6o2waFROp-89BCE8lEf96jLsndRQ&usqp=CAU";

    return userData;
  }

  const userData = getUserData();

  function fetch_cus() {
    if (userData.roleId == 1) {
      fetch(`https://coffee-web-api-dkrq.onrender.com/users/${userData.id}`)
        .then((response) => response.json())
        .then((customer) => {
          document.getElementById("avatar_layout").src = customer.avatar;
        });
    } else {
      fetch(`https://coffee-web-api-dkrq.onrender.com/users/${userData.id}`)
        .then((response) => response.json())
        .then((customer) => {
          console.log(customer.avatar, "avata3333");
          document.getElementById("avatar_layout").src = customer.avatar;
        });
    }
  }

  fetch_cus();
  document.getElementById("box_search").style.display = "none";

  // Get the input and ul elements
  const searchInput = document.getElementById("searchInput");
  const suggestionList = document.getElementById("suggestionList");

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    searchProductByName(searchValue);
    suggestionList.style.display = "block";
  });

  searchInput.addEventListener("focus", function () {
    const searchValue = searchInput.value.toLowerCase();
    searchProductByName(searchValue);
    suggestionList.style.display = "block";
  });

  document.addEventListener("click", function (event) {
    const target = event.target;
    if (!searchInput.contains(target) && !suggestionList.contains(target)) {
      suggestionList.style.display = "none";
    }
  });

  const searchButton = document.getElementById("searchButton");
  const productContainer = document.getElementById("product4");

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    searchProductByName(searchValue);
    document.getElementById("suggestionList").style.display = "block";
  });

  searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn sự kiện submit mặc định của button
    const searchValue = searchInput.value.toLowerCase();
    searchProductByName(searchValue);
    document.getElementById("suggestionList").style.display = "none";
    displayProducts(searchValue);
  });

  function searchProductByName(searchTerm) {
    fetch("https://coffee-web-api-dkrq.onrender.com/products")
      .then((response) => response.json())
      .then((data) => {
        const matchingSuggestions = data.filter(function (product) {
          return product.name.toLowerCase().includes(searchTerm);
        });
        displaySuggestions(matchingSuggestions);
      })
      .catch((error) => {});
  }

  function displaySuggestions(suggestions) {
    suggestionList.innerHTML = "";
    suggestions.forEach(function (suggestion) {
      const listItem = document.createElement("li");
      const suggestionText = document.createElement("span");
      const searchIcon = document.createElement("i");

      suggestionText.textContent = suggestion.name;
      searchIcon.className = "fas fa-search"; // Thay đổi lớp (class) của icon tùy theo yêu cầu

      listItem.addEventListener("click", function () {
        searchInput.value = suggestion.name;
        suggestionList.innerHTML = "";
        document.getElementById("suggestionList").style.display = "none";
      });

      listItem.appendChild(searchIcon);
      listItem.appendChild(suggestionText);
      suggestionList.appendChild(listItem);
    });
  }
  function displayProducts(searchTerm) {
    fetch("https://coffee-web-api-dkrq.onrender.com/products")
      .then((response) => response.json())
      .then((data) => {
        const matchingProducts = data.filter(function (product) {
          return product.name.toLowerCase().includes(searchTerm);
        });
        if (matchingProducts.length === 0) {
          const notFoundMessage = document.createElement("div");
          notFoundMessage.textContent = "Not found";
          productContainer.innerHTML = "";
          productContainer.appendChild(notFoundMessage);
        } else {
          document.getElementById("content").style.display = "none";
          document.getElementById("box_search").style.display = "block";

          productContainer.innerHTML = "";
          matchingProducts.forEach(function (product) {
            const productItem = document.createElement("div");
            productItem.innerHTML = `
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
            productContainer.appendChild(productItem);
          });
        }
      })
      .catch((error) => {});
  }

  // Xóa dữ liệu khi input rỗng
  searchInput.addEventListener("input", function () {
    if (searchInput.value === "") {
      suggestionList.innerHTML = "";
      document.getElementById("suggestionList").style.display = "none";
    }
  });

  const footer = document.createElement("div");
  footer.innerHTML = `
    <div class="footer" id="footer">
    <div class="row-first">
        <div class="row-first-content"><img src="/images/img_icon/logo_coffe.svg" alt=""></div>
    </div>
    <div class="row-final">
        <div class="menu-footer">
            <div class="menu-footer-item">
                <div class="footer-item-heading">Type of coffee</div>
                <div class="footer-item-paragrap">Mocha</div>
                <div class="footer-item-paragrap">CapAmericano</div>
                <div class="footer-item-paragrap">Latte</div>
                <div class="footer-item-paragrap">Other</div>
            </div>
            <div class="menu-footer-item">
                <div class="footer-item-heading">About Us</div>
                <div class="footer-item-paragrap">Contact Us: 0333775890 - 03488859302 - 01234947232</div>
                <div class="footer-item-paragrap">Branch: 101B Le Huu Trac, Phuoc My, Son Tra, Da Nang</div>
                <div class="footer-item-paragrap">Address: 445-421 ĐT607, Hoa Hai, Ngu Hanh Son, Da Nang</div>
                <div class="footer-item-paragrap">My team: Pham Gia Bao - Ho Thi Mai - Ho Thi Hue - Nguyen Thi Kim
                    Tuyen</div>
                <div class="footer-item-paragrap">Mentor: Nguyen The Quy</div>
            </div>
            <div class="menu-footer-item">
                <div class="footer-item-heading">Follow Us</div>
                <div class="footer-item-paragrap"><i class="fa-brands fa-instagram icon-footer"></i>Instagram</div>
                <div class="footer-item-paragrap"><i class="fa-brands fa-facebook icon-footer"></i>Facebook</div>
                <div class="footer-item-paragrap"><i class="fa-brands fa-twitter icon-footer"></i>Twitter</div>
            </div>
        </div>
        <div class="footer-content1">We aim to provide a great time for everyone</div>
        <div class="footer-content2">Coffee suitable for you</div>
    </div>
    <script src="/services/log_out.js"></script>
<script src="/services/search.js"></script>


</div>

    `;

  document.body.appendChild(footer);

  if (userData.roleId == 1) {
    document.getElementById("profile").style.display = "block";
    document.getElementById("log_out").style.display = "block";
    document.getElementById("sign_up").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("management").style.display = "block";
  }

  // Kiểm tra giá trị roleId và ẩn các phần tử tương ứng khi roleId là 2
  if (userData.roleId == 2) {
    const managementElement = document.querySelector(".dropdown");
    const loginElement = document.querySelector(
      ".navbar__li--mobile a[href='/page/login/login.html']"
    );
    const signUpElement = document.querySelector(
      ".navbar__li--mobile .border2"
    );
    document.getElementById("profile").style.display = "block";
    document.getElementById("log_out").style.display = "block";

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
};

function logout() {
  Swal.fire({
    icon: "info",
    title: "Confirm Logout",
    text: "Are you sure you want to log out?",
    showCancelButton: true,
    confirmButtonText: "Logout",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  })
    .then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
      }
    })
    .then(() => {
      document.getElementById("log_out").style.display = "none";
      window.location.href = "/page/login/login.html";
      Swal.fire({
        icon: "success",
        title: "Logout Successful!",
        showConfirmButton: false,
        timer: 3000,
      });
    });
}

function openNav() {
  document.getElementById("navbar__ul").style.width = "250px";
  document.getElementById("opacity").style.display = "block";
  // document.getElementById('open_sideBar').style.opacity = 0;
  setTimeout(function () {
    document.getElementById("navbar__ul").classList.add("active");
  }, 10);
}

function closeNav() {
  document.getElementById("navbar__ul").classList.remove("active");
  setTimeout(function () {
    document.getElementById("navbar__ul").style.width = "0";
    document.getElementById("opacity").style.display = "none";
    document.getElementById("open_sideBar").style.opacity = 1;
  }, 10);
}
