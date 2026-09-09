import type { DesignProblem, Lesson, Resource, ReviewCard, Track } from './course-types';

export const sourceSnapshot = {
  capturedAt: '2026-09-09',
  hld: {
    repository: 'https://github.com/ashishps1/awesome-system-design-resources',
    commit: '25724090f7dd7746129b7194b55504f9d06f86ed',
    license: 'GPL-3.0',
  },
  lld: {
    repository: 'https://github.com/saivarun1410/awesome-low-level-design',
    commit: 'a2b9419e98d0e0b17ccac3fbdbd139bb3ea905ff',
    license: 'GPL-3.0',
  },
} as const;

export const tracks: Track[] = [
  { id: 'foundations', order: 1, title: 'Requirements & estimation', description: 'Frame the problem, quantify demand, and set the quality bar before choosing technology.', accent: '#22d3ee' },
  { id: 'networking', order: 2, title: 'Networking & the web', description: 'Trace requests across the network and understand where latency and failure enter.', accent: '#60a5fa' },
  { id: 'apis', order: 3, title: 'APIs & communication', description: 'Design durable contracts and choose the right interaction model.', accent: '#818cf8' },
  { id: 'data', order: 4, title: 'Data & storage', description: 'Model, index, partition, replicate, and select storage around access patterns.', accent: '#a78bfa' },
  { id: 'caching', order: 5, title: 'Caching & delivery', description: 'Reduce expensive work while managing freshness, invalidation, and hot keys.', accent: '#f472b6' },
  { id: 'async', order: 6, title: 'Queues, streams & events', description: 'Decouple work, absorb bursts, and build dependable event flows.', accent: '#fb7185' },
  { id: 'distributed', order: 7, title: 'Distributed systems', description: 'Reason about coordination, consistency, partial failure, and time.', accent: '#f59e0b' },
  { id: 'reliability', order: 8, title: 'Reliability & operations', description: 'Keep systems observable, recoverable, and safe under pressure.', accent: '#84cc16' },
  { id: 'architecture', order: 9, title: 'Architecture & tradeoffs', description: 'Choose boundaries and patterns using explicit costs and constraints.', accent: '#10b981' },
  { id: 'hld', order: 10, title: 'High-level design lab', description: 'Apply the complete HLD method across 45 real interview systems.', accent: '#14b8a6' },
  { id: 'oop', order: 11, title: 'Java OOP, UML & patterns', description: 'Turn behavior into maintainable object models and readable Java.', accent: '#06b6d4' },
  { id: 'lld', order: 12, title: 'Low-level design lab', description: 'Practice class, interaction, and extension design across 33 systems.', accent: '#3b82f6' },
  { id: 'case-studies', order: 13, title: 'Systems in the wild', description: 'Read landmark papers and production stories with an architect’s lens.', accent: '#6366f1' },
];

