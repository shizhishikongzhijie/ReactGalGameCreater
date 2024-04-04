const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const request = require('request');
const _ = require('lodash');

// 设置存储路径和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/') // 上传的文件存储在images目录中
    },
    filename: function (req, file, cb) {
        const imgName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, imgName) // 文件名设置为字段名加时间戳和原始扩展名
    }
})

// 创建multer实例，设置文件上传限制和存储方式
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1000 // 限制文件大小为1000MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp|svg/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images Only!');
        }
    }
})

// 处理POST请求，上传图片
router.post('/', upload.single('image'), (req, res) => {
    // 检查是否上传了文件
    if (!req.file) {
        console.error('未上传任何文件。');
        return res.status(400).send('未上传任何文件。');
    }

    // 发送GET请求，获取JSON数据
    //但是这里是有前提的,客户端请求接口时必须指名请求头类型 Content-Type=application/json
    //bodyParser 发现这样类型的请求头后,会自动将 body 里的 json 格式数据正确解析,否则 req.body.data 为 undefined
    request.get({
        url: 'http://localhost:3300/file',
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    }
        , (err, response, body) => {
            if (err) {
                console.error(err);
                console.error('获取JSON数据时发生错误。');
                return res.status(500).send('获取JSON数据时发生错误。');
            }
            //在 JavaScript 中，使用点（.）访问对象的属性时，属性名必须是一个有效的标识符。而在这个 JSON 数据中，属性名包含了非标识符字符（如空格、中文字符等），因此无法直接使用点操作符来访问这些属性。

            //为了访问这些属性，可以使用方括号（[]）加上属性名的方式来访问。例如，jsonData.backgroundimg['背景一'] 就可以正确地获取到背景一的值。方括号内可以使用字符串形式的属性名，这样就可以访问包含特殊字符的属性了。
            try {
                // 解析JSON数据
                const jsonData = JSON.parse(body);
                // 使用深拷贝确保数据安全
                const jsonDataCopy = _.cloneDeep(jsonData);
                //获取backgroundimg中的内容条数
                if (typeof jsonDataCopy.backgroundimg !== 'object' || jsonDataCopy.backgroundimg === null) {
                    console.error('jsonDataCopy.backgroundimg 不存在或不是对象。');
                    console.error('jsonDataCopy.backgroundimg:', jsonDataCopy.backgroundimg['背景一']);
                    return res.status(500).send('jsonDataCopy.backgroundimg 不存在或不是对象。');
                }
                const contentCount = Object.keys(jsonDataCopy.backgroundimg).length;
                console.log(`contentCount: ${contentCount}`);
                // 获得jsonDataCopy.backgroundimg对象里的最后一个名字为bg+数字的key
                let lastKey = '';
                let lastCount = 1;
                for (let i = 1; i <=contentCount; i++) {
                    const key = `bg${i}`;
                    if (jsonDataCopy.backgroundimg[key]) {
                        lastKey = key;
                        lastCount = i;
                    }
                }
                console.log(lastKey, lastCount);
                // 构建新的键值对，键为新的图片名称，值为新上传的图片路径
                const newKey = 'bg' + (lastCount + 1); // 新键的命名方式可以根据需求进行修改
                const newValue = 'images/' + req.file.filename;

                // 将新的键值对添加到backgroundimg中
                jsonDataCopy.backgroundimg[newKey] = newValue;
                console.log('jsonDataCopy:', JSON.stringify(jsonDataCopy, null, 2));

                // 发送修改后的JSON数据到/file，使用POST请求
                request.post({
                    url: 'http://localhost:3300/file',
                    json: true,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonDataCopy
                }, (err, response, body) => {
                    if (err) {
                        console.error(err);
                        console.error('更新JSON数据时发生错误。');
                        return res.status(500).send('更新JSON数据时发生错误。');
                    }
                    res.send('文件上传成功！');
                });
            } catch (error) {
                console.error(error);
                console.error('解析JSON数据时发生错误。');
                return res.status(500).send('解析JSON数据时发生错误。');
            }
        });
});
module.exports = router;