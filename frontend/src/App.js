import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Chatpage from './pages/Chatpage';
// import Chatpage from './pages/Chatpage';

function App() {
  return (
    <div className="App">
      {/* Define your routes here */}
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
