// Select the element by class name (use . for classes)
let toolsArr = document.querySelectorAll(".tool");

let currentTool = "pencil";  // Moved this outside to be accessible globally

// Add event listener to each tool
for (let i = 0; i < toolsArr.length; i++) {
    toolsArr[i].addEventListener("click", function () {
        const toolName = toolsArr[i].id; // Fixed typo
        if (toolName == "pencil") {
            currentTool = "pencil";
            tool.strokeStyle = "black"; // Set stroke style to black for the pencil
        } else if (toolName == "eraser") {
            currentTool = "eraser";
            tool.strokeStyle = "white"; // Set stroke style to white for the eraser
        } else if (toolName == "download") {
            console.log("clicked dwn");
        } else if (toolName == "sticky") {
            currentTool = "sticky";
            createSticky();
            
        } else if (toolName == "upload") {
            currentTool = "upload";
            uploadFile();

        } else if (toolName == "undo") {
            console.log("clicked");
        } else if (toolName == "redo") {
            console.log("clicked");
        }
    });
}

// Select canvas tag and set height and width
let canvas = document.querySelector("#board");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// Get the drawing context (2D context)
let tool = canvas.getContext("2d");

// Drawing state
let isDrawing = false;

// Track mousedown event
canvas.addEventListener("mousedown", function (e) {
    let sidx = e.clientX;
    let sidy = e.clientY;
    let toolbarHeight = getYDelta();
    tool.beginPath(); // Start the path only once, on mousedown
    tool.moveTo(sidx, sidy - toolbarHeight);
    isDrawing = true;  // Set drawing state to true
});

// Track mousemove event
canvas.addEventListener("mousemove", function (e) {
    if (!isDrawing) return;  // Only draw when mouse is pressed

    let eidx = e.clientX;
    let eidy = e.clientY;
    let toolbarHeight = getYDelta();

    if (currentTool === "eraser") {
        tool.strokeStyle = "white"; // Set the stroke to white for eraser
        tool.lineWidth = 10; // Optionally, make the eraser wider
    } else {
        tool.strokeStyle = "black"; // Set to black for drawing
        tool.lineWidth = 2; // Default pencil width
    }

    tool.lineTo(eidx, eidy - toolbarHeight); // Draw the line
    tool.stroke(); // Render the line
});

// Track mouseup event
canvas.addEventListener("mouseup", function (e) {
    isDrawing = false;  // Stop drawing when mouse is released
});

// Function to get the toolbar height
const toolbar = document.querySelector(".toolbar");
function getYDelta() {
    let heightOfToolbar = toolbar.getBoundingClientRect().height;
    return heightOfToolbar;
}

// Function to create a sticky note
function createSticky() {
    // Create sticky note elements
    let stickyDiv = document.createElement("div");
    let navDiv = document.createElement("div");
    let closeDiv = document.createElement("div");
    let minimizeDiv = document.createElement("div");
    let textarea = document.createElement("textarea");

    // Set attributes and inner text for buttons
    stickyDiv.setAttribute("class", "sticky");
    navDiv.setAttribute("class", "nav");
    closeDiv.setAttribute("class", "close");
    minimizeDiv.setAttribute("class", "minimize");
    textarea.setAttribute("class", "textarea");

    closeDiv.innerText = "x";
    minimizeDiv.innerText = "-";

    // Append elements to the sticky note structure
    stickyDiv.appendChild(navDiv);
    stickyDiv.appendChild(textarea);
    navDiv.appendChild(minimizeDiv);
    navDiv.appendChild(closeDiv);
    
    // Add the sticky note to the page
    document.body.appendChild(stickyDiv);

    // Close functionality
    let isMinimized=false;
    closeDiv.addEventListener("click", function () {
        stickyDiv.remove();
    });
    
    // Minimize functionality
minimizeDiv.addEventListener("click", function () {
    if (!isMinimized) {
        textarea.style.display = "none";   // Hide the textarea
        stickyDiv.style.height = "30px";   // Shrink the sticky to show only the nav bar
    } else {
        textarea.style.display = "block";  // Show the textarea
        stickyDiv.style.height = "200px";  // Expand the sticky note back to original height
    }
    isMinimized = !isMinimized;  // Toggle the minimized state
});


// functionality to move sticky notes
//navbar->mousedown,mouseup,mousemove
let isStickyDown = false;
let initialX, initialY;

// When the mouse is pressed down on the nav (header) of the sticky note
navDiv.addEventListener("mousedown", function (e) {
    initialX = e.clientX;
    initialY = e.clientY;
    isStickyDown = true;
});

// Track mouse movement across the document
document.addEventListener("mousemove", function (e) {
    if (isStickyDown) {
        let finalX = e.clientX;
        let finalY = e.clientY;

        let dx = finalX - initialX; // Change in X
        let dy = finalY - initialY; // Change in Y

        // Get current position from the style (not from getBoundingClientRect)
        let currentTop = parseInt(stickyDiv.style.top) || 0;
        let currentLeft = parseInt(stickyDiv.style.left) || 0;

        // Update the position of the sticky note
        stickyDiv.style.top = (currentTop + dy) + "px"; // Update top position
        stickyDiv.style.left = (currentLeft + dx) + "px"; // Update left position

        // Update initial positions for the next movement
        initialX = finalX;
        initialY = finalY;
    }
});


// When the mouse is released, stop moving the sticky note
document.addEventListener("mouseup", function () {
    isStickyDown = false;
});
}

// upload file function
let inputTag = document.querySelector(".input-tag");
function uploadFile(){
    //input tag ->file accept [hide]->css
    // click img icon ->input tag click
    inputTag.click();
    // file read input tag
     inputTag.addEventListener("change",function(){
        // console.log("files" ,inputTag.files);
        let data = inputTag.files[0];

        // add UI
    let img = document.createElement("img");
    let url = URL.createObjectURL(data);
    img.src = url;
    img.height = 100;

    // add to body
    document.body.appendChild(img);
     });
   
    




}