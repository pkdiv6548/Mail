import { EmailMessage, UserAccount } from '../types';

export const mockAccounts: UserAccount[] = [
  {
    id: 'personal',
    name: 'Alex Morgan',
    email: 'alex.morgan@flowmail.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    storageUsed: '4.8 GB',
    storageLimit: '15 GB',
    storagePercentage: 32
  },
  {
    id: 'work',
    name: 'Alex Morgan (CloudFlow)',
    email: 'alex.m@cloudflow.tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    storageUsed: '18.4 GB',
    storageLimit: '30 GB',
    storagePercentage: 61
  },
  {
    id: 'student',
    name: 'Alex M.',
    email: 'alex.morgan@alumni.stanford.edu',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    storageUsed: '1.2 GB',
    storageLimit: '100 GB',
    storagePercentage: 1
  }
];

const now = Date.now();
const hour = 3600 * 1000;
const day = 24 * hour;

export const initialMockEmails: EmailMessage[] = [
  {
    id: 'mail-1',
    threadId: 'thread-redesign-discussion',
    sender: 'Marcus Vance',
    senderEmail: 'marcus.vance@designlabs.co',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    cc: ['team@designlabs.co'],
    subject: 'MailFlow Design System & Mobile Tokens Review',
    preview: 'Hey Alex, I just published the updated Figma tokens for the dark theme surface elevations. Let me know what you think of the new contrast ratios...',
    body: `Hey Alex,

I just published the updated Figma design tokens for the dark theme surface elevations and corner radiuses. Here is a quick summary of what changed:

1. Base surface adjusted from #121316 to #111318 for optimal OLED power efficiency.
2. Floating search bar pill given a subtle 1px border accent and 2dp tonal elevation.
3. Added haptic visual bounce animations for the swipe-to-archive gesture.

Check out the exported token spec sheet attached below. Let's do a 10-minute sync this afternoon if you are free.

Best regards,
Marcus Vance
Lead Product Designer | DesignLabs`,
    timestamp: now - (22 * 60 * 1000), // 22 mins ago
    dateFormatted: '9:48 AM',
    read: false,
    starred: true,
    important: true,
    labels: ['Work', 'Projects'],
    category: 'primary',
    hasAttachment: true,
    attachments: [
      {
        id: 'att-1',
        name: 'Design_Tokens_M3_Spec.pdf',
        size: '2.4 MB',
        type: 'pdf',
        url: '#'
      },
      {
        id: 'att-2',
        name: 'Mobile_Dark_Theme_Elevation.png',
        size: '1.1 MB',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mail-1-reply-1',
    threadId: 'thread-redesign-discussion',
    sender: 'Alex Morgan',
    senderEmail: 'alex.morgan@flowmail.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    recipients: ['marcus.vance@designlabs.co'],
    subject: 'Re: MailFlow Design System & Mobile Tokens Review',
    preview: 'Looks fantastic Marcus! The contrast on the search bar in particular feels very crisp on physical devices.',
    body: `Looks fantastic Marcus! The contrast on the search bar in particular feels very crisp on physical devices. I tested the pill search bar elevation in our prototype and it feels just like native Android. Let's do the 10-minute sync at 3:30 PM.`,
    timestamp: now - (15 * 60 * 1000),
    dateFormatted: '9:55 AM',
    read: true,
    starred: false,
    important: true,
    labels: ['Work', 'Projects'],
    category: 'primary',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-1-reply-2',
    threadId: 'thread-redesign-discussion',
    sender: 'Marcus Vance',
    senderEmail: 'marcus.vance@designlabs.co',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Re: MailFlow Design System & Mobile Tokens Review',
    preview: 'Perfect, invite sent! See you at 3:30 PM.',
    body: `Perfect, calendar invite sent! See you at 3:30 PM. Looking forward to reviewing the swipe gesture feedback curve.`,
    timestamp: now - (5 * 60 * 1000),
    dateFormatted: '10:05 AM',
    read: false,
    starred: true,
    important: true,
    labels: ['Work', 'Projects'],
    category: 'primary',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-2',
    threadId: 'thread-chase-fraud',
    sender: 'Chase Fraud Alert',
    senderEmail: 'alerts@chase.com',
    avatar: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Transaction Verification: $84.20 at Whole Foods Market',
    preview: 'Did you make a purchase on September 7 for $84.20? Reply YES if this was you, or call 1-800-CHASE-01 immediately...',
    body: `Dear Alex Morgan,

We detected a card-present transaction of $84.20 at WHOLE FOODS MKT #1042 on your Chase Sapphire Reserve card ending in 4921.

Transaction Details:
- Date: Today, 9:15 AM
- Merchant: WHOLE FOODS MKT #1042
- Amount: $84.20 USD
- Status: Approved / Pending Confirmation

If you authorized this charge, no further action is necessary. If you did NOT authorize this charge, please lock your card instantly in the Chase Mobile app or reply to this message.

Thank you for banking with Chase.`,
    timestamp: now - (45 * 60 * 1000),
    dateFormatted: '9:25 AM',
    read: false,
    starred: false,
    important: true,
    labels: ['Finance'],
    category: 'primary',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-3',
    threadId: 'thread-github-notifications',
    sender: 'GitHub',
    senderEmail: 'notifications@github.com',
    avatar: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: '[mailflow/core] Pull Request #142: Add gesture velocity friction & undo toast',
    preview: 'dev-elena requested your review on #142. Summary: Implemented interactive drag bounds and CSS haptic feedback animations...',
    body: `Hi Alex,

@dev-elena has requested your review on Pull Request #142 in mailflow/core:

Title: Add gesture velocity friction & undo toast
Branch: feat/gestures -> main

Diff Stat:
+184 lines, -22 lines (4 files changed)

Review notes:
"Tested on Android Chrome 124 and iOS Safari 17. The swipe threshold feels very natural with the 60px friction curve."

View Pull Request on GitHub: https://github.com/mailflow/core/pull/142`,
    timestamp: now - (2 * hour),
    dateFormatted: '8:10 AM',
    read: true,
    starred: true,
    important: false,
    labels: ['Projects', 'Work'],
    category: 'updates',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-4',
    threadId: 'thread-sarah-hiking',
    sender: 'Sarah Chen',
    senderEmail: 'sarah.chen@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Weekend trail run at Mt. Tam + Lunch afterward?',
    preview: 'Hey! The weather forecast for Saturday looks sunny and in the 70s. Dave and I are thinking of doing the Steep Ravine trail...',
    body: `Hey Alex!

The weather forecast for Saturday looks gorgeous—sunny and right around 72°F up on the coast. Dave and I are planning to run the Steep Ravine to Dipsea loop starting from Stinson Beach around 8:30 AM.

Total loop is about 6.8 miles with 1,600ft of elevation gain. We will grab fish tacos at the Siren Canteen afterwards!

Let me know if you want to join and we can carpool from the Presidio.

Cheers,
Sarah`,
    timestamp: now - (4 * hour),
    dateFormatted: '6:12 AM',
    read: true,
    starred: false,
    important: false,
    labels: ['Personal'],
    category: 'primary',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-5',
    threadId: 'thread-apple-invoice',
    sender: 'Apple Store',
    senderEmail: 'no_reply@email.apple.com',
    avatar: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Your invoice from Apple: iCloud+ with 2TB Storage',
    preview: 'Receipt for Apple ID. Order ID: MNB7729901. iCloud+ with 2TB Storage monthly plan billed to Apple Card...',
    body: `Apple Receipt
Order ID: MNB7729901
Date: September 7, 2026
Document No: 198284729104

Billed To: Alex Morgan
Payment Method: Apple Card (•••• 8912)

Item:
iCloud+ with 2TB Storage (Monthly Plan)
Duration: Sep 7, 2026 – Oct 7, 2026
Price: $9.99

Tax: $0.85
Total Billed: $10.84 USD

Manage your subscription anytime in Settings > Apple ID > Subscriptions.`,
    timestamp: now - (8 * hour),
    dateFormatted: 'Sep 6',
    read: true,
    starred: false,
    important: false,
    labels: ['Finance', 'Shopping'],
    category: 'promotions',
    hasAttachment: true,
    attachments: [
      {
        id: 'att-apple-inv',
        name: 'Apple_Receipt_MNB7729901.pdf',
        size: '142 KB',
        type: 'pdf',
        url: '#'
      }
    ]
  },
  {
    id: 'mail-6',
    threadId: 'thread-tldr-newsletter',
    sender: 'TLDR Tech Daily',
    senderEmail: 'dan@tldrnewsletter.com',
    avatar: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'TLDR: Modern Web Frameworks & Android 16 Material 3 Expressive',
    preview: 'Google previewed the next generation of adaptive Material Design for foldable devices and cross-platform web shells...',
    body: `TLDR Tech — September 7, 2026

📱 MOBILE & DESIGN
Google previews next-gen Material 3 Expressive tokens (4 minute read)
The new guidelines bring fluid container transforms, adaptive bottom sheets, and ultra-snappy haptic feedback primitives to web and mobile web apps.

⚡ WEB DEVELOPMENT
Why offline-first PWAs are dominating the mobile productivity landscape (6 minute read)
With modern Service Workers and client cache storage, web email clients achieve sub-16ms touch responses matching native compiled Kotlin apps.

🚀 QUICK HITS
- V8 engine lands new memory compaction algorithms.
- CSS @starting-style and view transitions now supported across 98% of mobile browsers.

Sponsored by CloudFlow.`,
    timestamp: now - (14 * hour),
    dateFormatted: 'Sep 6',
    read: false,
    starred: true,
    important: false,
    labels: [],
    category: 'updates',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-7',
    threadId: 'thread-amazon-shipping',
    sender: 'Amazon Delivery',
    senderEmail: 'shipment-tracking@amazon.com',
    avatar: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Delivered: Anker Prime 100W USB-C GaN Wall Charger',
    preview: 'Your package was delivered at 2:14 PM near the front porch. Photo proof attached in your order details...',
    body: `Hi Alex,

Great news! Your package containing:
- Anker Prime 100W USB-C GaN Charger, 3-Port Ultra-Compact Foldable
Was delivered today at 2:14 PM.

Delivery location: Front porch / Secured entry
Tracking number: TBA302918471920

Track or report delivery issues in the Amazon app.`,
    timestamp: now - (18 * hour),
    dateFormatted: 'Sep 6',
    read: true,
    starred: false,
    important: false,
    labels: ['Shopping'],
    category: 'promotions',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-8',
    threadId: 'thread-yc-scout',
    sender: 'Kunal Shah',
    senderEmail: 'kunal@foundersfoundry.vc',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Intro / Following your open source work on MailFlow',
    preview: 'Hey Alex, noticed your latest commits on responsive email clients and mobile touch gestures. Would love to grab coffee in SOMA...',
    body: `Hey Alex,

I have been following your open-source work on modern web architectures and was blown away by the mobile swipe latency in your latest MailFlow demos.

We are actively investing in next-gen developer productivity and communication tools. If you are ever exploring backing or taking MailFlow to the next stage, I would love to treat you to coffee at Sightglass in SOMA or jump on a quick 15-minute video call.

Let me know if next Tuesday or Thursday works!

Warmly,
Kunal Shah | General Partner`,
    timestamp: now - (1 * day),
    dateFormatted: 'Sep 5',
    read: false,
    starred: true,
    important: true,
    labels: ['Work'],
    category: 'primary',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-9',
    threadId: 'thread-united-flight',
    sender: 'United Airlines',
    senderEmail: 'reservations@united.com',
    avatar: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Confirmation: SFO to HND Flight UA875 on Oct 14',
    preview: 'Confirmation code: K9X2P4. Seat 12A (Economy Plus). Check-in opens 24 hours before scheduled departure...',
    body: `Dear Alex Morgan,

Thank you for choosing United. Your international flight reservation is confirmed.

Confirmation Code: K9X2P4
Flight: UA 875 (Boeing 787-9 Dreamliner)
Depart: San Francisco (SFO) — Mon, Oct 14, 11:30 AM
Arrive: Tokyo Haneda (HND) — Tue, Oct 15, 3:20 PM
Seat: 12A (Window, Economy Plus)

Boarding pass will be available in your United app 24 hours prior to departure.`,
    timestamp: now - (2 * day),
    dateFormatted: 'Sep 4',
    read: true,
    starred: true,
    important: true,
    labels: ['Travel'],
    category: 'updates',
    hasAttachment: true,
    attachments: [
      {
        id: 'att-flight-ticket',
        name: 'United_E-Ticket_K9X2P4.pdf',
        size: '380 KB',
        type: 'pdf',
        url: '#'
      }
    ]
  },
  {
    id: 'mail-10',
    threadId: 'thread-stripe-payout',
    sender: 'Stripe Payments',
    senderEmail: 'payouts@stripe.com',
    avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: '$3,420.00 USD is on the way to your bank account',
    preview: 'Payout reference: po_1Oq294kLk1. Expected arrival: Sep 8, 2026 to JPMorgan Chase Bank ending in 4921...',
    body: `Stripe Payout Notification

A payout of $3,420.00 USD is on its way to your bank account:
- Bank: JPMorgan Chase Bank, N.A.
- Account ending in: 4921
- Expected arrival: Tomorrow, September 8, 2026
- Payout reference ID: po_1Oq294kLk1

View payout breakdown and invoices in your Stripe Dashboard.`,
    timestamp: now - (3 * day),
    dateFormatted: 'Sep 3',
    read: true,
    starred: false,
    important: false,
    labels: ['Finance', 'Work'],
    category: 'updates',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-11',
    threadId: 'thread-linkedin-network',
    sender: 'LinkedIn Invitations',
    senderEmail: 'invitations@linkedin.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Claire Beauchamp wants to connect on LinkedIn',
    preview: 'Principal Staff Engineer at Google Brain: "Hi Alex, enjoyed your talk at the Bay Area Web Performance summit..."',
    body: `Hi Alex,

Claire Beauchamp (Principal Staff Engineer at Google DeepMind) sent you a connection request:

"Hi Alex, enjoyed your talk at the Bay Area Web Performance summit on optimizing 60fps gesture animations. Would love to stay connected!"

Accept invitation or view profile on LinkedIn.`,
    timestamp: now - (4 * day),
    dateFormatted: 'Sep 2',
    read: true,
    starred: false,
    important: false,
    labels: ['Work'],
    category: 'social',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-12',
    threadId: 'thread-google-cloud',
    sender: 'Google Cloud Platform',
    senderEmail: 'cloud-billing@google.com',
    avatar: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Budget alert: 50% threshold reached for Project mailflow-prod',
    preview: 'Your Google Cloud spend has exceeded 50% ($250.00 of $500.00) for the billing period Sep 1 - Sep 30...',
    body: `Google Cloud Billing Alert

Your billing account "Production Workloads" has exceeded 50% of your $500.00 monthly budget:
- Project: mailflow-prod (ID: 3a3f44a1-b734)
- Current Spend: $258.40
- Forecasted Spend: $492.10

Primary services driving cost:
1. Cloud Run (Serverless microservices)
2. Cloud Storage Multi-Regional CDN
3. Cloud Spanner Read/Write replicas

No service interruptions will occur. You can review quotas or modify budget thresholds in the Cloud Console.`,
    timestamp: now - (5 * day),
    dateFormatted: 'Sep 1',
    read: true,
    starred: false,
    important: true,
    labels: ['Projects', 'Finance'],
    category: 'updates',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-13',
    threadId: 'thread-reddit-digest',
    sender: 'Reddit Daily Digest',
    senderEmail: 'noreply@redditmail.com',
    avatar: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'Trending in r/webdev: "Why 2026 is the golden age of responsive design"',
    preview: 'Top post with 2.8k upvotes and 410 comments: Building touch-native web apps that rival native Android APKs...',
    body: `Reddit Digest for r/webdev

🔥 Trending Today:
"Why 2026 is the golden age of responsive web design"
Posted by u/frontend_wizard (2,840 points • 412 comments)

"Between CSS Subgrid, container queries, modern View Transitions API, and zero-latency local caching, we can now build full web applications that feel identically responsive to a 120Hz native mobile client."

Read top comments on Reddit.`,
    timestamp: now - (6 * day),
    dateFormatted: 'Aug 31',
    read: true,
    starred: false,
    important: false,
    labels: [],
    category: 'forums',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-14',
    threadId: 'thread-crypto-security',
    sender: 'Security Center',
    senderEmail: 'security-no-reply@securityflow.org',
    avatar: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'New sign-in from Pixel 9 Pro in San Francisco, CA',
    preview: 'Your MailFlow account was accessed from a new device running Android 15. If this was you, you can disregard this alert...',
    body: `Security Alert: New Sign-in Detected

Device: Google Pixel 9 Pro
OS: Android 15
Browser: Chrome Mobile 128
Location: San Francisco, California, USA
IP Address: 172.56.42.109
Time: Today at 8:42 AM PST

If you recognize this activity, no action is required. If you did not sign in, secure your account immediately.`,
    timestamp: now - (7 * day),
    dateFormatted: 'Aug 30',
    read: true,
    starred: false,
    important: false,
    labels: [],
    category: 'updates',
    hasAttachment: false,
    attachments: []
  },
  {
    id: 'mail-15',
    threadId: 'thread-draft-project-pitch',
    sender: 'Alex Morgan',
    senderEmail: 'alex.morgan@flowmail.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    recipients: ['investors@sequoia.com'],
    subject: '[Draft] MailFlow: Next Generation Responsive Email Client',
    preview: 'Draft message: Hi Roelof, sharing our seed deck and initial metrics on MailFlow. We have seen 40k active users...',
    body: `Hi Roelof,

Following up on our brief chat at the AI summit, I've put together our seed memo and product architecture breakdown for MailFlow.

Key highlights:
- 40,000 weekly active users with 68% retention at 30 days
- Instant sub-20ms search indexing client-side
- Offline-first architecture with PWA standalone installability
- Full Material 3 dark surface hierarchy

Attached is our 12-page investor deck. Let me know when you have 15 minutes next week.`,
    timestamp: now - (8 * day),
    dateFormatted: 'Aug 29',
    read: true,
    starred: false,
    important: false,
    labels: ['Projects'],
    category: 'primary',
    draft: true,
    hasAttachment: true,
    attachments: [
      {
        id: 'att-deck-pdf',
        name: 'MailFlow_Seed_Deck_2026.pdf',
        size: '4.8 MB',
        type: 'pdf',
        url: '#'
      }
    ]
  },
  {
    id: 'mail-16',
    threadId: 'thread-spam-lottery',
    sender: 'Global Lottery Rewards',
    senderEmail: 'winner772@claim-gift-free.biz',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&auto=format&fit=crop&q=80',
    recipients: ['alex.morgan@flowmail.io'],
    subject: 'CLAIM NOW: You have been selected for $5,000 Amazon Gift Card',
    preview: 'Congratulations! Your email was randomly chosen in our annual consumer rewards sweepstakes. Click here to verify...',
    body: `CONGRATULATIONS ALEX!

You have been selected as the weekly first prize winner of a $5,000 Amazon shopping spree.
To claim your card, simply verify your social security number and shipping address within 24 hours.`,
    timestamp: now - (9 * day),
    dateFormatted: 'Aug 28',
    read: true,
    starred: false,
    important: false,
    labels: [],
    category: 'promotions',
    spam: true,
    hasAttachment: false,
    attachments: []
  }
];