const groups: Array<[string, string, string[]]> = [
  ['foundations', 'Design method', ['Functional vs non-functional requirements', 'Back-of-the-envelope estimation', 'Capacity planning', 'Service-level indicators and objectives', 'Read and write paths', 'Bottleneck analysis', 'Scalability', 'Availability', 'Reliability', 'Single point of failure']],
  ['networking', 'Networking', ['OSI Model', 'IP Addresses', 'Domain Name System (DNS)', 'Proxy vs Reverse Proxy', 'HTTP/HTTPS', 'TCP vs UDP', 'Load Balancing', 'Checksums']],
  ['apis', 'Interfaces', ['APIs', 'API Gateway', 'REST vs GraphQL', 'WebSockets', 'Webhooks', 'Idempotency', 'Rate limiting', 'API Design']],
  ['data', 'Data systems', ['ACID Transactions', 'SQL vs NoSQL', 'Database Indexes', 'Database Sharding', 'Data Replication', 'Database Scaling', 'Database Types', 'Bloom Filters', 'Database Architectures', 'Data modeling by access pattern', 'LSM trees and B-trees', 'Object, block and file storage']],
  ['caching', 'Caching', ['Caching 101', 'Caching Strategies', 'Cache Eviction Policies', 'Distributed Caching', 'Content Delivery Network (CDN)']],
  ['async', 'Asynchronous communication', ['Pub/Sub', 'Message Queues', 'Change Data Capture (CDC)', 'Event ordering', 'Delivery semantics', 'Backpressure and load shedding', 'Batch vs Stream Processing', 'Synchronous vs asynchronous communication']],
  ['distributed', 'Distributed coordination', ['Heartbeats', 'Service Discovery', 'Consensus Algorithms', 'Distributed Locking', 'Gossip Protocol', 'Consistent Hashing', 'CAP Theorem', 'Strong vs Eventual Consistency', 'Logical clocks', 'Quorums', 'Leader election', 'Split brain and fencing tokens']],
  ['reliability', 'Production readiness', ['Failover', 'Fault Tolerance', 'Circuit Breaker', 'Disaster Recovery', 'Distributed Tracing', 'Timeouts, retries and jitter', 'Health checks', 'Observability', 'Multi-region design', 'Zero-downtime deployment']],
  ['architecture', 'Architecture decisions', ['Client-Server Architecture', 'Microservices Architecture', 'Serverless Architecture', 'Event-Driven Architecture', 'Peer-to-Peer (P2P) Architecture', 'Top 15 Tradeoffs', 'Vertical vs Horizontal Scaling', 'Concurrency vs Parallelism', 'Long Polling vs WebSockets', 'Stateful vs Stateless Design', 'Read-Through vs Write-Through Cache', 'Push vs Pull Architecture', 'REST vs RPC', 'Latency vs Throughput vs Bandwidth', 'Security boundaries and threat modeling', 'Cost-aware architecture', 'Modular monoliths and service boundaries']],
  ['oop', 'OOP foundations', ['Classes and Objects', 'Enums', 'Interfaces', 'Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism', 'Association', 'Aggregation', 'Composition', 'Dependency', 'DRY Principle', 'YAGNI Principle', 'KISS Principle', 'SOLID Principles', 'SOLID with Java']],
  ['oop', 'Design patterns', ['Singleton', 'Adapter', 'Iterator', 'Factory Method', 'Bridge', 'Observer', 'Abstract Factory', 'Composite', 'Strategy', 'Builder', 'Decorator', 'Command', 'Prototype', 'Facade', 'State', 'Flyweight', 'Template Method', 'Proxy', 'Visitor', 'Mediator', 'Memento', 'Chain of Responsibility']],
  ['oop', 'UML', ['Class Diagram', 'Use Case Diagram', 'Sequence Diagram', 'Activity Diagram', 'State Machine Diagram']],
];

const keyIdeas: Record<string, string> = {
  'Scalability': 'Scalability is the ability to preserve acceptable performance as load grows by adding resources or reducing work per request.',
  'Availability': 'Availability is the proportion of time a system can successfully serve valid requests; redundancy only helps when failover also works.',
  'Reliability': 'Reliability asks whether the system continues to produce correct outcomes over time, including during faults and recovery.',
  'CAP Theorem': 'During a network partition, a distributed system must choose whether a conflicting operation favors consistency or availability.',
  'Consistent Hashing': 'Consistent hashing places nodes and keys on a logical ring so membership changes move only a bounded fraction of keys.',
  'Idempotency': 'An idempotent operation can be retried without applying the intended effect more than once.',
  'Rate limiting': 'Rate limiting protects finite capacity by admitting work according to identity, budget, and time.',
  'Database Indexes': 'An index trades write cost and storage for a faster path to selected rows; its value depends on actual query shape.',
  'Database Sharding': 'Sharding divides ownership of data across nodes; the shard key determines balance, locality, and query cost.',
  'Data Replication': 'Replication creates additional copies for availability and read scale while introducing lag, conflict, and failover decisions.',
  'Caching 101': 'A cache keeps expensive or distant results closer to demand; correctness depends on what staleness the product can tolerate.',
  'Message Queues': 'A queue separates producers from consumers, absorbs bursts, and turns immediate work into retryable work.',
  'Pub/Sub': 'Publish/subscribe fans each event to independent subscribers without coupling the producer to their identities.',
  'Consensus Algorithms': 'Consensus lets healthy nodes agree on one ordered history despite delay, duplication, and node failure.',
  'Distributed Locking': 'A distributed lock grants temporary authority, but leases and fencing are needed when holders pause or partitions occur.',
  'Circuit Breaker': 'A circuit breaker stops repeated calls to an unhealthy dependency so it can recover and callers can degrade deliberately.',
  'Microservices Architecture': 'Microservices trade independent ownership and deployment for network, data, and operational complexity.',
  'Event-Driven Architecture': 'Event-driven systems publish facts about completed changes and let consumers react asynchronously.',
  'SOLID Principles': 'SOLID is a set of pressures that keeps object models cohesive, substitutable, focused, and easy to extend.',
  'Composition': 'Composition models strong ownership: the whole controls the lifecycle of its parts and exposes behavior through them.',
  'Strategy': 'Strategy moves a family of interchangeable algorithms behind one contract and selects one at runtime.',
  'Observer': 'Observer broadcasts state changes to registered dependents while keeping the publisher unaware of their concrete behavior.',
  'Factory Method': 'Factory Method moves construction behind an overridable decision so callers depend on a product abstraction.',
};

