require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const logger = (req, res, next) => {
    const time = new Date().toLocaleString('vi-VN');
    console.log(`[${time}] ${req.method} ${req.url}`);
    next();
};
app.use(logger);

const checkAge = (req, res, next) => {
    const age = parseInt(req.query.age || req.body.age); 
    
    if (!age || age < 18) {
        return res.status(400).json({ error: "Bạn chưa đủ 18 tuổi" });
    }
    next();
};

app.get('/api/info', checkAge, (req, res) => {
    const { name, age } = req.query;
    res.json({
        name: name,
        age: parseInt(age),
        message: `Chào mừng ${name}!`
    });
});

let currentId = 1; 
app.post('/api/register', (req, res) => {
    const { name, age, email } = req.body;

    if (!name || !age || !email) {
        return res.status(400).json({ error: "Vui lòng điền đầy đủ" });
    }

    res.json({
        id: currentId++,
        name: name,
        age: parseInt(age),
        email: email
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});