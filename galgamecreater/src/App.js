import logo from './logo.svg';
import './App.css';
import axios from 'axios';
function file(){
  axios.get('http://localhost:3300/file')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
function App() {
  return (
    <div className="App" >
      file
      {file()}
    </div>
  );
}

export default App;
