/* @ds-bundle: {"format":4,"namespace":"CatchmonShopDesignSystem_709fd4","components":[{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Panel","sourcePath":"components/core/Panel.jsx"},{"name":"StatusPill","sourcePath":"components/core/StatusPill.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"CatchmonCard","sourcePath":"components/shop/CatchmonCard.jsx"},{"name":"CurrencyChip","sourcePath":"components/shop/CurrencyChip.jsx"},{"name":"ELEMENTS","sourcePath":"components/shop/ElementBadge.jsx"},{"name":"ElementBadge","sourcePath":"components/shop/ElementBadge.jsx"},{"name":"ProductCard","sourcePath":"components/shop/ProductCard.jsx"},{"name":"Slot","sourcePath":"components/shop/Slot.jsx"}],"sourceHashes":{"components/core/Button.jsx":"8a934734407f","components/core/Icon.jsx":"865f03a6c0d7","components/core/Panel.jsx":"ce98b740871d","components/core/StatusPill.jsx":"27d0b9028fed","components/core/Tabs.jsx":"defea9d9b4ae","components/shop/CatchmonCard.jsx":"a25f0bdb8f02","components/shop/CurrencyChip.jsx":"10b0eff3f44f","components/shop/ElementBadge.jsx":"6324a1c081b7","components/shop/ProductCard.jsx":"daf4ca46db43","components/shop/Slot.jsx":"711f5ea3e5c1","ui_kits/shop_app/AppShell.jsx":"858bbdae3080","ui_kits/shop_app/CollectionScreen.jsx":"0c164e7745d1","ui_kits/shop_app/ProductSheet.jsx":"391d1a165664","ui_kits/shop_app/ShopFloorScreen.jsx":"ad3651726fd5","ui_kits/shop_app/WorkshopScreen.jsx":"26f16e1cb0a3","ui_kits/shop_app/data.jsx":"4fffa2b7e9d7"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CatchmonShopDesignSystem_709fd4 = window.CatchmonShopDesignSystem_709fd4 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    minHeight: 'var(--touch-min)',
    padding: '0 16px',
    fontSize: 'var(--text-body-sm)',
    radius: 'var(--radius-s)'
  },
  md: {
    minHeight: 'var(--touch-comfortable)',
    padding: '0 20px',
    fontSize: 'var(--text-body-md)',
    radius: 'var(--radius-m)'
  },
  lg: {
    minHeight: '58px',
    padding: '0 26px',
    fontSize: 'var(--text-body-lg)',
    radius: 'var(--radius-l)'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  onClick,
  children,
  style,
  ...rest
}) {
  const [held, setHeld] = React.useState(false);
  const s = SIZES[size] || SIZES.md;
  const skins = {
    primary: {
      background: 'var(--action-primary)',
      color: 'var(--text-on-primary)',
      border: '1px solid var(--action-primary-press)',
      boxShadow: held ? 'var(--depth-button-press)' : 'var(--depth-button)'
    },
    secondary: {
      background: 'var(--action-secondary)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-default)',
      boxShadow: held ? 'none' : 'var(--shadow-small)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-link)',
      border: '1px solid transparent',
      boxShadow: 'none'
    },
    destructive: {
      background: 'var(--action-destructive)',
      color: 'var(--text-on-primary)',
      border: '1px solid var(--action-destructive-press)',
      boxShadow: held ? 'var(--depth-button-press)' : '0 3px 0 var(--action-destructive-press)'
    }
  };
  const skin = skins[variant] || skins.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    onClick: onClick,
    onPointerDown: () => setHeld(true),
    onPointerUp: () => setHeld(false),
    onPointerLeave: () => setHeld(false),
    style: {
      display: fullWidth ? 'flex' : 'inline-flex',
      width: fullWidth ? '100%' : 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-2)',
      minHeight: s.minHeight,
      padding: s.padding,
      borderRadius: s.radius,
      font: 'var(--type-body-strong)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: s.fontSize,
      letterSpacing: '0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'var(--transition-press),var(--transition-surface)',
      transform: held && !disabled ? 'translateY(var(--press-offset))' : 'none',
      ...skin,
      ...(disabled ? {
        background: variant === 'ghost' ? 'transparent' : 'var(--action-disabled)',
        color: 'var(--cs-disabled)',
        border: '1px solid transparent',
        boxShadow: 'none'
      } : null),
      ...style
    }
  }, rest), iconLeft, /*#__PURE__*/React.createElement("span", null, children), iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// TEMPORARY ICON SET — Lucide stands in until Catchmon Shop icon masters are produced.
