(function(){
const { CatchmonCard, ElementBadge, Tabs, Button, Panel, StatusPill, Icon } = window.CatchmonShopDesignSystem_709fd4;

function CollectionScreen({ onSelect }) {
  const [tab, setTab] = React.useState('all');
  const all = window.CATCHMONS;
  const list = tab === 'all' ? all : all.filter((c) => ['fire', 'ice', 'water', 'electric'].includes(c.element));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack-loose)', padding: 'var(--space-4) var(--gutter-screen) var(--space-8)' }}>
      <Tabs value={tab} onChange={setTab} items={[
        { id: 'all', label: 'All', icon: 'sparkles', count: all.length },
        { id: 'elemental', label: 'Elemental', icon: 'flame' },
      ]} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap-grid)' }}>
        {list.map((c, i) => (
          <CatchmonCard key={c.name} name={c.name} element={c.element} art={window.artUrl(c.file)}
            caption={c.caption} glow={i === 1} discovered={c.name !== 'Voidalon'}
            onClick={() => onSelect(c)} />
        ))}
      </div>
    </div>
  );
}

function CatchmonDetail({ catchmon, onClose }) {
  const c = catchmon;
  return (
    <div data-element={c.element} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack-loose)', padding: 'var(--space-4) var(--gutter-screen) var(--space-8)' }}>
      <div style={{
        borderRadius: 'var(--radius-panel)', background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)', boxShadow: 'var(--shadow-card)',
        padding: 'var(--pad-panel)', textAlign: 'center',
      }}>
        <div style={{
          aspectRatio: '1 / 1', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-l)',
          background: 'radial-gradient(120% 90% at 50% 84%, var(--el-glow) 0%, rgba(255,248,235,0) 64%)',
        }}>
          <img src={window.artUrl(c.file)} alt="" style={{ width: '94%', filter: 'drop-shadow(0 12px 14px rgba(94,64,41,.24))' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <h2 style={{ margin: 0, font: 'var(--type-screen-title)', fontSize: 'var(--text-title)', color: 'var(--text-body)' }}>{c.name}</h2>
          <ElementBadge element={c.element} size="sm" showLabel />
        </div>
        <p style={{ margin: '6px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>{c.caption}</p>
      </div>

      <Panel tone="sand" title="Care">
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: 'var(--stack-default)' }}>
          <StatusPill tone="success">Rested</StatusPill>
          <StatusPill tone="info" icon="heart">Content</StatusPill>
          <StatusPill tone="neutral" icon={null}>Standard habitat</StatusPill>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="primary" fullWidth iconLeft={<Icon name="hand-heart" size={18} />}>Tend</Button>
          <Button variant="secondary" onClick={onClose}>Back to collection</Button>
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { CollectionScreen, CatchmonDetail });

})();
