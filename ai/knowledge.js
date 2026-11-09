
const KNOWLEDGE = [
    {
        id: "greeting",
        category: "other",
        keywords: ["hola", "buenas", "saludos", "hey", "buenos dias", "buenas tardes"],
        answer: `¡Hola! Soy EliteAI, el asistente inteligente de EliteHostX.

Estoy aquí para ayudarte a conocer nuestra plataforma, nuestros planes de hosting Minecraft y las herramientas disponibles en tu panel.

Puedo explicarte cómo crear una cuenta, conocer los planes, configurar un servidor, utilizar Support Center y entender qué funciones están disponibles actualmente.

¿Qué te gustaría conocer sobre EliteHostX?`
    },
    {
        id: "support",
        category: "support",
        keywords: [
            "support center", "centro de soporte", "para que sirve soporte",
            "para que sirve support", "crear ticket", "crear un ticket",
            "tickets", "ticket", "contactar soporte", "atencion al cliente"
        ],
        answer: `## Support Center de EliteHostX

Support Center es el centro de atención y soporte técnico de EliteHostX. Su función es permitir que los usuarios se comuniquen con el equipo de soporte mediante conversaciones organizadas en tickets.

### ¿Qué puedes hacer?

1. **Crear una solicitud:** puedes abrir un nuevo ticket cuando tengas una pregunta, un inconveniente o necesites asistencia.
2. **Seleccionar una categoría:** cada solicitud se organiza según el tipo de problema.
3. **Mantener una conversación:** cada ticket tiene su propio historial de mensajes, por lo que puedes continuar hablando sobre el mismo caso sin mezclarlo con otras solicitudes.
4. **Consultar respuestas:** puedes entrar en tus conversaciones y revisar los mensajes recibidos del equipo.
5. **Seguir tus solicitudes:** puedes consultar el estado de los tickets desde la sección correspondiente.

### Categorías disponibles

- Account & Login: problemas relacionados con cuentas e inicio de sesión.
- Billing & Payments: consultas sobre precios, pagos y facturación.
- Hosting Plans: preguntas sobre los planes de alojamiento.
- Minecraft Server: asuntos relacionados con servidores Minecraft.
- Technical Support: problemas técnicos de la plataforma.
- Other: consultas que no encajan en las demás categorías.

### ¿Dónde se encuentra?

Entra en tu dashboard de EliteHostX y abre la sección Support.

**Importante:** los tickets son conversaciones privadas destinadas al usuario y al equipo de soporte autorizado.`
    },
    {
        id: "account-register",
        category: "account",
        keywords: [
            "crear cuenta", "crear una cuenta", "como crear cuenta",
            "como me registro", "como registrarme", "registrarme",
            "registro", "nueva cuenta", "cuenta nueva", "create account"
        ],
        answer: `## Cómo crear una cuenta en EliteHostX

Para utilizar las funciones del dashboard de EliteHostX necesitas tener una cuenta. El registro se realiza desde el formulario CREATE ACCOUNT.

### Pasos para registrarte

**1. Abre la página oficial**

Entra en https://elitehostx.bond desde tu navegador.

**2. Selecciona CREATE ACCOUNT**

En la pantalla de acceso, busca la opción CREATE ACCOUNT para abrir el formulario de registro.

**3. Completa tus datos**

El formulario solicita los siguientes campos:

- Display name: el nombre visible que quieres utilizar en tu cuenta.
- Email: tu dirección de correo electrónico.
- Password: la contraseña que utilizarás para iniciar sesión.
- Confirm password: vuelve a escribir la contraseña para confirmar que ambas coinciden.

**4. Revisa tu contraseña**

La contraseña debe tener un mínimo de 12 caracteres. Comprueba que el campo Password y Confirm password tengan exactamente el mismo contenido.

**5. Envía el formulario**

Pulsa CREATE ACCOUNT para enviar tu registro.

### ¿Ya tienes una cuenta?

Si ya estás registrado, utiliza SIGN IN e introduce tu correo electrónico y contraseña para acceder.

### ¿Tienes problemas?

Si el registro o el inicio de sesión no funcionan, puedes crear un ticket en Support Center y seleccionar la categoría Account & Login.

Nunca compartas tu contraseña en un ticket ni con otras personas.`
    },
    {
        id: "account-login",
        category: "account",
        keywords: [
            "iniciar sesion", "como inicio sesion", "como entrar",
            "entrar a mi cuenta", "login", "sign in", "acceder a mi cuenta"
        ],
        answer: `## Cómo iniciar sesión en EliteHostX

El inicio de sesión te permite acceder a tu dashboard y consultar las secciones disponibles para tu cuenta.

### Instrucciones

1. Entra en https://elitehostx.bond.
2. Selecciona SIGN IN.
3. Escribe el correo electrónico asociado a tu cuenta.
4. Introduce tu contraseña.
5. Envía el formulario para iniciar sesión.

### ¿Qué encontrarás después?

Una vez dentro del dashboard podrás consultar secciones como Dashboard, My Servers, Hosting Plans, Create Server, File Manager, Console, Settings y Support.

Ten presente que algunas herramientas todavía están pendientes de integración con un panel real de servidores.

### Si no puedes acceder

Comprueba que el correo y la contraseña estén escritos correctamente. Si el problema continúa, contacta al equipo mediante Support Center, categoría Account & Login.`
    },
    {
        id: "hosting",
        category: "hosting",
        keywords: [
            "planes", "planes de hosting", "hosting minecraft",
            "alojamiento", "que planes ofrecen", "planes disponibles",
            "todos los planes", "tipos de planes"
        ],
        answer: `## Planes de hosting de EliteHostX

EliteHostX dispone de un catálogo de seis planes orientados al alojamiento de servidores Minecraft. Cada plan presenta una capacidad diferente de memoria RAM, CPU y almacenamiento SSD.

### Planes disponibles

| Plan | RAM | CPU | SSD |
|---|---:|---:|---:|
| CORONA | 8 GB | 4 | 80 GB |
| ESMERALDA | 12 GB | 6 | 120 GB |
| DIAMANTE | 16 GB | 8 | 160 GB |
| NETHERITE | 24 GB | 10 | 240 GB |
| RUBÍ | 32 GB | 12 | 320 GB |
| AMATISTA | 48 GB | 16 | 480 GB |

### ¿Qué significa cada recurso?

**RAM:** es la memoria que utiliza el servidor para mantener cargado el mundo, procesar entidades, jugadores, plugins y otras tareas. La cantidad necesaria depende de la configuración y de la carga real del servidor.

**CPU:** representa la capacidad de procesamiento asignada al plan. Es importante para ejecutar las tareas del servidor y procesar su actividad.

**SSD:** es el almacenamiento disponible para los archivos del servidor, como mundos, configuraciones, plugins y otros datos.

### ¿Qué plan debería elegir?

La elección depende del tipo de servidor que quieras alojar, de los plugins o modificaciones que utilices, del número de jugadores y de la carga de trabajo esperada.

Un plan con más recursos ofrece una capacidad asignada superior, pero no garantiza por sí solo un rendimiento determinado. El resultado también depende de la configuración y del uso real.

### Información sobre precios

Los precios aparecen como PRECIO PRÓXIMAMENTE. Por ahora no hay tarifas oficiales publicadas.

**Importante:** estos planes forman parte del catálogo de la web. La creación de instancias reales todavía está pendiente de integrar Pterodactyl.`
    },
    {
        id: "plan-comparison",
        category: "hosting",
        keywords: [
            "diferencia entre corona y amatista",
            "corona vs amatista",
            "comparar corona y amatista",
            "comparacion de planes",
            "comparar planes",
            "diferencias entre planes"
        ],
        answer: `## Comparación entre CORONA y AMATISTA

CORONA y AMATISTA son dos planes del catálogo de EliteHostX, pero tienen capacidades de recursos bastante diferentes.

### Recursos de cada plan

| Recurso | CORONA | AMATISTA |
|---|---:|---:|
| RAM | 8 GB | 48 GB |
| CPU | 4 | 16 |
| SSD | 80 GB | 480 GB |

### 1. Memoria RAM

CORONA dispone de 8 GB de RAM, mientras que AMATISTA dispone de 48 GB.

Esto significa que AMATISTA tiene seis veces la memoria RAM de CORONA. La memoria es importante para mantener cargados los mundos, procesar entidades y ejecutar plugins o modificaciones.

### 2. Procesamiento

CORONA ofrece 4 CPU y AMATISTA ofrece 16 CPU.

AMATISTA tiene cuatro veces la cantidad de CPU indicada en CORONA. Esto representa una capacidad asignada de procesamiento superior.

### 3. Almacenamiento

CORONA incluye 80 GB SSD y AMATISTA incluye 480 GB SSD.

AMATISTA dispone de seis veces el almacenamiento de CORONA. Esto permite disponer de más espacio para mundos, archivos, configuraciones y otros datos.

### ¿Cuál tiene más recursos?

AMATISTA tiene más recursos en las tres categorías comparadas: RAM, CPU y SSD.

CORONA tiene una asignación menor de recursos. La elección entre ambos depende de las necesidades de tu proyecto y del presupuesto que tengas previsto.

**Importante:** no podemos garantizar una cantidad concreta de jugadores, TPS o rendimiento únicamente a partir de estas cifras. Eso depende también del software, los plugins, la configuración y la carga del servidor.

Los precios oficiales de ambos planes todavía están pendientes de publicación.`
    },
    {
        id: "plan-corona",
        category: "hosting",
        keywords: ["plan corona", "corona hosting", "ram corona", "cpu corona", "ssd corona"],
        answer: `## Plan CORONA

CORONA es uno de los planes del catálogo de hosting Minecraft de EliteHostX.

### Recursos incluidos

- RAM: 8 GB.
- CPU: 4.
- Almacenamiento: 80 GB SSD.

### ¿Qué significan estos recursos?

Los 8 GB de RAM representan la memoria asignada al plan. La CPU corresponde a su capacidad de procesamiento y los 80 GB SSD representan el espacio disponible para los archivos.

La elección de este plan debe considerar las características del servidor que quieras utilizar, incluyendo software, plugins, mundos y carga esperada.

### Precio

El precio oficial aparece como PRECIO PRÓXIMAMENTE.

**Estado:** forma parte del catálogo de planes; la creación de servidores reales todavía necesita la integración con Pterodactyl.`
    },
    {
        id: "plan-esmeralda",
        category: "hosting",
        keywords: ["plan esmeralda", "esmeralda hosting", "ram esmeralda", "cpu esmeralda"],
        answer: `## Plan ESMERALDA

ESMERALDA es uno de los planes disponibles en el catálogo de EliteHostX.

### Recursos incluidos

- RAM: 12 GB.
- CPU: 6.
- Almacenamiento: 120 GB SSD.

### ¿Qué ofrece?

Este plan dispone de más memoria, procesamiento y almacenamiento que CORONA.

La RAM se utiliza para las tareas del servidor, la CPU procesa su actividad y el SSD proporciona espacio para mundos, archivos, plugins y configuraciones.

Para decidir si es adecuado, debes considerar la versión de Minecraft, el software que utilizarás y la carga prevista.

### Precio y disponibilidad

El precio todavía está pendiente de publicación. La creación de instancias reales requiere conectar la plataforma con Pterodactyl.`
    },
    {
        id: "plan-diamante",
        category: "hosting",
        keywords: ["plan diamante", "diamante hosting", "ram diamante", "cpu diamante"],
        answer: `## Plan DIAMANTE

DIAMANTE es uno de los planes de hosting Minecraft del catálogo de EliteHostX.

### Recursos incluidos

- RAM: 16 GB.
- CPU: 8.
- Almacenamiento: 160 GB SSD.

### ¿Para qué sirven estos recursos?

Los 16 GB de RAM representan la memoria asignada al servidor. Las 8 CPU corresponden a la capacidad de procesamiento indicada y los 160 GB SSD proporcionan almacenamiento para los datos del servidor.

La capacidad que realmente necesitas dependerá de tus plugins, mundos, software, jugadores y configuración.

### Precio

El precio oficial todavía no ha sido publicado.`
    },
    {
        id: "plan-netherite",
        category: "hosting",
        keywords: ["plan netherite", "netherite hosting", "ram netherite", "cpu netherite"],
        answer: `## Plan NETHERITE

NETHERITE es uno de los planes del catálogo de EliteHostX.

### Recursos incluidos

- RAM: 24 GB.
- CPU: 10.
- Almacenamiento: 240 GB SSD.

### Características

Este plan dispone de 24 GB de memoria RAM, 10 CPU y 240 GB de almacenamiento SSD.

Estos recursos representan la capacidad indicada para el plan. La cantidad de memoria y procesamiento necesaria para un servidor Minecraft depende de su configuración, software, plugins, mundos y actividad.

### Precio

El precio oficial está pendiente de publicación.`
    },
    {
        id: "plan-rubi",
        category: "hosting",
        keywords: ["plan rubi", "plan rubí", "rubi hosting", "rubí hosting", "ram rubi", "cpu rubi"],
        answer: `## Plan RUBÍ

RUBÍ es uno de los planes de hosting disponibles en el catálogo de EliteHostX.

### Recursos incluidos

- RAM: 32 GB.
- CPU: 12.
- Almacenamiento: 320 GB SSD.

### Características

El plan dispone de 32 GB de RAM, 12 CPU y 320 GB SSD.

La memoria permite mantener los procesos y datos del servidor en ejecución, la CPU se encarga del procesamiento y el almacenamiento SSD proporciona espacio para los archivos.

La elección debe realizarse según las necesidades reales del proyecto.

### Precio

El precio todavía está pendiente de publicación.`
    },
    {
        id: "plan-amatista",
        category: "hosting",
        keywords: ["plan amatista", "amatista hosting", "ram amatista", "cpu amatista", "ssd amatista"],
        answer: `## Plan AMATISTA

AMATISTA es el plan con mayor capacidad de recursos dentro del catálogo actual de EliteHostX.

### Recursos incluidos

- RAM: 48 GB.
- CPU: 16.
- Almacenamiento: 480 GB SSD.

### Características

Dispone de 48 GB de memoria RAM, 16 CPU y 480 GB de almacenamiento SSD.

La memoria se utiliza para mantener los procesos y datos del servidor, la CPU proporciona capacidad de procesamiento y el SSD permite almacenar mundos, archivos, plugins y configuraciones.

Aunque tiene la mayor asignación de recursos del catálogo, el rendimiento final dependerá también de la configuración y de la carga de trabajo.

### Precio

El precio oficial está pendiente de publicación.`
    },
    {
        id: "minecraft",
        category: "server",
        keywords: [
            "minecraft", "servidor minecraft", "servidores minecraft",
            "plugins", "mods", "paper", "purpur", "spigot",
            "vanilla", "software de servidor"
        ],
        answer: `## Hosting de servidores Minecraft en EliteHostX

EliteHostX está orientado al alojamiento de servidores Minecraft.

En la sección Create Server, el formulario permite seleccionar diferentes opciones de software para configurar el servidor.

### Software disponible

- Paper.
- Purpur.
- Vanilla.
- Spigot.

### ¿Qué debes tener en cuenta?

El software determina la plataforma sobre la que funcionará el servidor. La elección dependerá de las características que necesites y de los plugins o configuraciones que quieras utilizar.

También puedes seleccionar una de las versiones disponibles en el formulario.

### Estado actual

La web dispone de la interfaz de configuración, pero todavía no está conectada a un sistema de creación de instancias reales mediante Pterodactyl.

Por eso, no debes confundir guardar una configuración con tener un servidor Minecraft funcionando.`
    },
    {
        id: "creation",
        category: "server",
        keywords: [
            "crear servidor", "crear mi servidor", "como crear servidor",
            "crear una instancia", "create server", "configurar servidor",
            "iniciar servidor", "encender servidor"
        ],
        answer: `## Cómo configurar un servidor desde EliteHostX

La sección Create Server está diseñada para permitirte seleccionar las características de una configuración de servidor Minecraft.

### Pasos disponibles en la web

**1. Accede al dashboard**

Inicia sesión en EliteHostX y entra en tu panel.

**2. Abre Create Server**

Selecciona la sección Create Server en la navegación del dashboard.

**3. Escribe el nombre**

Introduce el nombre que quieres utilizar para identificar la configuración.

**4. Selecciona el software**

El formulario permite elegir entre Paper, Purpur, Vanilla y Spigot.

**5. Selecciona la versión**

Elige una de las versiones de Minecraft disponibles en el formulario.

**6. Selecciona un plan**

Escoge el plan del catálogo que quieras asociar a la configuración.

**7. Guarda la configuración**

Envía el formulario para guardar los datos.

### ¿Se crea un servidor real?

No todavía. Actualmente el formulario funciona en modo demostración y guarda una configuración en el navegador.

Todavía falta integrar Pterodactyl para que la web pueda solicitar la creación de una instancia real, asignar recursos y administrar el servidor.

Por lo tanto, guardar el formulario no significa que el servidor esté encendido, tenga una dirección IP o esté disponible para conectarse.

Esta integración forma parte del trabajo pendiente de la plataforma.`
    },
    {
        id: "file-manager",
        category: "server",
        keywords: [
            "file manager", "administrador de archivos",
            "archivos del servidor", "gestionar archivos",
            "subir archivos", "editar archivos"
        ],
        answer: `## File Manager de EliteHostX

File Manager es la sección destinada a administrar los archivos de un servidor.

En un panel de hosting conectado, un administrador de archivos permite trabajar con elementos como configuraciones, mundos, plugins y otros archivos del servidor.

### Estado actual

La sección de File Manager todavía no está conectada a un servidor real.

Para que funcione necesita:

1. Una instancia real de servidor.
2. Una integración con el panel de administración de servidores, como Pterodactyl.
3. Una conexión que permita consultar y administrar los archivos de la instancia correspondiente.

Hasta que esa integración esté terminada, no se puede afirmar que sea posible subir, borrar o editar archivos reales desde esta sección.

La interfaz forma parte del dashboard, pero su funcionalidad real está pendiente de conexión.`
    },
    {
        id: "console",
        category: "server",
        keywords: [
            "console", "consola", "consola del servidor",
            "comandos del servidor", "logs del servidor",
            "ejecutar comandos", "ver consola"
        ],
        answer: `## Console de EliteHostX

La sección Console está destinada a ofrecer acceso a la consola de administración del servidor.

### ¿Qué funciones tendrá?

Cuando esté conectada a una instancia real, esta sección estará destinada a permitir:

- Consultar la salida de la consola.
- Revisar los registros o logs.
- Ejecutar comandos administrativos.
- Supervisar la actividad del servidor.

### ¿Está funcionando actualmente?

Todavía no. La consola necesita una integración con Pterodactyl y Wings, además de una instancia real a la que conectarse.

Por eso, actualmente no debes considerar la sección como una consola Minecraft operativa.

Cuando se complete la integración, podrá conectarse a los servidores correspondientes según los permisos de cada usuario.`
    },
    {
        id: "settings",
        category: "account",
        keywords: [
            "settings", "configuracion", "configuraciones",
            "ajustes", "cambiar nombre", "nombre de cuenta",
            "preferencias"
        ],
        answer: `## Settings de EliteHostX

Settings es la sección de configuración de tu cuenta dentro del dashboard.

### Opciones disponibles

**Nombre visible:** puedes consultar y cambiar el nombre que aparece asociado a tu cuenta.

**Correo electrónico:** puedes consultar la dirección asociada. El correo es administrado por el sistema de cuenta y aparece como un campo de solo lectura.

**Cerrar sesión:** permite finalizar tu sesión actual en la plataforma.

### Preferencias

Algunas preferencias del panel se guardan en el navegador. Esto significa que no necesariamente se sincronizan entre diferentes dispositivos o navegadores.

Para acceder a Settings, inicia sesión y selecciona esa sección desde la navegación del dashboard.`
    },
    {
        id: "billing",
        category: "billing",
        keywords: [
            "pago", "pagos", "precio", "precios", "factura",
            "cobro", "comprar", "reembolso", "cuanto cuesta",
            "cuanto valen"
        ],
        answer: `## Precios y pagos de EliteHostX

El catálogo de EliteHostX muestra seis planes de hosting Minecraft: CORONA, ESMERALDA, DIAMANTE, NETHERITE, RUBÍ y AMATISTA.

Sin embargo, los precios oficiales todavía están pendientes de publicación y aparecen como PRECIO PRÓXIMAMENTE.

### ¿Puedo consultar un pago o una factura?

Para una consulta relacionada con facturación, pagos o cobros, puedes utilizar Support Center.

### Cómo enviar la solicitud

1. Inicia sesión en tu cuenta.
2. Entra en Support.
3. Crea un nuevo ticket.
4. Selecciona Billing & Payments.
5. Describe tu consulta con la información necesaria.

No puedo confirmar tarifas, métodos de pago o políticas de reembolso que todavía no hayan sido publicados oficialmente.`
    },
    {
        id: "technical",
        category: "technical",
        keywords: [
            "error en elitehostx", "problema con mi cuenta",
            "fallo del panel", "no funciona el panel",
            "problema tecnico", "ayuda tecnica",
            "error de la web", "problema tecnico"
        ],
        answer: `## Asistencia técnica de EliteHostX

Si tienes un problema técnico con la plataforma, podemos organizar la solicitud mediante Support Center.

### ¿Qué información conviene incluir?

Para que el equipo pueda entender mejor el problema, describe:

1. En qué sección estabas trabajando.
2. Qué acción intentabas realizar.
3. Qué resultado esperabas obtener.
4. Qué ocurrió realmente.
5. Si apareció algún mensaje de error, copia su texto.

### ¿Dónde solicitar ayuda?

Entra en el dashboard, abre Support, crea un ticket y selecciona Technical Support.

Incluye una descripción clara del problema. No compartas contraseñas ni otros datos privados.

De esta forma, el equipo podrá revisar la solicitud con el contexto necesario.`
    }
];

module.exports = { KNOWLEDGE };
