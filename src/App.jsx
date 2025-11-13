import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Details from './pages/Details';
import MyLists from './pages/MyLists';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:type/:id" element={<Details />} />
        <Route path="/lists" element={<MyLists />} />
      </Routes>
    </div>
  );
}

export default App;