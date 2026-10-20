// @vitest-environment node
//
// Boot do servidor. O Hostinger carrega o entry a partir de um wrapper próprio
// (process.argv[1] é o wrapper, não o arquivo) e derruba o app que não chamar
// listen() em até 3 segundos.
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { startServer } from './index.mjs';
import { TEST_DATABASE_URL } from './test/globalSetup.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const closeServer = (server) => new Promise((resolve) => server.close(resolve));

const freePort = () => new Promise((resolve) => {
  const probe = net.createServer().listen(0, () => {
    const { port } = probe.address();
    probe.close(() => resolve(port));
  });
});

describe('startServer', () => {
  let server;

  afterEach(async () => {
    if (server?.listening) await closeServer(server);
    server = undefined;
  });

  it('escuta na porta antes de a conexão com o banco terminar', async () => {
    const connect = vi.fn(() => new Promise(() => {})); // conexão que nunca resolve

    server = await startServer({ port: 0, connect, exit: vi.fn() });

    expect(server.listening).toBe(true);
    expect(server.address().port).toBeGreaterThan(0);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it('encerra o processo com código 1 quando o banco está inacessível', async () => {
    const exit = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    server = await startServer({ port: 0, connect: () => Promise.reject(new Error('ECONNREFUSED')), exit });

    await vi.waitFor(() => expect(exit).toHaveBeenCalledWith(1));
  });
});

describe('server/start.mjs', () => {
  let child;

  afterEach(() => {
    child?.kill();
    child = undefined;
  });

  it('sobe o servidor mesmo carregado por um wrapper, como no Hostinger', async () => {
    const port = await freePort();
    // node -e faz o papel do wrapper: process.argv[1] não é o entry.
    child = spawn(process.execPath, ['-e', "import('./server/start.mjs')"], {
      cwd: ROOT,
      env: { ...process.env, NODE_ENV: 'test', PORT: String(port), DATABASE_URL: TEST_DATABASE_URL },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const output = await new Promise((resolve, reject) => {
      let buffer = '';
      const timer = setTimeout(() => reject(new Error(`listen() não foi chamado em 3s. Saída:\n${buffer}`)), 3000);
      const onData = (chunk) => {
        buffer += chunk;
        if (buffer.includes('Servidor pronto')) {
          clearTimeout(timer);
          resolve(buffer);
        }
      };
      child.stdout.on('data', onData);
      child.stderr.on('data', onData);
    });

    expect(output).toContain(`Servidor pronto na porta ${port}`);
    const response = await fetch(`http://127.0.0.1:${port}/api/badges`);
    expect(response.status).toBe(200);
    expect(Array.isArray((await response.json()).badges)).toBe(true);
  });
});
