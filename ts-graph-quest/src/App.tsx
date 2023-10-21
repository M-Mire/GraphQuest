import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Canvas from './Canvas';
import TraverseCode from './TraverseCode';
import TraverseAnimation from './TraverseAnimation';

const App: React.FC = () => {
  const [rootValue, setRootValue] = useState<number | null>(null);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar setRootValue={setRootValue} rootValue={rootValue}/>
      <div className="flex-1">
      <Navbar />
        <div className="flex h-full">
          <Canvas />
          <div className="w-1/4 relative">
            <TraverseCode rootValue={rootValue}/>
            <TraverseAnimation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
