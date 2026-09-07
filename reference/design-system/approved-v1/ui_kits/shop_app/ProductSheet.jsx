(function(){
const { Button, StatusPill, ElementBadge, CurrencyChip, Icon } = window.CatchmonShopDesignSystem_709fd4;

function ProductSheet({ product, onClose, onBuy }) {
  if (!product) return null;
  const tierWord = product.tier === 'masterwork' ? 'Masterwork' : product.tier === 'fine' ? 'Fine' : 'Standard';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--surface-scrim)' }} />
      <div data-element={product.element} style={{
        position: 'relative', background: 'var(--surface-panel)',
        borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        boxShadow: 'var(--shadow-modal)', padding: 'var(--pad-panel)',
        display: 'flex', flexDirection: 'column', gap: 'var(--stack-default)',
        animation: 'cs-sheet var(--dur-base) var(--ease-out)',
      }}>
        <div style={{ width: 44, height: 4, borderRadius: 999, background: 'var(--border-default)', alignSelf: 'center' }} />
        <div style={{
          height: 132, borderRadius: 'var(--radius-card)', background: 'var(--surface-slot)',
          boxShadow: 'var(--inset-slot)', border: '1px dashed var(--border-default)',
          display: 'grid', placeItems: 'center',
        }}>
          <div style={{ textAlign: 'center' }}>
            <Icon name="package" size={26} color="rgba(123,87,61,.5)" />
            <p style={{ margin: '4px 0 0', font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>
              Placeholder · Golden Sample Wave 1
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <h2 style={{ margin: 0, flex: 1, font: 'var(--type-section)', color: 'var(--text-body)' }}>{product.name}</h2>
          {product.element && <ElementBadge element={product.element} size="sm" />}
          <StatusPill tone={product.tier === 'standard' ? 'neutral' : 'premium'} icon={product.tier === 'standard' ? null : undefined}>{tierWord}</StatusPill>
        </div>
        <p style={{ margin: 0, font: 'var(--type-body)', color: 'var(--text-muted)' }}>
          Quality is an overlay on the same base artwork — material finish, a light edge and a controlled glow. The product itself never gets repainted.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ font: 'var(--type-label)', letterSpacing: 'var(--tracking-label)', textTransform: 'uppercase', color: 'var(--text-subtle)' }}>Price</span>
          <CurrencyChip kind="coin" amount={product.price} />
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="primary" fullWidth size="lg" onClick={() => onBuy(product)}>Buy for {product.price}</Button>
          <Button variant="ghost" size="lg" onClick={onClose}>Not now</Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductSheet });

})();
