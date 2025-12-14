const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const pool = require('../database'); // database.js
// insertuser.js

(async () => {
  try {
    // insert user info
    const users = [
      { username: "test03@gc.com", password: "123456" },
      { username: "test04", password: "1234567" }
    ];

    for (const u of users) {
      // 生成ハッシュ化されたパスワード
      const hashedPassword = await bcrypt.hash(u.password, 10);

      // データベースに挿入
      await pool.query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [u.username, hashedPassword]
      );

      console.log(`ユーザー ${u.username} を登録しました（ハッシュ済みパスワード）。`);
    }

    console.log("すべてのユーザーが正常に挿入されました。");
    process.exit(0);
  } catch (err) {
    console.error("ユーザー挿入エラー:", err);
    process.exit(1);
  }
})();
