two scripts important for AD implementation 1. Ad.tsx 2. ProsperNewSession.ts

`Ad.tsx` is called in all pages to display specif ads eg `<Ad placementName="video" /></div>`
see. page1.tsx for sample

`ProsperNewSession.ts` adds a event to tract the page navigation this should be added only once,
Best to add in App.tsx or in the head tag.
see: App.tsx
