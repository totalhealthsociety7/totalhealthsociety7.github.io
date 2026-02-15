const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

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
    // return download URL
    res.json({ url: '/out/' + id + '.pdf' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'generate_failed' });
  }
});

// serve generated files
app.use('/out', express.static(STORAGE, { maxAge: '1h' }));

const PORT = process.env.PORT || 3003;
app.listen(PORT, ()=> console.log('pdf service listening', PORT));
