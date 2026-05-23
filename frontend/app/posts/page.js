'use client';

// CivicView — Copyright (c) 2026 Jeffrey De La Nuez. All rights reserved.
// Proprietary and confidential. See LICENSE at the repository root.

/*
 * /posts — Posts tab of the dual-feed Grassroots surface.
 *
 * Mounts the shared GrassrootsFeed component from /polls/page.js with
 * tab='posts'. The component itself owns all the routing logic — when
 * the user clicks the Polls tab on this page, GrassrootsFeed pushes
 * /polls and Next.js mounts the other route's page.
 *
 * Keeping this file deliberately thin so route-vs-component
 * responsibilities stay clean: routes pick which tab to start on,
 * the component picks how to render that tab.
 */

import { GrassrootsFeed } from '../polls/page';

export default function PostsPage() {
  return <GrassrootsFeed tab="posts" />;
}
