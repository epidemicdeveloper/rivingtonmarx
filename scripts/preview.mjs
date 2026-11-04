import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('out');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.json':'application/json', '.webp':'image/webp', '.svg':'image/svg+xml', '.txt':'text/plain', '.ico':'image/x-icon' };
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end(); return; }
    // Next's Windows static export stores the final segment in a directory.
    if (!(await stat(file).catch(() => null)) && file.endsWith('.__PAGE__.txt')) {
      file = file.slice(0, -'.__PAGE__.txt'.length) + sep + '__PAGE__.txt';
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'X-Robots-Tag': 'noindex, nofollow' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(await readFile(resolve(root, '404.html')).catch(() => 'Page not found'));
  }
}).listen(3000, '127.0.0.1', () => console.log('Client preview: http://127.0.0.1:3000'));
