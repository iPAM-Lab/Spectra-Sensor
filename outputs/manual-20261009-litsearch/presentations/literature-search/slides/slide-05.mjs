export async function slide05(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', paper='#172c28', cyan='#b9d9d2', amber='#d8913f', lime='#dbe7bd';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:300,height:24,text:'04  /  搜索结果不是终点',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:96,width:1050,height:58,text:'先宽后窄：用 3 轮检索，把噪声变成证据。',fontSize:36,color:'#fffdf8',bold:true,typeface:'Aptos Display'});
  const rows=[['Round 1','找词','用 1–2 个核心概念，收集标题、摘要里的术语'],['Round 2','找证据','加入方法、对象、年份和文献类型限制'],['Round 3','找缺口','追踪高被引论文、最新论文与参考文献链']];
  rows.forEach((r,i)=>{const y=218+i*112;ctx.addText(s,{x:82,y,width:120,height:28,text:r[0],fontSize:15,color:amber,typeface:'Aptos Mono'});ctx.addShape(s,{x:218,y:y+4,width:2,height:56,fill:i===1?lime:cyan,line:ctx.line()});ctx.addText(s,{x:250,y,width:170,height:30,text:r[1],fontSize:24,color:'#fffdf8',bold:true,typeface:'Aptos Display'});ctx.addText(s,{x:445,y:y+4,width:650,height:52,text:r[2],fontSize:18,color:'#b9cfc4',typeface:'Aptos'});});
  ctx.addShape(s,{x:82,y:580,width:1000,height:2,fill:'#47605a',line:ctx.line()});
  ctx.addText(s,{x:82,y:602,width:950,height:36,text:'每一轮结束，都要更新自己的关键词表，而不是只保存 PDF。',fontSize:18,color:lime,bold:true,typeface:'Aptos'});
  return s;
}
