# EXTENSIÓN 2048 PARA CHROME

| Modo Claro | Modo Oscuro |
|------------|-------------|
| ![Modo claro](assets/2048%2001.png) | ![Modo oscuro](assets/2048%2002.png) |

[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Versión](https://img.shields.io/badge/version-2.0-brightgreen.svg)](https://github.com/686f6c61/2048-chrome-extension)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)

## DESCRIPCIÓN GENERAL

Esta extensión de Chrome implementa el clásico juego de puzzle 2048 directamente en el navegador como popup. La implementación incluye una interfaz con soporte para modo oscuro, funcionalidad de deshacer, seguimiento de estadísticas persistentes y características completas de accesibilidad. Construido con JavaScript vanilla sin dependencias externas, la extensión proporciona una experiencia de juego ligera y responsiva.

El proyecto sigue los estándares Chrome Extension Manifest V3 e incluye documentación completa para desarrolladores que deseen entender, modificar o contribuir al código base.

## CARACTERÍSTICAS

### MECÁNICAS DE JUEGO

La extensión implementa las mecánicas completas del juego 2048 con cuatro niveles de dificultad configurables. Los jugadores pueden ajustar la probabilidad de aparición de fichas (2 vs 4) mediante un selector intuitivo, desde el modo Fácil con 95% de probabilidad de 2s hasta el modo Extremo con solo 70% de probabilidad. El juego detecta automáticamente las condiciones de victoria al alcanzar 2048 y las condiciones de derrota cuando no quedan movimientos válidos.

Los controles mediante teclas de flecha proporcionan movimiento fluido de las fichas en las cuatro direcciones. El estado del juego se actualiza en tiempo real con retroalimentación visual para cambios de puntuación y combinaciones de fichas.

### INTERFAZ DE USUARIO

La interfaz presenta temas claro y oscuro con almacenamiento persistente de preferencias. La implementación del modo oscuro incluye contrastes de color cuidadosamente optimizados para asegurar legibilidad en todos los valores de fichas. Los usuarios pueden alternar entre temas usando un botón animado que proporciona retroalimentación visual inmediata.

El selector de dificultad utiliza un diseño moderno de botones tipo píldora con indicadores visuales claros para la selección activa. La visualización de puntuación incluye transiciones animadas que resaltan incrementos de puntos, y toda la interfaz responde a las interacciones del usuario con animaciones y transiciones suaves.

### FUNCIONALIDAD AVANZADA

Los jugadores pueden deshacer hasta 10 movimientos anteriores, permitiendo experimentación estratégica sin reiniciar el juego. El sistema de deshacer mantiene un historial tanto de estados del tablero como de puntuaciones, asegurando restauración completa del estado.

El seguimiento de estadísticas persiste entre sesiones usando localStorage del navegador. El sistema registra total de partidas jugadas, mejor puntuación alcanzada y ficha más alta lograda. Estas estadísticas se muestran en tarjetas dedicadas dentro de la interfaz y se actualizan automáticamente al concluir las partidas.

Los diálogos modales personalizados reemplazan las alertas estándar del navegador, proporcionando una experiencia visual consistente que coincide con el lenguaje de diseño de la extensión. El modal de victoria incluye un efecto de confeti animado celebrando el logro.

### ACCESIBILIDAD

La extensión implementa etiquetas ARIA completas en toda la interfaz, permitiendo a usuarios de lectores de pantalla navegar y jugar efectivamente. Todos los elementos interactivos incluyen roles y etiquetas apropiados, con indicadores de foco visibles para navegación por teclado.

La estructura del tablero usa HTML semántico con atributos de rol apropiados (grid, gridcell, dialog), y todos los botones proporcionan etiquetas descriptivas. El tema de modo oscuro mantiene ratios de contraste compatibles con WCAG para texto y elementos interactivos.

## INSTALACIÓN

### MODO DESARROLLADOR

Clonar o descargar el repositorio desde GitHub:

```bash
git clone https://github.com/686f6c61/2048-chrome-extension.git
cd 2048-chrome-extension
```

Para instalar la extensión en Chrome:

1. Navegar a `chrome://extensions/` en el navegador
2. Activar "Modo de desarrollador" usando el toggle en la esquina superior derecha
3. Hacer clic en "Cargar extensión sin empaquetar" y seleccionar el directorio del proyecto
4. El icono de la extensión aparecerá en la barra de herramientas

Hacer clic en el icono de la extensión para lanzar el juego en una ventana popup.

### CHROME WEB STORE

La distribución a través de Chrome Web Store está planificada para una futura versión.

## USO

### CONTROLES

Las teclas de flecha mueven las fichas en la dirección correspondiente. El juego combina fichas de igual valor cuando colisionan, añadiendo su suma a la puntuación. Continuar combinando fichas hasta alcanzar 2048 para ganar, o hasta que no queden movimientos válidos.

El botón de deshacer revierte el último movimiento (hasta 10 movimientos pueden deshacerse). El botón de reiniciar comienza un nuevo juego mientras preserva las estadísticas. El selector de dificultad cambia las probabilidades de aparición de fichas y automáticamente inicia un nuevo juego.

El toggle de modo oscuro cambia entre temas claro y oscuro. La preferencia persiste entre sesiones del navegador.

### PERSISTENCIA DE DATOS

Todos los datos del juego se almacenan localmente en el navegador usando la API localStorage. Esto incluye:

- Estadísticas del juego (total de partidas jugadas, mejor puntuación, ficha más alta alcanzada)
- Preferencia de modo oscuro (habilitado o deshabilitado)
- Selección de nivel de dificultad actual

No se transmiten datos a servidores externos. Limpiar los datos del navegador restablecerá toda la información almacenada.

## DETALLES TÉCNICOS

### ARQUITECTURA

El código base consiste en tres archivos principales siguiendo una clara separación de responsabilidades:

**index.html** define la estructura semántica usando estándares HTML5. Todos los elementos interactivos incluyen atributos ARIA apropiados para accesibilidad. El marcado usa etiquetas semánticas y mantiene una jerarquía clara.

**styles.css** implementa el diseño visual usando características CSS3 incluyendo variables CSS para tematización, CSS Grid para layout y animaciones CSS para transiciones. La hoja de estilos define esquemas de color separados para modos claro y oscuro usando propiedades personalizadas CSS.

**script.js** contiene toda la lógica del juego implementada en JavaScript vanilla ES6+. El código usa declaraciones const/let, funciones flecha y métodos modernos de arrays. Las funciones incluyen comentarios JSDoc documentando parámetros y valores de retorno.

### CONSTANTES PRINCIPALES

```javascript
GRID_SIZE = 4              // Dimensiones del tablero (cuadrícula 4x4)
WIN_TILE = 2048            // Valor objetivo de ficha para victoria
CONFETTI_COUNT = 100       // Cantidad de partículas para animación de victoria
ANIMATION_DURATION = 3000  // Duración de animación en milisegundos
```

### FUNCIONES PRINCIPALES

```javascript
init()                     // Inicializar nuevo estado del juego
render()                   // Actualizar DOM con estado actual del tablero
move(direction)            // Procesar movimiento de fichas en dirección especificada
slide(row)                 // Combinar y desplazar fichas dentro de una fila
hasMoves()                 // Verificar movimientos válidos restantes
undo()                     // Restaurar estado anterior del juego
```

### VARIABLES CSS

```css
--bg-primary               // Color de fondo principal
--bg-grid                  // Fondo del tablero de juego
--tile-empty               // Color de ficha vacía
--text-primary             // Color de texto principal
--button-bg                // Color de fondo de botones
```

La implementación de modo oscuro sobrescribe estas variables para proporcionar contraste apropiado.

### ESQUEMA LOCALSTORAGE

Estructura del objeto de estadísticas:
```javascript
{
  gamesPlayed: number,     // Total de partidas completadas
  bestScore: number,       // Puntuación más alta alcanzada
  bestTile: number         // Valor de ficha más alto alcanzado
}
```

Preferencia de modo oscuro:
```javascript
'true' | 'false'           // Booleano string para estado del tema
```

## ESTRUCTURA DEL PROYECTO

```
2048-chrome-extension/
├── assets/             # Capturas de pantalla
├── icons/              # Iconos de extensión (16, 32, 48, 128px)
├── index.html          # Interfaz principal (108 líneas)
├── styles.css          # Hojas de estilo (470 líneas)
├── script.js           # Lógica del juego (381 líneas)
├── manifest.json       # Configuración de extensión (Manifest V3)
├── README.md           # Esta documentación
├── CONTRIBUTING.md     # Guías de contribución
└── LICENSE             # Licencia MIT
```

### MÉTRICAS DE CÓDIGO

- Total de líneas de código: 979
- JavaScript: 381 líneas
- CSS: 470 líneas
- HTML: 108 líneas
- Dependencias: 0 (JavaScript vanilla)

## CONTRIBUCIONES

Se aceptan contribuciones de desarrolladores de todos los niveles. Antes de enviar cambios, revisar el archivo CONTRIBUTING.md para directrices detalladas sobre estilo de código, convenciones de commits y el proceso de pull request.

### FLUJO DE CONTRIBUCIÓN

1. Hacer fork del repositorio a la cuenta de GitHub
2. Crear una rama de característica desde main (`git checkout -b feature/descripcion`)
3. Implementar cambios siguiendo el estilo de código del proyecto
4. Probar los cambios exhaustivamente en modo desarrollador
5. Hacer commit usando formato de conventional commits
6. Hacer push al fork y enviar un pull request

### REPORTAR PROBLEMAS

Enviar reportes de bugs y solicitudes de características a través del rastreador de issues de GitHub. Incluir pasos de reproducción detallados para bugs y casos de uso claros para solicitudes de características.

## LICENCIA

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo LICENSE para términos completos.

```
MIT License - Copyright (c) 2025 686f6c61
```

## CRÉDITOS

**Autor:** 686f6c61

**Repositorio:** https://github.com/686f6c61/2048-chrome-extension

**Agradecimientos:** Inspirado en el juego original 2048 de Gabriele Cirulli.

## ROADMAP

Los planes de desarrollo futuro incluyen:

- Publicación en Chrome Web Store para distribución más amplia
- Soporte para tamaños de cuadrícula alternativos (5x5, 6x6)
- Sistema de logros con condiciones de desbloqueo
- Efectos de sonido opcionales con toggle de usuario
- Temas de color adicionales y personalización
- Soporte de internacionalización para múltiples idiomas
- Movimientos de fichas animados durante transiciones

---

Copyright (c) 2025 686f6c61 - Licenciado bajo MIT
