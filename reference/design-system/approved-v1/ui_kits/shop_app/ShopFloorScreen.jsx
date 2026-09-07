(function(){
const { Panel, Button, StatusPill, ProductCard, Tabs, Icon } = window.CatchmonShopDesignSystem_709fd4;

function ShopFloorScreen({ onSelectProduct }) {
  const [filter, setFilter] = React.useState('shelf');
  const list = filter === 'shelf' ? window.PROVISIONS : window.PROVISIONS.filter((p) => p.tier !== 'standard');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack-loose)', padding: 'var(--space-4) var(--gutter-screen) var(--space-8)' }}>
      <window.ArtPlaceholder height={160} note="PLACEHOLDER · Shop Key Environment — Golden Sample Wave 1. Foreground floor stays clear for UI." />

      <section>
        <window.SectionHead title="Stations" action={<Button variant="ghost" size="sm" iconRight={<Icon name="chevron-right" size={16} />}>All</Button>} />
        <div style={{ display: 'flex', gap: 'var(--gap-grid)' }}>
          {window.STATIONS.map((s) => (
            <div key={s.id} style={{
              flex: 1, background: 'var(--surface-card)', border: '1px solid var(--border-hairline)',
              borderRadius: 'var(--radius-card)', boxShadow: 'var(--shadow-card)', padding: 'var(--space-3)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, textAlign: 'center',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-m)', background: 'var(--surface-slot)',
                boxShadow: 'var(--inset-slot)', display: 'grid', placeItems: 'center',
              }}>
                <Icon name={s.glyph} size={20} color="var(--cs-walnut-700)" />
              </div>
              <span style={{ font: 'var(--type-label)', color: 'var(--text-body)', lineHeight: 1.25 }}>{s.name}</span>
              <StatusPill tone={s.tone}>{s.status}</StatusPill>
            </div>
          ))}
        </div>
      </section>

      <section>
        <window.SectionHead title="On the shelf" />
        <Tabs value={filter} onChange={setFilter} style={{ marginBottom: 'var(--stack-default)' }} items={[
          { id: 'shelf', label: 'Everything', count: window.PROVISIONS.length },
          { id: 'premium', label: 'Fine & above' },
        ]} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-grid)' }}>
          {list.map((p) => (
            <ProductCard key={p.id} name={p.name} price={p.price} tier={p.tier} element={p.element}
              onClick={() => onSelectProduct(p)} />
          ))}
        </div>
        <p style={{ margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-subtle)' }}>
          PLACEHOLDER · Products — Golden Sample Wave 1 (Standard Product) and Wave 2 (Premium Product, Special Component). Tiles show the recessed empty state; names are category-level placeholders, not game content.
        </p>
      </section>

      <Panel tone="card" title="Today" subtitle="Two customers waiting, one route open">
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="primary" fullWidth>Open the doors</Button>
          <Button variant="secondary" iconLeft={<Icon name="map" size={18} />}>Routes</Button>
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { ShopFloorScreen });

})();
