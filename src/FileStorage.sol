// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        uint id;
        string ipfsHash;
        uint fileSize;
        string fileType;
        string fileName;
        uint uploadTime;
        address uploader;
    }

    mapping(uint => File) public files;
    uint public fileCount = 0;

    // Array to store file IDs
    uint[] public fileIds;

    event FileUploaded(
        uint id,
        string ipfsHash,
        uint fileSize,
        string fileType,
        string fileName,
        uint uploadTime,
        address uploader
    );

    // Function to upload a file
    function uploadFile(
        string memory _ipfsHash,
        uint _fileSize,
        string memory _fileType,
        string memory _fileName
    ) public {
        require(bytes(_ipfsHash).length > 0, "IPFS hash is required");
        require(_fileSize > 0, "File size must be greater than 0");
        require(bytes(_fileType).length > 0, "File type is required");
        require(bytes(_fileName).length > 0, "File name is required");

        fileCount++;
        files[fileCount] = File(
            fileCount,
            _ipfsHash,
            _fileSize,
            _fileType,
            _fileName,
            block.timestamp,
            msg.sender
        );

        // Store the file ID in the array
        fileIds.push(fileCount);

        emit FileUploaded(
            fileCount,
            _ipfsHash,
            _fileSize,
            _fileType,
            _fileName,
            block.timestamp,
            msg.sender
        );
    }

    // Function to get a list of all file IDs
    function getAllFileIds() public view returns (uint[] memory) {
        return fileIds;
    }

    // Function to get details of a specific file by ID
    function getFile(uint _id) public view returns (
        uint,
        string memory,
        uint,
        string memory,
        string memory,
        uint,
        address
    ) {
        File memory file = files[_id];
        return (
            file.id,
            file.ipfsHash,
            file.fileSize,
            file.fileType,
            file.fileName,
            file.uploadTime,
            file.uploader
        );
    }
}
