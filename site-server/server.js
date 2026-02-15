const express = require('express');
const path = require('path');
const basicAuth = require('basic-auth');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple HTTP Basic Auth middleware for short-lived testing
const fs = require('fs');
let AUTH_USER = 'tester';
let AUTH_PASS = 'ujsQ6EEg4pat';
try{
  const env = fs.readFileSync(path.join(__dirname,'.env'), 'utf8');
  env.split(/\r?\n/).forEach(line=>{
    const m=line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
    if(m){
      if(m[1]==='PDF_USERNAME') AUTH_USER = m[2];
      if(m[1]==='PDF_PASSWORD') AUTH_PASS = m[2];
    }
  });
}catch(e){/* ignore */}
function auth(req, res, next) {
  const user = basicAuth(req);
  if (!user || user.name !== AUTH_USER || user.pass !== AUTH_PASS) {
    res.set('WWW-Authenticate', 'Basic realm="Restricted"');
    return res.status(401).send('Authentication required.');
  }
  next();
}

// Protect all routes with basic auth for now
app.use(auth);

app.use(express.static(path.join(__dirname,'..','pdf-factory')));
// proxy /api to pdf-service
app.use('/api', createProxyMiddleware({ target: 'http://127.0.0.1:3003', changeOrigin: true, pathRewrite:{'^/api':''} }));

app.get('/health', (req,res)=>res.send('ok'));
app.listen(PORT, ()=> console.log('site server', PORT));
