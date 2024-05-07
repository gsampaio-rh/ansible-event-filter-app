// stateManager.js

let fileLines = []; // To store lines fetched from logs
let currentLine = 0; // To keep track of the current line being processed
let messageIndex = 1; // To track the number of messages processed

function getCurrentLine() {
    return currentLine;
}

function advanceCurrentLine() {
    currentLine++;
}

function getMessageIndex() {
    return messageIndex;
}

function incrementMessageIndex() {
    messageIndex++;
}

function getFileLines() {
    return fileLines;
}

function setFileLines(lines) {
    fileLines = lines;
}

export { getCurrentLine, advanceCurrentLine, getMessageIndex, incrementMessageIndex, getFileLines, setFileLines };
