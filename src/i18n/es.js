export default {
  nav: {
    play: "Jugar",
    howItWorks: "Cómo Funciona",
    lang: "Idioma",
  },
  topbar: {
    title: "SATOSHI GUESSER",
    jackpot: "Bote Acumulado",
    oddsPerSpin: "Probabilidad por giro",
    walletsInPlay: "Billeteras en juego",
    oddsFlavor:
      "aprox. 10⁷× más difícil que elegir un átomo específico en el universo",
    priceSnapshot: "captura de precio: {date}",
    taglineBillion: "¡Ganá hasta {amount} mil millones de dólares!",
    taglineMillion: "¡Ganá hasta {amount} millones de dólares!",
    taglineDollars: "¡Ganá hasta {amount} dólares!",
  },
  game: {
    pull: "TIRAR",
    settings: "Ajustes",
    logTitle: "Registro",
    loadedWallets: "Cargadas {count} billeteras · bote {btc} BTC.",
    oddsLog: "Probabilidad por giro: {odds}.",
    pullLever: "Tirá de la palanca.",
    noMatch: "→ sin coincidencia",
    matchFound: "🎉 ¡COINCIDENCIA!: {address} ({btc} BTC)",
  },
  settings: {
    title: "Ajustes",
    reelsSound: "Rodillos y sonido",
    realisticReels: "Rodillos hexadecimales (64 hex)",
    noDelay: "Sin retraso (sin animación)",
    autospin: "Giro automático",
    sound: "Sonido",
    checkKey: "Verificar clave privada",
    checkKeyHint:
      "Pegá una clave privada de 64 caracteres hex o Base58 WIF (empieza con 5, K o L) para probarla directamente.",
    placeholder: "64 caracteres hex o Base58 WIF…",
    checkBtn: "Verificar",
    close: "Cerrar",
    enterKeyFirst: "Ingresá una clave privada primero.",
    checking: "Verificando…",
    matchPrize: "🎉 ¡Coincidencia! Abriendo diálogo de premio…",
    noMatchAddr: "Sin coincidencia. Dirección: {address}",
    error: "Error: {message}",
  },
  win: {
    title: "Realmente adivinaste la billetera de Satoshi.",
    prize: "Premio:",
    matchedAddr: "Dirección coincidente:",
    privKeyWif: "Clave privada (WIF):",
    copyKey: "Copiar clave privada",
    close: "Cerrar",
    note: "Transferí esto a una billetera bajo tu control. No lo pierdas.",
    copied: "¡Copiado al portapapeles!",
  },
  footer: {
    clientSide:
      "100% en tu navegador. Los intentos son reales, las probabilidades son astronómicamente bajas.",
  },
  about: {
    badge: "Tragamonedas Criptográfica y Demostración Educativa",
    heroTitle: "¿Qué es Satoshi Guesser?",
    heroSubtitle:
      "Una máquina tragamonedas criptográfica en tiempo real que intenta adivinar al azar las claves privadas de las billeteras originales de Bitcoin de Satoshi Nakamoto. Las probabilidades son astronómicamente diminutas, pero la matemática y criptografía que se ejecutan en tu navegador son 100% auténticas.",

    pipelineTitle: "Cómo Funciona (Bajo el capó)",
    pipelineSubtitle:
      "Sin nodo de blockchain, sin llamadas a APIs, sin servidores. Todo ocurre en tu navegador mediante matemática determinista.",

    step1Title: "1. Generar Clave Privada de 256 Bits",
    step1Desc:
      "Cada giro genera un número entero aleatorio seguro de 256 bits (32 bytes). Este número representa una clave privada candidata de Bitcoin dentro del espacio de 2²⁵⁶ posibilidades.",

    step2Title: "2. Derivar Clave Pública vía secp256k1",
    step2Desc:
      "Mediante multiplicación en la curva elíptica secp256k1, el escalar de la clave privada se multiplica por el punto generador G para calcular las coordenadas de la clave pública (x, y).",

    step3Title: "3. Hash a Dirección P2PKH de Bitcoin",
    step3Desc:
      'La clave pública se procesa con SHA-256 y RIPEMD-160 (HASH160). El resultado de 20 bytes se codifica con Base58Check en una dirección estándar de Bitcoin clásica (que empieza con "1").',

    step4Title: "4. Búsqueda Instantánea con Filtro Bloom",
    step4Desc:
      "La dirección derivada se verifica en submilisegundos contra ~22.000 direcciones coinbase atribuidas a Satoshi (patrón Patoshi) usando un filtro Bloom en memoria y una tabla de búsqueda binaria.",

    diagramTitle: "Flujo del Pipeline Criptográfico",

    oddsTitle: "La Inmensa Escala de 2²⁵⁶",
    oddsSubtitle:
      "Por qué adivinar la clave de Satoshi es virtualmente imposible, aunque matemáticamente no nulo.",
    oddsStat1Value: "1.1579 × 10⁷⁷",
    oddsStat1Label: "Claves Privadas de 256 bits Totales",
    oddsStat2Value: "~22.000",
    oddsStat2Label: "Billeteras Objetivo de Satoshi",
    oddsStat3Value: "1 en 5.27 × 10⁷²",
    oddsStat3Label: "Probabilidad por Giro",

    comparisonsTitle: "Poniendo 1 en 10⁷² en Perspectiva",
    comp1Title: "Átomos en el Universo",
    comp1Desc:
      "Hay aproximadamente 10⁸⁰ átomos en todo el universo observable. Encontrar una clave privada de Satoshi en un solo intento es solo ~10 millones de veces más fácil que elegir un átomo específico preseleccionado en todo el cosmos.",
    comp2Title: "Planetas Tierra Hechos de Arena",
    comp2Desc:
      "Imaginate un planeta Tierra hecho de granos de arena (~10¹⁹ granos). Ahora imaginate 10⁵⁰ de esos planetas. Acertar la clave ganadora equivale a elegir un único grano marcado entre todos ellos.",
    comp3Title: "Escala de Tiempo Universal",
    comp3Desc:
      "Si los 8 mil millones de humanos en la Tierra hicieran girar esta máquina 1.000 veces por segundo desde el Big Bang (hace 13.800 millones de años), la humanidad solo habría completado ~3.5 × 10²¹ giros — aún prácticamente el 0% del espacio de claves.",

    dataTitle: "Las Billeteras Objetivo: El Patrón Patoshi",
    dataDesc:
      "En 2013, el investigador Sergio Demian Lerner descubrió patrones distintivos en los campos extraNonce y timestamp de los primeros bloques de Bitcoin (bloques 0 a ~22.000 minados en 2009–2010), atribuidos a Satoshi Nakamoto.",
    dataHighlight:
      "Estas ~22.000 direcciones contienen aproximadamente 1.1 millones de Bitcoins intactos valuados en decenas de miles de millones de dólares.",

    faqTitle: "Preguntas Frecuentes",
    faq1Q: "Si gano, ¿la clave privada realmente es mía?",
    faq1A:
      "¡Sí! En Bitcoin, quien posee la clave privada controla matemáticamente los fondos de esa dirección. Dado que nuestra derivación es matemáticamente idéntica a Bitcoin Core, una clave coincidente es la clave real y funcional.",
    faq2Q: "¿Este juego envía mis claves o datos a un servidor?",
    faq2A:
      "No. Satoshi Guesser corre 100% en tu navegador. No hay servidores de backend, ni analíticas, ni cookies, ni peticiones de red durante los giros.",
    faq3Q: "¿Esto representa un ataque a la seguridad de Bitcoin?",
    faq3A:
      "Para nada. El espacio de 256 bits de Bitcoin es tan inmenso que intentar romperlo por fuerza bruta viola las leyes de la termodinámica. Satoshi Guesser es una demostración educativa interactiva que demuestra lo inquebrantable que es la criptografía de Bitcoin.",
    faq4Q: "¿Puedo probar mis propias claves para verificar el sistema?",
    faq4A:
      '¡Sí! Abrí el menú Ajustes (⚙) y usá la herramienta "Verificar clave privada". Podés pegar cualquier clave de 64 caracteres hex o Base58 WIF para ver cómo funciona la derivación y búsqueda al instante.',
  },
};
