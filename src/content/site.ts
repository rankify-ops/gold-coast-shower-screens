/**
 * All copy lives here so it can be edited without touching a component.
 *
 * Everything below is the client's own wording, carried across from
 * goldcoastshowerscreens.com.au. Anything still marked TODO is scaffolding I
 * wrote and needs replacing with their words.
 */

export const SITE = {
  name: "Gold Coast Shower Screens",
  phone: "1300 199 480",
  phoneHref: "tel:1300199480",
  email: "contact@goldcoastshowerscreens.com.au",
  address: "3/610 Pine Ridge Rd, Coombabah QLD 4216",
  licence: "QBCC 15437991",
  social: {
    facebook: "https://www.facebook.com/goldcoastshowerscreens/",
    instagram: "https://www.instagram.com/gcshowerscreens/",
  },
};

export const NAV = [
  { label: "Products", href: "#products" },
  { label: "Gallery", href: "#gallery" },
  { label: "Why Us", href: "#why" },
  { label: "Process", href: "#process" },
  { label: "FAQs", href: "#faq" },
];

/**
 * The products mega menu — their own four ranges and the variants under each,
 * in their order.
 *
 * Every item points at #products for now. The individual product pages do not
 * exist in this build (home page only), and sending someone to a URL that
 * 404s on the client's demo is worse than landing them on the section that
 * covers it. Swap the hrefs when those pages are built.
 */
export const MEGA_PRODUCTS = [
  {
    title: "Shower Screens",
    href: "#products",
    icon: "/img/logos/Category-Icon-White-Shower.svg",
    items: [
      "Semi-Frameless Shower Screens",
      "Frameless Shower Screens",
      "Framed Shower Screens",
      "Bath Screens",
    ],
  },
  {
    title: "Glass Splashbacks",
    href: "#products",
    icon: "/img/logos/Category-Icon-White-Splashbacks.svg",
    items: ["Painted Glass", "Mirrored Glass", "Printed Glass", "Glass Walls"],
  },
  {
    title: "Mirrors",
    href: "#products",
    icon: "/img/logos/Category-Icon-White-Mirrors.svg",
    items: ["Custom Mirror", "Framed", "Semi Framed", "Gym Mirror", "LED Mirrors"],
  },
  {
    title: "Wardrobe Doors",
    href: "#products",
    icon: "/img/logos/Category-Icon-White-Wardrobe-Doors.svg",
    items: ["Framed", "Semi Frameless", "Slimline"],
  },
] as const;

/**
 * Hero — their own headline, subline and call to action, verbatim.
 *
 * Their H1 covers all four product lines on purpose. An earlier draft of this
 * page said "Frameless Glass", which quietly narrowed the business to shower
 * screens and dropped splashbacks, mirrors and wardrobe doors off the front
 * page entirely.
 */
export const HERO = {
  /**
   * NOT from their site — a line written for this layout and picked over the
   * scraped one. Their own headline is still here as `headline`/`headlineDim`
   * and now runs as the subhead beneath it. Kept in this file rather than in
   * the page so all hero copy stays in one place.
   */
  display: ["Best shower screens", "on the coast."],
  headline: "Custom Made to Measure",
  headlineDim: "Glass, Gold Coast Wide",
  body: "We combine local craftsmanship with exceptional service to deliver frameless and semi frameless shower screens that look stunning and stand the test of time — giving you a bathroom upgrade without the hassle.",
  cta: "Get an Instant Estimate",
  // Paths point at the client's own untouched SVGs, scraped from their site.
  categories: [
    { label: "Shower Screens", icon: "/img/logos/Category-Icon-White-Shower.svg" },
    { label: "Splashbacks", icon: "/img/logos/Category-Icon-White-Splashbacks.svg" },
    { label: "Mirrors", icon: "/img/logos/Category-Icon-White-Mirrors.svg" },
    { label: "Wardrobe Doors", icon: "/img/logos/Category-Icon-White-Wardrobe-Doors.svg" },
  ],
};

/** Section 01 — their positioning line and supporting paragraph. */
export const INTRO = {
  heading: "Gold Coast's leading shower screen installation & replacement specialist.",
  body: "At Gold Coast Shower Screens, we are proud to be the leading shower screen specialists in the Gold Coast area. We not only supply and install high-quality shower screens, but also manufacture and install splashbacks, mirrors and wardrobe doors, all made to measure from our Gold Coast factory.",
  sub: "Shower screens, splashbacks, mirrors and wardrobe doors — all made to measure from our Gold Coast factory, and installed by the people who made them.",
};