// Lucide is NOT the final Catchmon Shop icon art language. Custom SVG masters drop into
// assets/icons/ under the same glyph names; no consuming component changes.
// Icon masters live in the project's assets/icons/ folder. Pages can override the
// base path with window.CATCHMON_ICON_BASE; the CDN default keeps standalone pages working.
const ICON_BASE = () => typeof window !== 'undefined' && window.CATCHMON_ICON_BASE || 'https://unpkg.com/lucide-static@0.441.0/icons/';
const CACHE = {};
function iconUrl(name) {
  // Standalone exports map glyph names to inlined blob URLs.
  const map = typeof window !== 'undefined' && window.CATCHMON_ICON_URLS;
  return map && map[name] || ICON_BASE() + name + '.svg';
}
function useGlyph(name) {
  const url = iconUrl(name);
  const [markup, setMarkup] = React.useState(CACHE[url] || null);
  React.useEffect(() => {
    if (CACHE[url]) {
      setMarkup(CACHE[url]);
      return;
    }
    let live = true;
    fetch(url).then(r => r.ok ? r.text() : '').then(t => {
      const cleaned = t.replace(/<!--[\s\S]*?-->/g, '').replace(/\swidth="[^"]*"/, '').replace(/\sheight="[^"]*"/, '');
      CACHE[url] = cleaned;
      if (live) setMarkup(cleaned);
    }).catch(() => {});
    return () => {
      live = false;
    };
  }, [url]);
  return markup;
}
function Icon({
  name,
  size = 24,
  color = 'currentColor',
  label,
  style,
  ...rest
}) {
  const markup = useGlyph(name);
  return /*#__PURE__*/React.createElement("span", _extends({
    role: label ? 'img' : 'presentation',
    "aria-label": label,
    "aria-hidden": label ? undefined : true,
    dangerouslySetInnerHTML: markup ? {
      __html: markup
    } : undefined,
    style: {
      display: 'inline-flex',
      flex: '0 0 auto',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      color,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Panel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  cream: {
    background: 'var(--surface-panel)',
    border: '1px solid var(--border-hairline)'
  },
  card: {
    background: 'var(--surface-card)',
    border: '1px solid var(--border-hairline)'
  },
  sand: {
    background: 'var(--cs-sand-200)',
    border: '1px solid var(--border-default)'
  }
};
function Panel({
  title,
  subtitle,
  action,
  tone = 'cream',
  padding,
  children,
  style,
  ...rest
}) {
  const skin = TONES[tone] || TONES.cream;
  return /*#__PURE__*/React.createElement("section", _extends({
    style: {
      borderRadius: 'var(--radius-panel)',
      padding: padding || 'var(--pad-panel)',
      boxShadow: 'var(--shadow-card),var(--inset-panel)',
      ...skin,
      ...style
    }
  }, rest), (title || action) && /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 'var(--space-3)',
      marginBottom: 'var(--stack-default)'
    }
  }, /*#__PURE__*/React.createElement("div", null, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: 'var(--type-section)',
      color: 'var(--text-body)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      font: 'var(--type-body)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, subtitle)), action), children);
}
Object.assign(__ds_scope, { Panel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Panel.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TONES = {
  success: {
    fg: '#2C5E38',
    bg: 'rgba(101,185,122,.22)',
    bd: 'rgba(101,185,122,.55)',
    icon: 'check'
  },
  warning: {
    fg: '#8A5E13',
    bg: 'rgba(230,169,76,.22)',
    bd: 'rgba(230,169,76,.6)',
    icon: 'clock'
  },
  error: {
    fg: '#8E3E3D',
    bg: 'rgba(217,104,104,.2)',
    bd: 'rgba(217,104,104,.55)',
    icon: 'triangle-alert'
  },
  info: {
    fg: '#2F5F7C',
    bg: 'rgba(103,169,216,.2)',
    bd: 'rgba(103,169,216,.55)',
    icon: 'info'
  },
  premium: {
    fg: 'var(--text-premium)',
    bg: 'rgba(230,185,88,.24)',
    bd: 'var(--border-premium)',
    icon: 'sparkles'
  },
  neutral: {
    fg: 'var(--text-muted)',
    bg: 'rgba(123,87,61,.1)',
    bd: 'var(--border-hairline)',
    icon: null
  }
};
function StatusPill({
  tone = 'neutral',
  icon,
  children,
  style,
  ...rest
}) {
  const t = TONES[tone] || TONES.neutral;
  const glyph = icon === null ? null : icon || t.icon;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      border: `1px solid ${t.bd}`,
      color: t.fg,
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), glyph && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: 12
  }), children);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Tabs({
  items = [],
  value,
  onChange,
  style,
  ...rest
}) {
  const active = value ?? items[0]?.id;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "tablist",
    style: {
      display: 'flex',
      gap: '4px',
      padding: '4px',
      background: 'var(--cs-sand-200)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-l)',
      boxShadow: 'var(--inset-slot)',
      ...style
    }
  }, rest), items.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(it.id),
      style: {
        flex: 1,
        minHeight: '40px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '0 12px',
        border: on ? '1px solid var(--border-default)' : '1px solid transparent',
        borderRadius: 'var(--radius-m)',
        background: on ? 'var(--surface-card)' : 'transparent',
        boxShadow: on ? 'var(--shadow-small)' : 'none',
        color: on ? 'var(--text-body)' : 'var(--text-muted)',
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--text-body-sm)',
        fontWeight: on ? 700 : 600,
        cursor: 'pointer',
        transition: 'var(--transition-surface)'
      }
    }, it.icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 16
    }), it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-numeric)',
        fontSize: 'var(--text-micro)',
        color: 'var(--text-subtle)'
      }
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/shop/CurrencyChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const KINDS = {
  coin: {
    glyph: 'coins',
    color: 'var(--cs-soft-gold)'
  },
  momentum: {
    glyph: 'wind',
    color: 'var(--el-wind-1)'
  },
  material: {
    glyph: 'package',
    color: 'var(--cs-walnut-600)'
  }
};
function CurrencyChip({
  kind = 'coin',
  amount,
  delta,
  size = 'md',
  style,
  ...rest
}) {
  const k = KINDS[kind] || KINDS.coin;
  const pad = size === 'sm' ? '4px 8px' : '6px 12px';
  const glyphSize = size === 'sm' ? 14 : 18;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: pad,
      background: 'var(--surface-panel)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-pill)',
      boxShadow: 'var(--shadow-small)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: k.glyph,
    size: glyphSize,
    color: k.color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-numeric)',
      fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body-md)',
      color: 'var(--text-body)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, typeof amount === 'number' ? amount.toLocaleString('en-US') : amount), delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      color: String(delta).startsWith('-') ? 'var(--action-destructive)' : 'var(--cs-success)'
    }
  }, delta));
}
Object.assign(__ds_scope, { CurrencyChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shop/CurrencyChip.jsx", error: String((e && e.message) || e) }); }

// components/shop/ElementBadge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ELEMENTS = ['fire', 'water', 'electric', 'grass', 'earth', 'poison', 'normal', 'ice', 'fairy', 'wind', 'steel', 'psychic', 'light', 'dark', 'ghost', 'dragon', 'cosmic'];
const GLYPHS = {
  fire: 'flame',
  water: 'droplet',
  electric: 'zap',
  grass: 'leaf',
  earth: 'mountain',
  poison: 'flask-conical',
  normal: 'circle',
  ice: 'snowflake',
  fairy: 'sparkle',
  wind: 'wind',
  steel: 'shield',
  psychic: 'eye',
  light: 'sun',
  dark: 'moon',
  ghost: 'ghost',
  dragon: 'gem',
  cosmic: 'orbit'
};
function ElementBadge({
  element = 'normal',
  size = 'md',
  showLabel = false,
  style,
  ...rest
}) {
  const box = size === 'sm' ? 22 : size === 'lg' ? 34 : 28;
  const glyph = GLYPHS[element] || 'circle';
  return /*#__PURE__*/React.createElement("span", _extends({
    "data-element": element,
    title: element,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: box,
      height: box,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-card)',
      border: '1.5px solid var(--el-1)',
      boxShadow: 'var(--shadow-small)',
      flex: '0 0 auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: glyph,
    size: Math.round(box * 0.56),
    color: "var(--el-1)"
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--el-1)'
    }
  }, element));
}
Object.assign(__ds_scope, { ELEMENTS, ElementBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shop/ElementBadge.jsx", error: String((e && e.message) || e) }); }

// components/shop/CatchmonCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function CatchmonCard({
  name,
  art,
  element = 'normal',
  caption,
  discovered = true,
  glow = false,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    "data-element": element,
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-1)',
      padding: 'var(--pad-card)',
      width: '100%',
      textAlign: 'center',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-hairline)',
      borderRadius: 'var(--radius-card)',
      boxShadow: glow ? 'var(--shadow-card),var(--glow-ring-selection)' : 'var(--shadow-card)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'var(--transition-press),var(--transition-surface)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 10,
      left: 10
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.ElementBadge, {
    element: element,
    size: "sm"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      aspectRatio: '1 / 1',
      display: 'grid',
      placeItems: 'center',
      borderRadius: 'var(--radius-m)',
      background: `radial-gradient(120% 90% at 50% 82%, var(--el-glow) 0%, rgba(255,248,235,0) 62%)`
    }
  }, art ? /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      width: '92%',
      height: '92%',
      objectFit: 'contain',
      filter: discovered ? 'drop-shadow(0 8px 10px rgba(94,64,41,.22))' : 'brightness(0) opacity(.28)'
    }
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-card-title)',
      color: 'var(--text-body)'
    }
  }, discovered ? name : '???'), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--text-body-sm)',
      color: 'var(--text-muted)'
    }
  }, caption));
}
Object.assign(__ds_scope, { CatchmonCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shop/CatchmonCard.jsx", error: String((e && e.message) || e) }); }

// components/shop/ProductCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TIERS = {
  standard: {
    border: 'var(--border-hairline)',
    ring: 'none',
    label: null
  },
  fine: {
    border: 'var(--border-default)',
    ring: 'inset 0 0 0 1px rgba(231,184,90,.5)',
    label: 'Fine'
  },
  masterwork: {
    border: 'var(--border-premium)',
    ring: 'var(--glow-ring-masterwork)',
    label: 'Masterwork'
  }
};
function ProductCard({
  name,
  art,
  price,
  currencyGlyph = 'coins',
  tier = 'standard',
  element,
  status,
  count,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  const t = TIERS[tier] || TIERS.standard;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    "data-element": element,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      width: '100%',
      padding: 'var(--pad-card)',
      textAlign: 'left',
      background: 'var(--surface-card)',
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-card)',
      boxShadow: selected ? `var(--shadow-card),var(--glow-ring-selection)` : tier === 'masterwork' ? `var(--shadow-card),${t.ring}` : 'var(--shadow-card)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'var(--transition-press),var(--transition-surface)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      alignSelf: 'center',
      width: '100%',
      aspectRatio: '1 / 1',
      display: 'grid',
      placeItems: 'center'
    }
  }, art ? /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 6px 8px rgba(94,64,41,.22))'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '76%',
      height: '76%',
      borderRadius: 'var(--radius-m)',
      background: 'var(--surface-slot)',
      boxShadow: 'var(--inset-slot)'
    }
  }), count != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      padding: '2px 8px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-panel)',
      border: '1px solid var(--border-hairline)',
      font: 'var(--type-numeric)',
      fontSize: 'var(--text-micro)',
      color: 'var(--text-muted)'
    }
  }, "\xD7", count)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-card-title)',
      fontSize: 'var(--text-body-md)',
      color: 'var(--text-body)'
    }
  }, name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-2)'
    }
  }, price != null && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      font: 'var(--type-numeric)',
      color: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: currencyGlyph,
    size: 14,
    color: "var(--cs-soft-gold)"
  }), price), status || t.label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      letterSpacing: 'var(--tracking-label)',
      textTransform: 'uppercase',
      color: 'var(--text-premium)'
    }
  }, t.label)));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shop/ProductCard.jsx", error: String((e && e.message) || e) }); }

