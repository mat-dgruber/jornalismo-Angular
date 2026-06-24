import { RenderMode, ServerRoute } from '@angular/ssr';
import { readFileSync } from 'fs';
import { join } from 'path';

function getRoutes(): string[] {
  try {
    const content = readFileSync(join(process.cwd(), 'routes.txt'), 'utf8');
    return content.split('\n').filter(r => r.trim().length > 0);
  } catch (e) {
    return [];
  }
}

export const serverRoutes: ServerRoute[] = [
  // Rotas que não devem ser indexadas ou processadas no servidor (Admin, Edição, Login)
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/materiais', renderMode: RenderMode.Client },
  { path: 'admin/posts', renderMode: RenderMode.Client },
  { path: 'admin/artigos', renderMode: RenderMode.Client },
  { path: 'admin/projetos', renderMode: RenderMode.Client },
  { path: 'admin/sucesso', renderMode: RenderMode.Client },
  { path: 'admin/erro', renderMode: RenderMode.Client },

  { path: 'post/create', renderMode: RenderMode.Client },
  { path: 'post/editar/:slug', renderMode: RenderMode.Client },
  
  { path: 'artigos/novo', renderMode: RenderMode.Client },
  { path: 'artigos/editar/:slug', renderMode: RenderMode.Client },

  { path: 'materiais/novo', renderMode: RenderMode.Client },
  { path: 'materiais/editar/:slug', renderMode: RenderMode.Client },

  { path: 'projetos/novo', renderMode: RenderMode.Client },
  { path: 'projetos/editar/:slug', renderMode: RenderMode.Client },

  // Rotas dinâmicas públicas (buscar parâmetros gerados no routes.txt)
  { 
    path: 'post/:slug', 
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const routes = getRoutes();
      return routes
        .filter(r => r.startsWith('/post/') && !r.includes('editar') && !r.includes('create'))
        .map(r => ({ slug: r.replace('/post/', '') }));
    }
  },
  { 
    path: 'projetos/:slug', 
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const routes = getRoutes();
      return routes
        .filter(r => r.startsWith('/projetos/') && !r.includes('editar') && !r.includes('novo'))
        .map(r => ({ slug: r.replace('/projetos/', '') }));
    }
  },

  // Todo o resto do site público (Home, Contato, etc)
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
