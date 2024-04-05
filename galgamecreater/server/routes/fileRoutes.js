// fileRoutes.js

const express = require('express');

const fs = require('fs');
const router = express.Router();

// 读取 JSON 文件
router.get('/', (req, res) => {
    res.set('Content-Type', 'application/json');

    try {
        const jsonString = fs.readFileSync('./data.json', 'utf8');
        const data = jsonString;
        res.json(data); // res.json()方法会自动设置Content-Type响应头为application/json。
    } catch (err) {
        console.error('Error reading or parsing JSON file:', err);
        res.status(500).json({ error: 'Error reading or parsing JSON file' });
    }
});

// 写入 JSON 文件
router.post('/', (req, res) => {
    res.set('Content-Type', 'application/json');
    const updatedJSON = req.body; // 假设请求的 JSON 数据已经包含更新后的内容
    console.log(updatedJSON);

    try {
        fs.writeFileSync('./data.json', JSON.stringify(updatedJSON));
        res.json({ message: 'File updated successfully' });
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).json({ error: 'Error writing file' });
    }
});
module.exports = router;
