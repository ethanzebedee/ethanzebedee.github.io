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
      const link = document.createElement("a");
      link.href = file.path;
      link.download = name;
      link.className = "file-download-btn";
      link.textContent = `⬇️ Download ${name}`;
      link.click();
      fileViewer.innerHTML = `<div class="file-info"><h3>${name}</h3><p>File downloaded!</p></div>`;
    } else if (file.image) {
      const img = document.createElement("img");
      img.src = file.path;
      img.className = "file-image";
      img.alt = name;
      fileViewer.innerHTML = `<div class="file-info"><h3>${name}</h3></div>`;
      fileViewer.appendChild(img);
    } else if (file.content) {
      const content = document.createElement("div");
      content.className = "file-content";
      content.innerHTML = `<h3>${name}</h3><pre>${escapeHtml(file.content)}</pre>`;
      fileViewer.appendChild(content);
    } else {
      fileViewer.innerHTML = `<div class="file-info"><h3>${name}</h3><p>No preview available</p></div>`;
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
