'use client';

// CivicView — Copyright (c) 2026 Jeffrey Nuez. All rights reserved.
// Proprietary and confidential. See LICENSE at the repository root.

/**
 * useActiveIdentities — returns the list of currently-signed-in
 * identity sessions in a normalized shape for the IdentityPicker /
 * PostingAsPicker UIs.
 *
 * Shape:
 *   [
 *     { kind: 'citizen', label: 'Pat Back', sublabel: 'LA-4' },
 *     { kind: 'rep',     label: 'CivicView Test Rep' },
 *     { kind: 'candidate', label: 'Jane Doe (Candidate)' },
 *   ]
 *
 * Order: citizen → rep → candidate (alphabetical by kind is fine
 * since order is mostly for stable rendering; the picker UI doesn't
 * imply priority).
 *
 * Page-owner constraint: the rep + candidate identity entries are
 * only included when the viewer is on a page they own — i.e. the
 * caller passes `isOwner=true`. On a page the viewer doesn't own,
 * their rep / candidate session is a "spectator" identity and
 * shouldn't be offered as an engagement target (the backend would
 * 401 / 403 anyway since rep + candidate self-engagement is
 * scoped to their own page).
 */
import { useMemo } from 'react';
import { useAuth } from './auth';
import { useCitizenAuth } from './citizenAuth';
import { useCandidateAuth } from './candidateAuth';

export function useActiveIdentities({ isOwner = false } = {}) {
  const { me } = useAuth();
  const { citizen } = useCitizenAuth();
  const { candidate } = useCandidateAuth();

  return useMemo(() => {
    const out = [];
    if (citizen) {
      const district = citizen.congressional_district || citizen.state || '';
      out.push({
        kind: 'citizen',
        label: citizen.display_name,
        sublabel: district,
      });
    }
    if (me && isOwner) {
      out.push({
        kind: 'rep',
        label: me.display_name || 'Page owner',
        sublabel: me.role ? me.role : '',
      });
    }
    if (candidate && isOwner) {
      out.push({
        kind: 'candidate',
        label: candidate.display_name || 'Candidate',
        sublabel: 'Candidate',
      });
    }
    return out;
  }, [me, citizen, candidate, isOwner]);
}

/**
 * Helper — decide which identity should perform an action, given:
 *   identities: list of {kind, label} from useActiveIdentities
 *   alreadyActed: object mapping kind → truthy value when that
 *                 identity has already done the action (e.g. for
 *                 likes/votes pulled from my_reactions / voter_choices)
 *
 * Returns one of:
 *   { autoPick: <kind> }            — only one identity hasn't acted;
 *                                     fire automatically as that one
 *   { showPicker: [...identities] } — 2+ haven't acted (or 0 have any
 *                                     remaining picks but the picker
 *                                     opens in toggle-off mode); the
 *                                     UI pops the dropdown
 *   { single: <kind> }              — only one identity is signed in;
 *                                     no picker needed ever
 *   { none: true }                  — no identities signed in
 */
export function pickEngagementIdentity({ identities, alreadyActed = {} } = {}) {
  if (!identities || identities.length === 0) return { none: true };
  if (identities.length === 1) return { single: identities[0].kind };

  const remaining = identities.filter((id) => !alreadyActed[id.kind]);
  if (remaining.length === 1) return { autoPick: remaining[0].kind };
  if (remaining.length >= 2) {
    return { showPicker: remaining, mode: 'pick' };
  }
  // remaining.length === 0 → all identities have already acted.
  // Open the picker in toggle-off mode so the user can retract one.
  return { showPicker: identities, mode: 'toggle' };
}
