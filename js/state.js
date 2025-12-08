// Shared application state and configuration

export const state = {
  windows: {},
  zIndexCounter: 100,
  activeWindow: null,
  // 'modern' or 'win95'
  theme: "modern",
  dayMode: false,
};

// Background options
export const backgrounds = {
  "gradient-blue": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
  "gradient-purple": "linear-gradient(135deg, #581c87 0%, #3b0764 100%)",
  "gradient-green": "linear-gradient(135deg, #065f46 0%, #064e3b 100%)",
  "gradient-orange": "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
  "gradient-pink": "linear-gradient(135deg, #db2777 0%, #9f1239 100%)",
  "solid-navy": "#1e3a8a",
  "solid-forest": "#14532d",
  "solid-midnight": "#1e1b4b",
};

export function changeBackground(bgType) {
  const desktop = document.querySelector(".desktop");
  const background = backgrounds[bgType];

  if (desktop && background) {
    desktop.style.background = background;
    localStorage.setItem("desktop-background", bgType);
  }
}
