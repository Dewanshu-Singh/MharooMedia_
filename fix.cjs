const fs = require('fs');
let content = fs.readFileSync('style.css', 'utf8');

let target = 
`.marquee-google-img {
  height: 1.15em !important;
  margin: 0 0.3em;
  vertical-align: middle;
  filter: none !important;
  opacity: 1 !important;
}`;

let replacement = 
`.marquee-google-img {
  height: 2.2em !important;
  margin: 0 0.3em;
  vertical-align: middle;
  filter: none !important;
  opacity: 1 !important;
}`;
content = content.replace(target, replacement);

fs.writeFileSync('style.css', content);
