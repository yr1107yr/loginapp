document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const messageBox = document.getElementById('messageBox');

  // message function
  function showMessage(message, type = "success") {
    messageBox.textContent = message;
    messageBox.className = ""; // 清空旧样式 Clear
    messageBox.classList.add(type); // 添加 success 或 errorBox
    messageBox.classList.remove("hidden");
    setTimeout(() => messageBox.classList.add("hidden"), 3000);
  }

  // 输入校验  Input validation
  usernameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z0-9@._-]/g, "");
    if (this.value.trim()) usernameError.textContent = '';
  });

  passwordInput.addEventListener('input', function() {
    if (this.value.trim()) passwordError.textContent = '';
  });

  // loginBtn
  loginBtn.addEventListener('click', function() {
    usernameError.textContent = '';
    passwordError.textContent = '';

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username) {
      usernameError.textContent = '空白にはできません';
      return;
    }
    if (!password) {
      passwordError.textContent = '空白にはできません';
      return;
    }
    if (password.length < 6) {
      passwordError.textContent = 'パスワードは６文字以上です。';
      return;
    }

    // Send request to server
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then(res => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.json();
    })
    .then(data => {
      if (data.success) {
        // Login success
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let inputType = emailPattern.test(username) ? 'メール' : '会員';
        let welcomeMessage = inputType === 'メール'
          ? `ようこそ、${username}メールアドレスでログインされました`
          : `ようこそ、${username}会員IDでログインされました。`;

        showMessage(welcomeMessage, "success");
        // window.location.href = "/home.html";
      } else {
        // Login failed
        if (data.message.includes("ユーザー名")) {
          usernameError.textContent = data.message;
          showMessage(data.message, "errorBox");
        } else if (data.message.includes("パスワード")) {
          passwordError.textContent = data.message;
          showMessage(data.message, "errorBox");
        } else {
          passwordError.textContent = "ログイン失敗: " + data.message;
          showMessage("ログイン失敗: " + data.message, "errorBox");
        }
      }
    })
    .catch(err => {
      console.error("リクエスト失敗：", err);
      passwordError.textContent = "サーバーエラーが発生しました。";
      showMessage("サーバーエラーが発生しました。", "errorBox");
    });
  });
});


