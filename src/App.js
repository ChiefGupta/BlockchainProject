import React from 'react';
import UploadFile from './UploadFile';
import contractABI from './contractABI.json';

function App() {
    const contractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8"; // Replace with actual address

    return (
        <div className="App">
            <h1>Decentralized File Storage</h1>
            <UploadFile contractAddress={contractAddress} contractABI={contractABI} />
        </div>
    );
}

export default App;
