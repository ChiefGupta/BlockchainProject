import React from 'react';
import UploadFile from './UploadFile';
import contractABI from './contractABI.json';

function App() {
    const contractAddress = "0xD8b25a95f41E3531080641aF40A97aA03cE5aD70"; // Replace with actual address

    return (
        <div className="App">
            <h1>Decentralized File Storage</h1>
            <UploadFile contractAddress={contractAddress} contractABI={contractABI} />
        </div>
    );
}

export default App;
