# WCM - Webfonts Combination Manager

> :warning: Place a VITE_GOOGLE_FONTS_API_KEY in a .env file in the root of the project.

<br />

<img src="https://i.postimg.cc/YCcN9Dg8/combinations.png" alt="webfonts-combination-manager-editor" width="100%" />

<br />

<img src="https://i.postimg.cc/KzbtN1QT/editor.png" alt="webfonts-combination-manager-editor" width="100%" />

<br />

## The Project

The project is a SPA designed, coded and published in one week for a coding challenge.

Challenge requirements were:

-  Call a public API
-  Use any stack you're confident with
-  Ship it within one week

It allows users to create, save, preview and delete Google webfonts combinations.

A preview panel is shared across main views to see a mockup of the combination (e.g. business cards, SaaS website etc.) in addition to typical features such as font download and live text editing.

For simplicity CRUD operations are done in indexedDB which could be easily replaced with a client-friendly database like Firebase.

In such case, some indexedBD calls in route guards and components should be avoided/refactored to be more efficient since an external service will be involved. Authentication can be implemented using the same or similar service.

Once fetched, fonts are also saved in indexedDB as buffers and injected on-demand via FontFace. The initial fetch can take a while to load and maybe this could also be improved.

CRUD UI lacks of dialog/confirmation modals which should be implemented to improve UX.

### Stack

-  Vue 3 with Composition API
-  State management with built-in Vue reactivity
-  Vue Router + Vue Suspense
-  IndexedDB using LocalForage
-  PostCSS using Open Props tokens

<br />

## License

MIT
