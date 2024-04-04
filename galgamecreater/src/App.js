import { useState, useEffect } from 'react';
import './App.less';
import axios from 'axios';
import Header from './layout/header/header';
import Footer from './layout/footer/footer';

function file() {
  axios.get('http://localhost:3300/file')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
// 防抖函数，减少函数调用频率
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
function App() {
  //实时获得窗口大小
  const [gameViewWidth, setgameViewWidth] = useState(0);
  const [gameViewHeight, setgameViewHeight] = useState(0);
  const [footerHeight, setfooterHeight] = useState(0);
  const [headerHeight, setheaderHeight] = useState(0);
  const handleResize = () => {
      let Width = window.innerWidth * 0.7;
      let Height = window.innerHeight * 0.7;
      if (Width / Height <= (2560 / 1600)) {
        setgameViewHeight(Width / 2560 * 1600);
        setgameViewWidth(Width);
        setfooterHeight(Height*10/7-Width/2560*1600-40-Height*10/7*0.1);
        setheaderHeight(Height*10/7*0.1);
      }
      else {
        setgameViewHeight(Height);
        setgameViewWidth(Height / 1600 * 2560);
        setfooterHeight(Height*10/7-Height-40-Height*10/7*0.1);
        setheaderHeight(Height*10/7*0.1);
      }
    };
  useEffect(() => {
      // 使用防抖技术的优化版handleResize
      const debouncedHandleResize = debounce(handleResize, 100);
    
    handleResize();
    window.addEventListener('resize',debouncedHandleResize);

    return () => {
      window.removeEventListener('resize',debouncedHandleResize);
    };
  }, []);
  return (

    <div className="App layoutStyle">
      <Header className='headerStyle' style={{height:headerHeight}}>Header</Header>
      <div style={{
        display: "flex", justifyContent: "space-between",
        height: 'auto',margin:"10px"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: 'auto',
          marginRight:"10px",
          marginBottom:'10px'
        }}>
          <div className='contentStyle' style={{ width: gameViewWidth, height: gameViewHeight }}>游戏渲染</div>
          <Footer className='footerStyle' style={{height:footerHeight}}>文件选择</Footer>
        </div>
        <div className='siderStyle' >
          Sider
        </div>
      </div>
    </div>
  );
}

export default App;