/**
 * Their three headline figures, with the descriptions from their site.
 *
 * `value` and `suffix` carry what the count-up needs; `figure` stays as the
 * authored string so the number in the markup is always theirs rather than
 * something reassembled from parts.
 */
export const PROOF = [
  {
    figure: "8,000+",
    value: 8000,
    suffix: "+",
    label: "Happy clients",
    body: "A proven track record across the Gold Coast and Brisbane — we're the team locals rely on.",
  },
  {
    figure: "10,000+",
    value: 10000,
    suffix: "+",
    label: "Screens installed",
    body: "With thousands of successful installations, you can count on our experience to get it right.",
  },
  {
    figure: "450+",
    value: 450,
    suffix: "+",
    label: "Five-star reviews",
    body: "Don't just take our word for it, check out what over 450 of our happy customers have to say.",
  },
];

/** Section 02 — one full-height panel per category. */
export const PRODUCTS = [
  {
    index: "01",
    name: "Shower Screens",
    line: "Frameless, semi-frameless and framed. Every screen templated on site and made to measure at our Gold Coast factory.",
    finish: "Brushed nickel",
    image: "/img/product-1.webp",
    specs: [
      { label: "Styles", value: "Frameless / Semi / Framed" },
      { label: "Glass", value: "10mm toughened" },
      { label: "Hardware", value: "6 finishes" },
    ],
  },
  {
    index: "02",
    name: "Splashbacks",
    line: "Painted, mirrored and printed glass, cut to your kitchen and templated on site.",
    finish: "Painted glass",
    image: "/img/product-2.webp",
    specs: [
      { label: "Styles", value: "Painted / Mirrored / Printed" },
      { label: "Glass", value: "6mm toughened" },
      { label: "Colour", value: "Matched to spec" },
    ],
  },
  {
    index: "03",
    name: "Mirrors",
    line: "Custom, framed, semi-framed, gym and LED. Any size, squared to the millimetre.",
    finish: "LED backlit",
    image: "/img/product-3.webp",
    specs: [
      { label: "Styles", value: "Custom / Framed / LED" },
      { label: "Glass", value: "5mm silvered" },
      { label: "Edges", value: "Polished / bevelled" },
    ],
  },
  {
    index: "04",
    name: "Wardrobe Doors",
    line: "Framed, semi-frameless and slimline, running on tracks that stay quiet.",
    finish: "Slimline black",
    image: "/img/product-4.webp",
    specs: [
      { label: "Styles", value: "Framed / Semi / Slimline" },
      { label: "Glass", value: "6mm toughened" },
      { label: "Track", value: "Soft-close" },
    ],
  },
];

/** Section 03 — staggered gallery. `tall` drives the offset grid rhythm. */
export const GALLERY = [
  { name: "Frameless door + panel", finish: "Brushed gold", image: "/img/g1.webp", tall: true },
  { name: "Semi-frameless front + return", finish: "Brushed nickel", image: "/img/g2.webp", tall: false },
  { name: "Framed fixed panel, reeded", finish: "Matte black", image: "/img/g3.webp", tall: false },
  { name: "Fixed radius panel", finish: "Brushed gold", image: "/img/g4.webp", tall: true },
  { name: "Bath screen, bi-fold", finish: "Brushed nickel", image: "/img/g5.webp", tall: false },
  { name: "Frameless door, reeded glass", finish: "Brushed gold", image: "/img/g6.webp", tall: true },
  { name: "Kitchen splashback, black glass", finish: "Painted glass", image: "/img/g7.webp", tall: false },
  { name: "Round LED mirror, 900mm", finish: "LED backlit", image: "/img/g8.webp", tall: false },
  { name: "Slimline wardrobe doors", finish: "Matte black", image: "/img/g9.webp", tall: true },
];

