 require('dotenv').config();;
//环境变量加载，读取.env
//console.log(process.env); 

const bcrypt = require('bcrypt');
const pool = require('./database');

const express = require('express');
const cors = require("cors");
const app = express();
// 解析 JSON 请求体
app.use(express.json());
// 允许跨域
app.use(cors());


//测试数据库链接 database connection
(async () => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    console.log('データベース接続成功:', rows[0]);
  } catch (err) {
    console.error('データベース接続失敗:', err.message);
  }
})();

// 根路由
app.get('/', (req, res) => {
  res.send('バックエンドは正常に稼働しています！');
});

// 健康检查接口
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.json({ status: 'error', db: 'failed' });
  }
});


// 登录接口 login API
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  //检查是否为空  empty check
  if (!username || !password) {
    return res.json({ success: false, message: 'ユーザー名またはパスワードは空にできません' });
  }

  try {
    // 查询数据库  query database
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    // 用户不存在 user not exist
    if (rows.length === 0) {
      return res.json({ success: false, message: 'ユーザー名が存在しません。下の［新規登録］ボタンから登録できます。' });
    }

    const user = rows[0];



    //password check
    //if (user.password !== password) {
    //  return res.json({ success: false, message: 'パスワードが間違っています' });
    //}

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ success: false, message: 'パスワードが間違っています' });
    }



    //success
    return res.json({
      success: true,
      message: 'ログイン成功',
      username: user.username
    });

  } catch (err) {
    console.error(err);
    return res.json({ success: false, message: 'サーバーエラーが発生しました' });
  }
});

app.listen(3000, () => {
  console.log('サーバーが起動しました：http://localhost:3000');
});


