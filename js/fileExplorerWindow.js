export function setupFileExplorerWindow(windowElement) {
  const fileTree = windowElement.querySelector(".file-tree");
  const fileViewer = windowElement.querySelector(".file-viewer");
  const pathBar = windowElement.querySelector(".file-path");

  // Simulated file system structure
  const fileSystem = {
    Documents: {
      "Ethan Hammond Resume.pdf": { type: "file", path: "files/Ethan Hammond Resume.pdf", download: true },
      "README.md": { type: "file", content: "# EthanOS Portfolio\n\nWelcome to my portfolio!" },
    },
    Images: {
      "profile.png": { type: "file", path: "files/profile.png", image: true },
    },
    Projects: {
      "FinalYearProject": {
        type: "folder",
        children: {
          "README.md": { type: "file", content: "# Final Year Project\n\nQuantum Classifiers implementation." },
        },
      },
    },
  };

  let currentPath = [];
  let currentData = fileSystem;

  // Navigate to path
  function navigateTo(path) {
    currentPath = path;
    let data = fileSystem;
    for (const segment of path) {
      if (data[segment] && data[segment].type === "folder") {
        data = data[segment].children;
      } else {
        return;
      }
    }
    currentData = data;
    render();
  }

  // Get current location data
  function getCurrentLocation() {
    let data = fileSystem;
    for (const segment of currentPath) {
      if (data[segment] && data[segment].type === "folder") {
        data = data[segment].children;
      }
    }
    return data;
  }

  // Render file tree
  function render() {
    const data = getCurrentLocation();
    fileTree.innerHTML = "";

    // Back button if not at root
    if (currentPath.length > 0) {
      const backBtn = document.createElement("div");
      backBtn.className = "file-item folder back";
      backBtn.innerHTML = '<span class="file-icon">⬆️</span><span class="file-name">..</span>';
      backBtn.addEventListener("click", () => {
        navigateTo(currentPath.slice(0, -1));
      });
      fileTree.appendChild(backBtn);
    }

    // Sort: folders first, then files
    const items = Object.entries(data).sort((a, b) => {
      if (a[1].type === "folder" && b[1].type !== "folder") return -1;
      if (a[1].type !== "folder" && b[1].type === "folder") return 1;
      return a[0].localeCompare(b[0]);
    });

    items.forEach(([name, item]) => {
      const fileItem = document.createElement("div");
      fileItem.className = `file-item ${item.type}`;
      const icon = item.type === "folder" ? "📁" : item.image ? "🖼️" : item.download ? "📄" : "📝";
      fileItem.innerHTML = `
        <span class="file-icon">${icon}</span>
        <span class="file-name">${name}</span>
      `;

      if (item.type === "folder") {
        fileItem.addEventListener("click", () => {
          navigateTo([...currentPath, name]);
        });
      } else {
        fileItem.addEventListener("click", () => {
          openFile(name, item);
        });
      }

      fileTree.appendChild(fileItem);
    });

    // Update path bar
    const pathParts = ["Home", ...currentPath];
    pathBar.textContent = pathParts.join(" / ");
  }

  // Open file
  function openFile(name, file) {
    fileViewer.innerHTML = "";

    if (file.download) {
      // Create download link
      const infoDiv = document.createElement("div");
      infoDiv.className = "file-info";
      infoDiv.innerHTML = `<h3>${name}</h3><p>Click the button below to download this file.</p>`;
      fileViewer.appendChild(infoDiv);
      
      const link = document.createElement("a");
      link.href = file.path;
      link.download = name;
      link.className = "file-download-btn";
      link.textContent = `⬇️ Download ${name}`;
      link.style.display = "inline-block";
      link.style.marginTop = "16px";
      fileViewer.appendChild(link);
    } else if (file.image) {
      const infoDiv = document.createElement("div");
      infoDiv.className = "file-info";
      infoDiv.innerHTML = `<h3>${name}</h3>`;
      fileViewer.appendChild(infoDiv);
      
      const img = document.createElement("img");
      img.src = file.path;
      img.className = "file-image";
      img.alt = name;
      fileViewer.appendChild(img);
    } else if (file.content) {
      const content = document.createElement("div");
      content.className = "file-content";
      content.innerHTML = `<h3>${name}</h3><pre>${escapeHtml(file.content)}</pre>`;
      fileViewer.appendChild(content);
    } else if (file.path) {
      // If file has a path but no specific type, try to open it
      const infoDiv = document.createElement("div");
      infoDiv.className = "file-info";
      infoDiv.innerHTML = `<h3>${name}</h3><p>Opening file...</p>`;
      fileViewer.appendChild(infoDiv);
      
      const link = document.createElement("a");
      link.href = file.path;
      link.target = "_blank";
      link.className = "file-download-btn";
      link.textContent = `🔗 Open ${name}`;
      link.style.display = "inline-block";
      link.style.marginTop = "16px";
      fileViewer.appendChild(link);
    } else {
      const infoDiv = document.createElement("div");
      infoDiv.className = "file-info";
      infoDiv.innerHTML = `<h3>${name}</h3><p>This file cannot be previewed in the browser.</p>`;
      fileViewer.appendChild(infoDiv);
    }
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Initial render
  render();
}