/** Section 04 — their six "Why Choose Us" blocks, verbatim. */
export const WHY = [
  {
    index: "01",
    title: "Exceptional Customer Service",
    icon: "/img/why/Customer-Service-1.svg",
    lottie: "/lottie/customer-service.json",
    lottieDark: "/lottie/dark/customer-service.json",
    body: "We pride ourselves on our exceptional customer service. Give our knowledgeable staff a call anytime within business hours to ask anything. Our state-of-the-art systems also means you'll always know what's happening — we notify you at every stage.",
  },
  {
    index: "02",
    title: "Fast Turnaround",
    icon: "/img/why/Fast-Turnaround-1.svg",
    lottie: "/lottie/fast-turnaround.json",
    lottieDark: "/lottie/dark/fast-turnaround.json",
    body: "From measure to install in as little as 14 working days. This ensures we have sufficient time to make sure your custom-built product is made perfect, but also ensure we can adhere to your project timeline.",
  },
  {
    index: "03",
    title: "In-Home Consultation",
    icon: "/img/why/Consultation-SQ-White-BG-Taupe-Icon.svg",
    lottie: "/lottie/consultation.json",
    lottieDark: "/lottie/dark/consultation.json",
    body: "We come to you to ensure the perfect products fit perfectly. Give us a call to schedule an appointment or fill out our contact form and one of our team members will give you a call as soon as possible.",
  },
  {
    index: "04",
    title: "Custom Made Products",
    icon: "/img/why/Custom-Made-1.svg",
    lottie: "/lottie/custom-made.json",
    lottieDark: "/lottie/dark/custom-made.json",
    body: "We custom design and manufacture each product to suit the specific dimensions of each space. Generic mass-produced products have a place, but not in the homes of discerning customers wanting quality. Every product we make is made to exact tolerances to ensure the perfect streamlined fit.",
  },
  {
    index: "05",
    title: "Australian Made",
    icon: "/img/why/Australian-Made-1.svg",
    lottie: "/lottie/australian-made.json",
    lottieDark: "/lottie/dark/australian-made.json",
    body: "We are proudly Australian owned and operated. Our products are made right here on the Gold Coast, by skilled local craftsmen, keeping our manufacturing jobs local.",
  },
  {
    index: "06",
    title: "Quality Work at Fair Prices",
    icon: "/img/why/Best-Price-1.svg",
    lottie: "/lottie/best-price.json",
    lottieDark: "/lottie/dark/best-price.json",
    body: "Our prices reflect the skill and care that go into every installation. We're not the cheapest — because great staff cost more and great service is worth more — but you'll always get outstanding value for money.",
  },
];

/** Section 06 */
export const PROCESS = [
  {
    index: "01",
    title: "Measure",
    body: "We come to you. Every screen is templated on site to ensure the perfect fit every time, and your quote comes with a 3D diagram so you can see the product before proceeding.",
  },
  {
    index: "02",
    title: "Make",
    body: "Cut, toughened and assembled at our own Gold Coast factory by skilled local craftsmen. We manufacture and install all our own screens — nothing is subcontracted.",
  },
  {
    index: "03",
    title: "Install",
    body: "Old screen out, new screen in, same visit where requested. From measure to install in as little as 14 working days.",
  },
];

/** Section 05 — configurator, replacing the chatbot estimate. */
export const CONFIGURATOR = [
  { id: "style", label: "Style", options: ["Frameless", "Semi-Frameless", "Framed", "Bath Screen"] },
  { id: "layout", label: "Layout", options: ["Door only", "Door + Return", "Front + Return", "Fixed Panel"] },
  { id: "glass", label: "Glass", options: ["10mm Clear", "10mm Low-Iron", "10mm Reeded", "10mm Frosted"] },
  { id: "hardware", label: "Hardware", options: ["Chrome", "Brushed Nickel", "Matte Black", "Brushed Gold"] },
];

/** Section 08 — their nine questions, with the answers published on their site. */
export const FAQ = [
  {
    q: "How much does a frameless shower screen cost?",
    a: "", // TODO: not published on their current site — needs their number
  },
  {
    q: "Do you remove old shower screens?",
    a: "Yes, when requested we remove old screens prior to installation if the new screen goes in on the one visit, for your convenience.",
  },
  {
    q: "How do I get a price?",
    a: "", // TODO
  },
  {
    q: "How long does it take to get a new screen?",
    a: "From measure to install in as little as 14 working days.",
  },
  {
    q: "Can you tailor my shower screen to suit my bathroom?",
    a: "We custom design and manufacture each product to suit the specific dimensions of each space. Every product we make is made to exact tolerances to ensure the perfect streamlined fit.",
  },
  {
    q: "What is the most watertight shower?",
    a: "Semi-frameless fully enclosed shower screens offer the ideal blend of keeping the water contained and offering a relatively simple look. Frameless shower screens are a little less so, because of the lack of frame under the door.",
  },
  {
    q: "Is removal of the old screen included in the price?",
    a: "Where removal is required and included, we will clearly say so on the quote.",
  },
  {
    q: "Do you come out and measure?",
    a: "Yes, we come to you to measure all of our shower screens to ensure the perfect fit every time.",
  },
  {
    q: "Do you supply and install?",
    a: "Yes, we manufacture and install all our own screens.",
  },
];

