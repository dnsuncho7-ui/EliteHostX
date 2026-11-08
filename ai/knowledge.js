
const KNOWLEDGE = [
    {
        id: "greeting",
        category: "other",
        keywords: ["hola", "buenas", "saludos", "hey", "buenos dias"],
        answer: "¡Hola! Soy EliteAI, el asistente inteligente de EliteHostX. ¿En qué puedo ayudarte?"
    },
    {
        id: "hosting",
        category: "hosting",
        keywords: ["hosting", "planes", "plan", "ram", "procesador", "cpu", "ssd", "alojamiento"],
        answer: "En EliteHostX ofrecemos planes de hosting Minecraft con diferentes capacidades. Actualmente tenemos CORONA (8 GB RAM), ESMERALDA (12 GB), DIAMANTE (16 GB), NETHERITE (24 GB), RUBÍ (32 GB) y AMATISTA (48 GB). Los precios están pendientes de publicación."
    },
    {
        id: "account",
        category: "account",
        keywords: ["cuenta", "login", "iniciar sesion", "contraseña", "contrasena", "registro", "registrarme"],
        answer: "Para acceder a EliteHostX, entra en el dashboard e inicia sesión con tu cuenta. Si tienes problemas para acceder, puedes crear un ticket en Support Center, categoría Account & Login."
    },
    {
        id: "minecraft",
        category: "server",
        keywords: ["minecraft", "servidor", "server", "plugins", "mods", "paper", "purpur", "spigot"],
        answer: "EliteHostX está orientado al alojamiento de servidores Minecraft. Podemos ayudarte con dudas sobre versiones, plugins, configuraciones y administración. Si tienes un problema específico, abre un ticket en la categoría Minecraft Server."
    },
    {
        id: "creation",
        category: "server",
        keywords: ["crear servidor", "crear mi servidor", "instancia", "iniciar servidor", "encender servidor"],
        answer: "La integración de creación y administración real de servidores está pendiente de conectar con Pterodactyl. No puedo afirmar que una instancia esté creada o funcionando hasta que esa integración esté disponible."
    },
    {
        id: "billing",
        category: "billing",
        keywords: ["pago", "pagos", "precio", "factura", "cobro", "comprar", "dinero", "reembolso"],
        answer: "La información de precios y pagos de EliteHostX todavía está pendiente de publicación. Para consultar un caso de facturación, crea un ticket en Support Center, categoría Billing & Payments."
    },
    {
        id: "technical",
        category: "technical",
        keywords: ["error", "fallo", "problema", "no funciona", "ayuda", "bug", "caido", "caído"],
        answer: "Puedo ayudarte a identificar el problema. Cuéntame qué estabas intentando hacer y qué mensaje de error recibiste. Si necesitas atención personalizada, abre un ticket en Technical Support."
    },
    {
        id: "support",
        category: "other",
        keywords: ["ticket", "soporte", "administrador", "atencion", "atención", "contactar"],
        answer: "Puedes comunicarte con nuestro equipo desde Support Center. Cada ticket tiene su propia conversación y una categoría para organizar la solicitud."
    }
];

module.exports = { KNOWLEDGE };
