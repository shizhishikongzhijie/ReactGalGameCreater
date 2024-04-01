import logo from './logo.svg';
import './App.less';
import axios from 'axios';
import { Layout, Flex } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
function file() {
  axios.get('http://localhost:3300/file')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}
var windowWidh,windowHeight;
function App() {
  //实时获得窗口大小
  window.onresize = function () {
    console.log(window.innerWidth, window.innerHeight);
    windowWidh = window.innerWidth;
    windowHeight = window.innerHeight;
  }
  return (

    <div className="App" style={{width :"auto",height:"auto"}}>{file()}
      <Layout className='layoutStyle'>
        <Header className='headerStyle'>Header</Header>
        <Layout>
          <Layout>
          <Content className='contentStyle'>Content</Content>
          <Footer className='footerStyle'>Footer</Footer>
          </Layout>
          <Sider width="25%" className='siderStyle'>
            Sider
          </Sider>
        </Layout>
        
      </Layout>
    </div>
  );
}

export default App;
