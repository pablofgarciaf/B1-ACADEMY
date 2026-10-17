class FakeFirestore {
  constructor(){this.rows=new Map();this.tail=Promise.resolve();}
  snapshot(path){const data=this.rows.get(path);return {exists:data!==undefined,id:path.split('/').at(-1),data:()=>data===undefined?undefined:structuredClone(data)};}
  collection(name){const db=this;return {doc(id=require('node:crypto').randomUUID()){return {id,path:name+'/'+id,get:async()=>db.snapshot(name+'/'+id),set:async(value,opts)=>db.write(name+'/'+id,value,opts?.merge),update:async(value)=>db.write(name+'/'+id,value,true),collection:child=>db.collection(name+'/'+id+'/'+child)};},
    where(field,op,value){return query([[field,op,value]]);},get:()=>query([]).get(),limit(n){return query([],n);}};
    function query(filters,limit=1000){return {where(f,o,v){return query([...filters,[f,o,v]],limit);},limit(n){return query(filters,n);},select(){return this;},async get(){const docs=[...db.rows].filter(([p,d])=>p.startsWith(name+'/')&&p.slice(name.length+1).indexOf('/')<0&&filters.every(([f,o,v])=>o==='array-contains'?d[f]?.includes(v):d[f]===v)).slice(0,limit).map(([p])=>db.snapshot(p));return {docs,empty:!docs.length,size:docs.length};}};}
  }
  write(path,data,merge=false){const output=merge?structuredClone(this.rows.get(path)||{}):{};for(const[k,v]of Object.entries(data)){if(v?.union)output[k]=[...new Set([...(output[k]||[]),...v.union])];else if(v?.delete)delete output[k];else output[k]=structuredClone(v);}this.rows.set(path,output);}
  runTransaction(work){const next=this.tail.then(async()=>{const writes=[];const tx={get:ref=>Promise.resolve(this.snapshot(ref.path)),set:(ref,data,opts)=>writes.push(()=>this.write(ref.path,data,opts?.merge)),update:(ref,data)=>writes.push(()=>this.write(ref.path,data,true)),create:(ref,data)=>writes.push(()=>{if(this.rows.has(ref.path))throw Error('EXISTS');this.write(ref.path,data);})};const result=await work(tx);for(const write of writes)write();return result;});this.tail=next.catch(()=>{});return next;}
}
module.exports={FakeFirestore};
