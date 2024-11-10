import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';

// Connect to your local IPFS node
const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});

function UploadFile({ contractAddress, contractABI }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setStatus("Please select a file first.");
            return;
        }

        try {
            setStatus("Uploading to IPFS...");
            
            // Upload file to IPFS
            const added = await ipfs.add(file);
            const ipfsHash = added.path;
            console.log("IPFS Hash:", ipfsHash); // Debugging output

            // File details for debugging
            console.log("IPFS Hash:", ipfsHash);
            console.log("File Size:", file.size);
            console.log("File Type:", file.type);
            console.log("File Name:", file.name);


            setStatus("Storing metadata on blockchain...");

            // Initialize ethers provider and signer for MetaMask
            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            await provider.send("eth_requestAccounts", []); // Request wallet connection
            const signer = provider.getSigner();

            // Initialize the contract with signer
            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            // Interact with the smart contract, setting a manual gas limit
            const tx = await contract.uploadFile(
                ipfsHash,
                file.size,
                file.type,
                file.name,
                {
                    gasLimit: 3000000 // Set an appropriate gas limit
                }
            );
            await tx.wait();

            setStatus("File uploaded successfully!");
        } catch (error) {
            console.error("Contract Interaction Error:", error);
            setStatus("Error storing metadata on blockchain.");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload File</button>
            <p>{status}</p>
        </div>
    );
}

export default UploadFile;
