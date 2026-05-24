/* Section 3 — Error states. Re-uses the EmptyState shell with warning-circle icon. */

function ErrorStates() {
  const Warning = window.Icon.WarningCircle;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <window.EmptyState
        icon={Warning}
        iconBg="danger"
        iconColor="#8c2929"
        iconOpacity={0.28}
        headline="Couldn’t reach CivicLens"
        body="Check your connection and try again."
        cta={{ label: 'Retry' }}
        compact
      />
      <window.EmptyState
        icon={Warning}
        iconBg="danger"
        iconColor="#8c2929"
        iconOpacity={0.28}
        headline="We couldn’t find that page"
        body="It may have been removed or the link is wrong."
        cta={{ label: 'Back to dashboard →' }}
        compact
      />
      <window.EmptyState
        icon={Warning}
        iconBg="warning"
        iconColor="#8a6100"
        iconOpacity={0.30}
        headline="This is scoped to a different district"
        body="Only verified voters in FL-26 can see this. You’re verified for FL-19."
        compact
      />
    </div>
  );
}

window.ErrorStates = ErrorStates;
