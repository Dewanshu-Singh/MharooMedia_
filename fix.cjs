const fs = require('fs');
let content = fs.readFileSync('style.css', 'utf8');

let target = 
`.collab-bg-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: url('https://images.unsplash.com/photo-1599661559882-777271926b48?q=80&w=2000&auto=format&fit=crop');
  background-size: cover;
  background-position: center 20%;
  opacity: 0.15;
  filter: grayscale(100%) sepia(100%) hue-rotate(320deg) saturate(300%) contrast(150%);
  z-index: 1;
}`;

let replacement = 
`.collab-bg-overlay {
  display: none;
}`;
content = content.replace(target, replacement);

fs.writeFileSync('style.css', content);
