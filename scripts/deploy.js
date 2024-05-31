// scripts/deploy_student_marks.js

const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
    const StudentMarks = await ethers.getContractFactory("StudentMarks");
    const studentMarksInstance = await StudentMarks.deploy();

    console.log("Contract deployed to address:", studentMarksInstance.address);

    // Save deployed contract address to a file for later reference
    const contractAddress = studentMarksInstance.address;
    fs.writeFileSync("deployed_student_marks_contract_address.txt", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });