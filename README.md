# Star Wars API Angular App

Angular 21 Anwendung, die Daten von der Star Wars API (SWAPI) anzeigt. Erstellt mit zoneless Architektur unter Verwendung von Signals und Standalone Components.

## Features

- Listenansichten für Filme, Charaktere und Planeten mit Pagination
- Detailseiten mit vollständigen Informationen und verwandten Ressourcen
- Modal-Formulare zum Hinzufügen neuer Einträge (clientseitige Simulation)
- Responsive Design mit Tailwind CSS
- Fehlerbehandlung für API-Fehler
- WCAG-optimiert für Barrierefreiheit (Focus-Management, ARIA-Attribute, Skip-Links, Screenreader-Unterstützung)

## Tech Stack

- Angular 21 (zoneless mit Signals)
- TypeScript
- Tailwind CSS
- Jest für Unit-Tests
- RxJS für Datenverarbeitung

## Installation

Abhängigkeiten installieren:
```bash
npm install
```

Entwicklungsserver starten:
```bash
npm start
```

Öffne `http://localhost:4200` im Browser.

## Tests ausführen

Unit-Tests wurden mit Jest implementiert für:
- `app.component` - App-Initialisierung und Header-Rendering
- `swapi.service` - API-Aufrufe und Fehlerbehandlung

```bash
npm test
```

Für Coverage:
```bash
npm run test:coverage
```

## API

Diese App nutzt die [Star Wars API](https://swapi.dev/), die eine schreibgeschützte API ist. Die Modal-Formulare zum Hinzufügen von Einträgen sind nur clientseitig und erstellen keine neuen Ressourcen.

## Projektstruktur

Die Anwendung folgt einer **feature-driven Architektur**:

- `src/app/core/` - Zentrale Services, Models und Utilities
- `src/app/features/` - Feature-Module (Filme, Charaktere, Planeten, Home)
  - Jedes Feature enthält seine List- und Detail-Komponenten
  - Verwendet wiederverwendbare Komponenten aus `shared/`
- `src/app/shared/` - Wiederverwendbare Komponenten (Cards, Modals, Pagination, Detail-Layout)
- `src/app/layout/` - Layout-Komponenten (Header, Footer)

## Technische Entscheidungen

**Zoneless Architektur mit Signals:**
- Verwendung von Angular Signals für reaktive State-Verwaltung
- Keine Zone.js-Abhängigkeit für bessere Performance
- Standalone Components für bessere Tree-Shaking und Modularität

**State Management:**
- `NavigationStateService` mit Signals für Datenübergabe zwischen List- und Detail-Seiten
- SWAPI liefert keine einfachen IDs, daher Übergabe des gesamten Objekts via Signals
- Alternative zu URL-Parametern für komplexe Objekte

**Service-Architektur:**
- Zentraler `SwapiService` für alle API-Aufrufe (statt separate Services pro Feature)
- Einfachere Wartung und konsistente Fehlerbehandlung
- Wiederverwendbare Methoden für verschiedene Ressourcen

**UI-Komponenten:**
- HTML `<dialog>` Element für Modals (statt Angular Material)
- Native Browser-APIs für bessere Performance und weniger Dependencies
- Tailwind CSS für Utility-First Styling (statt Component-Library)

**Testing:**
- Jest statt Karma/Jasmine für moderneres Testing-Setup
- Unit-Tests fokussiert auf Services und Core-Komponenten
- HttpTestingController für isolierte API-Tests
