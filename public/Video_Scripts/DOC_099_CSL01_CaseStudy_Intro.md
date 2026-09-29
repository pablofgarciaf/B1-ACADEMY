# Guion de Video: DOC 099 CSL01 CaseStudy Intro

## Introducción (Visual: Logo de SAP Academy)
Locutor: Bienvenidos a SAP Academy. En este módulo cubriremos: DOC 099 CSL01 CaseStudy Intro.

## Contenido Principal (Visual: Diapositivas correspondientes)
Guía Técnica: Caso Práctico CSL01 - Introducción, Navegación y Procesos Básicos en SAP HANA
Metadatos Técnicos
Módulo SAP: Fundamentos del Sistema y Ventas (System Basics & Sales / Navigation)
Código de Unidad: 099_CSL01_Introduction_ES
Versión Oficial: SAP Business One 10.0, versión para SAP HANA
Audiencia Objetivo: Usuarios Finales, Jefes de Ventas, Consultores de Implementación y Soporte.



{

  "antigravity_master_schema": {

    "module": "System Fundamentals & CRM Navigation",

    "version": "10.0 HANA",

    "roles_involved": {

      "user": "director / Sales Manager",

      "responsibilities": ["Gestión de clientes C20000, C50000, C60000", "Emisión de Ofertas de Venta", "Seguimiento de Pedidos"]

    },

    "core_functionalities": [

      "Plantillas de Cockpit (Fiori-style Cockpit Templates)",

      "Búsqueda Empresarial (Enterprise Search en SAP HANA)",

      "Búsqueda de Menú (Menu Search)",

      "Personalización de Cockpit y Galería de Widgets (Common Functions Widget)",

      "Estructuración de Ofertas de Venta con Filas de Texto y Subtotales",

      "Trazabilidad de Pedidos Abiertos (Drag & Relate, Open Items List, BP Master)"

    ],

    "business_partners_scope": ["C20000", "C50000", "C60000"],

    "items_scope": [

      {"item_code": "A00002", "quantity": 10},

      {"item_code": "A00005", "quantity": 5},

      {"item_code": "C00008", "quantity": 15}

    ]

  }

}


1. Contexto del Caso de Negocio: OEC Computers
Bill ha sido contratado como el nuevo Jefe de Ventas en OEC Computers. Durante su jornada de inducción, debe configurar su espacio de trabajo en SAP Business One 10.0 sobre SAP HANA para asegurar la máxima productividad comercial:

Adaptar su entorno visual mediante una plantilla de Cockpit de Ventas.
Asignar formalmente su perfil como empleado de ventas responsable en los clientes estratégicos asignados (C20000, C50000 y C60000).
Configurar accesos rápidos a las herramientas de CRM (Actividades) dentro de su cockpit.
Generar una oferta comercial estructurada para el cliente principal C20000, incluyendo líneas informativas de texto, subtotales intermedios y descuentos especiales.
Gestionar el ciclo de vida del documento convirtiendo la oferta en pedido mediante Enterprise Search, y auditar las órdenes pendientes de entrega mediante técnicas avanzadas de consulta.


2. Planteamiento de las Tareas del Caso Práctico
Tarea 1: Asignación de la Plantilla de Cockpit de Ventas
Problema: Tras iniciar sesión, la interfaz no presenta los indicadores clave ni el banco de trabajo de ventas.
Pregunta de Negocio: ¿Cuál es el procedimiento para que Bill se autoasigne la plantilla predefinida de Cockpit de Ventas orientada a la experiencia Fiori?
Tarea 2: Asignación de Responsabilidad Comercial en Datos Maestros
Problema: Los clientes corporativos C20000, C50000 y C60000 deben reflejar a Bill como su gestor oficial para asegurar el devengo de comisiones y el ruteo de notificaciones.
Pregunta de Negocio: ¿Cómo se actualiza el campo Empleado del departamento de ventas en los datos maestros de interlocutor comercial (OCRD)?
Tarea 3: Localización y Anclaje Rápido de la Función Actividades
Problema: Bill desconoce la ubicación en el árbol de menús de la gestión de Actividades (reuniones y llamadas de seguimiento).
Pregunta de Negocio:
¿Cómo utilizar la función Buscar menús para localizar la ruta exacta?
¿Cómo agregar un widget de Funciones comunes al cockpit y anclar el acceso directo a Actividades?
Tarea 4: Confección de Oferta de Ventas Estructurada (Oferta con Textos y Subtotales)
Requerimiento: El cliente C20000 solicita cotización para:
10 unidades de A00002
5 unidades de A00005
Subtotal intermedio
15 unidades de C00008
Descuento global a nivel de documento del 5%.
Desafío Técnico: Configurar la cuadrícula de contenido para habilitar filas de tipo Texto libre ('T') y Subtotal ('$\Sigma$') mediante parametrizaciones de formulario.
Tarea 5: Localización Rápida con Enterprise Search y Copiado a Pedido
Problema: El cliente confirma telefónicamente la aceptación de la oferta. Bill requiere abrir la oferta inmediatamente sin navegar por listados históricos.
Pregunta de Negocio: ¿Cómo aplicar Enterprise Search combinando el código de cliente y la fecha para abrir la oferta y convertirla en Pedido de Cliente (ORDR) mediante el botón Copiar a?
Tarea 6: Auditoría Multicanal de Pedidos Pendientes
Problema: Durante la llamada, el cliente solicita el estado de todas sus demás órdenes abiertas.
Pregunta de Negocio: Identificar y describir los 4 métodos nativos de SAP B1 para obtener los pedidos abiertos de un cliente en tiempo real.


3. Resumen de Puntos de Control y Competencias Evaluadas


## Cierre (Visual: Información de contacto)
Locutor: Gracias por acompañarnos en este módulo. Si tienes preguntas, ¡no dudes en usar nuestro asistente IA o el chat de WhatsApp!
