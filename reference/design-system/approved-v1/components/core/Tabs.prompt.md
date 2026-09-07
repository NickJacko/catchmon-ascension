Switch between sibling views of the same content — inventory categories, collection filters, station queues.

```jsx
<Tabs value={tab} onChange={setTab} items={[
  { id: 'shelf', label: 'Shelf', icon: 'package', count: 12 },
  { id: 'craft', label: 'Workshop', icon: 'hammer' },
]} />
```

- The track is recessed sand; the selected tab is a raised cream chip with a hairline border and heavier weight.
- Two to four tabs. More than four becomes a scrolling filter row, not a segmented control.
- 40px tab height inside a 48px track keeps the whole control above the 44px touch floor.
