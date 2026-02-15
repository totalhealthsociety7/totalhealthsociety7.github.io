const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname,'..','pdf-factory')));
// proxy /api to pdf-service
app.use('/api', createProxyMiddleware({ target: 'http://127.0.0.1:3005', changeOrigin: true, pathRewrite:{'^/api':''} }));

app.get('/health', (req,res)=>res.send('ok'));
app.listen(PORT, ()=> console.log('site server', PORT));
