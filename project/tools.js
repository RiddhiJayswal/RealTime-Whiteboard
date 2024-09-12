// select the element by ID (use # for IDs)
const pencilElement = document.querySelector("#pencil");
const eraserElement = document.querySelector("#eraser");
const stickyElement = document.querySelector("#sticky");
const uploadElement = document.querySelector("#upload");
const downloadElement = document.querySelector("#download");
const undoElement = document.querySelector("#undo");
const redoElement = document.querySelector("#redo");

// add event listeners
pencilElement.addEventListener("click", function tellPencil() {
    console.log("Pencil is clicked");
});

eraserElement.addEventListener("click", function tellEraser() {
    console.log("Eraser is clicked");
});

stickyElement.addEventListener("click", function tellSticky() {
    console.log("Sticky Note is clicked");
});

uploadElement.addEventListener("click", function tellUpload() {
    console.log("Upload is clicked");
});

downloadElement.addEventListener("click", function tellDownload() {
    console.log("Download is clicked");
});

undoElement.addEventListener("click", function tellUndo() {
    console.log("Undo is clicked");
});

redoElement.addEventListener("click", function tellRedo() {
    console.log("Redo is clicked");
});