// components/shop/Slot.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Slot({
  art,
  label,
  size = 72,
  locked = false,
  empty,
  tier = 'standard',
  selected = false,
  onClick,
  style,
  ...rest
}) {
  const isEmpty = empty != null ? empty : !art;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: locked ? undefined : onClick,
    "aria-label": label,
    style: {
      position: 'relative',
      width: size,
      height: size,
      display: 'grid',
      placeItems: 'center',
      padding: '6px',
      background: locked ? 'var(--cs-sand-300)' : 'var(--surface-slot)',
      border: `1px solid ${selected ? 'var(--border-premium)' : tier === 'masterwork' ? 'var(--border-premium)' : 'var(--border-hairline)'}`,
      borderRadius: 'var(--radius-slot)',
      boxShadow: selected ? 'var(--inset-slot),var(--glow-ring-selection)' : 'var(--inset-slot)',
      cursor: locked ? 'not-allowed' : onClick ? 'pointer' : 'default',
      transition: 'var(--transition-surface)',
      ...style
    }
  }, rest), locked ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "lock",
    size: Math.round(size * 0.28),
    color: "var(--cs-walnut-600)"
  }) : isEmpty ? /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: Math.round(size * 0.26),
    color: "rgba(123,87,61,.45)"
  }) : /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      filter: 'drop-shadow(0 4px 5px rgba(94,64,41,.24))'
    }
  }), !isEmpty && !locked && tier === 'masterwork' && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-slot)',
      boxShadow: 'var(--glow-ring-masterwork)',
      pointerEvents: 'none'
    }
  }));
}
Object.assign(__ds_scope, { Slot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/shop/Slot.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop_app/AppShell.jsx
try { (() => {
(function () {
  const {
    Icon,
    CurrencyChip,
    StatusPill
  } = window.CatchmonShopDesignSystem_709fd4;
  function TopBar({
    title,
    coins,
    momentum,
    onBack
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        padding: '14px var(--gutter-screen) 12px',
        background: 'var(--surface-panel)',
        borderBottom: '1px solid var(--border-hairline)',
        boxShadow: 'var(--shadow-small)',
        position: 'sticky',
        top: 0,
        zIndex: 4
      }
    }, onBack && /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      "aria-label": "Back",
      style: {
        width: 36,
        height: 36,
        display: 'grid',
        placeItems: 'center',
        marginLeft: -6,
        background: 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-s)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-left",
      size: 22,
      color: "var(--cs-walnut-700)"
    })), /*#__PURE__*/React.createElement("h1", {
      style: {
        margin: 0,
        flex: 1,
        font: 'var(--type-section)',
        color: 'var(--text-body)'
      }
    }, title), /*#__PURE__*/React.createElement(CurrencyChip, {
      kind: "momentum",
      amount: momentum,
      size: "sm"
    }), /*#__PURE__*/React.createElement(CurrencyChip, {
      kind: "coin",
      amount: coins,
      size: "sm"
    }));
  }
  function TabBar({
    value,
    onChange
  }) {
    const items = [{
      id: 'shop',
      label: 'Shop',
      icon: 'store'
    }, {
      id: 'workshop',
      label: 'Workshop',
      icon: 'hammer'
    }, {
      id: 'collection',
      label: 'Catchmons',
      icon: 'sparkles'
    }];
    return /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        gap: 4,
        padding: '8px var(--space-2) 10px',
        background: 'var(--surface-panel)',
        borderTop: '1px solid var(--border-hairline)',
        boxShadow: '0 -2px 6px rgba(94,64,41,.08)'
      }
    }, items.map(it => {
      const on = it.id === value;
      return /*#__PURE__*/React.createElement("button", {
        key: it.id,
        onClick: () => onChange(it.id),
        style: {
          flex: 1,
          minHeight: 'var(--touch-min)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          background: on ? 'var(--surface-card)' : 'transparent',
          border: on ? '1px solid var(--border-hairline)' : '1px solid transparent',
          borderRadius: 'var(--radius-m)',
          cursor: 'pointer',
          boxShadow: on ? 'var(--shadow-small)' : 'none',
          transition: 'var(--transition-surface)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: it.icon,
        size: 20,
        color: on ? 'var(--cs-walnut-700)' : 'var(--cs-ink-300)'
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-micro)',
          fontWeight: on ? 700 : 600,
          color: on ? 'var(--text-body)' : 'var(--text-subtle)'
        }
      }, it.label));
    }));
  }
  function ArtPlaceholder({
    height = 150,
    note
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height,
        borderRadius: 'var(--radius-card)',
        background: 'var(--surface-slot)',
        boxShadow: 'var(--inset-slot)',
        border: '1px dashed var(--border-default)',
        display: 'grid',
        placeItems: 'center',
        textAlign: 'center',
        padding: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Icon, {
      name: "image",
      size: 22,
      color: "rgba(123,87,61,.5)"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        font: 'var(--type-body)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--text-muted)',
        maxWidth: 260
      }
    }, note)));
  }
  function SectionHead({
    title,
    action
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '0 0 var(--stack-default)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        font: 'var(--type-card-title)',
        color: 'var(--text-body)'
      }
    }, title), action);
  }
  Object.assign(window, {
    TopBar,
    TabBar,
    ArtPlaceholder,
    SectionHead
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop_app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop_app/CollectionScreen.jsx
try { (() => {
(function () {
  const {
    CatchmonCard,
    ElementBadge,
    Tabs,
    Button,
    Panel,
    StatusPill,
    Icon
  } = window.CatchmonShopDesignSystem_709fd4;
  function CollectionScreen({
    onSelect
  }) {
    const [tab, setTab] = React.useState('all');
    const all = window.CATCHMONS;
    const list = tab === 'all' ? all : all.filter(c => ['fire', 'ice', 'water', 'electric'].includes(c.element));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--stack-loose)',
        padding: 'var(--space-4) var(--gutter-screen) var(--space-8)'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'All',
        icon: 'sparkles',
        count: all.length
      }, {
        id: 'elemental',
        label: 'Elemental',
        icon: 'flame'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--gap-grid)'
      }
    }, list.map((c, i) => /*#__PURE__*/React.createElement(CatchmonCard, {
      key: c.name,
      name: c.name,
      element: c.element,
      art: window.artUrl(c.file),
      caption: c.caption,
      glow: i === 1,
      discovered: c.name !== 'Voidalon',
      onClick: () => onSelect(c)
    }))));
  }
  function CatchmonDetail({
    catchmon,
    onClose
  }) {
    const c = catchmon;
    return /*#__PURE__*/React.createElement("div", {
      "data-element": c.element,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--stack-loose)',
        padding: 'var(--space-4) var(--gutter-screen) var(--space-8)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 'var(--radius-panel)',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--pad-panel)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '1 / 1',
        display: 'grid',
        placeItems: 'center',
        borderRadius: 'var(--radius-l)',
        background: 'radial-gradient(120% 90% at 50% 84%, var(--el-glow) 0%, rgba(255,248,235,0) 64%)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: window.artUrl(c.file),
      alt: "",
      style: {
        width: '94%',
        filter: 'drop-shadow(0 12px 14px rgba(94,64,41,.24))'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        marginTop: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        font: 'var(--type-screen-title)',
        fontSize: 'var(--text-title)',
        color: 'var(--text-body)'
      }
    }, c.name), /*#__PURE__*/React.createElement(ElementBadge, {
      element: c.element,
      size: "sm",
      showLabel: true
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '6px 0 0',
        font: 'var(--type-body)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--text-muted)'
      }
    }, c.caption)), /*#__PURE__*/React.createElement(Panel, {
      tone: "sand",
      title: "Care"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
        marginBottom: 'var(--stack-default)'
      }
    }, /*#__PURE__*/React.createElement(StatusPill, {
      tone: "success"
    }, "Rested"), /*#__PURE__*/React.createElement(StatusPill, {
      tone: "info",
      icon: "heart"
    }, "Content"), /*#__PURE__*/React.createElement(StatusPill, {
      tone: "neutral",
      icon: null
    }, "Standard habitat")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "hand-heart",
        size: 18
      })
    }, "Tend"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: onClose
    }, "Back to collection"))));
  }
  Object.assign(window, {
    CollectionScreen,
    CatchmonDetail
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop_app/CollectionScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop_app/ProductSheet.jsx
try { (() => {
(function () {
  const {
    Button,
    StatusPill,
    ElementBadge,
    CurrencyChip,
    Icon
  } = window.CatchmonShopDesignSystem_709fd4;
  function ProductSheet({
    product,
    onClose,
    onBuy
  }) {
    if (!product) return null;
    const tierWord = product.tier === 'masterwork' ? 'Masterwork' : product.tier === 'fine' ? 'Fine' : 'Standard';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: onClose,
      style: {
        position: 'absolute',
        inset: 0,
        background: 'var(--surface-scrim)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      "data-element": product.element,
      style: {
        position: 'relative',
        background: 'var(--surface-panel)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        boxShadow: 'var(--shadow-modal)',
        padding: 'var(--pad-panel)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--stack-default)',
        animation: 'cs-sheet var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 4,
        borderRadius: 999,
        background: 'var(--border-default)',
        alignSelf: 'center'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 132,
        borderRadius: 'var(--radius-card)',
        background: 'var(--surface-slot)',
        boxShadow: 'var(--inset-slot)',
        border: '1px dashed var(--border-default)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "package",
      size: 26,
      color: "rgba(123,87,61,.5)"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '4px 0 0',
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, "Placeholder \xB7 Golden Sample Wave 1"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: 0,
        flex: 1,
        font: 'var(--type-section)',
        color: 'var(--text-body)'
      }
    }, product.name), product.element && /*#__PURE__*/React.createElement(ElementBadge, {
      element: product.element,
      size: "sm"
    }), /*#__PURE__*/React.createElement(StatusPill, {
      tone: product.tier === 'standard' ? 'neutral' : 'premium',
      icon: product.tier === 'standard' ? null : undefined
    }, tierWord)), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        font: 'var(--type-body)',
        color: 'var(--text-muted)'
      }
    }, "Quality is an overlay on the same base artwork \u2014 material finish, a light edge and a controlled glow. The product itself never gets repainted."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--text-subtle)'
      }
    }, "Price"), /*#__PURE__*/React.createElement(CurrencyChip, {
      kind: "coin",
      amount: product.price
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      size: "lg",
      onClick: () => onBuy(product)
    }, "Buy for ", product.price), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "lg",
      onClick: onClose
    }, "Not now"))));
  }
  Object.assign(window, {
    ProductSheet
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop_app/ProductSheet.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop_app/ShopFloorScreen.jsx
try { (() => {
(function () {
  const {
    Panel,
    Button,
    StatusPill,
    ProductCard,
    Tabs,
    Icon
  } = window.CatchmonShopDesignSystem_709fd4;
  function ShopFloorScreen({
    onSelectProduct
  }) {
    const [filter, setFilter] = React.useState('shelf');
    const list = filter === 'shelf' ? window.PROVISIONS : window.PROVISIONS.filter(p => p.tier !== 'standard');
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--stack-loose)',
        padding: 'var(--space-4) var(--gutter-screen) var(--space-8)'
      }
    }, /*#__PURE__*/React.createElement(window.ArtPlaceholder, {
      height: 160,
      note: "PLACEHOLDER \xB7 Shop Key Environment \u2014 Golden Sample Wave 1. Foreground floor stays clear for UI."
    }), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(window.SectionHead, {
      title: "Stations",
      action: /*#__PURE__*/React.createElement(Button, {
        variant: "ghost",
        size: "sm",
        iconRight: /*#__PURE__*/React.createElement(Icon, {
          name: "chevron-right",
          size: 16
        })
      }, "All")
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--gap-grid)'
      }
    }, window.STATIONS.map(s => /*#__PURE__*/React.createElement("div", {
      key: s.id,
      style: {
        flex: 1,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-card)',
        boxShadow: 'var(--shadow-card)',
        padding: 'var(--space-3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 'var(--radius-m)',
        background: 'var(--surface-slot)',
        boxShadow: 'var(--inset-slot)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.glyph,
      size: 20,
      color: "var(--cs-walnut-700)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        color: 'var(--text-body)',
        lineHeight: 1.25
      }
    }, s.name), /*#__PURE__*/React.createElement(StatusPill, {
      tone: s.tone
    }, s.status))))), /*#__PURE__*/React.createElement("section", null, /*#__PURE__*/React.createElement(window.SectionHead, {
      title: "On the shelf"
    }), /*#__PURE__*/React.createElement(Tabs, {
      value: filter,
      onChange: setFilter,
      style: {
        marginBottom: 'var(--stack-default)'
      },
      items: [{
        id: 'shelf',
        label: 'Everything',
        count: window.PROVISIONS.length
      }, {
        id: 'premium',
        label: 'Fine & above'
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--gap-grid)'
      }
    }, list.map(p => /*#__PURE__*/React.createElement(ProductCard, {
      key: p.id,
      name: p.name,
      price: p.price,
      tier: p.tier,
      element: p.element,
      onClick: () => onSelectProduct(p)
    }))), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 'var(--space-3) 0 0',
        font: 'var(--type-body)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--text-subtle)'
      }
    }, "PLACEHOLDER \xB7 Products \u2014 Golden Sample Wave 1 (Standard Product) and Wave 2 (Premium Product, Special Component). Tiles show the recessed empty state; names are category-level placeholders, not game content.")), /*#__PURE__*/React.createElement(Panel, {
      tone: "card",
      title: "Today",
      subtitle: "Two customers waiting, one route open"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true
    }, "Open the doors"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "map",
        size: 18
      })
    }, "Routes"))));
  }
  Object.assign(window, {
    ShopFloorScreen
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop_app/ShopFloorScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop_app/WorkshopScreen.jsx
try { (() => {
(function () {
  const {
    Panel,
    Button,
    Slot,
    StatusPill,
    Icon,
    CurrencyChip
  } = window.CatchmonShopDesignSystem_709fd4;
  function WorkshopScreen() {
    const [inputs, setInputs] = React.useState([null, null, null]);
    const [state, setState] = React.useState('idle'); // idle | working | done
    const filled = inputs.filter(Boolean).length;
    const fill = i => setInputs(prev => prev.map((v, n) => n === i ? v ? null : window.artUrl('nuttiki.png') : v));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--stack-loose)',
        padding: 'var(--space-4) var(--gutter-screen) var(--space-8)'
      }
    }, /*#__PURE__*/React.createElement(window.ArtPlaceholder, {
      height: 140,
      note: "PLACEHOLDER \xB7 Provision Station \u2014 Golden Sample Wave 1. Idle / active states authored per file, shared origin and footprint."
    }), /*#__PURE__*/React.createElement(Panel, {
      tone: "card",
      title: "Provision Station",
      subtitle: state === 'done' ? 'Batch complete' : state === 'working' ? 'Working — 1h 58m' : 'Add up to three inputs',
      action: /*#__PURE__*/React.createElement(StatusPill, {
        tone: state === 'done' ? 'success' : state === 'working' ? 'warning' : 'neutral',
        icon: state === 'working' ? 'hourglass' : undefined
      }, state === 'done' ? 'Ready' : state === 'working' ? '1h 58m' : 'Idle')
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        justifyContent: 'center',
        marginBottom: 'var(--stack-loose)'
      }
    }, inputs.map((art, i) => /*#__PURE__*/React.createElement(Slot, {
      key: i,
      art: art || undefined,
      size: 72,
      label: `Input ${i + 1}`,
      selected: state === 'done' && i === 1,
      tier: state === 'done' && i === 1 ? 'masterwork' : 'standard',
      onClick: state === 'idle' ? () => fill(i) : undefined
    })), /*#__PURE__*/React.createElement(Slot, {
      locked: true,
      size: 72,
      label: "Locked input"
    })), state === 'idle' && /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      disabled: filled === 0,
      onClick: () => setState('working')
    }, filled === 0 ? 'Add an input' : `Start batch · ${filled} input${filled > 1 ? 's' : ''}`), state === 'working' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 10,
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-slot)',
        boxShadow: 'var(--inset-slot)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '38%',
        height: '100%',
        background: 'var(--cs-walnut-700)',
        borderRadius: 'var(--radius-pill)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-2)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      fullWidth: true,
      onClick: () => setState('done')
    }, "Finish now"), /*#__PURE__*/React.createElement(Button, {
      variant: "destructive",
      onClick: () => {
        setState('idle');
        setInputs([null, null, null]);
      }
    }, "Cancel"))), state === 'done' && /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      fullWidth: true,
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "sparkles",
        size: 18
      }),
      onClick: () => {
        setState('idle');
        setInputs([null, null, null]);
      }
    }, "Collect batch")), /*#__PURE__*/React.createElement(Panel, {
      tone: "sand",
      title: "Materials on hand"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        gap: 'var(--space-2)'
      }
    }, ['nuttiki', 'ripplee', 'cogmino', 'flameron', 'glacelyra'].map(n => /*#__PURE__*/React.createElement(Slot, {
      key: n,
      art: window.artUrl(n + '.png'),
      size: 56,
      label: n
    })), [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Slot, {
      key: 'e' + i,
      empty: true,
      size: 56
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'var(--stack-default)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        fontSize: 'var(--text-body-sm)',
        color: 'var(--text-muted)'
      }
    }, "PLACEHOLDER \xB7 Routine materials \u2014 Golden Sample Wave 2. Creature artwork stands in."), /*#__PURE__*/React.createElement(CurrencyChip, {
      kind: "material",
      amount: 5,
      size: "sm"
    }))));
  }
  Object.assign(window, {
    WorkshopScreen
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop_app/WorkshopScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/shop_app/data.jsx
try { (() => {
(function () {
  const DS = window.CatchmonShopDesignSystem_709fd4;
  const CATCH = '../../assets/catchmons/';

  // Content-agnostic placeholders. The Visual Production System defines no product
  // catalogue, so these are category-level stand-ins, not game content.
  const PROVISIONS = [{
    id: 'p1',
    name: 'Provision I',
    price: 240,
    tier: 'standard'
  }, {
    id: 'p2',
    name: 'Provision II',
    price: 320,
    tier: 'fine'
  }, {
    id: 'p3',
    name: 'Care Item',
    price: 180,
    tier: 'standard'
  }, {
    id: 'p4',
    name: 'Field Gear',
    price: 640,
    tier: 'fine'
  }, {
    id: 'p5',
    name: 'Special Component',
    price: 1480,
    tier: 'masterwork',
    element: 'fire'
  }, {
    id: 'p6',
    name: 'Routine Material',
    price: 40,
    tier: 'standard'
  }];
  const CATCHMONS = [{
    name: 'Terranox',
    element: 'earth',
    file: 'terranox.png',
    caption: 'Angular / heroic end'
  }, {
    name: 'Zappiri',
    element: 'electric',
    file: 'zappiri.png',
    caption: 'Cute end of the band'
  }, {
    name: 'Glacelyra',
    element: 'ice',
    file: 'glacelyra.png',
    caption: 'Elegant translucency'
  }, {
    name: 'Flameron',
    element: 'fire',
    file: 'flameron.png',
    caption: 'Warm ember palette'
  }, {
    name: 'Ripplee',
    element: 'water',
    file: 'ripplee.png',
    caption: 'Two-tone flat masses'
  }, {
    name: 'Dracogold',
    element: 'dragon',
    file: 'dracogold.png',
    caption: 'Monumental silhouette'
  }, {
    name: 'Myrelith',
    element: 'ghost',
    file: 'myrelith.png',
    caption: 'Mystical, not grimdark'
  }, {
    name: 'Chronavelle',
    element: 'light',
    file: 'chronavelle.png',
    caption: 'Gold-on-cream accents'
  }, {
    name: 'Cogmino',
    element: 'steel',
    file: 'cogmino.png',
    caption: 'Stylised metal ceiling'
  }, {
    name: 'Luraville',
    element: 'fairy',
    file: 'luraville.png',
    caption: 'Light motes'
  }, {
    name: 'Nuttiki',
    element: 'grass',
    file: 'nuttiki.png',
    caption: 'Oversized flora'
  }, {
    name: 'Venuscale',
    element: 'poison',
    file: 'venuscale.png',
    caption: 'Fungi and vapour'
  }, {
    name: 'Aquilor',
    element: 'water',
    file: 'aquilor.png',
    caption: 'Wave and coral forms'
  }, {
    name: 'Obscidrahl',
    element: 'dark',
    file: 'obscidrahl.png',
    caption: 'Deep shadow mass'
  }, {
    name: 'Voidalon',
    element: 'dark',
    file: 'voidalon.png',
    caption: 'Darkest legal point'
  }, {
    name: 'Betarion-Prime',
    element: 'cosmic',
    file: 'betarion-prime.png',
    caption: 'Stars and voids'
  }];
  const STATIONS = [{
    id: 's1',
    name: 'Provision Station',
    glyph: 'flame',
    status: 'Ready',
    tone: 'success'
  }, {
    id: 's2',
    name: 'Fieldworks Bench',
    glyph: 'hammer',
    status: '2h left',
    tone: 'warning'
  }, {
    id: 's3',
    name: 'Resonance Table',
    glyph: 'sparkles',
    status: 'Idle',
    tone: 'neutral'
  }];

  // Standalone exports override this with blob URLs via window.__catchmonArt.
  const artUrl = file => window.__catchmonArt && window.__catchmonArt[file] || CATCH + file;
  Object.assign(window, {
    DS,
    CATCH,
    artUrl,
    PROVISIONS,
    CATCHMONS,
    STATIONS
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/shop_app/data.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Panel = __ds_scope.Panel;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.CatchmonCard = __ds_scope.CatchmonCard;

__ds_ns.CurrencyChip = __ds_scope.CurrencyChip;

__ds_ns.ELEMENTS = __ds_scope.ELEMENTS;

__ds_ns.ElementBadge = __ds_scope.ElementBadge;

__ds_ns.ProductCard = __ds_scope.ProductCard;

__ds_ns.Slot = __ds_scope.Slot;

})();