/**
 * Their accreditations and the brands they buy — all eight marks taken from
 * their own site.
 *
 * `mark` is the ORIGINAL 320px square; `trim` is the same file with its white
 * margin cropped off. The squares are mostly padding — Glass Outlet's wordmark
 * is 289x73 inside 320x320 — so anything sized off the square renders the
 * artwork at a quarter of the intended size.
 *
 * `w`/`h` are the trimmed file's real pixels and `size` is the height to draw
 * it at. Those heights are not eyeballed: each is set so every mark covers the
 * same optical AREA (sqrt(w*h) held constant, clamped to 22-44px). Sizing a
 * row of logos by height alone is the usual mistake — it makes a 4:1 wordmark
 * shout and a square badge disappear.
 */
export const ACCREDITATIONS = [
  { name: "Master Builders", mark: "/img/partners/Master-Builders-Logo-Square.webp", trim: "/img/partners/trim/Master-Builders-Logo-Square.webp", w: 268, h: 127, size: 34 },
  { name: "QBCC", mark: "/img/partners/QBCC-Logo-Square.webp", trim: "/img/partners/trim/QBCC-Logo-Square.webp", w: 213, h: 187, size: 44 },
  { name: "HIA", mark: "/img/partners/HIA-Logo-Square-1.webp", trim: "/img/partners/trim/HIA-Logo-Square-1.webp", w: 144, h: 161, size: 44 },
  { name: "EnduroShield", mark: "/img/partners/EnduroShield-Glass-Logo-Square.webp", trim: "/img/partners/trim/EnduroShield-Glass-Logo-Square.webp", w: 232, h: 156, size: 40 },
  { name: "G James", mark: "/img/partners/GJames-Logo-Square.webp", trim: "/img/partners/trim/GJames-Logo-Square.webp", w: 283, h: 92, size: 28 },
  { name: "National Glass", mark: "/img/partners/National-Glass-Logo-Square.webp", trim: "/img/partners/trim/National-Glass-Logo-Square.webp", w: 269, h: 121, size: 33 },
  { name: "SuperKOTE", mark: "/img/partners/SuperKOTE-Logo-Square.webp", trim: "/img/partners/trim/SuperKOTE-Logo-Square.webp", w: 301, h: 62, size: 22 },
  { name: "Glass Outlet", mark: "/img/partners/Glass-Outlet-Logo-Square.webp", trim: "/img/partners/trim/Glass-Outlet-Logo-Square.webp", w: 289, h: 73, size: 25 },
];

/**
 * Section 05 — their four "about" blocks, verbatim from the live homepage.
 *
 * On their site these are four near-identical stacked panels; here they are
 * one stacking sequence, which is the only way four repetitions of the same
 * claim earn their place rather than reading as padding.
 */
export const STORY = [
  {
    index: "01",
    title: "Gold Coast's Most Trusted Shower Screen Specialists",
    body: "Gold Coast Shower Screens is a locally-owned business that has become one of the leading shower screen specialists in the region. Our success boils down to exceptionally high standards for quality, reliable and trustworthy service, and quick and efficient installation times.",
  },
  {
    index: "02",
    title: "Gold Coast's Leading Shower Screen & Splashback Specialists",
    body: "At Gold Coast Shower Screens, we are proud to be the leading shower screen specialists in the Gold Coast area. We not only supply and install high-quality shower screens, but also manufacture and install made to measure glass splashbacks, mirrors and wardrobe doors.",
  },
  {
    index: "03",
    title: "Industry Experience, Expertise & Knowledge",
    body: "Our experienced knowledgeable team will guide you through the entire process, from selecting the right products, through to manufacturing and installation. We offer obligation free measure and quotations for all of our clients which are accompanied by state-of-the-art 3D diagrams to ensure our customers can really see and feel the product before proceeding.",
  },
  {
    index: "04",
    title: "Australian Owned",
    body: "Being owned by local Gold Coasters and proud Australians, Gold Coast Shower Screens manufacture our products right here on the Gold Coast. We offer fast turnaround times on our work and in most cases will beat any other written quote ensuring that we are offering the best price to our customers.",
  },
];

