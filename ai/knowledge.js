
const KNOWLEDGE = [
    {
        id: "greeting",
        category: "other",
        keywords: ["hola", "buenas", "saludos", "hey", "buenos dias", "buenas tardes"],
        answer: "¡Hola! Soy EliteAI, el asistente de EliteHostX. ¿En qué puedo ayudarte con nuestros servicios?"
    },
    {
        id: "support",
        category: "support",
        keywords: [
            "support center", "centro de soporte", "soporte",
            "para que sirve soporte", "para que sirve support",
            "ticket", "tickets", "conversacion de soporte",
            "contactar soporte", "ayuda de soporte"
        ],
        answer: "Support Center es el centro de atención al cliente de EliteHostX. Desde allí puedes crear tickets de soporte, seleccionar la categoría de tu solicitud y mantener una conversación privada con nuestro equipo. También puedes consultar las respuestas recibidas y seguir el estado de tus solicitudes. Cada ticket tiene su propia conversación."
    },
    {
        id: "account",
        category: "account",
        keywords: [
            "crear cuenta", "crear una cuenta", "como me registro",
            "como registrarme", "registrarme", "registro",
            "crear usuario", "nueva cuenta", "cuenta nueva",
            "iniciar sesion", "login", "contraseña", "contrasena"
        ],
        answer: "Para crear una cuenta en EliteHostX, entra en la página principal y selecciona CREATE ACCOUNT. Completa los campos Display name, Email, Password y Confirm password. La contraseña debe tener al menos 12 caracteres y debes escribirla nuevamente para confirmarla. Después, pulsa CREATE ACCOUNT. Si ya tienes una cuenta, utiliza SIGN IN para iniciar sesión."
    },
    {
        id: "hosting",
        category: "hosting",
        keywords: [
            "planes", "plan de hosting", "planes de hosting",
            "hosting minecraft", "alojamiento", "precio de planes",
            "que planes ofrecen", "planes disponibles"
        ],
        answer: "EliteHostX ofrece seis planes de hosting Minecraft: CORONA, ESMERALDA, DIAMANTE, NETHERITE, RUBÍ y AMATISTA. Sus capacidades van desde 8 GB hasta 48 GB de RAM. Los precios todavía están pendientes de publicación."
    },
    {
        id: "plan-corona",
        category: "hosting",
        keywords: [
            "corona", "plan corona", "corona hosting",
            "ram corona", "cpu corona"
        ],
        answer: "El plan CORONA ofrece 8 GB de RAM, 4 CPU y 80 GB de almacenamiento SSD."
    },
    {
        id: "plan-esmeralda",
        category: "hosting",
        keywords: ["esmeralda", "plan esmeralda"],
        answer: "El plan ESMERALDA ofrece 12 GB de RAM, 6 CPU y 120 GB de almacenamiento SSD."
    },
    {
        id: "plan-diamante",
        category: "hosting",
        keywords: ["diamante", "plan diamante"],
        answer: "El plan DIAMANTE ofrece 16 GB de RAM, 8 CPU y 160 GB de almacenamiento SSD."
    },
    {
        id: "plan-netherite",
        category: "hosting",
        keywords: ["netherite", "plan netherite"],
        answer: "El plan NETHERITE ofrece 24 GB de RAM, 10 CPU y 240 GB de almacenamiento SSD."
    },
    {
        id: "plan-rubi",
        category: "hosting",
        keywords: ["rubi", "rubí", "plan rubi", "plan rubí"],
        answer: "El plan RUBÍ ofrece 32 GB de RAM, 12 CPU y 320 GB de almacenamiento SSD."
    },
    {
        id: "plan-amatista",
        category: "hosting",
        keywords: ["amatista", "plan amatista"],
        answer: "El plan AMATISTA ofrece 48 GB de RAM, 16 CPU y 480 GB de almacenamiento SSD."
    },
    {
        id: "plan-comparison",
        category: "hosting",
        keywords: [
            "diferencia entre corona y amatista",
            "comparar corona y amatista",
            "corona vs amatista",
            "comparacion de planes",
            "comparar planes"
        ],
        answer: "La diferencia entre CORONA y AMATISTA es su capacidad: CORONA incluye 8 GB de RAM, 4 CPU y 80 GB SSD; AMATISTA incluye 48 GB de RAM, 16 CPU y 480 GB SSD. AMATISTA ofrece seis veces más RAM y almacenamiento que CORONA."
    },
    {
        id: "minecraft",
        category: "server",
        keywords: [
            "minecraft", "servidor minecraft", "servidores minecraft",
            "plugins", "mods", "paper", "purpur", "spigot",
            "versiones de minecraft", "software de servidor"
        ],
        answer: "EliteHostX está orientado al alojamiento de servidores Minecraft. En el formulario de creación puedes seleccionar Paper, Purpur, Vanilla o Spigot y elegir entre las versiones disponibles en el panel."
    },
    {
        id: "creation",
        category: "server",
        keywords: [
            "crear servidor", "crear mi servidor",
            "como crear servidor", "crear una instancia",
            "create server", "iniciar servidor", "encender servidor"
        ],
        answer: "Puedes entrar en Create Server desde el dashboard. Allí puedes elegir el nombre del servidor, el software (Paper, Purpur, Vanilla o Spigot), la versión de Minecraft y un plan de hosting. IMPORTANTE: actualmente el formulario guarda una configuración de demostración en el navegador; todavía no crea una instancia real porque falta conectar Pterodactyl."
    },
    {
        id: "file-manager",
        category: "server",
        keywords: [
            "file manager", "administrador de archivos",
            "archivos del servidor", "gestionar archivos"
        ],
        answer: "File Manager es la sección destinada a administrar los archivos del servidor. Actualmente necesita la integración con un panel de servidores como Pterodactyl y una instancia real para funcionar. Todavía no está conectada."
    },
    {
        id: "console",
        category: "server",
        keywords: [
            "console", "consola", "consola del servidor",
            "comandos del servidor", "logs del servidor"
        ],
        answer: "La sección Console está destinada a mostrar la consola en vivo, ejecutar comandos y consultar registros del servidor. Actualmente necesita la integración de Pterodactyl/Wings y un servidor real. Todavía no está conectada."
    },
    {
        id: "settings",
        category: "account",
        keywords: [
            "settings", "configuracion", "configuraciones",
            "ajustes", "cambiar nombre", "nombre de cuenta",
            "preferencias"
        ],
        answer: "En Settings puedes consultar y cambiar el nombre visible de tu cuenta, consultar tu correo electrónico y cerrar tu sesión. Las preferencias indicadas en el panel se guardan en el navegador."
    },
    {
        id: "billing",
        category: "billing",
        keywords: [
            "pago", "pagos", "precio", "precios",
            "factura", "cobro", "comprar", "reembolso"
        ],
        answer: "Los precios de los planes de EliteHostX todavía están pendientes de publicación. Para consultar una cuestión específica de facturación, puedes crear un ticket en Support Center y seleccionar Billing & Payments."
    },
    {
        id: "technical",
        category: "technical",
        keywords: [
            "error en elitehostx", "problema con mi cuenta",
            "fallo del panel", "no funciona el panel",
            "problema tecnico", "ayuda tecnica"
        ],
        answer: "Puedo orientarte con los servicios de EliteHostX. Si tienes un problema técnico, entra en Support Center, crea un ticket y selecciona Technical Support. Describe el problema para que nuestro equipo pueda revisarlo."
    }
];

module.exports = { KNOWLEDGE };
