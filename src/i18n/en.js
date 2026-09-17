export default {
  nav: {
    play: "Play",
    howItWorks: "How It Works",
    lang: "Language",
  },
  topbar: {
    title: "SATOSHI GUESSER",
    jackpot: "Jackpot",
    oddsPerSpin: "Odds per spin",
    walletsInPlay: "Wallets in play",
    oddsFlavor:
      "about 10⁷× harder than picking one specific atom in the universe",
    priceSnapshot: "price snapshot: {date}",
    taglineBillion: "Win up to {amount} billion dollars!",
    taglineMillion: "Win up to {amount} million dollars!",
    taglineDollars: "Win up to {amount} dollars!",
  },
  game: {
    pull: "PULL",
    settings: "Settings",
    logTitle: "Log",
    loadedWallets: "Loaded {count} wallets · jackpot {btc} BTC.",
    oddsLog: "Odds per spin: {odds}.",
    pullLever: "Pull the lever.",
    noMatch: "→ no match",
    matchFound: "🎉 MATCH: {address} ({btc} BTC)",
  },
  settings: {
    title: "Settings",
    reelsSound: "Reels & sound",
    realisticReels: "Hexadecimal reels (64 hex)",
    noDelay: "No delay (skip animation)",
    autospin: "Autospin",
    sound: "Sound",
    checkKey: "Check a private key",
    checkKeyHint:
      "Paste a 64-character hex private key or a Base58 WIF (starts with 5, K, or L) to test it directly.",
    placeholder: "64 hex chars or Base58 WIF…",
    checkBtn: "Check",
    close: "Close",
    enterKeyFirst: "Enter a private key first.",
    checking: "Checking…",
    matchPrize: "🎉 Match! Opening prize dialog…",
    noMatchAddr: "No match. Address: {address}",
    error: "Error: {message}",
  },
  win: {
    title: "You actually guessed Satoshi's wallet.",
    prize: "Prize:",
    matchedAddr: "Matched address:",
    privKeyWif: "Private key (WIF):",
    copyKey: "Copy private key",
    close: "Close",
    note: "Sweep this into a wallet you control. Don't lose it.",
    copied: "Copied to clipboard!",
  },
  footer: {
    clientSide:
      "100% client-side. Guesses are real, the odds are just real bad.",
  },
  about: {
    badge: "Cryptographic Slot Machine & Educational Demo",
    heroTitle: "What is Satoshi Guesser?",
    heroSubtitle:
      "A real-time cryptographic slot machine that attempts to randomly guess the private keys to Satoshi Nakamoto's original Bitcoin wallets. The odds are astronomically small, but the math and cryptography executed in your browser are 100% authentic.",

    pipelineTitle: "How It Works (Under the Hood)",
    pipelineSubtitle:
      "No blockchain node, no API calls, no servers. Everything happens client-side using deterministic mathematics.",

    step1Title: "1. Roll a 256-Bit Private Key",
    step1Desc:
      "Every spin generates a secure random 256-bit integer (32 bytes). This number represents a candidate Bitcoin private key from the vast keyspace of 2²⁵⁶ possibilities.",

    step2Title: "2. Derive Public Key via secp256k1",
    step2Desc:
      "Using elliptic curve multiplication on the secp256k1 curve, the private key scalar is multiplied by the generator point G to calculate the corresponding public key coordinates (x, y).",

    step3Title: "3. Hash to P2PKH Bitcoin Address",
    step3Desc:
      'The public key is hashed using SHA-256 and RIPEMD-160 (HASH160). The 20-byte result is encoded with Base58Check into a standard legacy Bitcoin address (starting with "1").',

    step4Title: "4. Instant Bloom Filter & Table Lookup",
    step4Desc:
      "The derived address is checked in sub-millisecond time against ~22,000 Patoshi-pattern Satoshi coinbase addresses using an in-memory Bloom filter and binary search table.",

    diagramTitle: "Cryptographic Pipeline Flow",

    oddsTitle: "The Mind-Boggling Scale of 2²⁵⁶",
    oddsSubtitle:
      "Why guessing Satoshi's private key is virtually impossible, yet mathematically non-zero.",
    oddsStat1Value: "1.1579 × 10⁷⁷",
    oddsStat1Label: "Total 256-bit Private Keys",
    oddsStat2Value: "~22,000",
    oddsStat2Label: "Satoshi Target Wallets",
    oddsStat3Value: "1 in 5.27 × 10⁷²",
    oddsStat3Label: "Per-Spin Winning Chance",

    comparisonsTitle: "Putting 1 in 10⁷² into Perspective",
    comp1Title: "Atoms in the Universe",
    comp1Desc:
      "There are approximately 10⁸⁰ atoms in the entire observable universe. Finding a Satoshi private key on a single spin is only ~10 million times easier than picking one specific pre-selected atom out of the whole cosmos.",
    comp2Title: "Earths Made of Sand",
    comp2Desc:
      "Imagine an entire planet Earth made of grains of sand (~10¹⁹ grains). Now imagine 10⁵⁰ such Earths. Picking the winning key is like picking one marked grain of sand out of all of them.",
    comp3Title: "Universal Time Scale",
    comp3Desc:
      "If all 8 billion humans on Earth spun this machine 1,000 times per second since the Big Bang (13.8 billion years ago), humanity would have completed only ~3.5 × 10²¹ spins — still essentially 0% of the keyspace.",

    dataTitle: "The Target Wallets: The Patoshi Pattern",
    dataDesc:
      "In 2013, blockchain researcher Sergio Demian Lerner discovered distinct patterns in the extraNonce and timestamp fields of the earliest Bitcoin blocks (Blocks 0 through ~22,000 mined in 2009–2010), widely attributed to Bitcoin's creator, Satoshi Nakamoto.",
    dataHighlight:
      "These ~22,000 addresses hold an estimated ~1.1 million untouched Bitcoins worth tens of billions of dollars.",

    faqTitle: "Frequently Asked Questions",
    faq1Q: "If I win, is the private key really mine?",
    faq1A:
      "Yes! In Bitcoin, whoever possesses the private key mathematically controls the coins associated with that address. Because our derivation is mathematically identical to Bitcoin Core, a matched key is the real, working key.",
    faq2Q: "Is this game sending my private keys or data to a server?",
    faq2A:
      "No. Satoshi Guesser runs 100% locally in your web browser. There are no backend servers, no analytics, no cookies, and no network requests made during spins.",
    faq3Q: "Is this an attack on Bitcoin security?",
    faq3A:
      "Not at all. The 256-bit keyspace of Bitcoin is so immense that brute-forcing it violates the laws of thermodynamics. Satoshi Guesser is an interactive art and educational tool that proves how unbreakable Bitcoin's cryptography truly is.",
    faq4Q: "Can I test my own private keys to verify the system?",
    faq4A:
      'Yes! Open the Settings menu (⚙) and use the "Check a private key" tool. You can paste any 64-character hexadecimal key or Base58 WIF to see how the address derivation and lookup work instantly.',
  },
};
