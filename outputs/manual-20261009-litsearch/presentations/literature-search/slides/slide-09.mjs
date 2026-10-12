export async function slide09(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', amber='#d8913f', cyan='#b9d9d2';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:'#172c28',line:ctx.line()});
  ctx.addText(s,{x:70,y:56,width:300,height:24,text:'08  /  课后任务',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:100,width:1050,height:60,text:'带走一个问题，交付一份可复盘的检索报告。',fontSize:38,color:'#fffdf8',bold:true,typeface:'Aptos Display'});
  const tasks=[['1','确定主题','写出 1 句研究问题 + 3 组同义词'],['2','完成检索','至少使用 2 个数据库，记录完整检索式'],['3','筛选论文','选出 8–10 篇高质量论文并说明理由'],['4','形成判断','写出 1 个共识、1 个争议、1 个研究缺口']];
  tasks.forEach((t,i)=>{const y=220+i*84;ctx.addShape(s,{x:78,y,width:42,height:42,fill:i===3?amber:cyan,line:ctx.line()});ctx.addText(s,{x:78,y:y+7,width:42,height:25,text:t[0],fontSize:17,color:ink,bold:true,typeface:'Aptos Mono',align:'center'});ctx.addText(s,{x:150,y,width:170,height:30,text:t[1],fontSize:23,color:'#fffdf8',bold:true,typeface:'Aptos Display'});ctx.addText(s,{x:355,y:y+4,width:650,height:34,text:t[2],fontSize:18,color:'#b9cfc4',typeface:'Aptos'});});
  ctx.addShape(s,{x:78,y:584,width:1050,height:2,fill:'#47605a',line:ctx.line()});ctx.addText(s,{x:78,y:607,width:1000,height:28,text:'下一步：把检索结果转化为你的研究问题，而不是停留在文献堆积。',fontSize:18,color:'#dbe7bd',bold:true,typeface:'Aptos'});
  return s;
}
