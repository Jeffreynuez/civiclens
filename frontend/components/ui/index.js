// CivicView — Copyright (c) 2026 Jeffrey De La Nuez. All rights reserved.
// Proprietary and confidential. See LICENSE at the repository root.

// Barrel export for CivicView UI primitives only.
//
// Iconography lives in lucide-react. Consumers import icon names
// directly: `import { Bookmark, Search } from 'lucide-react';` —
// NOT through this barrel. See lucide.md in the design exports.
//
// Atomic primitives: Button, Card, Avatar, PartyChip, Eyebrow.
// State primitives: Spinner, Skeleton, EmptyState, ErrorState, ModalShell.

// Atomic
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Avatar } from './Avatar';
export { default as PartyChip } from './PartyChip';
export { default as Eyebrow } from './Eyebrow';

// State
export { default as Spinner } from './Spinner';
export { default as Skeleton } from './Skeleton';
export { default as EmptyState } from './EmptyState';
export { default as ErrorState } from './ErrorState';
export { default as ModalShell } from './ModalShell';

// Iconography re-exports were migrated to direct lucide-react imports
// in Phase 2 of the icon migration. Consumers now import icon names
// directly from 'lucide-react' rather than from this barrel. See
// docs/Design Exports/civicview-brand-logo/assets/lucide.md for the
// canonical mapping table.
