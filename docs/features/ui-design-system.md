# UI & Design System

AgendaStudio does not rely on heavy frameworks like Tailwind; instead, it uses a bespoke component library (`/library`) and CSS variable theming.

- **Dynamic Theming:** The entire application responds to CSS variables defined in `index.css`. This enables effortless switching between Light and Dark modes, and allows for custom accent colors.
- **Component Library:** A rich set of reusable UI elements:
  - **Sidebar:** A collapsible, structured navigation menu with group labels, icons, and nested items.
  - **Forms & Inputs:** Standardized Buttons, Text Inputs, Select dropdowns, and Checkboxes ensure a consistent data-entry experience.
  - **Overlays & Modals:** Support for dialogs, popovers, and context menus for contextual interactions without leaving the page.
- **Responsiveness:** Components are built with flexbox and CSS grid to ensure they adapt gracefully to various screen sizes.
