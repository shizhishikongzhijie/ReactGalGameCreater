// fileRoutes.js

const express = require('express');
const fs = require('fs');
const router = express.Router();

// 读取 JSON 文件
router.get('/', (req, res) => {
    fs.readFile('./data.json', 'utf8', (err, jsonString) => {
        if (err) {
            console.log('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
        }

        try {
            const data = JSON.parse(jsonString);
            res.json(data);
        } catch (err) {
            console.log('Error parsing JSON string:', err);
            res.status(500).json({ error: 'Error parsing JSON string' });
        }
    });
});

// 写入 JSON 文件
router.post('/', (req, res) => {
    const updatedJSON = req.body; // 假设请求的 JSON 数据已经包含更新后的内容
    fs.writeFile('./data.json', JSON.stringify(updatedJSON), (err) => {
        if (err) {
            console.log('Error writing file:', err);
            return res.status(500).json({ error: 'Error writing file' });
        }
        res.json({ message: 'File updated successfully' });
    });
});

module.exports = router;
