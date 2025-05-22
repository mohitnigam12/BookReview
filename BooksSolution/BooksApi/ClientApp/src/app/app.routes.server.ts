import { RenderMode, ServerRoute } from '@angular/ssr'; //error here 

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
