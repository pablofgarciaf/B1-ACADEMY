import { NextResponse } from 'next/server';
import { OFFICIAL_SYLLABUS } from '@/lib/curriculum-data';
import { requireBearerUser } from '@/lib/server-auth';
import { MODULO_INDUCCION, moduloInduccionCompleto } from '@/lib/requisitos-aula';
import LECCIONES_AULA from '@/content/aula/lecciones.json';

// =============================================================
// CONTENIDO EDUCATIVO — Framework: Content Creator + Behavioral Nudge Engine
// Fórmula por slide: Hook → Qué VAS a HACER → Acción → Micro-celebración
// =============================================================
const LESSON_CONTENT: Record<string, {
  images: string[];
  syncData: { slide_index: number; script_text: string; step_guide: any | null }[];
  quizQuestions: any[];
}> = {
  // CLASE 1: Arquitectura y Cockpit Fiori
  'mod1-c1': {
    images: ['/images/pilot_slide_1.jpg'], // Solo 1 imagen de bienvenida
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a SAP Business One. Todo consultor debe empezar por lo básico: entrar al sistema y comprender su arquitectura de tres capas. Lo que estás viendo ahora es el proceso para acceder a la capa de presentación (el cliente).",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar en una representación didáctica del inicio de sesión. Aquí identificas el usuario, la clave y la sociedad (empresa) a la que te vas a conectar. Utiliza únicamente los datos de demostración.",
        step_guide: {
          action_type: "login",
          title: "Acceso al Sistema",
          instructions: [
            "Verifica que el usuario sea 'manager' y la sociedad 'SBODEMO_ES'.",
            "Haz clic en el botón 'Iniciar Sesión' para acceder."
          ]
        }
      },
      {
        slide_index: 3,
        script_text: "¡Perfecto! Acabas de entrar al Cockpit Fiori. Esta es la pantalla principal. Desde aquí puedes controlar indicadores de ventas, compras, finanzas e inventario en tiempo real, todo mediante widgets.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Cockpit > Análisis Visual",
          title: "Exploración del Cockpit",
          instructions: [
            "Observa los widgets en la pantalla principal.",
            "Pulsa 'Terminar exploración' para continuar."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // CLASE 2: Parametrizaciones y Preferencias
  'mod1-c2': {
    images: ['/images/pilot_slide_2.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "En esta lección aprenderemos a configurar las parametrizaciones de usuario. Esto es vital para adaptar el sistema al rol de cada empleado, asegurando que el idioma, el formato de moneda y el almacén por defecto sean los correctos.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Vamos a la práctica. Asignemos el perfil de Ventas y el Almacén Logístico Norte a tu usuario para que no tengas que elegirlos manualmente cada vez que crees una cotización.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión > Parametrizaciones Generales > Fiori Cockpit",
          title: "Configurar Perfil de Usuario",
          instructions: [
            "En 'Plantilla de Perfil / Rol', selecciona 'Ventas y Distribución'.",
            "En 'Almacén Predeterminado', elige '02 - Almacén Logístico Norte'.",
            "Haz clic en 'Actualizar y Guardar'."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // CLASE 3: Búsqueda y Funciones de Ayuda
  'mod1-c3': {
    images: ['/images/pilot_slide_3.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "El menú principal de SAP es gigantesco. La forma en la que los consultores expertos ahorran tiempo es utilizando el Buscador Empresarial (Enterprise Search). Nos permite encontrar ventanas, documentos y clientes con un par de teclas.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Prueba el atajo tú mismo. Utilizaremos el icono de búsqueda en la barra superior para encontrar un formulario específico rápidamente.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Barra Superior > Lupa de Búsqueda",
          title: "Búsqueda Rápida",
          instructions: [
            "Haz clic en el icono de la Lupa (Buscar) en la barra superior.",
            "Visualiza la barra de búsqueda desplegada.",
            "Cierra la barra para finalizar la misión."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // CLASE 4: Mensajes, Alertas y Autorizaciones
  'mod1-c4': {
    images: ['/images/pilot_slide_4.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Para terminar el módulo, hablaremos de la gestión por excepciones. SAP Business One te alerta automáticamente cuando ocurren desviaciones importantes, como faltantes de stock o descuentos que superan el límite permitido.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "El último paso para dominar tu entorno de trabajo es revisar estas alertas. Un buen consultor siempre revisa su buzón al iniciar el día. Ve a la barra superior y abre tus mensajes.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Barra Superior > Mensajes y Alertas",
          title: "Revisar Bandeja de Entrada",
          instructions: [
            "Localiza la Barra de Herramientas Estándar en la parte superior derecha.",
            "Haz clic en el icono de la Campanita.",
            "Revisa tu bandeja de entrada y ciérrala para terminar el módulo."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // ============================================================================
  // MA"DULO 2: Nacleo Maestro ERP
  // ============================================================================
  
  // CLASE 1: Socio de Negocios (OCRD)
  'mod2-c1': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "En SAP Business One, cualquier persona o empresa con la que hacemos negocios, ya sea un cliente, un proveedor o incluso un prospecto, se gestiona como un Socio de Negocios. Su ficha maestra es la tabla OCRD y es el punto de partida para emitir cualquier documento comercial.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Vamos a crear la ficha de un nuevo cliente. Para eso, abriremos el módulo de Interlocutores Comerciales y navegaremos hasta los Datos Maestros.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Interlocutores Comerciales > Datos Maestros de Socio de Negocios",
          title: "Abrir Ficha de Socio de Negocios",
          instructions: [
            "Haz clic en el menú principal 'Interlocutores Comerciales'.",
            "Selecciona la opción 'Datos Maestros de Socio de Negocios'.",
            "En la barra superior, haz clic en el icono 'Añadir' (Ctrl+A) para activar el modo creación."
          ]
        }
      },
      {
        slide_index: 3,
        script_text: "Ahora completamos los datos esenciales. El código del socio de negocios debe ser único. Asignaremos el tipo 'Cliente' y lo vincularemos a un grupo de cuentas por cobrar.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Interlocutores Comerciales > Datos Maestros > Pestaña General",
          title: "Configurar el Nuevo Cliente",
          instructions: [
            "En el campo 'Código', escribe 'C10001'.",
            "En 'Nombre', escribe 'OEC Computers Ecuador'.",
            "En 'Tipo', selecciona 'Cliente'.",
            "Haz clic en 'Actualizar y Guardar' para registrar el cliente."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // CLASE 2: Datos Maestros de Artículo (OITM)
  'mod2-c2': {
    images: ['/images/mod2_articulo_oitm_1790987286637.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Todo lo que compramos, vendemos o almacenamos en SAP Business One necesita una ficha maestra de artículo, la tabla OITM. Aquí definimos si el producto maneja inventario permanente, lotes, series, y qué cuentas contables utiliza automáticamente.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Vamos a crear el artículo. Navegamos al módulo de Inventario para abrir la ficha de datos maestros.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Inventario > Datos Maestros de Artículo",
          title: "Abrir Datos Maestros de Artículo",
          instructions: [
            "Haz clic en el menú 'Inventario'.",
            "Selecciona 'Datos Maestros de Artículo'.",
            "Haz clic en 'Añadir' (Ctrl+A) para iniciar la creación."
          ]
        }
      },
      {
        slide_index: 3,
        script_text: "Ahora configuramos las propiedades del artículo. Verificamos que el producto sea de inventario, de venta y de compra. Estas tres casillas determinan en qué documentos puede aparecer.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Inventario > Datos Maestros de Artículo > Campos Generales",
          title: "Configurar el Artículo",
          instructions: [
            "En 'Número de Artículo', escribe 'LAPTOP-001'.",
            "En 'Descripción', escribe 'Laptop Empresarial 15 pulgadas'.",
            "Verifica que estén marcadas: 'Artículo de inventario', 'Artículo de venta' y 'Artículo de compra'.",
            "Haz clic en 'Actualizar y Guardar'."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // CLASE 3: Gestión de Unidades de Medida
  'mod2-c3': {
    images: ['/images/mod2_articulo_oitm_1790987286637.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Un problema frecuente en logística es que compramos en una unidad y vendemos en otra. Por ejemplo, compramos laptops por pallets de 10 unidades pero las vendemos de a una. SAP Business One resuelve esto con los Grupos de Unidades de Medida, que permiten conversiones automáticas entre la unidad de compra y la de venta.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Para configurar esto, debemos acceder a la pestaña de Datos de Compra dentro de la ficha del artículo.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Inventario > Datos Maestros de Artículo > Pestaña Compras",
          title: "Configurar Unidad de Compra",
          instructions: [
            "Abre la ficha del artículo 'LAPTOP-001'.",
            "Ve a la pestaña 'Datos de Compra'.",
            "En el campo 'UdM de Compra', selecciona 'Caja (10 un)'.",
            "El sistema calculará automáticamente el factor de conversión."
          ]
        }
      },
      {
        slide_index: 3,
        script_text: "Ahora asignamos la unidad de venta en la pestaña correspondiente. Cuando se emita una orden de compra en cajas y una orden de venta en unidades, SAP convertirá los valores de inventario automáticamente.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Inventario > Datos Maestros de Artículo > Pestaña Ventas",
          title: "Configurar Unidad de Venta",
          instructions: [
            "Ahora ve a la pestaña 'Datos de Ventas'.",
            "En 'UdM de Ventas', selecciona 'Unidad'.",
            "Verifica que el factor de conversión muestre '1 Caja = 10 Unidades'.",
            "Guarda los cambios con 'Actualizar y Guardar'."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // CLASE 4: Determinación Estándar de Precios
  'mod2-c4': {
    images: ['/images/mod2_precios_1790987294588.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Las Listas de Precios son el puente entre los artículos y los clientes. En SAP Business One, cada artículo puede tener diferentes precios según el tipo de cliente: precio de lista para el público, precio preferencial para distribuidores, y precio de costo para uso interno. Todas estas listas pueden aplicar descuentos encadenados entre sí.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Primero configuramos el precio base del artículo. Esta es la lista desde la cual se calcularán todos los demás precios.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Inventario > Listas de Precios > Listas de Precios",
          title: "Asignar Precio Base",
          instructions: [
            "Ve al menú 'Inventario' y selecciona 'Listas de Precios'.",
            "Haz doble clic en la 'Lista de Precios Base'.",
            "Busca el artículo 'LAPTOP-001' en la grilla.",
            "Escribe el precio unitario: '1500' y presiona Enter."
          ]
        }
      },
      {
        slide_index: 3,
        script_text: "Ahora vinculamos esta lista de precios al cliente que creamos anteriormente. De esta forma, cuando el vendedor emita una cotización para OEC Computers, el precio se llenará automáticamente.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Interlocutores Comerciales > Datos Maestros > Pestaña Condiciones de Pago",
          title: "Vincular Lista de Precios al Cliente",
          instructions: [
            "Abre la ficha del cliente 'C10001 - OEC Computers Ecuador'.",
            "Ve a la pestaña 'Condiciones de Pago'.",
            "En el campo 'Lista de Precios', selecciona 'Lista de Precios Base'.",
            "Haz clic en 'Actualizar y Guardar'."
          ]
        }
      }
    ],
    quizQuestions: []
  },

  // ============================================================================
  // MÓDULO 3: Aprovisionamiento y Control de Inventarios
  // ============================================================================

  'mod3-c1': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Ciclo Procure-to-Pay. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Aprovisionamiento y Control de Inventarios > Ciclo Procure-to-Pay",
          title: "Práctica: Ciclo Procure-to-Pay",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Ciclo Procure-to-Pay.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod3-c2': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Transacciones de Almacén. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Aprovisionamiento y Control de Inventarios > Transacciones de Almacén",
          title: "Práctica: Transacciones de Almacén",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Transacciones de Almacén.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod3-c3': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Recuentos de Inventario. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Aprovisionamiento y Control de Inventarios > Recuentos de Inventario",
          title: "Práctica: Recuentos de Inventario",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Recuentos de Inventario.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod3-c4': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre MRP Básico. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Aprovisionamiento y Control de Inventarios > MRP Básico",
          title: "Práctica: MRP Básico",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de MRP Básico.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 4: Gestión de Ventas y Order-to-Cash
  // ============================================================================

  'mod4-c1': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Proceso de Ventas. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión de Ventas y Order-to-Cash > Proceso de Ventas",
          title: "Práctica: Proceso de Ventas",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Proceso de Ventas.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod4-c2': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Oportunidades de Ventas. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión de Ventas y Order-to-Cash > Oportunidades de Ventas",
          title: "Práctica: Oportunidades de Ventas",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Oportunidades de Ventas.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod4-c3': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Facturación y Entregas. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión de Ventas y Order-to-Cash > Facturación y Entregas",
          title: "Práctica: Facturación y Entregas",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Facturación y Entregas.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod4-c4': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Devoluciones. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión de Ventas y Order-to-Cash > Devoluciones",
          title: "Práctica: Devoluciones",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Devoluciones.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 5: Estrategias Avanzadas de Precios
  // ============================================================================

  'mod5-c1': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Descuentos por Periodo. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Estrategias Avanzadas de Precios > Descuentos por Periodo",
          title: "Práctica: Descuentos por Periodo",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Descuentos por Periodo.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod5-c2': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Grupos de Descuentos. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Estrategias Avanzadas de Precios > Grupos de Descuentos",
          title: "Práctica: Grupos de Descuentos",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Grupos de Descuentos.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod5-c3': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Precios Especiales. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Estrategias Avanzadas de Precios > Precios Especiales",
          title: "Práctica: Precios Especiales",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Precios Especiales.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod5-c4': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Campañas. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Estrategias Avanzadas de Precios > Campañas",
          title: "Práctica: Campañas",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Campañas.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 6: Gestión CRM y Servicios Post-venta
  // ============================================================================

  'mod6-c1': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Llamadas de Servicio. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión CRM y Servicios Post-venta > Llamadas de Servicio",
          title: "Práctica: Llamadas de Servicio",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Llamadas de Servicio.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod6-c2': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Tarjetas de Equipo. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión CRM y Servicios Post-venta > Tarjetas de Equipo",
          title: "Práctica: Tarjetas de Equipo",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Tarjetas de Equipo.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod6-c3': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Base de Soluciones. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión CRM y Servicios Post-venta > Base de Soluciones",
          title: "Práctica: Base de Soluciones",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Base de Soluciones.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod6-c4': {
    images: ['/images/mod4_ventas_1790986008319.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Garantías. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Gestión CRM y Servicios Post-venta > Garantías",
          title: "Práctica: Garantías",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Garantías.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 7: Contabilidad Central y NIIF
  // ============================================================================

  'mod7-c1': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Plan de Cuentas. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Contabilidad Central y NIIF > Plan de Cuentas",
          title: "Práctica: Plan de Cuentas",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Plan de Cuentas.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod7-c2': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Asientos Manuales. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Contabilidad Central y NIIF > Asientos Manuales",
          title: "Práctica: Asientos Manuales",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Asientos Manuales.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod7-c3': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Modelos Contables. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Contabilidad Central y NIIF > Modelos Contables",
          title: "Práctica: Modelos Contables",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Modelos Contables.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod7-c4': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Diferencias de Cambio. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Contabilidad Central y NIIF > Diferencias de Cambio",
          title: "Práctica: Diferencias de Cambio",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Diferencias de Cambio.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 8: Tesorería, Cobros y Pagos
  // ============================================================================

  'mod8-c1': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Pagos Recibidos. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Tesorería, Cobros y Pagos > Pagos Recibidos",
          title: "Práctica: Pagos Recibidos",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Pagos Recibidos.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod8-c2': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Pagos Efectuados. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Tesorería, Cobros y Pagos > Pagos Efectuados",
          title: "Práctica: Pagos Efectuados",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Pagos Efectuados.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod8-c3': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Medios de Pago. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Tesorería, Cobros y Pagos > Medios de Pago",
          title: "Práctica: Medios de Pago",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Medios de Pago.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod8-c4': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Reconciliación Interna. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Tesorería, Cobros y Pagos > Reconciliación Interna",
          title: "Práctica: Reconciliación Interna",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Reconciliación Interna.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 9: Control de Activos Fijos
  // ============================================================================

  'mod9-c1': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Datos Maestros de Activos. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Control de Activos Fijos > Datos Maestros de Activos",
          title: "Práctica: Datos Maestros de Activos",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Datos Maestros de Activos.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod9-c2': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Capitalización. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Control de Activos Fijos > Capitalización",
          title: "Práctica: Capitalización",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Capitalización.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod9-c3': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Amortización. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Control de Activos Fijos > Amortización",
          title: "Práctica: Amortización",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Amortización.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod9-c4': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Baja de Activos. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Control de Activos Fijos > Baja de Activos",
          title: "Práctica: Baja de Activos",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Baja de Activos.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 10: Planificación de Materiales (MRP)
  // ============================================================================

  'mod10-c1': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Pronósticos. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Planificación de Materiales (MRP) > Pronósticos",
          title: "Práctica: Pronósticos",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Pronósticos.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod10-c2': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Asistente MRP. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Planificación de Materiales (MRP) > Asistente MRP",
          title: "Práctica: Asistente MRP",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Asistente MRP.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod10-c3': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Recomendaciones. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Planificación de Materiales (MRP) > Recomendaciones",
          title: "Práctica: Recomendaciones",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Recomendaciones.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod10-c4': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Ejecución MRP. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Planificación de Materiales (MRP) > Ejecución MRP",
          title: "Práctica: Ejecución MRP",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Ejecución MRP.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 11: Fabricación y Proyectos (BOM)
  // ============================================================================

  'mod11-c1': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Listas de Materiales. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Fabricación y Proyectos (BOM) > Listas de Materiales",
          title: "Práctica: Listas de Materiales",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Listas de Materiales.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod11-c2': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Órdenes de Producción. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Fabricación y Proyectos (BOM) > Órdenes de Producción",
          title: "Práctica: Órdenes de Producción",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Órdenes de Producción.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod11-c3': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Emisión y Recibo. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Fabricación y Proyectos (BOM) > Emisión y Recibo",
          title: "Práctica: Emisión y Recibo",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Emisión y Recibo.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod11-c4': {
    images: ['/images/mod3_logistica_1790986000116.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Gestión de Proyectos. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Fabricación y Proyectos (BOM) > Gestión de Proyectos",
          title: "Práctica: Gestión de Proyectos",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Gestión de Proyectos.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  // ============================================================================
  // MÓDULO 12: Consultoría y Herramientas SQL
  // ============================================================================

  'mod12-c1': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Query Manager. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Consultoría y Herramientas SQL > Query Manager",
          title: "Práctica: Query Manager",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Query Manager.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod12-c2': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Vistas SQL. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Consultoría y Herramientas SQL > Vistas SQL",
          title: "Práctica: Vistas SQL",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Vistas SQL.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod12-c3': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Data Transfer Workbench. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Consultoría y Herramientas SQL > Data Transfer Workbench",
          title: "Práctica: Data Transfer Workbench",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Data Transfer Workbench.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
  'mod12-c4': {
    images: ['/images/mod2_maestros_1790985991136.jpg'],
    syncData: [
      {
        slide_index: 1,
        script_text: "Bienvenido a la clase sobre Alertas Personalizadas. Aquí dominaremos los fundamentos teóricos y las mejores prácticas en SAP Business One para este proceso.",
        step_guide: null
      },
      {
        slide_index: 2,
        script_text: "Es momento de practicar. Abre el menú y ejecuta las instrucciones del simulador para completar la misión.",
        step_guide: {
          action_type: "cockpit",
          menu_path: "Consultoría y Herramientas SQL > Alertas Personalizadas",
          title: "Práctica: Alertas Personalizadas",
          instructions: [
            "Abre el módulo correspondiente en el menú principal.",
            "Selecciona la opción de Alertas Personalizadas.",
            "Completa los campos requeridos y haz clic en Crear o Actualizar."
          ]
        }
      }
    ],
    quizQuestions: []
  },
};

export async function GET(req: Request) {
  try {
    const actor = await requireBearerUser(req);
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json({ error: 'Parámetro classId requerido' }, { status: 400 });
    }

    // Buscar la clase en el curriculum oficial
    let foundClass = null;
    let foundModule = null;
    for (const mod of OFFICIAL_SYLLABUS) {
      const cls = mod.classes.find(c => c.id === classId);
      if (cls) {
        foundClass = cls;
        foundModule = mod;
        break;
      }
    }

    if (!foundClass || !foundModule) {
      return NextResponse.json({ error: `Clase ${classId} no encontrada` }, { status: 404 });
    }

    // El Módulo 1 (inducción) es requisito de todos los demás: se exige también aquí, no solo en la interfaz.
    if (foundModule.id !== MODULO_INDUCCION && !(await moduloInduccionCompleto(actor.uid, actor.profile.role))) {
      return NextResponse.json({ error: 'Completa primero el Módulo 1 para acceder a este módulo.' }, { status: 403 });
    }

    // Contenido publicado de Mi Aula (clases completas con prácticas evaluadas) tiene prioridad.
    const publicada = (LECCIONES_AULA as Record<string, { images: string[]; syncData: unknown[]; quizQuestions: unknown[] }>)[classId];
    if (publicada) {
      return NextResponse.json({
        classId,
        title: foundClass.title,
        category: foundModule.badge,
        number: foundClass.number,
        totalSlides: publicada.syncData.length,
        images: publicada.images,
        syncData: publicada.syncData,
        quizQuestions: publicada.quizQuestions,
      });
    }

    // Si hay contenido real para esta clase, usarlo
    const content = LESSON_CONTENT[classId];
    if (content) {
      return NextResponse.json({
        classId,
        title: foundClass.title,
        category: foundModule.badge,
        number: foundClass.number,
        totalSlides: content.syncData.length,
        images: content.images,
        syncData: content.syncData,
        quizQuestions: content.quizQuestions
      });
    }

    // Para clases sin contenido aún: texto motivacional con la descripción real
    return NextResponse.json({
      classId,
      title: foundClass.title,
      category: foundModule.badge,
      number: foundClass.number,
      totalSlides: 1,
      images: [],
      syncData: [
        {
          slide_index: 1,
          script_text: `Bienvenido a "${foundClass.title}", parte del Módulo ${foundModule.number}. ${foundClass.description} Esta lección está siendo preparada con material de alta calidad. Mientras tanto, puedes avanzar con las clases disponibles.`,
          step_guide: null
        }
      ],
      quizQuestions: []
    });

  } catch {
    return NextResponse.json({ error: 'No autorizado o contenido no disponible.' }, { status: 401 });
  }
}
