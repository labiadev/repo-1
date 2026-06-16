import { getRequestContext } from '@cloudflare/next-on-pages';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return new Response(
        JSON.stringify({ error: 'Nombre de personaje requerido.' }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    let myKv: any = null;

    try {
      // Accessing Cloudflare bindings from getRequestContext
      const context = getRequestContext();
      if (context && context.env) {
        myKv = (context.env as any).busquedas;
      }
    } catch (e) {
      // Fallback to process.env for other environments
      myKv = (process.env as any).busquedas;
    }

    // If KV is not configured, we gracefully log it (useful for local development without full pages setup)
    if (!myKv) {
      console.warn('Cloudflare KV binding "busquedas" no disponible. Omitiendo almacenamiento.');
      return new Response(
        JSON.stringify({ 
          success: false, 
          warning: 'KV binding not found. Search query was not saved to KV.' 
        }), 
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Key format: search:[timestamp]:[random_id]
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const key = `search:${timestamp}:${randomId}`;

    const value = JSON.stringify({
      characterName: name,
      timestamp: new Date().toISOString()
    });

    await myKv.put(key, value);

    return new Response(
      JSON.stringify({ success: true, key }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (err: any) {
    console.error('Error al registrar la búsqueda en KV:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}
