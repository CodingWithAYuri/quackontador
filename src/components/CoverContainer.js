import React from 'react';

function CoverContainer({ children }) {
  return (
    <div className="cover-container">
      {children}
      <footer className="footer">
        {/* Conteúdo do footer aqui */}
      </footer>
    </div>
  );
}

export default CoverContainer;
