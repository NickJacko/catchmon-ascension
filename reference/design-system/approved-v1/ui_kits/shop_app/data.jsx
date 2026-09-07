(function(){
const DS = window.CatchmonShopDesignSystem_709fd4;
const CATCH = '../../assets/catchmons/';

// Content-agnostic placeholders. The Visual Production System defines no product
// catalogue, so these are category-level stand-ins, not game content.
const PROVISIONS = [
  { id: 'p1', name: 'Provision I', price: 240, tier: 'standard' },
  { id: 'p2', name: 'Provision II', price: 320, tier: 'fine' },
  { id: 'p3', name: 'Care Item', price: 180, tier: 'standard' },
  { id: 'p4', name: 'Field Gear', price: 640, tier: 'fine' },
  { id: 'p5', name: 'Special Component', price: 1480, tier: 'masterwork', element: 'fire' },
  { id: 'p6', name: 'Routine Material', price: 40, tier: 'standard' },
];

const CATCHMONS = [
  { name: 'Terranox', element: 'earth', file: 'terranox.png', caption: 'Angular / heroic end' },
  { name: 'Zappiri', element: 'electric', file: 'zappiri.png', caption: 'Cute end of the band' },
  { name: 'Glacelyra', element: 'ice', file: 'glacelyra.png', caption: 'Elegant translucency' },
  { name: 'Flameron', element: 'fire', file: 'flameron.png', caption: 'Warm ember palette' },
  { name: 'Ripplee', element: 'water', file: 'ripplee.png', caption: 'Two-tone flat masses' },
  { name: 'Dracogold', element: 'dragon', file: 'dracogold.png', caption: 'Monumental silhouette' },
  { name: 'Myrelith', element: 'ghost', file: 'myrelith.png', caption: 'Mystical, not grimdark' },
  { name: 'Chronavelle', element: 'light', file: 'chronavelle.png', caption: 'Gold-on-cream accents' },
  { name: 'Cogmino', element: 'steel', file: 'cogmino.png', caption: 'Stylised metal ceiling' },
  { name: 'Luraville', element: 'fairy', file: 'luraville.png', caption: 'Light motes' },
  { name: 'Nuttiki', element: 'grass', file: 'nuttiki.png', caption: 'Oversized flora' },
  { name: 'Venuscale', element: 'poison', file: 'venuscale.png', caption: 'Fungi and vapour' },
  { name: 'Aquilor', element: 'water', file: 'aquilor.png', caption: 'Wave and coral forms' },
  { name: 'Obscidrahl', element: 'dark', file: 'obscidrahl.png', caption: 'Deep shadow mass' },
  { name: 'Voidalon', element: 'dark', file: 'voidalon.png', caption: 'Darkest legal point' },
  { name: 'Betarion-Prime', element: 'cosmic', file: 'betarion-prime.png', caption: 'Stars and voids' },
];

const STATIONS = [
  { id: 's1', name: 'Provision Station', glyph: 'flame', status: 'Ready', tone: 'success' },
  { id: 's2', name: 'Fieldworks Bench', glyph: 'hammer', status: '2h left', tone: 'warning' },
  { id: 's3', name: 'Resonance Table', glyph: 'sparkles', status: 'Idle', tone: 'neutral' },
];

// Standalone exports override this with blob URLs via window.__catchmonArt.
const artUrl = (file) => (window.__catchmonArt && window.__catchmonArt[file]) || CATCH + file;

Object.assign(window, { DS, CATCH, artUrl, PROVISIONS, CATCHMONS, STATIONS });

})();
