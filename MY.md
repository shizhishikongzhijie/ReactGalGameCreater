# 窗口大小

## window.innerWidth:

这是一个浏览器提供的JavaScript属性，返回当前浏览器窗口（不包括任何滚动条、工具栏等额外元素）的内部宽度（像素值）。在这个上下文中，let Width = window.innerWidth * 0.5; 表示获取当前窗口宽度的一半，并将其赋值给变量 Width。
优点：能够动态适应窗口大小的变化，适用于需要响应式布局的场景。
缺点：依赖于浏览器环境，仅在运行时才能获取具体数值，且单位固定为像素（px）。

## 100vh:

这是CSS中的视口相对单位，表示相对于浏览器视口高度的100%。也就是说，100vh等于当前浏览器窗口的高度（包括滚动条，但不包括浏览器界面顶部和底部的其他UI元素，如地址栏、标签页等）。
优点：用于创建高度与浏览器窗口高度完全匹配的元素，同样适用于响应式布局，尤其在全屏展示或自适应高度的设计中非常有用。
缺点：当页面存在垂直滚动条时，100vh会包括滚动条的宽度，可能导致某些情况下计算出的元素高度比预期稍大。另外，部分老版浏览器可能不支持该单位。

## 100%:

在CSS中，100% 是一个百分比单位，表示相对于父容器的尺寸。如果应用于元素的 width 或 height 属性，则该元素的尺寸将是其父容器相应尺寸的100%。
优点：具有良好的继承性和灵活性，可以根据父容器的尺寸自动调整子元素的大小，有助于构建灵活的响应式布局。
缺点：依赖于父容器的尺寸定义，如果父容器尺寸未明确指定或计算不准确，可能会导致子元素尺寸异常。此外，在多层嵌套的布局中，需要确保所有相关父级元素的尺寸计算正确。

# JSON在expressJs中的使用

## node.js 下最出名的web框架 express ,之前低版本(4.0以下)貌似需要依赖 bodyParser 包来解析请求体,

- Express 3.x和4.x版本的区别

- 后来的版本把 bodyParser 继承进去,
- 需要在express 配置项里 user(express.bodyParser( { keepExtensions: true, uploadDir: '/tmp' }))

如下代码:

```javascript
var express = require('express'),
    app = express();

app.configure(function () {
    app.use(express.bodyParser({ keepExtensions: true, uploadDir: '/tmp' }));
});
```
- // 配置解析 数据格式为表单数据的请求体 的中间件 
- app.use(express.urlencoded({ extended: false }))
- expres服务器默认无法解析数据格式为表单数据的请求体，因此express才提供了这个中间件，让我们配置，从而能够解析req. - - body 中表单格式数据。而这个中间件内部，其实是在配置body-parser属性，所以我的每个request请求都是要经过这个过滤器解- 析的，也就是说，这个中间件不能解析json格式字符串？？？？

- 经过网上查阅，我找到了如下解释

- body-parser的urlencoded方法顾名思义就是把传来的数据当做url来处理，也就是像querystring一样，所以对于传过来的json 数据，没有识别到切割key和value的标志，就把所有都当做key来处理
- 真相大白。body-parser无法解析请求体中的JSON字符串，所以当收到JSON格式的参数时，因无法解析，所以req.body就为空了

### 现在的Express 4.0最新版把 bodyParser 又拿出来了(当然很多之前依赖的插件都拿出来了) 变成了独立的依赖包 body-parser 需要 npm install 来安装使用.

```javascript
npm install body-parser
Express 4.0以上版本需要在启动文件中做如下配置:

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var server = require('http').createServer(app);

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
  extended: true
}));
```

## 如果你的接口要求post 上来的数据格式是这样的:

- {"data":{"name":"张三","age":25}} 后端express 进过 bodyParser 的解析后,可以这样读取到数据
- req.body.data.name (获取到张三)
- req.body.data.age (获取到年龄)
- 但是这里是有前提的,客户端请求接口时必须指名请求头类型 Content-Type=application/json
- bodyParser 发现这样类型的请求头后,会自动将 body 里的 json 格式数据正确解析,否则 req.body.data 为 undefined
- 传统的服务器端语言可能会接收post上传的流,然后转成字符串最后在格式化成 json ,这样加不加application/json 请求头都是没有问题的.
- 但是Express 中间件在解析body中的post参数会检查 Content-Type 类型,所以没有指定正确格式导致中间件解析参数出错.

### 那如何处理呢?

因为好多地方都在调用你的接口,你无法保证所有的人都在请求头里面加了 Content-Type=application/json

#### 解决思路是:

- 服务器端 先用 req.body.data 参数获取参数,如果成功,说明 bodyParser 正确解析了json 参数. 还是按照之前的方法读取.
- 如果 req.body.data 参数无值或者undefined 那么我们也用流来读取post 数据,然后转成字符串再解析成 json 格式来使用. 直接上代码

```javascript
app.post('/post', function (req, res) {
    if (req.body.data) {
        //能正确解析 json 格式的post参数
        res.send({"status": "success", "name": req.body.data.name, "age": req.body.data.age});
    } else {
        //不能正确解析json 格式的post参数
        var body = '', jsonStr;
        req.on('data', function (chunk) {
            body += chunk; //读取参数流转化为字符串
        });
        req.on('end', function () {
            //读取参数流结束后将转化的body字符串解析成 JSON 格式
            try {
                jsonStr = JSON.parse(body);
            } catch (err) {
                jsonStr = null;
            }
            jsonStr ? res.send({"status":"success", "name": jsonStr.data.name, "age": jsonStr.data.age}) : res.send({"status":"error"});
        });
    }
});
```