const trackModels: Record<string, string> = {
  foundations: 'Treat architecture as a chain: requirements → numbers → guarantees → components → failure review.',
  networking: 'Follow one request hop by hop: name resolution, connection, encryption, routing, application, response.',
  apis: 'A contract is a promise across time. Separate resource semantics, transport behavior, failure, and evolution.',
  data: 'Start with access patterns. Map each read and write to placement, indexes, consistency, and recovery.',
  caching: 'Every cache is a second copy. Define ownership, freshness, invalidation, eviction, and failure behavior.',
  async: 'Model producers, durable handoff, ordering scope, consumer progress, retries, and poison messages.',
  distributed: 'Assume messages can be late, repeated, reordered, or lost and that any participant may pause.',
  reliability: 'Design the detection and recovery loop: observe, isolate, degrade, repair, verify, and learn.',
  architecture: 'Choose the simplest boundary that isolates a real rate of change, scale need, or failure domain.',
  oop: 'Assign each behavior to the object that owns the information required to perform it.',
};

const trackTradeoffs: Record<string, string[]> = {
  foundations: ['Accuracy versus speed of estimation', 'Headroom versus infrastructure cost', 'Product guarantees versus implementation freedom'],
  networking: ['Latency versus connection overhead', 'Reachability versus isolation', 'Protocol simplicity versus delivery guarantees'],
  apis: ['Client flexibility versus server control', 'Synchronous simplicity versus temporal coupling', 'Compatibility versus clean redesign'],
  data: ['Consistency versus availability during partitions', 'Read speed versus write amplification', 'Locality versus even distribution'],
  caching: ['Freshness versus latency', 'Hit rate versus memory cost', 'Simple expiry versus precise invalidation'],
  async: ['Throughput versus ordering', 'Fast acknowledgement versus processing certainty', 'Retention versus storage cost'],
  distributed: ['Coordination safety versus availability', 'Replication factor versus cost', 'Leader simplicity versus failover delay'],
  reliability: ['Fast recovery versus false positives', 'Redundancy versus operational complexity', 'Detailed telemetry versus cost and privacy'],
  architecture: ['Independent deployment versus distributed complexity', 'Isolation versus duplicated work', 'Flexibility versus governance'],
  oop: ['Reuse versus coupling', 'Abstraction versus indirection', 'Extensibility versus unnecessary generality'],
};

