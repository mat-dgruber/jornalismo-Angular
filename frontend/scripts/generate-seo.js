const fs = require('fs');
const path = require('path');

// Configurações
const API_BASE = 'https://jornalismo-api-302135985728.southamerica-east1.run.app';
const SITE_BASE = 'https://mariaizabela.com.br';
const OUTPUT_DIR = path.join(__dirname, '../public');
const ROUTES_FILE = path.join(__dirname, '../routes.txt');

// Garantir que o diretório de saída existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${API_BASE}/api/${endpoint}/`);
    return await response.json();
  } catch (error) {
    console.error(`Erro ao buscar ${endpoint}:`, error);
    return [];
  }
}

async function generate() {
  console.log('🚀 Iniciando geração de SEO e Rotas...');

  const [posts, artigos, projetos, materiais] = await Promise.all([
    fetchData('blog'),
    fetchData('artigos'),
    fetchData('projetos'),
    fetchData('materiais')
  ]);

  const initialRoutes = [
    '/',
    '/blog',
    '/artigos',
    '/projetos',
    '/materiais',
    '/contato',
    '/projeto-tcc'
  ];

  const routesSet = new Set(initialRoutes);

  // Adicionar rotas dinâmicas
  posts.forEach(p => {
    if (p.slug) routesSet.add(`/post/${p.slug}`);
  });
  
  // Artigos: filtramos rotas de edição/admin para SEO
  artigos.forEach(a => {
    // Se no futuro houver página de visualização pública:
    // routesSet.add(`/artigos/${a.slug}`);
  });

  projetos.forEach(pr => {
    if (pr.slug) routesSet.add(`/projetos/${pr.slug}`);
  });

  // Materiais: Atualmente não possuem página de detalhe, mantemos apenas a rota base (já no initialRoutes)

  // Converter Set para Array e ordenar
  const routes = Array.from(routesSet).sort();

  // 1. Salvar routes.txt para o Angular Prerender
  fs.writeFileSync(ROUTES_FILE, routes.join('\n'));
  console.log(`✅ ${routes.length} rotas salvas em routes.txt`);

  // 2. Gerar sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .filter(r => !r.includes('editar') && !r.includes('novo') && !r.includes('admin'))
  .map(route => `  <url>
    <loc>${SITE_BASE}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), sitemap);
  console.log('✅ sitemap.xml gerado com sucesso em public/');

  // 3. Garantir robots.txt correto
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login

Sitemap: ${SITE_BASE}/sitemap.xml
`;
  fs.writeFileSync(path.join(OUTPUT_DIR, 'robots.txt'), robots);
  console.log('✅ robots.txt atualizado em public/');
}

generate();