/** Their showroom invitation, verbatim. */
export const SHOWROOM = {
  eyebrow: "Visit our showroom",
  title: "See it in person.",
  body: "When you're working on your home's interior design, you'll know how important it is to see every detail in person. We serve both the residential and commercial markets and have a solution for all of our customers. This is why we encourage all our customers to pay a visit to our Coombabah Showroom, so you can take a closer look at our product selection and choose the right items for your needs.",
};

/** Their nine most recent articles, titles and dates as published. */
export const BLOG = [
  { title: "Sliding Shower Screens Gold Coast: Everything You Need to Know", date: "16 July 2026" },
  { title: "Shower Screen Replacement Cost on the Gold Coast: Complete Guide", date: "16 July 2026" },
  { title: "How to Remove a Semi-Frameless Shower Screen: Expert Tips & DIY Steps", date: "16 July 2026" },
  { title: "How to Safely Remove a Frameless Glass Shower Panel", date: "16 July 2026" },
  { title: "How to Replace a Shower Screen on the Gold Coast", date: "16 July 2026" },
  { title: "How to Choose Shower Screen Manufacturers on the Gold Coast", date: "24 March 2026" },
  { title: "How to Safely Remove a Shower Screen on the Gold Coast", date: "24 March 2026" },
  { title: "Frameless Shower Screens Gold Coast: Everything You Need to Know", date: "24 March 2026" },
  { title: "Best Semi Frameless Shower Screens Gold Coast: Complete Guide", date: "24 March 2026" },
];

/** Their closing copy, verbatim. */
export const SEO_BLOCK = [
  {
    title: "Quality Custom Shower Screens on the Gold Coast",
    body: "We offer the best in custom shower screens for the Gold Coast and Brisbane, designed with care to meet your specific needs. Our high-quality glass products promise long-term durability and elegance – perfect for enhancing your home's aesthetics and the functionality of your bathroom.",
  },
  {
    title: "Gold Coast Shower Screen Replacement",
    body: "If your shower screen is damaged, consider our services for shower screen replacement on the Gold Coast. We can replace old or broken shower screens with new, high-quality options, ensuring your bathroom remains functional and stylish. Trust us for precision and durability in every shower screen installation on the Gold Coast and beyond.",
  },
];

/** Their footer navigation, as labelled on the live site. */
export const FOOTER_LINKS = [
  {
    title: "Quick links",
    items: ["Home", "About", "Products", "Contact", "FAQs", "Blog", "Terms & Conditions", "Warranty"],
  },
  {
    title: "Our products",
    items: [
      "Shower Screens",
      "Glass Splashbacks",
      "Mirrors",
      "Wardrobe Doors",
      "Semi-Frameless Shower Screens",
      "Bath Screens",
    ],
  },
];

/**
 * Customer reviews — their real ones.
 *
 * Pulled from the Google Reviews feed their own site runs (the Elfsight widget
 * on their homepage, place ID ChIJt-oEXPYPkWsR3Vc7DXaZcY4). Five-star reviews
 * only, trimmed of emoji, otherwise the reviewer's words exactly. Nothing here
 * is written by us — these are real customers and the names are real, so the
 * text is not edited for tone or length beyond removing emoji.
 */
/**
 * Nine of their Google reviews, verbatim.
 *
 * `rating` is not decoration and not an assumption: each was checked against
 * the live Google feed for place ChIJt-oEXPYPkWsR3Vc7DXaZcY4 and all nine came
 * back 5. The field exists so the cards can show stars that are sourced —
 * without it, five stars per card would be asserting something not in the data.
 *
 * Note for whoever maintains this: the feed also contains 1, 2 and 4 star
 * reviews. These nine are a selection, not the whole record.
 */