const trackExample: Record<string, string> = {
  foundations: 'For a photo feed, estimate daily active users, peak reads per second, media bytes, and the freshness users actually notice before drawing services.',
  networking: 'A mobile request resolves DNS, negotiates TLS at an edge, crosses a load balancer, reaches an application instance, and may call several dependencies.',
  apis: 'A payment creation endpoint accepts an idempotency key, returns a stable operation resource, and makes retry behavior explicit.',
  data: 'A timeline query is shaped around user, time range, and pagination; the primary key and indexes should make that exact path predictable.',
  caching: 'A product page can tolerate a minute of stale description data but inventory requires a different source of truth and invalidation path.',
  async: 'An order transaction writes an outbox record; a relay publishes it; independent consumers update fulfillment, email, and analytics.',
  distributed: 'A coordinator pauses after its lease expires. A fencing token lets storage reject its stale write even if it resumes later.',
  reliability: 'When recommendations fail, the home page serves a cached popular list while telemetry records the degraded dependency and recovery.',
  architecture: 'A modular monolith keeps checkout local until team ownership or scaling evidence justifies extracting payments behind a durable boundary.',
  oop: 'A parking lot delegates spot selection to a strategy and payment to a gateway interface, keeping the aggregate focused on parking rules.',
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

let lessonIndex = 0;
export const lessons: Lesson[] = groups.flatMap(([trackId, category, titles]) => titles.map((title, index) => {
  const id = `lesson-${String(++lessonIndex).padStart(3, '0')}`;
  const summary = keyIdeas[title] ?? `${title} is a design tool for controlling ${trackId === 'oop' ? 'responsibility, coupling, and change' : 'load, state, coordination, and failure'}; use it only after naming the constraint it resolves.`;
  const source = ['foundations', 'reliability'].includes(trackId) && !['Scalability', 'Availability', 'Reliability', 'Single point of failure', 'Failover', 'Fault Tolerance', 'Circuit Breaker', 'Disaster Recovery', 'Distributed Tracing'].includes(title)
    ? 'original'
    : trackId === 'oop' ? 'lld-repo' : 'hld-repo';
  return {
    id,
    slug: slugify(title),
    trackId,
    title,
    category,
    duration: index % 3 === 0 ? 16 : index % 3 === 1 ? 12 : 14,
    level: trackId === 'foundations' || (trackId === 'oop' && category === 'OOP foundations') ? 'foundation' : trackId === 'distributed' || category === 'Design patterns' ? 'advanced' : 'intermediate',
    summary,
    mentalModel: trackModels[trackId],
    example: trackExample[trackId],
    tradeoffs: trackTradeoffs[trackId],
    mistakes: [
      `Choosing ${title} because it is familiar instead of tying it to a measurable requirement.`,
      'Ignoring the unhappy path: partial failure, retries, overload, migration, or recovery.',
      'Naming a component without explaining ownership, data flow, and operational signals.',
    ],
    prerequisites: index === 0 ? [] : [],
    quiz: {
      id: `${id}-check`,
      prompt: `What is the strongest reason to introduce ${title} into a design?`,
      options: ['It is common in large companies', 'It resolves a named constraint with understood costs', 'It removes every failure mode', 'It avoids measuring the workload'],
      answer: 1,
      explanation: 'Architecture choices are justified by the specific constraint they resolve and the new costs they introduce.',
    },
    source,
  };
}));

const hldTitles = [
  'URL Shortener like TinyURL', 'Autocomplete for Search Engines', 'Load Balancer', 'Content Delivery Network', 'Parking Garage', 'Vending Machine', 'Distributed Key-Value Store', 'Distributed Cache', 'Authentication System', 'Unified Payments Interface (UPI)', 'WhatsApp', 'Spotify', 'Instagram', 'Notification Service', 'Distributed Job Scheduler', 'Tinder', 'Facebook', 'Twitter', 'Reddit', 'Netflix', 'YouTube', 'Google Search', 'E-commerce Store like Amazon', 'TikTok', 'Shopify', 'Airbnb', 'Rate Limiter', 'Distributed Message Queue like Kafka', 'Flight Booking System', 'Online Code Editor', 'Analytics Platform (Metrics & Logging)', 'Payment System', 'Digital Wallet', 'Location Based Service like Yelp', 'Uber', 'Food Delivery App like DoorDash', 'Google Docs', 'Google Maps', 'Zoom', 'File Sharing System like Dropbox', 'Ticket Booking System like BookMyShow', 'Distributed Web Crawler', 'Code Deployment System', 'Distributed Cloud Storage like S3', 'Distributed Locking Service'
];

const lldTitles = [
  'Parking Lot', 'Stack Overflow', 'Vending Machine', 'Logging Framework', 'Traffic Signal Control System', 'Coffee Vending Machine', 'Task Management System', 'ATM', 'LinkedIn', 'LRU Cache', 'Tic Tac Toe Game', 'Pub Sub System', 'Elevator System', 'Car Rental System', 'Online Auction System', 'Hotel Management System', 'Digital Wallet Service', 'Airline Management System', 'Library Management System', 'Social Network like Facebook', 'Restaurant Management System', 'Concert Ticket Booking System', 'CricInfo', 'Splitwise', 'Chess Game', 'Snake and Ladder Game', 'Ride-Sharing Service like Uber', 'Course Registration System', 'Movie Ticket Booking System', 'Online Shopping System like Amazon', 'Online Stock Brokerage System', 'Music Streaming Service like Spotify', 'Online Food Delivery Service like Swiggy'
];

const videoIds = [
  '8zX0rue2Hic','NtMvNh0WFVM','D0kDMUgo27c','rnZmdmlR-2M','iuqZvajTOyA','uj_4vxm9u90','QpLy0_c_RXk','tndzLznxq40','9-hjBGxuiEs','wYk0xPP_P_8','KYExYE_9nIY','psQzyFfsUGU','jPKTo1iGQiE','CeGtqouT8eA','EpASu_1dUdE','Z-0g_aJL5Fw','lEL4F_0J3l8','YyOXt2MEkv4','mhUQe4BKZXs','iJLL-KPqBpM','qsGcfVGvFSs','07jkn4jUtso','kIcq1_pBQSY','olfaBgJrUBI','4ijjIUeq6hE','M4lR_Va97cQ','umWABit-wbk','iRhSAR3ldTw','2auwirNBvGg','jk3yvVfNvds','G32ThJakeHk','U0xTu6E2CT8','lBAwJgoO3Ek','BKZxZwUgL3Y','q0KGYwNbf-0','UmWtcgC96X8','v7x75aN9liM'
];

const videoByTitle: Record<string, string> = {};
[
  'Content Delivery Network','Parking Garage','Vending Machine','Distributed Key-Value Store','Distributed Cache','Authentication System','Unified Payments Interface (UPI)','Tinder','Facebook','Twitter','Reddit','Netflix','YouTube','Google Search','E-commerce Store like Amazon','TikTok','Shopify','Airbnb','Rate Limiter','Distributed Message Queue like Kafka','Flight Booking System','Online Code Editor','Analytics Platform (Metrics & Logging)','Payment System','Digital Wallet','Location Based Service like Yelp','Uber','Food Delivery App like DoorDash','Google Docs','Google Maps','Zoom','File Sharing System like Dropbox','Ticket Booking System like BookMyShow','Distributed Web Crawler','Code Deployment System','Distributed Cloud Storage like S3','Distributed Locking Service'
].forEach((title, index) => { videoByTitle[title] = videoIds[index]; });

function problemLevel(index: number, total: number): 'Easy' | 'Medium' | 'Hard' {
  if (index < Math.ceil(total * .22)) return 'Easy';
  if (index < Math.ceil(total * .68)) return 'Medium';
  return 'Hard';
}

export const problems: DesignProblem[] = [
  ...hldTitles.map((title, index): DesignProblem => ({
    id: `hld-${String(index + 1).padStart(2, '0')}`,
    slug: `hld-${slugify(title)}`,
    kind: 'HLD',
    title: `Design ${title}`,
    level: problemLevel(index, hldTitles.length),
    duration: index < 10 ? 35 : index < 30 ? 50 : 65,
    prompt: `Design ${title} for a global product. Make demand, consistency, availability, privacy, and recovery assumptions explicit before choosing components.`,
    focus: ['Requirements and scale', 'API and data model', 'Critical read/write path', 'Partitioning and replication', 'Failure and observability'],
    rubric: ['Quantifies peak traffic and storage with defensible assumptions.', 'Defines APIs and ownership before naming infrastructure.', 'Explains the critical data path and consistency requirement.', 'Identifies bottlenecks, overload behavior, and recovery.', 'Makes at least two important tradeoffs explicit.'],
    sourceUrl: sourceSnapshot.hld.repository,
    videoId: videoByTitle[title],
  })),
  ...lldTitles.map((title, index): DesignProblem => ({
    id: `lld-${String(index + 1).padStart(2, '0')}`,
    slug: `lld-${slugify(title)}`,
    kind: 'LLD',
    title: `Design ${title}`,
    level: problemLevel(index, lldTitles.length),
    duration: index < 8 ? 40 : index < 23 ? 55 : 70,
    prompt: `Model ${title} in Java. Clarify use cases, invariants, object responsibilities, interactions, and likely extension points.`,
    focus: ['Use cases and invariants', 'Core entities and value objects', 'Relationships and ownership', 'Behavior and interaction sequence', 'Extension and test seams'],
    rubric: ['Models behavior rather than producing only data-holder classes.', 'Keeps invariants close to the state they protect.', 'Uses composition and interfaces deliberately.', 'Shows one important interaction as a sequence.', 'Explains how the design changes for a new requirement.'],
    sourceUrl: `${sourceSnapshot.lld.repository}/blob/main/problems/${slugify(title).replace('tic-tac-toe-game','tic-tac-toe').replace('snake-and-ladder-game','snake-and-ladder').replace('ride-sharing-service-like-uber','ride-sharing-service').replace('online-food-delivery-service-like-swiggy','food-delivery-service')}.md`,
    javaStarter: `public final class ${title.replace(/[^a-zA-Z0-9]/g, '')}Service {\n    // Start with behavior and invariants, not getters.\n    public void execute(Command command) {\n        throw new UnsupportedOperationException("model the use case");\n    }\n}`,
  })),
];

const videoResources: Resource[] = hldTitles.filter(title => videoByTitle[title]).map((title, index) => ({
  id: `video-${String(index + 1).padStart(2, '0')}`,
  title: `Design ${title}`,
  kind: 'video',
  url: `https://www.youtube.com/watch?v=${videoByTitle[title]}`,
  videoId: videoByTitle[title],
  description: 'Linked HLD walkthrough from the curated source repository.',
}));

const channels = [
  ['Tech Dummies Narendra L','https://www.youtube.com/@TechDummiesNarendraL'],['Gaurav Sen','https://www.youtube.com/@gkcs'],['codeKarle','https://www.youtube.com/@codeKarle'],['ByteByteGo','https://www.youtube.com/@ByteByteGo'],['System Design Interview','https://www.youtube.com/@SystemDesignInterview'],['sudoCODE','https://www.youtube.com/@sudocode'],['Success in Tech','https://www.youtube.com/@SuccessinTech/videos'],
];

const papers = [
  ['Paxos: The Part-Time Parliament','https://lamport.azurewebsites.net/pubs/lamport-paxos.pdf'],['MapReduce','https://research.google.com/archive/mapreduce-osdi04.pdf'],['The Google File System','https://static.googleusercontent.com/media/research.google.com/en//archive/gfs-sosp2003.pdf'],['Dynamo','https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf'],['Kafka','https://notes.stephenholiday.com/Kafka.pdf'],['Spanner','https://static.googleusercontent.com/media/research.google.com/en//archive/spanner-osdi2012.pdf'],['Bigtable','https://static.googleusercontent.com/media/research.google.com/en//archive/bigtable-osdi06.pdf'],['ZooKeeper','https://www.usenix.org/legacy/event/usenix10/tech/full_papers/Hunt.pdf'],['The Log-Structured Merge-Tree','https://www.cs.umb.edu/~poneil/lsmtree.pdf'],['The Chubby lock service','https://research.google.com/archive/chubby-osdi06.pdf'],
];

const caseStudies = [
  ['How Discord stores trillions of messages','https://discord.com/blog/how-discord-stores-trillions-of-messages'],['Building In-Video Search at Netflix','https://netflixtechblog.com/building-in-video-search-936766f0017c'],['How Canva scaled media uploads','https://www.canva.dev/blog/engineering/from-zero-to-50-million-uploads-per-day-scaling-media-at-canva/'],['How Airbnb avoids double payments','https://medium.com/airbnb-engineering/avoiding-double-payments-in-a-distributed-payments-system-2981f6b070bb'],["Stripe’s payments APIs — the first 10 years",'https://stripe.com/blog/payment-api-design'],['Real-time messaging at Slack','https://slack.engineering/real-time-messaging/'],
];

export const resources: Resource[] = [
  { id: 'repo-hld', title: 'Awesome System Design Resources', kind: 'repository', url: sourceSnapshot.hld.repository, description: 'The GPL-3.0 HLD catalog used as a curriculum source.' },
  { id: 'repo-lld', title: 'Awesome Low Level Design', kind: 'repository', url: sourceSnapshot.lld.repository, description: 'The GPL-3.0 LLD problems, diagrams, and multi-language solution catalog.' },
  ...videoResources,
  ...channels.map(([title,url], index): Resource => ({ id: `channel-${index + 1}`, title, kind: 'channel', url, description: 'System design channel linked by the HLD repository.' })),
  ...papers.map(([title,url], index): Resource => ({ id: `paper-${index + 1}`, title, kind: 'paper', url, description: 'Landmark paper: read for the problem, core mechanism, guarantees, and modern influence.' })),
  ...caseStudies.map(([title,url], index): Resource => ({ id: `case-${index + 1}`, title, kind: 'case-study', url, description: 'Production engineering case study: extract constraints, decisions, incidents, and tradeoffs.' })),
  { id: 'book-ddia', title: 'Designing Data-Intensive Applications', kind: 'book', url: 'https://www.amazon.in/dp/9352135245', description: 'Recommended deep reference for data systems.' },
  { id: 'book-head-first', title: 'Head First Design Patterns', kind: 'book', url: 'https://www.amazon.in/dp/9385889753', description: 'Recommended pattern reference for LLD.' },
];

export const reviewCards: ReviewCard[] = lessons.map(lesson => ({
  id: `card-${lesson.id}`,
  lessonId: lesson.id,
  front: `Explain ${lesson.title} without naming a product or vendor.`,
  back: lesson.summary,
}));

export const courseStats = {
  tracks: tracks.length,
  lessons: lessons.length,
  hldProblems: problems.filter(p => p.kind === 'HLD').length,
  lldProblems: problems.filter(p => p.kind === 'LLD').length,
  videos: resources.filter(r => r.kind === 'video').length,
  papers: resources.filter(r => r.kind === 'paper').length,
};
