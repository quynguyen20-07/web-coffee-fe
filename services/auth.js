document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("input_name").value;
    const password = document.getElementById("input_password").value;
    await login(username, password);
  });

const hashKey = "Abcd123@";

function hashUserInfo(userInfo) {
  return CryptoJS.AES.encrypt(userInfo, hashKey).toString();
}

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

async function login(username, password) {
  try {
    const res = await fetch("https://coffee-web-api-dkrq.onrender.com/users");
    const users = await res.json();

    const user = users.find(
      (u) => u.email === username && u.password === hashPassword(password)
    );

    if (user) {
      const userInfo = JSON.stringify(user);
      localStorage.setItem("token", hashUserInfo(userInfo));
      window.location.href = "/page/home/home.html";
    }
  } catch (error) {
    console.log(error);
  }
}

//anh làm đến đây thôi mọi ng tự giải quyết mấy cái nho nhỏ còn lại
function getUserInfo() {
  const encryptedUserInfo = localStorage.getItem("token");

  if (encryptedUserInfo) {
    const decryptedUserInfo = encrypts.update(encryptedUserInfo, "hex", "utf8");
    decryptedUserInfo += encrypts.final("utf8");

    return JSON.parse(decryptedUserInfo);
  }

  return null;
}

function logout() {
  localStorage.removeItem("token");
}
