
document.querySelector('.cross').addEventListener('click', function() {
    const toolbar = document.querySelector('.toolbar');
    if (toolbar.classList.contains('hidden')) {
        toolbar.classList.remove('hidden');
        toolbar.classList.add('visible');
    } else {
        toolbar.classList.remove('visible');
        toolbar.classList.add('hidden');
    }
});

// Example JavaScript to toggle the .active class
document.querySelectorAll('.tool').forEach(tool => {
    tool.addEventListener('click', function() {
        // Remove .active class from all tools
        document.querySelectorAll('.tool').forEach(t => t.classList.remove('active'));
        // Add .active class to the clicked tool
        this.classList.add('active');
    });
});

let toolsArr = document.querySelectorAll(".tool");

let currentTool = "pencil";  

// Add event listener to each tool
for (let i = 0; i < toolsArr.length; i++) {
    toolsArr[i].addEventListener("click", function (e) {
        const toolName = toolsArr[i].id; // Fixed typo
        if (toolName == "pencil") {
            tool.strokeStyle = "black"; // Set stroke style to black for the pencil
        } else if (toolName == "eraser") {
            currentTool = "eraser";
            tool.strokeStyle = "white"; // Set stroke style to white for the eraser
        } else if (toolName == "download") {
            currentTool="download";
            downloadFile();
            console.log("clicked dwn");
        } else if (toolName == "sticky") {
            currentTool = "sticky";
            createSticky();
        } else if (toolName == "upload") {
            currentTool = "upload";
            uploadFile();
        } else if (toolName == "undo") {
            currentTool = "undo";
            undoFN();
        } else if (toolName == "redo") {
            console.log("clicked");
            currentTool = "redo";
            redoFN();
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
let undostack = [];
let redostack = [];
let isDrawing = false;

/// Variables for start coordinates
let sidx, sidy;

// Track mousedown event
canvas.addEventListener("mousedown", function (e) {
    sidx = e.clientX; // Store the starting X position
    sidy = e.clientY; // Store the starting Y position
    let toolbarHeight = getYDelta();
    tool.beginPath(); // Start the path only once, on mousedown
    tool.moveTo(sidx, sidy - toolbarHeight);
    isDrawing = true;  // Set drawing state to true
    
    // Push the initial point to undostack with tool information
    let pointdec = {
        x: sidx,
        y: sidy - toolbarHeight,
        desc: "md",
        tool: currentTool === "eraser" ? "eraser" : "pencil"  // Add the current tool to the stack
    };
    undostack.push(pointdec);
});

// Track mousemove event
canvas.addEventListener("mousemove", function (e) {
    if (!isDrawing) return;  // Only draw when mouse is pressed

    let eidx = e.clientX;
    let eidy = e.clientY;
    let toolbarHeight = getYDelta();

    if (currentTool === "eraser") {
        tool.strokeStyle = "white"; // Set the stroke to white for eraser
        tool.lineWidth = 40; // Optionally, make the eraser wider
    } else {
        tool.strokeStyle = "black"; // Set to black for drawing
        tool.lineWidth = 2; // Default pencil width
    }

    tool.lineTo(eidx, eidy - toolbarHeight); // Draw the line
    tool.stroke(); // Render the line
    
    // Push the current point to undostack with tool information
    let pointdec = {
        x: eidx,
        y: eidy - toolbarHeight,
        desc: "mn",
        tool: currentTool === "eraser" ? "eraser" : "pencil"  // Add the current tool to the stack
    };
    undostack.push(pointdec);
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

// for displaying sticky note
function createOuterShell(textarea = null) {
    // Create sticky note elements
    let stickyDiv = document.createElement("div");
    let navDiv = document.createElement("div");
    let closeDiv = document.createElement("div");
    let minimizeDiv = document.createElement("div");

    // Set attributes and inner text for buttons
    stickyDiv.setAttribute("class", "sticky");
    navDiv.setAttribute("class", "nav");
    closeDiv.setAttribute("class", "close");
    minimizeDiv.setAttribute("class", "minimize");

    closeDiv.innerText = "x";
    minimizeDiv.innerText = "-";

    // Append elements to the sticky note structure
    stickyDiv.appendChild(navDiv);
    navDiv.appendChild(minimizeDiv);
    navDiv.appendChild(closeDiv);

    // Add the sticky note to the page
    document.body.appendChild(stickyDiv);

    // Close functionality
    let isMinimized = false;
    closeDiv.addEventListener("click", function () {
        stickyDiv.remove();
    });

    // Minimize functionality
    minimizeDiv.addEventListener("click", function () {
        if (!isMinimized) {
            if (textarea) {
                textarea.style.display = "none"; // Hide the textarea
            }
            stickyDiv.style.height = "30px"; // Shrink the sticky to show only the nav bar
        } else {
            if (textarea) {
                textarea.style.display = "block"; // Show the textarea
            }
            stickyDiv.style.height = "200px"; // Expand the sticky note back to original height
        }
        isMinimized = !isMinimized; // Toggle the minimized state
    });

    // Functionality to move sticky notes
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

    return stickyDiv;
}



// for displaying img on sticky note
function createSticky() {
    let textarea = document.createElement("textarea");
    textarea.setAttribute("class", "textarea");

    let stickyDiv = createOuterShell(textarea); // Pass textarea to be controlled for minimizing
    stickyDiv.appendChild(textarea);
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
    img.setAttribute("class","upload-img")

    // add to body
    let stickyDiv = createOuterShell();
    stickyDiv.appendChild(img);
     });
   
    
}


// download file function
function downloadFile() {
    console.log("download clicked");

    // Create an off-screen canvas
    let offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;

    // Get the context of the off-screen canvas
    let offscreenContext = offscreenCanvas.getContext("2d");

    // Fill the background with white
    offscreenContext.fillStyle = "white";
    offscreenContext.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Draw the actual canvas content over the white background
    offscreenContext.drawImage(canvas, 0, 0);

    // Create an anchor element for downloading
    let a = document.createElement("a");

    // Set the filename for download
    a.download = "file.jpeg";

    // Convert the off-screen canvas to a data URL (JPEG format)
    let url = offscreenCanvas.toDataURL("image/jpeg", 1.0);

    // Set the URL as the href of the anchor
    a.href = url;

    // Trigger a click on the anchor to download the image
    a.click();

    // Remove the anchor after triggering the download
    a.remove();
}



// undo function
// undo function
function undoFN(){
    tool.clearRect(0, 0, canvas.width, canvas.height);
    // Last removal
    if (undostack.length > 0) {
        redostack.push(undostack.pop());  // Move to redo stack
    }

    // Redraw everything in the undostack
    for (let i = 0; i < undostack.length; i++) {
        let { x, y, desc, tool: toolUsed } = undostack[i];  // Include tool information

        if (toolUsed === "eraser") {
            tool.strokeStyle = "white";
            tool.lineWidth = 10; // Adjust as needed
        } else {
            tool.strokeStyle = "black";
            tool.lineWidth = 2; // Default pencil width
        }

        if (desc == "md") {
            tool.beginPath();
            tool.moveTo(x, y);
        } else if (desc == "mn") {
            tool.lineTo(x, y);
            tool.stroke();
        }
    }
}

// redo function
function redoFN() {
    // Check if there are actions to redo
    if (redostack.length > 0) {
        // Move the last action from redostack back to undostack
        undostack.push(redostack.pop());

        // Clear the canvas
        tool.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the canvas from undostack
        for (let i = 0; i < undostack.length; i++) {
            let { x, y, desc, tool: toolUsed } = undostack[i];  // Include tool information

            // Set correct tool settings based on what was used (eraser or pencil)
            if (toolUsed === "eraser") {
                tool.strokeStyle = "white";
                tool.lineWidth = 10; // Eraser's width
            } else {
                tool.strokeStyle = "black";
                tool.lineWidth = 2; // Pencil's width
            }

            if (desc == "md") {
                tool.beginPath();
                tool.moveTo(x, y);
            } else if (desc == "mn") {
                tool.lineTo(x, y);
                tool.stroke();
            }
        }
    }
}

