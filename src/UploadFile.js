import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';

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
        <div className="container mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Decentralized File Storage</h1>

            {/* Upload Section */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upload a New File</h2>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-gray-700 border border-gray-300 rounded-md p-2 mb-4"
                />
                <button
                    onClick={handleUpload}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md w-full hover:bg-blue-700 transition"
                >
                    Upload File
                </button>
            </div>

            {/* File List Section */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">List of Uploaded Files</h2>
                <button
                    onClick={fetchFileList}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mb-4 hover:bg-blue-700 transition"
                >
                    Refresh File List
                </button>
                <p className="text-gray-600 text-center mb-4">{status}</p>
                <ul className="space-y-4">
                    {fileList.map((file) => (
                        <li key={file.fileId} className="bg-gray-50 p-4 rounded-lg shadow break-words">
                            <p><strong>File Name:</strong> {file.fileName}</p>
                            <p><strong>File Type:</strong> {file.fileType}</p>
                            <p><strong>Uploaded By:</strong> {file.uploader}</p>
                            <p><strong>Upload Time:</strong> {file.uploadTime}</p>
                            <p><strong>IPFS Hash:</strong> <span className="break-words">{file.ipfsHash}</span></p>
                            <a
                                href={`http://localhost:8080/ipfs/${file.ipfsHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline mt-2 block"
                            >
                                View/Download
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UploadFile;
