import React from 'react';

function Footer() {
  return (
    <footer className="bg-primary text-white p-4 mt-auto">
      <div className="container mx-auto flex justify-center items-center">
        <p className="text-sm">&copy; {new Date().getFullYear()} CORNINSPEC. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

