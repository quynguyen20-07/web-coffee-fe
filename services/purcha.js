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

const listContainer = document.querySelector("#container_purcha");
async function fetchData() {
  try {
    const orderResponse = await fetch(
      "https://coffee-web-api-dkrq.onrender.com/orders"
    );
    const orderData = await orderResponse.json();

    const orderedProducts = orderData.filter(
      (order) => Number(order.customerId) === Number(getUserData()?.id)
    );

    orderedProducts.filter((product) => Number(product.id) === Number());

    // Fetch product data
    const productResponse = await fetch(
      "https://coffee-web-api-dkrq.onrender.com/products"
    );
    const productData = await productResponse.json();

    const productList = productData.filter(
      ({ id: id1 }) => !orderedProducts.some(({ id: id2 }) => id2 === id1)
    );

    let data = "";

    productList.forEach((product) => {
      data += `<a target="_self" id="card" href="/page/product/ProductDetail/ProductDetail.html?id=${
        product.id
      }">
              <div class="card_product">
                <div class="card_product_img">
                  <img id="img_product" src="${product.image1}">
                </div>
                <div class="content_product">
                  <h1 id="product__name">${product.name}</h1>
                  <p id="describe">${product.description}</p>
                  <p>x${product.quantity}</p>
                  <div class="prices">
                    <p class="price" id="old__price">${product.oldPrice} VND</p>
                    <p id="new__price">${product.newPrice} VND</p>
                  </div>
                  <div class="d-flex justify-content-between align-items-center">
                    <p id="total_product">Total: ${
                      product.quantity * product.newPrice
                    } VND</p>
                    <div class="buttons">
                      <button id="product__btn__buy" class="btn btn_buy_qtt btn-small" type="button" onclick="redirectToOrderPage(${
                        product.id
                      })">Buy again</button>
                      <button id="product__btn__detail" class="btn btn_detail_qtt btn-small" type="button" onclick="rederectDetailPage(${
                        product.id
                      })">Product detail</button>
                    </div>
                  </div>
                </div>
              </div>
              </a>
            `;
    });

    listContainer.innerHTML = data;
  } catch (error) {
    console.error(error);
  }
}

fetchData();

fetchData();
function rederectDetailPage(id) {
  window.location.href = `/page/product/ProductDetail/ProductDetail.html?id=${id}`;
}

async function detailProduct() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (id) {
      const productResponse = await fetch(
        `https://coffee-web-api-dkrq.onrender.com/products/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (productResponse) {
        const details = await productResponse.json();
        document.querySelector(".container__productDetail").innerHTML = `
          <div class="con_item_productDetail con_item_productDetail1">
              <div class="main__img__box">
                  <img id="main__img" src="${details.image1}" alt="Photo">
              </div>
              <div class="secondary__img">
                  <div class="secodary__img__item">
                      <img id="item__img1" class="item__img" src="${details.image1}" alt="Photo">
                  </div>
                  <div class="secodary__img__item">
                      <img id="item__img2" class="item__img" src="${details.image2}" alt="Photo">
                  </div>
                  <div class="secodary__img__item">
                      <img id="item__img3" class="item__img" src="${details.image3}" alt="Photo">
                  </div>
              </div>
          </div>
          <!-- information of product -->
          <div class="con_item_productDetail con_item_productDetail2">
              <h2 id="product__name">${details.name}</h2>
              <div class="valuate">
                  <div id="rating">
                      <span class="star">&#9734;</span>
                      <span class="star">&#9734;</span>
                      <span class="star">&#9734;</span</span>
                      <span class="star">&#9734;</span>
                  </div>
              </div>
              <div class="discribe">
                  <p>100 reviews</p>
                  <div class="price">
                      <p id="new__price">${details.newPrice} VND</p>
                      <p id="old__price">${details.oldPrice} VND</p>
                  </div>
                  <p id="describe">${details.description}</p>
              </div>
              <div class="qnty__box">
                  <p>
                      Quantity purchased:
                  </p>
                  <div class="btn__box">
                      <button onclick="decrement()">-</button>
                      <input id="input__qty" type="number" min="0">
                      <button onclick="increment()">+</button>
                  </div>
              </div>
              <div class="btn__buy">
              <button id="product__btn__add" class="btn_add_qtt" type="button" onclick="addToCart(${id})">
              <img src="/images/img_icon/icon shoping cart.svg" alt="">
              Add to Cart
          </button>
                  <button id="product__btn__buy" class="btn_add_qtt" type="button" onclick="buy(${id})">Buy</button>
              </div>
          </div>
          `;
      } else {
        console.log("Item not found");
      }
    } else {
      console.log("Id not found");
    }
  } catch (error) {}
}

document.addEventListener("DOMContentLoaded", detailProduct);

function buy(productId) {
  var quantity = document.getElementById("input__qty").value;
  var orderUrl =
    "/page/order/order.html?id=" + productId + "&quantity=" + quantity;
  window.location.href = orderUrl;
}
function redirectToOrderPage(productId) {
  window.location.href = `/page/order/order.html?id=${productId}`;
}
