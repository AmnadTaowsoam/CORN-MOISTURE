import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import UpdatePage from './pages/UpdatePage'; // Import UpdatePage
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';

function App() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false); // Track if user is logged in
  const [username, setUsername] = useState('CORN-USER');

  const handleLogin = () => {
    setLoggedIn(true);
    setLoginOpen(false);
  };

  const handleRegister = () => {
    setLoggedIn(true);
    setRegisterOpen(false);
  };

  const handleLogout = () => {
    setUsername(null);
    setLoggedIn(false);
  };

  return (
    <Router>
      <div className="App flex flex-col min-h-screen relative">
        <Header
          onLoginClick={() => setLoginOpen(true)}
          onRegisterClick={() => setRegisterOpen(true)}
          onLogoutClick={handleLogout}
          username={username}
          className="relative z-20"
        />

        <main className="">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Home /> // Show Home if logged in
                ) : (
                  <div className="flex justify-center items-center h-full text-center mt-20">
                    <p className="text-lg">Please log in or register to continue.</p>
                  </div>
                )
              }
            />
            <Route path="/update" element={<UpdatePage />} /> {/* Add UpdatePage route */}
          </Routes>
        </main>

        {/* Enable Login and Register Modals */}
        <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} onLogin={handleLogin} />
        <RegisterModal isOpen={isRegisterOpen} onClose={() => setRegisterOpen(false)} onRegister={handleRegister} />
      </div>
    </Router>
  );
}

export default App;
