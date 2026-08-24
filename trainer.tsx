"use client";
import {useEffect,useState} from "react";
type S={group:string;id:number;english:string;aiMizo:string;finalMizo:string;status:string};
export default function Trainer(){
 const [data,setData]=useState<S[]>([]),[group,setGroup]=useState("short"),[pos,setPos]=useState(0),[answer,setAnswer]=useState("");
 useEffect(()=>{fetch("/dataset.json").then(r=>r.json()).then(setData)},[]);
 const list=data.filter(x=>x.group===group), cur=list[pos];
 useEffect(()=>setAnswer(cur?.aiMizo||""),[cur?.id,cur?.aiMizo]);
 function next(){if(pos<list.length-1)setPos(pos+1)}
 function prev(){if(pos>0)setPos(pos-1)}
 function save(status:string){
   if(!cur)return;
   const all=JSON.parse(localStorage.getItem("mizo_progress")||"{}");
   all[`${cur.group}-${cur.id}`]={finalMizo:status==="correct"?cur.aiMizo:answer,status,savedAt:new Date().toISOString(),voice:null};
   localStorage.setItem("mizo_progress",JSON.stringify(all));
   if(pos<list.length-1)next(); else alert("Hemi group-a sentence zawng zawng i thlen tawh.");
 }
 if(!cur)return <main className="card">Loading dataset...</main>;
 return <main className="card">
  <header><div><h1>Mizo Training</h1><p>Text mode • Voice nakinah belh leh theih</p></div><div className="count">{pos+1}/{list.length}</div></header>
  <div className="tabs"><button className={group==="short"?"active":""} onClick={()=>{setGroup("short");setPos(0)}}>Short</button><button className={group==="long"?"active":""} onClick={()=>{setGroup("long");setPos(0)}}>Long</button></div>
  <small>#{cur.id}</small><h2>English</h2><div className="english">{cur.english}</div>
  <h2>AI Mizo</h2><div className="mizo">{cur.aiMizo}</div>
  <h2>Correction</h2><textarea value={answer} onChange={e=>setAnswer(e.target.value)} rows={5}/>
  <div className="actions"><button onClick={()=>save("correct")}>✓ C — Correct</button><button className="fix" onClick={()=>save("corrected")}>Save Correction</button></div>
  <div className="nav"><button onClick={prev} disabled={pos===0}>← Previous</button><button onClick={next} disabled={pos===list.length-1}>Skip →</button></div>
 </main>
}