(function(){
const { Panel, Button, Slot, StatusPill, Icon, CurrencyChip } = window.CatchmonShopDesignSystem_709fd4;

function WorkshopScreen() {
  const [inputs, setInputs] = React.useState([null, null, null]);
  const [state, setState] = React.useState('idle'); // idle | working | done
  const filled = inputs.filter(Boolean).length;

  const fill = (i) => setInputs((prev) => prev.map((v, n) => (n === i ? (v ? null : window.artUrl('nuttiki.png')) : v)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--stack-loose)', padding: 'var(--space-4) var(--gutter-screen) var(--space-8)' }}>
      <window.ArtPlaceholder height={140} note="PLACEHOLDER · Provision Station — Golden Sample Wave 1. Idle / active states authored per file, shared origin and footprint." />

      <Panel tone="card" title="Provision Station"
        subtitle={state === 'done' ? 'Batch complete' : state === 'working' ? 'Working — 1h 58m' : 'Add up to three inputs'}
        action={<StatusPill tone={state === 'done' ? 'success' : state === 'working' ? 'warning' : 'neutral'} icon={state === 'working' ? 'hourglass' : undefined}>
          {state === 'done' ? 'Ready' : state === 'working' ? '1h 58m' : 'Idle'}
        </StatusPill>}>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', marginBottom: 'var(--stack-loose)' }}>
          {inputs.map((art, i) => (
            <Slot key={i} art={art || undefined} size={72} label={`Input ${i + 1}`}
              selected={state === 'done' && i === 1}
              tier={state === 'done' && i === 1 ? 'masterwork' : 'standard'}
              onClick={state === 'idle' ? () => fill(i) : undefined} />
          ))}
          <Slot locked size={72} label="Locked input" />
        </div>

        {state === 'idle' && (
          <Button variant="primary" fullWidth disabled={filled === 0} onClick={() => setState('working')}>
            {filled === 0 ? 'Add an input' : `Start batch · ${filled} input${filled > 1 ? 's' : ''}`}
          </Button>
        )}
        {state === 'working' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div style={{ height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--surface-slot)', boxShadow: 'var(--inset-slot)', overflow: 'hidden' }}>
              <div style={{ width: '38%', height: '100%', background: 'var(--cs-walnut-700)', borderRadius: 'var(--radius-pill)' }} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button variant="secondary" fullWidth onClick={() => setState('done')}>Finish now</Button>
              <Button variant="destructive" onClick={() => { setState('idle'); setInputs([null, null, null]); }}>Cancel</Button>
            </div>
          </div>
        )}
        {state === 'done' && (
          <Button variant="primary" fullWidth iconLeft={<Icon name="sparkles" size={18} />}
            onClick={() => { setState('idle'); setInputs([null, null, null]); }}>
            Collect batch
          </Button>
        )}
      </Panel>

      <Panel tone="sand" title="Materials on hand">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 'var(--space-2)' }}>
          {['nuttiki', 'ripplee', 'cogmino', 'flameron', 'glacelyra'].map((n) => (
            <Slot key={n} art={window.artUrl(n + '.png')} size={56} label={n} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => <Slot key={'e' + i} empty size={56} />)}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--stack-default)' }}>
          <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
            PLACEHOLDER · Routine materials — Golden Sample Wave 2. Creature artwork stands in.
          </span>
          <CurrencyChip kind="material" amount={5} size="sm" />
        </div>
      </Panel>
    </div>
  );
}

Object.assign(window, { WorkshopScreen });

})();
