const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));
// Attempt to serve the UI static files (pdf-factory) if present in the build context
// Note: on Render we build from pdf-service subfolder, so pdf-factory may not be present.
const uiPath = path.join(__dirname, '..', 'pdf-factory');
if (fs.existsSync(uiPath)) {
  app.use('/', express.static(uiPath));
} else {
  // Fallback: serve a minimal UI so the root URL shows a functional page for testing
  app.get('/', (req, res) => {
    res.setHeader('Content-Type','text/html');
    res.send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Corvus PDF Factory (Staging)</title></head><body style="font-family:Arial,Helvetica,sans-serif;padding:28px;color:#073;">
      <h1 style="color:#0b6;">Corvus PDF Factory — Staging</h1>
      <p>This is a minimal staging UI. Use the form below to POST a small HTML to <code>/api/generate-pdf</code> and download the returned PDF.</p>
      <form id="f"><label>Title (for demo): <input id="t" value="Demo PDF" /></label><br/><label>Body HTML:<br/><textarea id="h" style="width:100%;height:200px"><h1>Demo</h1><p>This is a test PDF.</p></textarea></label><br/><button type="button" onclick="gen()">Generate PDF</button></form>
      <pre id="out" style="background:#f6fff6;padding:12px;border:1px solid #eee;margin-top:12px"></pre>
      <script>
      async function gen(){
        const html = document.getElementById('h').value;
        const res = await fetch('/api/generate-pdf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({html})});
        const data = await res.json();
        if(data.url){
          document.getElementById('out').textContent = 'PDF: ' + data.url;
          window.open(data.url,'_blank');
        } else {
          document.getElementById('out').textContent = JSON.stringify(data);
        }
      }
      </script>
    </body></html>`);
  });
}

const STORAGE = path.join(__dirname, 'out');
if (!fs.existsSync(STORAGE)) fs.mkdirSync(STORAGE, { recursive: true });

let browserPromise = null;
async function getBrowser(){
  if(!browserPromise) browserPromise = puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  return browserPromise;
}

app.post('/api/generate-pdf', async (req, res) => {
  try{
    const { html } = req.body;
    if(!html) return res.status(400).json({ error: 'missing html' });
    const id = uuidv4();
    const outPath = path.join(STORAGE, id + '.pdf');
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outPath, format: 'A4', printBackground: true });
    await page.close();
    // return download URL (absolute so browsers can open/download)
    const host = req.get('host');
    const proto = req.protocol;
    const fullUrl = `${proto}://${host}/out/${id}.pdf`;
    res.json({ url: fullUrl });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'generate_failed' });
  }
});

// serve generated files
app.use('/out', express.static(STORAGE, { maxAge: '1h' }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, ()=> console.log('pdf service listening', PORT));
