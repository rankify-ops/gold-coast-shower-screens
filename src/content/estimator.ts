/**
 * The instant-estimate question tree, extracted from the client's live
 * estimator at /instant-estimate-form/.
 *
 * That form is a Zoho Forms embed sitting in a cross-origin iframe, which is
 * why nothing on their own page can see it — the structure below was read off
 * the Zoho form loaded directly. 55 fields, ~30 of them branching choice
 * questions, ~101 option images.
 *
 * SHAPE
 * Every step is keyed by id. `next` decides where an answer leads: a string
 * for a fixed next step, or a lookup keyed by the chosen option. `null` ends
 * the branch and hands over to the contact step. Modelling it as a graph
 * rather than a flat array is what keeps the shower-screen branch (five levels
 * deep) from turning into nested conditionals in the component.
 *
 * NOTE ON "PSF"
 * The client's own labelling. It is their semi-frameless range — their form
 * uses "Semi-Frameless" in the frame-style question and "PSF" in the
 * configuration questions that follow. Worth confirming with them whether
 * customers understand the abbreviation; we surface "Semi-Frameless"
 * throughout.
 */

export type StepKind = "choice" | "size" | "measure" | "contact";

export type EstimatorStep = {
  id: string;
  kind: StepKind;
  /** Their wording, kept verbatim. */
  question: string;
  options?: string[];
  /** Fixed next step, or a per-option map. `null` finishes. */
  next?: string | Record<string, string | null> | null;
  unit?: string;
};

