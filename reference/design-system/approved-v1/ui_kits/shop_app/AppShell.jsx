(function(){
const { Icon, CurrencyChip, StatusPill } = window.CatchmonShopDesignSystem_709fd4;

function TopBar({ title, coins, momentum, onBack }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      padding: '14px var(--gutter-screen) 12px', background: 'var(--surface-panel)',
      borderBottom: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-small)',
      position: 'sticky', top: 0, zIndex: 4,
    }}>
      {onBack && (
        <button onClick={onBack} aria-label="Back" style={{
          width: 36, height: 36, display: 'grid', placeItems: 'center', marginLeft: -6,
          background: 'transparent', border: 'none', borderRadius: 'var(--radius-s)', cursor: 'pointer',
        }}><Icon name="chevron-left" size={22} color="var(--cs-walnut-700)" /></button>
      )}
      <h1 style={{ margin: 0, flex: 1, font: 'var(--type-section)', color: 'var(--text-body)' }}>{title}</h1>
      <CurrencyChip kind="momentum" amount={momentum} size="sm" />
      <CurrencyChip kind="coin" amount={coins} size="sm" />
    </header>
  );
}

function TabBar({ value, onChange }) {
  const items = [
    { id: 'shop', label: 'Shop', icon: 'store' },
    { id: 'workshop', label: 'Workshop', icon: 'hammer' },
    { id: 'collection', label: 'Catchmons', icon: 'sparkles' },
  ];
  return (
    <nav style={{
      display: 'flex', gap: 4, padding: '8px var(--space-2) 10px',
      background: 'var(--surface-panel)', borderTop: '1px solid var(--border-hairline)',
      boxShadow: '0 -2px 6px rgba(94,64,41,.08)',
    }}>
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            flex: 1, minHeight: 'var(--touch-min)', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 3,
            background: on ? 'var(--surface-card)' : 'transparent',
            border: on ? '1px solid var(--border-hairline)' : '1px solid transparent',
            borderRadius: 'var(--radius-m)', cursor: 'pointer',
            boxShadow: on ? 'var(--shadow-small)' : 'none',
            transition: 'var(--transition-surface)',
          }}>
            <Icon name={it.icon} size={20} color={on ? 'var(--cs-walnut-700)' : 'var(--cs-ink-300)'} />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 'var(--text-micro)',
              fontWeight: on ? 700 : 600, color: on ? 'var(--text-body)' : 'var(--text-subtle)',
            }}>{it.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function ArtPlaceholder({ height = 150, note }) {
  return (
    <div style={{
      height, borderRadius: 'var(--radius-card)', background: 'var(--surface-slot)',
      boxShadow: 'var(--inset-slot)', border: '1px dashed var(--border-default)',
      display: 'grid', placeItems: 'center', textAlign: 'center', padding: 'var(--space-4)',
    }}>
      <div>
        <Icon name="image" size={22} color="rgba(123,87,61,.5)" />
        <p style={{
          margin: '6px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)',
          color: 'var(--text-muted)', maxWidth: 260,
        }}>{note}</p>
      </div>
    </div>
  );
}

function SectionHead({ title, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 var(--stack-default)' }}>
      <h2 style={{ margin: 0, font: 'var(--type-card-title)', color: 'var(--text-body)' }}>{title}</h2>
      {action}
    </div>
  );
}

Object.assign(window, { TopBar, TabBar, ArtPlaceholder, SectionHead });

})();
