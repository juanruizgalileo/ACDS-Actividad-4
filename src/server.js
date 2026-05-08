const http = require('node:http');
const crypto = require('node:crypto');
const { URL } = require('node:url');
const bookStore = require('./store/bookStore');

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';
const maxBodyBytes = 1024 * 1024;

function sendJson(res, statusCode, payload) {
  const body = payload === null ? '' : JSON.stringify(payload);

  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;

      if (body.length > maxBodyBytes) {
        reject(new Error('El body supera 1MB'));
        req.destroy();
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('JSON invalido'));
      }
    });

    req.on('error', reject);
  });
}

function validateBookPayload(data) {
  const { title, author, year, available } = data;
  const errors = [];

  if (!title || typeof title !== 'string') {
    errors.push('title es obligatorio y debe ser texto');
  }

  if (!author || typeof author !== 'string') {
    errors.push('author es obligatorio y debe ser texto');
  }

  if (year !== undefined && (!Number.isInteger(year) || year < 0)) {
    errors.push('year debe ser un entero positivo');
  }

  if (available !== undefined && typeof available !== 'boolean') {
    errors.push('available debe ser boolean');
  }

  return errors;
}

function getPathParts(pathname) {
  return pathname.split('/').filter(Boolean);
}

async function handleRequest(req, res) {
  const startedAt = Date.now();
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathParts = getPathParts(url.pathname);
  const method = req.method;

  try {
    if (method === 'GET' && url.pathname === '/health') {
      return sendJson(res, 200, {
        status: 'ok',
        uptimeSeconds: Math.round(process.uptime()),
        memory: process.memoryUsage(),
      });
    }

    if (method === 'GET' && url.pathname === '/books') {
      const books = bookStore.getAll(url.searchParams.get('searchText'));
      return sendJson(res, 200, { count: books.length, data: books });
    }

    if (method === 'GET' && pathParts[0] === 'books' && pathParts[1]) {
      const book = bookStore.getById(pathParts[1]);

      if (!book) {
        return sendJson(res, 404, { message: 'Libro no encontrado' });
      }

      return sendJson(res, 200, book);
    }

    if (method === 'POST' && url.pathname === '/books') {
      const body = await readBody(req);
      const errors = validateBookPayload(body);

      if (errors.length > 0) {
        return sendJson(res, 400, { errors });
      }

      const book = bookStore.create(body);
      return sendJson(res, 201, book);
    }

    if (method === 'PUT' && pathParts[0] === 'books' && pathParts[1]) {
      const body = await readBody(req);
      const errors = validateBookPayload(body);

      if (errors.length > 0) {
        return sendJson(res, 400, { errors });
      }

      const book = bookStore.update(pathParts[1], body);

      if (!book) {
        return sendJson(res, 404, { message: 'Libro no encontrado' });
      }

      return sendJson(res, 200, book);
    }

    if (method === 'DELETE' && pathParts[0] === 'books' && pathParts[1]) {
      const book = bookStore.remove(pathParts[1]);

      if (!book) {
        return sendJson(res, 404, { message: 'Libro no encontrado' });
      }

      return sendJson(res, 204, null);
    }

    if (method === 'POST' && url.pathname === '/load/cpu') {
      const body = await readBody(req);
      const iterations = Math.min(Number(body.iterations || 250000), 5000000);
      const rounds = Math.min(Number(body.rounds || 8), 100);
      let hash = 'biblioteca';

      for (let round = 0; round < rounds; round += 1) {
        for (let i = 0; i < iterations; i += 1) {
          hash = crypto.createHash('sha256').update(`${hash}:${round}:${i}`).digest('hex');
        }
      }

      return sendJson(res, 200, {
        message: 'Carga CPU completada',
        iterations,
        rounds,
        hash,
      });
    }

    if (method === 'POST' && url.pathname === '/load/memory') {
      const body = await readBody(req);
      const size = Math.min(Number(body.size || 50000), 500000);
      const payload = [];

      for (let i = 0; i < size; i += 1) {
        payload.push({
          index: i,
          title: `Libro temporal ${i}`,
          author: `Autor ${i % 1000}`,
          checksum: crypto.createHash('md5').update(String(i)).digest('hex'),
        });
      }

      return sendJson(res, 200, {
        message: 'Carga memoria completada',
        objectsCreated: payload.length,
        sample: payload.slice(0, 3),
      });
    }

    return sendJson(res, 404, { message: 'Endpoint no encontrado' });
  } catch (error) {
    return sendJson(res, 400, { message: error.message });
  } finally {
    const ms = Date.now() - startedAt;
    console.log(`${method} ${url.pathname} ${ms}ms`);
  }
}

http.createServer(handleRequest).listen(port, host, () => {
  console.log(`Biblioteca API escuchando en http://${host}:${port}`);
});