export const ESTIMATOR: Record<string, EstimatorStep> = {
  // ── Entry ────────────────────────────────────────────────────────────
  product: {
    id: "product",
    kind: "choice",
    question: "What product do you require?",
    options: ["Shower Screen", "Splash Backs", "Mirrors", "Wardrobe Doors"],
    next: {
      "Shower Screen": "screenType",
      "Splash Backs": "splashbackStyle",
      Mirrors: "mirrorStyle",
      "Wardrobe Doors": "wardrobeStyle",
    },
  },

  // ── Shower / bath screens ────────────────────────────────────────────
  screenType: {
    id: "screenType",
    kind: "choice",
    question: "Do you require a Shower or Bath Screen?",
    options: ["Shower Screen", "Bath Screen"],
    next: { "Shower Screen": "showerDoor", "Bath Screen": "bathDoor" },
  },

  showerDoor: {
    id: "showerDoor",
    kind: "choice",
    question: "Do you require a Shower Screen with or without a door?",
    options: ["With Door", "Without Door"],
    next: { "With Door": "showerSwing", "Without Door": "doorlessFrame" },
  },

  showerSwing: {
    id: "showerSwing",
    kind: "choice",
    question: "Do you want a hinged or sliding door?",
    options: ["Hinged", "Sliding"],
    next: { Hinged: "hingedFrame", Sliding: "slidingFrame" },
  },

  hingedFrame: {
    id: "hingedFrame",
    kind: "choice",
    question: "What frame style do you require for your hinged screen?",
    options: ["Frameless", "Semi-Frameless", "Framed"],
    next: {
      Frameless: "framelessHingedConfig",
      "Semi-Frameless": "psfHingedConfig",
      Framed: "framedHingedConfig",
    },
  },

  slidingFrame: {
    id: "slidingFrame",
    kind: "choice",
    question: "What frame style do you require for your sliding door shower screen?",
    options: ["Frameless", "Semi-Frameless", "Framed"],
    next: {
      Frameless: "framelessSlidingConfig",
      "Semi-Frameless": "psfSlidingConfig",
      Framed: "framedSlidingConfig",
    },
  },

  framelessHingedConfig: {
    id: "framelessHingedConfig",
    kind: "choice",
    question: "What configuration do you require for your frameless hinged door shower screen?",
    options: ["Front & Return", "Splay", "Door Only", "Door & Fixed Panel", "Box", "Bath End"],
    next: "showerHeight",
  },
  psfHingedConfig: {
    id: "psfHingedConfig",
    kind: "choice",
    question: "What configuration do you require for your semi-frameless hinged door shower screen?",
    options: ["Front & Return", "Splay", "Door Only", "Door & Fixed Panel", "Box", "Bath End"],
    next: "showerHeight",
  },
  framedHingedConfig: {
    id: "framedHingedConfig",
    kind: "choice",
    question: "What configuration do you require for your framed hinged door shower screen?",
    options: ["Front & Return", "Splay", "Door Only", "Door & Fixed", "Box", "Bath End"],
    next: "showerHeight",
  },

  framelessSlidingConfig: {
    id: "framelessSlidingConfig",
    kind: "choice",
    question: "What configuration do you require for your frameless sliding door shower screen?",
    options: ["Front & Return", "2 Door Corner", "Front Only", "In Line", "Bath End"],
    next: "showerHeight",
  },
  psfSlidingConfig: {
    id: "psfSlidingConfig",
    kind: "choice",
    question: "What configuration do you require for your semi-frameless sliding door shower screen?",
    options: ["Front & Return", "Front Only", "In Line", "Bath End"],
    next: "showerHeight",
  },
  framedSlidingConfig: {
    id: "framedSlidingConfig",
    kind: "choice",
    question: "What configuration do you require for your framed sliding door shower screen?",
    options: ["Front & Return", "Front Only", "Box", "Bath End"],
    next: "showerHeight",
  },

  doorlessFrame: {
    id: "doorlessFrame",
    kind: "choice",
    question: "Do you require a Frameless or Framed doorless shower screen?",
    options: ["Frameless", "Framed"],
    next: { Frameless: "framelessDoorlessConfig", Framed: "framedDoorlessConfig" },
  },
  framelessDoorlessConfig: {
    id: "framelessDoorlessConfig",
    kind: "choice",
    question: "What configuration do you require for your frameless doorless shower screen?",
    options: ["Fixed Panel", "Front & Return", "Inline", "Splay"],
    next: "showerHeight",
  },
  framedDoorlessConfig: {
    id: "framedDoorlessConfig",
    kind: "choice",
    question: "What configuration do you require for your framed doorless shower screen?",
    options: ["Fixed Panel", "Front & Return", "Front Inline & Return", "Inline", "Splay"],
    next: "showerHeight",
  },

  showerHeight: {
    id: "showerHeight",
    kind: "size",
    question: "What height do you require for your shower screen?",
    options: ["1900mm", "2050mm", "2200mm", "2350mm"],
    next: "showerGirth",
  },
  showerGirth: {
    id: "showerGirth",
    kind: "measure",
    question: "What total girth do you require for your shower screen?",
    unit: "mm",
    next: null,
  },

  // ── Bath screens ─────────────────────────────────────────────────────
  bathDoor: {
    id: "bathDoor",
    kind: "choice",
    question: "Do you require a door or no door?",
    options: ["With Door", "Without Door"],
    next: { "With Door": "bathSwing", "Without Door": "bathDoorlessFrame" },
  },
  bathSwing: {
    id: "bathSwing",
    kind: "choice",
    question: "Do you require a hinged or sliding door?",
    options: ["Hinged", "Sliding"],
    next: { Hinged: "bathHingedFrame", Sliding: "bathSlidingFrame" },
  },

  bathHingedFrame: {
    id: "bathHingedFrame",
    kind: "choice",
    question: "What frame style do you require for your hinged bath screen?",
    options: ["Frameless", "Semi-Frameless"],
    next: { Frameless: "bathFramelessHinged", "Semi-Frameless": "bathPsfHinged" },
  },
  bathFramelessHinged: {
    id: "bathFramelessHinged",
    kind: "choice",
    question: "What configuration do you require for your frameless hinged bath screen?",
    options: ["Front & Return", "Splay", "Fixed & Swing", "Box"],
    next: "bathHeight",
  },
  bathPsfHinged: {
    id: "bathPsfHinged",
    kind: "choice",
    question: "What configuration do you require for your semi-frameless hinged bath screen?",
    options: ["Front & Return", "Splay", "Box"],
    next: "bathHeight",
  },

  bathSlidingFrame: {
    id: "bathSlidingFrame",
    kind: "choice",
    question: "What frame style do you require for your sliding bath screen?",
    options: ["Frameless", "Framed"],
    next: { Frameless: "bathFramelessSliding", Framed: "bathFramedSliding" },
  },
  bathFramelessSliding: {
    id: "bathFramelessSliding",
    kind: "choice",
    question: "What configuration do you require for your frameless sliding bath screen?",
    options: ["Front & Return", "Front Only", "Box"],
    next: "bathHeight",
  },
  bathFramedSliding: {
    id: "bathFramedSliding",
    kind: "choice",
    question: "What configuration do you require for your framed sliding bath screen?",
    options: ["Front & Return", "Front Only", "Box"],
    next: "bathHeight",
  },

  bathDoorlessFrame: {
    id: "bathDoorlessFrame",
    kind: "choice",
    question: "What frame style do you require for your bath screen without a door?",
    options: ["Frameless", "Framed"],
    next: { Frameless: "bathFramelessDoorless", Framed: "bathFramedDoorless" },
  },
  bathFramelessDoorless: {
    id: "bathFramelessDoorless",
    kind: "choice",
    question: "What configuration do you require for your frameless bath screen without a door?",
    options: ["Fixed Panel", "Front & Return", "Inline", "Splay"],
    next: "bathHeight",
  },
  bathFramedDoorless: {
    id: "bathFramedDoorless",
    kind: "choice",
    question: "What configuration do you require for your framed bath screen with no door?",
    options: ["Fixed Panel", "Front & Return", "Inline", "Splay"],
    next: "bathHeight",
  },

  bathHeight: {
    id: "bathHeight",
    kind: "size",
    question: "What height do you require for your bath screen?",
    options: ["700mm", "800mm"],
    next: "bathGirth",
  },
  bathGirth: {
    id: "bathGirth",
    kind: "measure",
    question: "What is the total girth you require for your bath screen?",
    unit: "mm",
    next: null,
  },

  // ── Splashbacks ──────────────────────────────────────────────────────
  splashbackStyle: {
    id: "splashbackStyle",
    kind: "choice",
    question: "What style of splashback do you require?",
    options: ["Painted Back", "Printed Back", "Mirror"],
    next: "splashbackWidth",
  },
  splashbackWidth: {
    id: "splashbackWidth",
    kind: "measure",
    question: "What is the approximate total width of the combined glass panels?",
    unit: "mm",
    next: null,
  },

  // ── Mirrors ──────────────────────────────────────────────────────────
  mirrorStyle: {
    id: "mirrorStyle",
    kind: "choice",
    question: "What style of mirror do you require?",
    options: ["Frameless", "Framed", "Studio"],
    next: "mirrorHeight",
  },
  mirrorHeight: {
    id: "mirrorHeight",
    kind: "size",
    question: "What height do you require for your mirror?",
    options: ["1000mm", "1200mm", "1500mm", "2000mm", "2500mm"],
    next: "mirrorWidth",
  },
  mirrorWidth: {
    id: "mirrorWidth",
    kind: "measure",
    question: "What is the total width of the mirror?",
    unit: "mm",
    next: null,
  },

  // ── Wardrobe doors ───────────────────────────────────────────────────
  wardrobeStyle: {
    id: "wardrobeStyle",
    kind: "choice",
    question: "What style of wardrobe doors do you require?",
    options: ["Slimline", "Framed", "Semi-Frameless"],
    next: "wardrobeHeight",
  },
  wardrobeHeight: {
    id: "wardrobeHeight",
    kind: "size",
    question: "What height do you require for your wardrobe doors?",
    // Their form offers a single height here. Confirm whether that is
    // deliberate or an oversight on their end before we ship it as a
    // one-option question.
    options: ["2400mm"],
    next: "wardrobeWidth",
  },
  wardrobeWidth: {
    id: "wardrobeWidth",
    kind: "measure",
    question: "What is the total width of the wardrobe/wardrobes?",
    unit: "mm",
    next: null,
  },
};

