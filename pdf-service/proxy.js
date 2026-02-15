const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');

const PORT = 3004;
const OWNER = 'totalhealthsociety7';
const REPO = 'totalhealthsociety7.github.io';
const SECRET_PATH = '/data/.openclaw/secrets/corvus_proxy_pat';
const TOKEN = fs.existsSync(SECRET_PATH) ? fs.readFileSync(SECRET_PATH,'utf8').trim() : '';

if(!TOKEN) console.error('WARNING: no PAT found at', SECRET_PATH);

function ghRequest(method, path, data){
  return new Promise((resolve,reject)=>{
    const options = {
      hostname: 'api.github.com',
      path: path,
      method: method,
      headers: {
        'User-Agent':'corvus-proxy',
        'Accept':'application/vnd.github+json',
        'Authorization': 'Bearer '+TOKEN
      }
    };
    const req = https.request(options, res=>{
      let body=''; res.on('data',d=>body+=d); res.on('end',()=>{
        try{ resolve({code:res.statusCode, body: JSON.parse(body||'null')}); }
        catch(e){ resolve({code:res.statusCode, body: body}); }
      });
    });
    req.on('error', err=>reject(err));
    if(data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function triggerDispatch(payload){
  const path = `/repos/${OWNER}/${REPO}/dispatches`;
  return ghRequest('POST', path, payload);
}

async function listRuns(){
  const path = `/repos/${OWNER}/${REPO}/actions/runs?event=repository_dispatch&per_page=10`;
  return ghRequest('GET', path);
}

async function listArtifacts(runId){
  const path = `/repos/${OWNER}/${REPO}/actions/runs/${runId}/artifacts`;
  return ghRequest('GET', path);
}

// simple server
const server = http.createServer(async (req,res)=>{
  if(req.method==='POST' && req.url==='/api/dispatch'){
    let body=''; req.on('data',c=>body+=c); req.on('end', async ()=>{
      try{
        const payload = JSON.parse(body);
        // send dispatch
        const disp = await triggerDispatch({ event_type: 'generate-pdf', client_payload: payload });
        if(disp.code>=400) return res.end(JSON.stringify({ok:false, error:disp}));
        // poll for a run with a short timeout
        const start = Date.now();
        let runId=null;
        while(Date.now()-start < 1000*60){
          const runs = await listRuns();
          if(runs.code==200 && runs.body && runs.body.workflow_runs){
            // find latest run
            for(const r of runs.body.workflow_runs){
              if(r.event=='repository_dispatch'){
                runId=r.id; break;
              }
            }
          }
          if(runId) break;
          await new Promise(r=>setTimeout(r,2000));
        }
        if(!runId) return res.end(JSON.stringify({ok:false, error:'no_run_found'}));
        // poll for artifacts
        let artifactUrl=null;
        const start2=Date.now();
        while(Date.now()-start2 < 1000*60){
          const arts = await listArtifacts(runId);
          if(arts.code==200 && arts.body && arts.body.artifacts && arts.body.artifacts.length>0){
            // pick first artifact and get download URL
            const a = arts.body.artifacts[0];
            // create archive link
            artifactUrl = `https://api.github.com/repos/${OWNER}/${REPO}/actions/artifacts/${a.id}/zip`;
            break;
          }
          await new Promise(r=>setTimeout(r,2000));
        }
        if(!artifactUrl) return res.end(JSON.stringify({ok:false, error:'no_artifact'}));
        // return artifact url (note: downloading requires auth)
        res.setHeader('Content-Type','application/json');
        res.end(JSON.stringify({ok:true, artifact: artifactUrl}));
      }catch(e){
        res.end(JSON.stringify({ok:false, error:e.toString()}));
      }
    });
  }else if(req.method==='GET' && req.url==='/.ping'){
    res.end('pong');
  }else{
    res.statusCode=404; res.end('no');
  }
});
server.listen(3005, ()=>console.log('proxy listening 3005'));
