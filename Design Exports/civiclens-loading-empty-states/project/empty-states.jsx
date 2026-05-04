/* Section 2 — Empty state shell + 6 instantiations */

function EmptyState({
  icon: IconComp,
  iconBg = 'accent', // 'accent' | 'warning' | 'neutral' | 'danger'
  iconColor = '#2d6a4f',
  iconOpacity = 0.30,
  iconSize,
  headline,
  body,
  cta,
  secondary,
  compact = false,
}) {
  const iconBgClass = {
    accent: 'cl-empty__icon',
    warning: 'cl-empty__icon cl-empty__icon--warning',
    neutral: 'cl-empty__icon cl-empty__icon--neutral',
    danger: 'cl-empty__icon cl-empty__icon--danger',
  }[iconBg] || 'cl-empty__icon';

  const sz = iconSize ?? (compact ? 36 : 56);

  return (
    <div className={`cl-empty ${compact ? 'cl-empty--compact' : ''}`}>
      <div className={iconBgClass}>
        <IconComp size={sz} color={iconColor} opacity={iconOpacity} />
      </div>
      <h3 className="cl-empty__head">{headline}</h3>
      <p className="cl-empty__body">{body}</p>
      {(cta || secondary) && (
        <div className="cl-empty__actions">
          {cta && (
            <button className="cl-btn cl-btn--primary" onClick={cta.onClick}>
              {cta.label}
            </button>
          )}
          {secondary && (
            <a className="cl-link" href="#" onClick={(e) => e.preventDefault()}>
              {secondary}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

const EMPTY_INSTANCES = [
  {
    label: '01 · Dashboard',
    icon: 'ChatCircleDots',
    headline: 'No recent activity yet',
    body: "When your tracked reps post, when polls you voted on close, or when someone replies to your comments — it'll show up here.",
    cta: { label: 'Track more reps →' },
  },
  {
    label: '02 · Rep page',
    icon: 'Newspaper',
    headline: '[Rep Name] hasn’t posted yet',
    body: 'We’ll surface their first post here. Track this rep to get notified.',
    cta: { label: 'Track [Rep Name]' },
  },
  {
    label: '03 · Post detail',
    icon: 'ChatText',
    headline: 'Be the first to comment',
    body: 'Comments are scoped to FL-19, so you’re talking to neighbors.',
    cta: null,
  },
  {
    label: '04 · Search',
    icon: 'MagnifyingGlass',
    headline: 'No matches for \u201Carmed forces\u201D',
    body: 'Try a rep’s name, a bill number (H.R. 4382), or a committee.',
    cta: null,
  },
  {
    label: '05 · My tracked',
    icon: 'BookmarkSimple',
    headline: "You\u2019re not tracking anyone yet",
    body: 'Tracking a rep adds their posts to your dashboard and notifies you when they vote, post, or hold a town hall.',
    cta: { label: 'Browse your representatives →' },
  },
  {
    label: '06 · Ballot tab',
    icon: 'CalendarCheck',
    headline: 'No elections in your district right now',
    body: 'Florida’s next election is the 2026 primary on Aug 18. We’ll surface candidates here once they’re declared.',
    cta: { label: 'See national calendar →' },
  },
];

function EmptyStateGrid() {
  return (
    <div className="empty-grid">
      {EMPTY_INSTANCES.map(inst => {
        const IconComp = window.Icon[inst.icon];
        return (
          <div key={inst.label} className="empty-grid__cell">
            <div className="empty-grid__label">{inst.label}</div>
            <EmptyState
              icon={IconComp}
              headline={inst.headline}
              body={inst.body}
              cta={inst.cta}
              compact
            />
          </div>
        );
      })}
    </div>
  );
}

window.EmptyState = EmptyState;
window.EmptyStateGrid = EmptyStateGrid;
