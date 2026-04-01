const http = require('http');
const path = require('path');
const fs = require('fs').promises;
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);
const NGROK_API_URL = 'http://127.0.0.1:4040/api/tunnels';
const OUTPUT_FILE = path.join(__dirname, 'public', 'backend_url.json');

async function fetchNgrokPublicUrl() {
  return new Promise((resolve, reject) => {
    http.get(NGROK_API_URL, (res) => {
      let rawData = '';

      res.on('data', (chunk) => {
        rawData += chunk;
      });

      res.on('end', () => {
        try {
          const data = JSON.parse(rawData);
          const tunnels = Array.isArray(data.tunnels) ? data.tunnels : [];
          const tunnel = tunnels.find((entry) => typeof entry.public_url === 'string');

          if (!tunnel) {
            return reject(new Error('Não foi encontrada nenhuma URL pública válida no Ngrok.'));
          }

          resolve(tunnel.public_url);
        } catch (error) {
          reject(new Error(`Falha ao analisar resposta do Ngrok: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Erro ao conectar ao Ngrok: ${error.message}`));
    });
  });
}

async function writeBackendUrlFile(url) {
  const directory = path.dirname(OUTPUT_FILE);
  await fs.mkdir(directory, { recursive: true });
  const content = JSON.stringify({ backend_url: url }, null, 2) + '\n';
  await fs.writeFile(OUTPUT_FILE, content, 'utf8');
}

async function gitCommitAndPush() {
  await execAsync(`git add ${OUTPUT_FILE}`);

  try {
    await execAsync('git commit -m "Atualiza URL do backend"');
  } catch (error) {
    const stderr = String(error.stderr || '');
    if (stderr.includes('nothing to commit') || stderr.includes('nada para commit') || stderr.includes('nada para commitar')) {
      console.log('Nenhuma alteração detectada para commit.');
    } else {
      throw new Error(`Falha no commit: ${stderr || error.message}`);
    }
  }

  await execAsync('git push origin main');
}

async function main() {
  try {
    console.log('Buscando URL pública atual do Ngrok...');
    const publicUrl = await fetchNgrokPublicUrl();
    console.log(`URL encontrada: ${publicUrl}`);

    console.log(`Gravando arquivo ${OUTPUT_FILE}...`);
    await writeBackendUrlFile(publicUrl);

    console.log('Adicionando alteração no Git, commitando e enviando para origin/main...');
    await gitCommitAndPush();

    console.log('Fluxo concluído com sucesso.');
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

main();
