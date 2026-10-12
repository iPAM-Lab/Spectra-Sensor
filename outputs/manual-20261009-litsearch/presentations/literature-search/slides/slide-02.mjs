export async function slide02(presentation, ctx) {
  const s = presentation.slides.add(); const ink='#172c28', amber='#d8913f', paper='#fbfaf6', soft='#526860';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:260,height:24,text:'01  /  先定义问题',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:95,width:1050,height:60,text:'好的检索，起点不是数据库，而是一个可检验的问题。',fontSize:34,color:ink,bold:true,typeface:'Aptos Display'});
  ctx.addText(s,{x:70,y:178,width:780,height:40,text:'把“我想了解这个方向”改写成“我需要哪些证据来回答它”。',fontSize:19,color:soft,typeface:'Aptos'});
  const cols=[['研究对象','研究什么？\n材料 / 人群 / 场景'],['核心变量','测量什么？\n成分 / 性能 / 机制'],['方法路径','怎么研究？\n实验 / 模型 / 综述'],['证据边界','需要多新、多强的证据？\n年份 / 期刊 / 数据库']];
  cols.forEach((c,i)=>{const x=70+i*290;ctx.addShape(s,{x,y:290,width:245,height:230,fill:i===1?'#dbe7bd':'#f4f0e6',line:{style:'solid',fill:'#d6d8cf',width:1}});ctx.addText(s,{x:x+22,y:317,width:190,height:32,text:`0${i+1}`,fontSize:16,color:amber,typeface:'Aptos Mono'});ctx.addText(s,{x:x+22,y:365,width:195,height:36,text:c[0],fontSize:23,color:ink,bold:true,typeface:'Aptos Display'});ctx.addText(s,{x:x+22,y:422,width:195,height:62,text:c[1],fontSize:16,color:soft,typeface:'Aptos'});});
  ctx.addText(s,{x:70,y:604,width:1080,height:40,text:'课堂提示：让学生先写出 1 句话的研究问题，再打开数据库。',fontSize:18,color:ink,bold:true,typeface:'Aptos'});
  return s;
}
