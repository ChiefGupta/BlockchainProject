
# Decentralized File Storage App

A decentralized application for securely uploading and storing files using IPFS (InterPlanetary File System) and Ethereum blockchain. This project provides a user-friendly interface to upload files to IPFS, with metadata stored on the blockchain via a smart contract on the Polygon Amoy Testnet. The application is built using React and Tailwind CSS for the frontend.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Smart Contract Details](#smart-contract-details)
- [File List Retrieval and Download](#file-list-retrieval-and-download)
- [Troubleshooting](#troubleshooting)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Features

- **File Upload**: Users can upload files directly to IPFS.
- **Blockchain Integration**: File metadata is stored on the Polygon Amoy Testnet, ensuring data immutability.
- **File List Retrieval**: View the list of all files uploaded, with IPFS links for download.
- **Responsive Design**: Styled with Tailwind CSS for a responsive and accessible interface.

---

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Blockchain**: Solidity smart contract on Polygon Amoy Testnet
- **Storage**: IPFS for decentralized file storage
- **Web3**: Ethers.js, MetaMask for wallet integration

---

## Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MetaMask](https://metamask.io/) extension
- IPFS node running locally or accessible remotely

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/decentralized-file-storage.git
   cd decentralized-file-storage
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set up IPFS**
   - Install and initialize IPFS if not already done:
     ```bash
     npm install -g ipfs
     ipfs init
     ipfs daemon
     ```

4. **Configure Tailwind CSS**
   - If not already configured, initialize Tailwind CSS by following the [Tailwind CSS documentation](https://tailwindcss.com/docs/installation).

5. **Compile and Deploy Smart Contract**
   - Use [Remix](https://remix.ethereum.org/) or Truffle/Hardhat for deployment. Save the contract address and ABI after deployment.

6. **Configure Environment Variables**
   - Add contract details in `UploadFile.js`:
     ```javascript
     const contractAddress = "0xD8b25a95f41E3531080641aF40A97aA03cE5aD70";
     const contractABI = <contractABI here>;  // Replace with the actual ABI
     ```

---

## Usage

### Running the Application

1. **Start the Development Server**
   ```bash
   npm start
   ```
2. **Access the App**
   - Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Upload a File**
   - Select a file and click `Upload File`. The file is stored on IPFS, with metadata recorded on the blockchain.

4. **Retrieve Uploaded Files**
   - Click `Refresh File List` to see all previously uploaded files. Each file entry includes a link for downloading the file directly from IPFS.

---

## Smart Contract Details

### FileStorage.sol

This smart contract allows users to upload files to IPFS and stores file metadata on the blockchain.

#### Contract Address
- **Polygon Amoy Testnet Contract Address**: `0xD8b25a95f41E3531080641aF40A97aA03cE5aD70`

#### Contract ABI
The ABI is provided below for integration:
```json
[
    { "anonymous": false, "inputs": [...], "name": "FileUploaded", "type": "event" },
    { "inputs": [...], "name": "fileCount", "outputs": [...], "stateMutability": "view", "type": "function" },
    { "inputs": [...], "name": "getAllFileIds", "outputs": [...], "stateMutability": "view", "type": "function" },
    { "inputs": [...], "name": "getFile", "outputs": [...], "stateMutability": "view", "type": "function" },
    { "inputs": [...], "name": "uploadFile", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
]
```

---

## File List Retrieval and Download

Once files are uploaded, users can retrieve and view the list of files on the platform:
- **View File List**: Each file includes metadata such as the file name, type, and IPFS hash.
- **Download Link**: Click on the "View/Download" link to access the file from IPFS.

---

## Troubleshooting

- **MetaMask Errors**: Ensure MetaMask is connected to the correct network (Polygon Amoy Testnet).
- **IPFS Errors**: Check that your IPFS daemon is running on `localhost:5001`. Update configuration if using a remote node.
- **CORS Issues**: If you encounter CORS issues, configure IPFS to allow access from `localhost:3000`:
  ```bash
  ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
  ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "POST", "GET"]'
  ipfs daemon
  ```

---

## Future Enhancements

- **Encryption**: Add file encryption for added security before uploading to IPFS.
- **Notifications**: Notify users when a file is successfully uploaded.
- **Gas Fee Optimization**: Implement batching or other strategies to reduce transaction costs.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to reach out with issues, contributions, or suggestions. Happy coding! 🚀
