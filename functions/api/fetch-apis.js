

export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    
    
    const pageSize = Math.min(
      Math.max(parseInt(url.searchParams.get('pageSize') || env.DEFAULT_PAGE_SIZE || '20'), 1),
      parseInt(env.MAX_PAGE_SIZE || '100')
    );
    const page = Math.max(parseInt(url.searchParams.get('page') || '1'), 1);
    const search = url.searchParams.get('search')?.toLowerCase().trim();
    const category = url.searchParams.get('category')?.toLowerCase().trim();
    const tag = url.searchParams.get('tag')?.toLowerCase().trim();
    const status = url.searchParams.get('status')?.toLowerCase();
    const sortBy = url.searchParams.get('sortBy') || 'name';
    const sortOrder = url.searchParams.get('sortOrder')?.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    
    
    const offset = (page - 1) * pageSize;
    let baseQuery = 'SELECT * FROM Apis WHERE name != "__sync_metadata__"';
    const countQuery = 'SELECT COUNT(*) as total FROM Apis WHERE name != "__sync_metadata__"';
    const bindings = [];
    const conditions = [];
    
    
    if (search) {
      conditions.push('(LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(title) LIKE ?)');
      bindings.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (category) {
      conditions.push('categories LIKE ?');
      bindings.push(`%"${category}"%`);
    }
    
    if (tag) {
      conditions.push('tags LIKE ?');
      bindings.push(`%"${tag}"%`);
    }
    
    
    if (status === 'new') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      conditions.push('added >= ?');
      bindings.push(monthAgo.toISOString().split('T')[0]);
    } else if (status === 'updated') {
      const monthAgo = new Date();
      monthAgo.setDate(monthAgo.getDate() - 30);
      conditions.push('updated >= ?');
      bindings.push(monthAgo.toISOString().split('T')[0]);
    }
    
    
    if (conditions.length > 0) {
      const whereClause = ' AND ' + conditions.join(' AND ');
      baseQuery += whereClause;
    }
    
    
    const validSortFields = ['name', 'title', 'added', 'updated'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'name';
    baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;
    
    
    baseQuery += ' LIMIT ? OFFSET ?';
    const finalBindings = [...bindings, pageSize, offset];
    
    
    const [dataResult, countResult] = await Promise.all([
      env.DB.prepare(baseQuery).bind(...finalBindings).all(),
      env.DB.prepare(countQuery + (conditions.length > 0 ? ' AND ' + conditions.join(' AND ') : ''))
        .bind(...bindings).first()
    ]);
    
    
    const apis = dataResult.results.map(row => ({
      name: row.name,
      title: row.title,
      description: row.description,
      version: row.version,
      categories: JSON.parse(row.categories || '[]'),
      tags: JSON.parse(row.tags || '[]'),
      added: row.added,
      updated: row.updated,
      swaggerUrl: row.swaggerUrl,
      swaggerYamlUrl: row.swaggerYamlUrl,
      logoUrl: row.logoUrl,
      externalUrl: row.externalUrl,
      contact: JSON.parse(row.contact || '{}'),
      license: JSON.parse(row.license || '{}')
    }));
    
    const total = countResult?.total || 0;
    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    
    const response = {
      apis,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      },
      filters: {
        search: search || null,
        category: category || null,
        tag: tag || null,
        status: status || null,
        sortBy,
        sortOrder: sortOrder.toLowerCase()
      }
    };
    
    
    return new Response(JSON.stringify(response), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' 
      }
    });
    
  } catch (error) {
    console.error('Fetch APIs failed:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: 'Failed to fetch APIs'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
}


export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
