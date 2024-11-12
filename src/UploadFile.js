// App.css
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import './App.css'; // Import the CSS file

// Connect to your local IPFS node
const ipfs = create({
    host: 'localhost',
    port: 5001,
    protocol: 'http'
});

function UploadFile({ contractAddress, contractABI }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const [fileList, setFileList] = useState([]);

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
            
            const added = await ipfs.add(file);
            const ipfsHash = added.path;

            setStatus("Storing metadata on blockchain...");

            const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();

            const contract = new ethers.Contract(contractAddress, contractABI, signer);

            const tx = await contract.uploadFile(
                ipfsHash,
                file.size,
                file.type,
                file.name,
                { gasLimit: 3000000 }
            );
            await tx.wait();

            setStatus("File uploaded successfully!");
        } catch (error) {
            console.error("Contract Interaction Error:", error);
            setStatus("Error storing metadata on blockchain.");
        }
    };

    const fetchFileList = async () => {
        try {
            setStatus("Fetching all uploaded files...");

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);

            const fileIds = await contract.getAllFileIds();

            const files = await Promise.all(fileIds.map(async (id) => {
                const fileData = await contract.getFile(id);
                const [fileId, ipfsHash, fileSize, fileType, fileName, uploadTime, uploader] = fileData;
                return {
                    fileId,
                    ipfsHash,
                    fileSize,
                    fileType,
                    fileName,
                    uploadTime: new Date(uploadTime * 1000).toLocaleString(),
                    uploader
                };
            }));

            setFileList(files);
            setStatus("File list retrieved successfully.");
        } catch (error) {
            console.error("Error fetching file list:", error);
            setStatus("Error fetching file list.");
        }
    };

    useEffect(() => {
        fetchFileList();
    }, []);

    return (
        <div className="upload-container">
            <h2>Upload a New File</h2>
            <div className="file-upload">
                <input type="file" onChange={handleFileChange} className="file-input" />
                <button onClick={handleUpload} className="upload-button">Upload File</button>
            </div>
            <p className="status-message">{status}</p>

            <h2>List of Uploaded Files</h2>
            <button onClick={fetchFileList} className="refresh-button">Refresh File List</button>
            <ul className="file-list">
                {fileList.map((file) => (
                    <li key={file.fileId} className="file-item">
                        <strong>File Name:</strong> {file.fileName}<br />
                        <strong>File Type:</strong> {file.fileType}<br />
                        <strong>Uploaded By:</strong> {file.uploader}<br />
                        <strong>Upload Time:</strong> {file.uploadTime}<br />
                        <strong>IPFS Hash:</strong> {file.ipfsHash}<br />
                        <a href={`http://localhost:8080/ipfs/${file.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                            View/Download
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UploadFile;