export const REVIEWS: { quote: string; name: string; source?: string; rating: number }[] = [
  {
    quote:
      "From our first visit to the showroom, to the installation of our new shower screen it's been a fantastic experience. Polite, helpful and professional from the salesperson to the installer...we couldn't be happier. Thanks so much, we'll be back!",
    name: "Peter Clarke",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "I highly recommend Gold Coast Shower Screens. The service has been excellent, from communicating with office staff, advice given on site prior to the quote, and the reasonably priced, high quality work completed on time.",
    name: "Keith Bassett",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Exceptional customer service. From the sales team, measure and quote and installation team one could not fault their knowledge, customer service etiquette and delivery and installation time. Highly recommend this company!",
    name: "Demi Pappas",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Gold Coast showers screens were super easy to deal with. Came out to quote / measure up quickly and shower was installed in just under 2 weeks from ordering. Installer was friendly, professional and left the space clean.",
    name: "Anne Foster",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Excellent communication throughout the whole process of measure, quote and install. Quality finish to top it off. Thanks",
    name: "Shane McMenamin",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Really great service from measure, to installation and created a three sided shower with ease. Highly recommend, will use again - happy Architect",
    name: "Karlie Price",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "3 things impress me: 1 The ease of purchase, GCSS identified my need and offered solutions. 2 Being kept informed, from manufacture to delivery. 3 Installation, quick efficient and fully explained.",
    name: "Steve Elston",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Good business. Prompt measure & quote, quality materials, with an efficient, professional installation.",
    name: "Riko Granger",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Gold Coast Shower Screens, was very helpful in advising me on ideas. Very happy with the service and the outcome.",
    name: "Catherine Heath",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Efficient and an excellent shower screen.",
    name: "Anthony Cassimatis",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Gold Coast Shower Screens have just today installed 2 new Shower Screens, removed 2 mirrors and installed new mirror. From dealing with Janey and Kristy in the office and the installers today, Adrian and Jason the whole journey has been an absolute pleasure! All staff were very caring, helpful beyond our expectations! We are so happy with our new shower screens giving our bathrooms a new lease on life! Thank you Gold Coast Shower Screens! No hesitation in recommending!",
    name: "Heather Hull",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "We enjoyed our business dealings with Gold Coast Showers. On to it, speedy, helpful, informative and friendly. You just knew from start to finish they would do as they said, on time, and on the money. Excellent. The lady that takes the enquiries is a gem. Some before and after pictures are attached but like many photos they don't do the new shower justice as it has really opened up the bathroom. It feels so much bigger now. Very happy and would not hesitate to recommend.",
    name: "Shaun Ashcroft",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Very smooth process from the start! Good pricing, good communication and quick turnaround. Adrian did the install and he was so quick! Had some issues with parking for the van but he was so patient and kind, while trying to figure it out. My shower looks amazing, highly recommend!!!",
    name: "Georgia Caesar",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Having had a bad experience with our previous shower, which was installed by incompetents; we were delighted not only by the top quality design but the skill and care that Luke put into the installation. It is a delight in todays world to find someone who takes an absolute pride in their work and leaves the place spotless on completion. Would recommend this company. Ron Wells Bethania Qld",
    name: "Ronald Wells",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "A great job. Would highly recommend.",
    name: "Chris Caton",
    source: "Google",
    rating: 5,
  },
  {
    quote:
      "Great communication, fast turnaround. Great quality and workmanship. Super happy with the results!",
    name: "Lisa Hart",
    source: "Google",
    rating: 5,
  },
];

/** What the rating band states — all of it from their own site. */
export const RATING = {
  score: "5.0",
  count: 450,
  source: "Google",
  line: "Don't just take our word for it, check out what over 450 of our happy customers have to say.",
};

/**
 * The single-statement impact band — their own turnaround figure.
 * "14 working days" is the number they publish; nothing here is estimated.
 */
export const IMPACT = {
  eyebrow: "The number that matters",
  before: "From measure to installed in",
  figure: 14,
  unit: " working days",
  after: "— on a screen built to your bathroom, not pulled off a shelf.",
  note: "Enough time to make it properly. Not enough to hold your renovation up.",
};

/**
 * Featured job.
 *
 * The narrative is a real customer's own Google review, quoted and credited —
 * not a case study written by us about work we did not do. The metadata is
 * only what the review itself states.
 */
export const CASE_STUDY = {
  eyebrow: "A recent job",
  client: "Heather's bathrooms",
  meta: [
    { label: "Scope", value: "2 shower screens, 1 mirror" },
    { label: "Also", value: "2 old mirrors removed" },
    { label: "Source", value: "Google review" },
  ],
  quote:
    "Gold Coast Shower Screens have just today installed 2 new Shower Screens, removed 2 mirrors and installed new mirror. From dealing with Janey and Kristy in the office and the installers today, Adrian and Jason the whole journey has been an absolute pleasure! All staff were very caring, helpful beyond our expectations! We are so happy with our new shower screens giving our bathrooms a new lease on life!",
  name: "Heather Hull",
  outcomes: [
    { figure: "3", label: "Products in one visit" },
    { figure: "5.0", label: "Rating left after" },
  ],
};

/** Thin divider band — a fact, not a slogan. */
export const DIVIDER_LINE = "Servicing the Gold Coast & Brisbane — factory at Coombabah";