/** Fields their form collects before and after the product questions. */
export const ESTIMATOR_CONTACT = {
  before: ["Name", "Job Suburb"],
  after: ["Email", "Mobile"],
};

export const ESTIMATOR_START = "product";

/**
 * Option artwork, keyed `stepId::Option`.
 *
 * Filenames are the client's own, recovered from their Zoho form definition —
 * the query string on each `/public?event-id=` reference carries the original
 * upload name. The files themselves could not be pulled: that endpoint 404s
 * outside a live render, and the form lazy-loads each branch's images only
 * when that branch is reached, so nothing but the current step is ever in the
 * DOM.
 *
 * Dropping his Zoho export into public/img/estimator/ makes every tile
 * resolve, with no code change. Until then tiles fall back to a drawn frame
 * with the label, which is a usable state rather than a broken one.
 *
 * Prefixes are his: FF = frameless, PSF = semi-frameless, Framed = framed.
 */
export const OPTION_IMAGE: Record<string, string> = {
  // Frameless — hinged
  "framelessHingedConfig::Front & Return": "FF_Door_Fixed_Return.png",
  "framelessHingedConfig::Splay": "FF_Splay_Door_Fixed_Return.png",
  "framelessHingedConfig::Door Only": "FF_Door_Only.png",
  "framelessHingedConfig::Door & Fixed Panel": "FF_Door_and_Fixed_Panel.png",
  "framelessHingedConfig::Box": "FF_Door_Fixed_Return_Box.png",
  "framelessHingedConfig::Bath End": "FF_Door_Fixed_Return_Bath_End.png",

  // Frameless — sliding
  "framelessSlidingConfig::Front & Return": "FF_Sliding_Fixed_Return.png",
  "framelessSlidingConfig::2 Door Corner": "FF_Sliding_2_Door_Corner.png",
  "framelessSlidingConfig::Front Only": "FF_Sliding_Front_Only.png",
  "framelessSlidingConfig::In Line": "FF_Sliding_Front_Only_Inline.png",
  "framelessSlidingConfig::Bath End": "FF_Sliding_Bath_End.png",

  // Semi-frameless — hinged
  "psfHingedConfig::Front & Return": "PSF_Door_Fixed_Return.png",
  "psfHingedConfig::Splay": "PSF_Splay_Door_Fixed_Return.png",
  "psfHingedConfig::Door Only": "PSF_Door_Only.png",
  "psfHingedConfig::Door & Fixed Panel": "PSF_Door_and_Fixed_Panel.png",
  "psfHingedConfig::Box": "PSF_Door_Fixed_Return_Box.png",
  "psfHingedConfig::Bath End": "PSF_Door_Fixed_Return_Bath_End.png",

  // Semi-frameless — sliding
  "psfSlidingConfig::Front & Return": "PSF_Sliding_Door_Fixed_Return.png",
  "psfSlidingConfig::Front Only": "PSF_Sliding_Door_Front_Only.png",
  "psfSlidingConfig::In Line": "PSF_Sliding_Door_Inline.png",
  "psfSlidingConfig::Bath End": "PSF_Sliding_Door_Bath_End.png",

  // Framed — hinged
  "framedHingedConfig::Front & Return": "Framed_Door_Fixed_Return.png",
  "framedHingedConfig::Splay": "Framed_Splay_Door_Fixed_Return.png",
  "framedHingedConfig::Door Only": "Framed_Door_Only.png",
  "framedHingedConfig::Door & Fixed": "Framed_Door_and_Fixed_Panel.png",
  "framedHingedConfig::Box": "Framed_Door_Fixed_Return_Box.png",
  "framedHingedConfig::Bath End": "Framed_Door_Fixed_Return_Bath_End.png",

  // Framed — sliding
  "framedSlidingConfig::Front & Return": "Framed_Sliding_Door_Fixed_Return_2_Door.png",
  "framedSlidingConfig::Front Only": "Framed_Sliding_Front_Only_2_Door.png",
  "framedSlidingConfig::Box": "Framed_Sliding_Door_Box_2_Door.png",
  "framedSlidingConfig::Bath End": "Framed_Sliding_Door_Bath_End_2_Door.png",

  // Doorless
  "framelessDoorlessConfig::Fixed Panel": "FF_Fixed_Panel.png",
  "framelessDoorlessConfig::Front & Return": "FF_Fixed_Return.png",
  "framelessDoorlessConfig::Inline": "FF_No_Door_2_Fixed_Inline.png",
  "framelessDoorlessConfig::Splay": "FF_Splay_Fixed_Return.png",
  "framedDoorlessConfig::Fixed Panel": "Framed_Fixed_Panel.png",
  "framedDoorlessConfig::Front & Return": "Framed_Fixed_Return.png",
  "framedDoorlessConfig::Front Inline & Return": "Framed_No_Door_Inline_Front_and_Return.png",
  "framedDoorlessConfig::Inline": "Framed_No_Door_Inline.png",
  "framedDoorlessConfig::Splay": "Framed_No_Door_Splay.png",

  // Bath screens
  "bathFramelessHinged::Front & Return": "FF_Bath_Door_Fixed_Return.png",
  "bathFramelessHinged::Splay": "FF_Bath_Door_2_Fixed_Return_Splay.png",
  "bathFramelessHinged::Fixed & Swing": "FF_Bath_Door_Fixed.png",
  "bathFramelessHinged::Box": "FF_Bath_Door_2_Fixed_Return_Box.png",
  "bathPsfHinged::Front & Return": "PSF_Bath_Door_Fixed_Return.png",
  "bathPsfHinged::Splay": "PSF_Bath_Door_Fixed_Return_Splay.png",
  "bathPsfHinged::Box": "PSF_Bath_Door_Fixed_Return_Box.png",
  "bathFramelessSliding::Front & Return": "FF_Bath_Slider_Fixed_Return.png",
  "bathFramelessSliding::Front Only": "FF_Bath_Slider_Front_Only.png",
  "bathFramelessSliding::Box": "FF_Bath_Slider_Front_and_2_Fied_Return_Box.png",
  "bathFramedSliding::Front & Return": "Framed_Bath_Sliding_Fixed_Return.png",
  "bathFramedSliding::Front Only": "Framed_Bath_Sliding_Front_Only.png",
  "bathFramedSliding::Box": "Framed_Bath_Sliding_Fixed_and_Return_Box.png",
  "bathFramelessDoorless::Fixed Panel": "FF_Bath_Fixed_Panel.png",
  "bathFramelessDoorless::Front & Return": "FF_Bath_No_Door_Fixed_Return.png",
  "bathFramelessDoorless::Inline": "FF_Bath_No_Door_Inline.png",
  "bathFramelessDoorless::Splay": "FF_Bath_No_Door_2_Fixed_Return_Splay.png",
  "bathFramedDoorless::Fixed Panel": "Framed_Bath_Fixed_Panel.png",
  "bathFramedDoorless::Front & Return": "Framed_Bath_Inline_Fixed_and_Return.png",
  "bathFramedDoorless::Inline": "Framed_Bath_2_Fixed_Inline.png",
  "bathFramedDoorless::Splay": "Framed_Bath_No_Door_2_Fixed_Panel_Splay.png",

  // Other product lines
  "splashbackStyle::Painted Back": "Kitchen-Splashback-Painted.jpg",
  "splashbackStyle::Printed Back": "Kitchen-Splashback-Printed.jpg",
  "splashbackStyle::Mirror": "Kitchen-Splashback-Mirror.jpg",
  "mirrorStyle::Frameless": "Mirror-Frameless.jpg",
  "mirrorStyle::Framed": "Mirror-Framed.jpg",
  "mirrorStyle::Studio": "Mirror-Studio.jpg",
  "wardrobeStyle::Slimline": "Wardrobe-Doors-Slimline.jpg",
  "wardrobeStyle::Framed": "Wardrobe-Doors-Framed.jpg",
  "wardrobeStyle::Semi-Frameless": "Wardrobe-Doors-Semi-Frameless.jpg",
};

/** Stage one uses the category icons we already hold as their own SVGs. */
export const PRODUCT_ICON: Record<string, string> = {
  "Shower Screen": "/img/logos/Category-Icon-White-Shower.svg",
  "Splash Backs": "/img/logos/Category-Icon-White-Splashbacks.svg",
  Mirrors: "/img/logos/Category-Icon-White-Mirrors.svg",
  "Wardrobe Doors": "/img/logos/Category-Icon-White-Wardrobe-Doors.svg",
};

export const ESTIMATOR_IMAGE_DIR = "/img/estimator/";
