# Fora Domain Vocabulary

## Fora

A mobile-first opportunity discovery app for underrepresented and nontraditional tech learners.

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

## Daily Stack

A limited set of high-fit opportunities shown as a short daily ritual. The Daily Stack is not an infinite feed or generic directory.

## Opportunity Preference

A private learner preference describing what the learner is looking for, such as hackathons, scholarships, internships, mentorship, coding workshops, tech communities, or resume/interview prep.

## Access Need

A private learner need or constraint that affects whether an opportunity is realistically accessible, such as free, remote, beginner-friendly, mentorship included, no experience required, travel support, childcare support, evening/weekend friendly, or application fee waived.

## Match Explanation

The transparent user-facing reasons an opportunity appears in the Daily Stack. Match explanations should be generated from structured reason keys, not freeform text.

## Explore More

A secondary browsing mode for opportunities outside the Daily Stack. Explore More can show lower-match, out-of-range, stretch, different-focus, or later-deadline opportunities with gentle labels.

## Saved Opportunity

An opportunity the learner keeps for later action. Saved opportunities can belong to playlists such as Apply this week, Bring friends, Beginner-friendly, Funding, or Near me.
