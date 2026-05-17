# Fora Domain Vocabulary

## Fora

A mobile-first opportunity discovery app for underrepresented and nontraditional tech learners.

## Landing Page

A short introduction to Fora whose primary job is to move a learner into Profile Onboarding or their existing Daily Stack. The Landing Page should not behave like a directory, docs page, or second navigation surface.

## Opportunity

A tech-access program, scholarship, mentorship option, hackathon, internship, fellowship, coding workshop, or community that a learner could save, dismiss, share, or apply to.

## Opportunity Source

A trusted place Fora can ingest opportunities from, such as an official API, structured event page, curated list, or admin-submitted URL. Opportunity Sources should be selected for trust, access relevance, and explainability before volume.

## Community Calendar Source

A public or partner-provided calendar from a club, university organization, student community, or event platform that lists recurring opportunities relevant to tech learners. Fora should prioritize remote or nationally accessible Community Calendar Sources first, then add campus-specific packs when there is enough local demand.

Luma should be treated as a partner/API-backed Community Calendar Source for calendars Fora controls or has permission to access. Broad event discovery should prefer official/public ICS feeds, Google Calendar public feeds, university event pages, and club calendars over brittle platform scraping.

## User-Submitted Source

An opportunity or event link discovered and submitted by a Fora user. User-Submitted Sources should be reviewed, deduplicated, and assigned a trust state before they become scheduled Opportunity Sources or appear in recommendations.

For the MVP, User-Submitted Sources can be automatically rejected or quarantined when the adapter detects clear fake, spammy, inaccessible, expired, or unrelated content. Human approval should be reserved for uncertain or high-impact cases rather than every submitted link.

For the hackathon prototype, User-Submitted Sources may be stored as quarantined links without immediate parsing. A future scheduled scraper can inspect this queue and promote accepted links into Opportunity Sources.

## Daily Stack

A limited set of high-fit opportunities shown as a short daily ritual. The Daily Stack is not an infinite feed or generic directory.

Daily Stack should feel curated rather than merely sorted. It should mostly prioritize the learner's selected goals while preserving a small number of Serendipity Slots, and it should balance across selected opportunity types when enough high-fit options are available.

## Serendipity Slot

A small part of the Daily Stack reserved for relevant opportunities outside the learner's explicitly selected goals. Serendipity Slots should still be access-aware and actionable; they are not random filler.

## Productive Scroll

A mobile-first browsing mode where the user can continue swiping through relevant opportunities after the Daily Stack. Productive Scroll can feel like a social short-form feed, but every card should be actionable, access-aware, and tied to a real opportunity rather than passive entertainment.

Productive Scroll cards should optimize for instant vibe recognition first, then application decision-making. The first glance should make the opportunity type, audience fit, and reason to care obvious; the lower action area should expose date, location, access tags, and the apply/save/share path.

Productive Scroll should use a consistent card shell with type-adaptive emphasis. Hackathons should foreground date, format, beginner fit, and build theme; scholarships should foreground funding, deadline, eligibility, and application effort; mentorship should foreground format, cadence, audience, and time commitment; internships should foreground role, location, experience level, and compensation when known.

On mobile, each Productive Scroll card should behave like a full-screen card with a bottom action sheet: an immersive visual/type area for quick recognition and a stable lower panel for title, match reasons, date, location, access tags, and primary actions.

Productive Scroll navigation chrome should stay compact on mobile and must not hide the opportunity's instant-read area. The opportunity card, not the shell navigation, should own the first screen.

Productive Scroll should treat apply and save activity as useful popularity signals. Likes and comments are not part of the MVP feed; they can make the experience feel social-first instead of opportunity-first.

Popularity should be shown as a soft trust cue only when it helps the learner decide, such as "saved by similar learners" or "popular with beginners." Raw counters should not dominate the card or override match fit.

Productive Scroll should prefer an opportunity's own image as the primary card visual, such as an event poster, program banner, official logo, or website preview image. If no trustworthy opportunity image is available, the card should use a neutral blank or brand-system background rather than guessing with unrelated venue, university, or city imagery.

Small logos should be placed cleanly inside the Productive Scroll visual area rather than stretched into full-bleed backgrounds. Full-bleed imagery should be reserved for trustworthy posters, banners, or photos that can carry a card without becoming blurry or misleading.

## Image Kind

The classification of an opportunity image, such as logo, poster, banner, photo, or unknown. Image Kind helps Productive Scroll decide whether to render an image as a contained mark, a full-bleed visual, or a neutral fallback.

## Opportunity Preference

A private learner preference describing what the learner is looking for, such as hackathons, scholarships, internships, mentorship, coding workshops, tech communities, or resume/interview prep.

## Profile Onboarding

A mandatory first-run setup step for signed-in learners who do not yet have a private matching profile. Profile Onboarding should collect enough optional preferences to make the first Daily Stack feel personalized, without forcing identity or access-need disclosures.

## Access Need

A private learner need or constraint that affects whether an opportunity is realistically accessible, such as free, remote, beginner-friendly, mentorship included, no experience required, travel support, childcare support, evening/weekend friendly, or application fee waived.

Access Needs can have different strengths. Cost sensitivity should strongly affect Daily Stack ranking when an opportunity is clearly paid. Remote preference should strongly favor remote opportunities while still allowing nearby in-person opportunities. Supports such as travel support, childcare support, fee waived, mentorship included, and no experience required should usually boost rather than filter because source data may be incomplete.

## Primary Location

The private home-base location a learner gives Fora for distance estimates and nearby matching. Primary Location should be used to show approximate miles away and prioritize reachable in-person opportunities, not to publicly label the learner.

## Application Deadline

The date by which a learner must apply, register, or submit interest for an Opportunity. Application Deadline should affect urgency and eligibility, but it should be capped in matching so an urgent low-fit opportunity does not outrank a practical high-fit opportunity.

## Event Start Date

The date an Opportunity begins, such as the first day of a hackathon, workshop, cohort, or event. Event Start Date should help determine whether an Opportunity is timely and realistic, and should not be confused with Application Deadline when both are available.

## Match Explanation

The transparent user-facing reasons an opportunity appears in the Daily Stack. Match explanations should be generated from structured reason keys, not freeform text.

## Match Score

A private ranking score generated from separate intent, access, identity, topic, location, urgency, and experience-fit buckets. Intent, access, and location should carry the strongest practical weight; identity should only boost; urgency should be capped so an approaching deadline cannot overpower a poor practical fit.

Matching should apply strong penalties for expired opportunities, clearly paid opportunities when the learner needs free access, far-away in-person opportunities, and advanced-only opportunities for beginner learners.

## Identity Fit

A private matching signal based on optional community or identity preferences the learner chooses during Profile Onboarding. Identity Fit should boost and explain relevant opportunities, not act as a hard filter that hides otherwise useful general opportunities.

## Explore More

A secondary browsing mode for opportunities outside the Daily Stack. Explore More can show lower-match, out-of-range, stretch, different-focus, or later-deadline opportunities with gentle labels.

## Saved Opportunity

An opportunity the learner keeps for later action. Saved opportunities can belong to playlists such as Apply this week, Bring friends, Beginner-friendly, Funding, or Near me.
