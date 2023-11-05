function validation() {
  if (document.Formfill.Email.value == "") {
    document.getElementById("result").innerHTML = "Enter your Email";
    return false;
  } else if (document.Formfill.Password.value == "") {
    document.getElementById("result").innerHTML = "Enter your Password";
    return false;
  } else if (document.Formfill.Con_password.value == "") {
    document.getElementById("result").innerHTML = "Enter Confirm Password";
    return false;
  } else if (
    document.Formfill.Password.value !== document.Formfill.Con_password.value
  ) {
    document.getElementById("result").innerHTML = "Passsword doesn't matched";
    return false;
  } else if (document.Formfill.Password.value.length <= 6) {
    document.getElementById("result").innerHTML = "Password must be 6-digits";
    return false;
  } else if (
    document.Formfill.Password.value == document.Formfill.Con_password.value
  ) {
    popup.classList.add("open-slize");
    return false;
  }
}

var popup = document.getElementById("popup");
function closeSlize() {
  popup.classList.remove("open-slize");
}

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

document
  .getElementById("customerForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    var customer = {
      roleId: 2,
      phoneNumber: "",
      avata: "",
      address: "",
      name: name,
      email: email,
      password: password,
    };
    localStorage.setItem("customer", JSON.stringify(customer));
    fetch("https://coffee-web-api-dkrq.onrender.com/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Đã xảy ra lỗi khi đăng ký khách hàng.");
        }
      })
      .then(function (user) {
        alert("Đã đăng ký thành công! Mã khách hàng mới: " + user.name);
        window.location.href = "/page/login/login.html";
      })
      .catch(function (error) {
        alert(error.message);
      });

    function sendEmail(customerId) {
      var emailData = {
        to: email,
        from: "tuyen.nguyen25@student.passerellesnumeriques.org",
        subject: "Đăng ký thành công",
        text:
          "Chúc mừng bạn đã đăng ký thành công! Mã khách hàng mới của bạn là: " +
          customerId,
      };

      axios
        .post("https://api.sendgrid.com/v3/mail/send", emailData, {
          headers: {
            Authorization: "Bearer YOUR_SENDGRID_API_KEY",
            "Content-Type": "application/json",
          },
        })
        .then(function (response) {})
        .catch(function (error) {});
    }
  });
