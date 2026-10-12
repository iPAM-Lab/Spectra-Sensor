export async function slide08(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', paper='#f4f0e6', amber='#d8913f', soft='#526860';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:300,height:24,text:'07  /  让检索结果可复用',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:96,width:1000,height:58,text:'每次检索，都留下一个可复盘的“证据包”。',fontSize:36,color:ink,bold:true,typeface:'Aptos Display'});
  const steps=[['01','检索式','数据库 + 日期 + 完整检索式'],['02','筛选表','纳入 / 排除标准、去重记录'],['03','阅读卡','问题、方法、结果、局限'],['04','引用链','参考文献、被引、相关文献']];
  steps.forEach((st,i)=>{const x=70+i*285;ctx.addText(s,{x,y:245,width:60,height:28,text:st[0],fontSize:16,color:amber,typeface:'Aptos Mono'});ctx.addText(s,{x:x+70,y:242,width:180,height:34,text:st[1],fontSize:25,color:ink,bold:true,typeface:'Aptos Display'});ctx.addShape(s,{x,y:310,width:225,height:2,fill:i===2?amber:'#aebcb1',line:ctx.line()});ctx.addText(s,{x,y:350,width:225,height:58,text:st[2],fontSize:17,color:soft,typeface:'Aptos'});if(i<3)ctx.addText(s,{x:x+235,y:302,width:35,height:30,text:'→',fontSize:24,color:amber,typeface:'Aptos'})});
  ctx.addShape(s,{x:70,y:520,width:1060,height:70,fill:'#172c28',line:ctx.line()});ctx.addText(s,{x:94,y:540,width:1010,height:30,text:'建议工具：Zotero / EndNote / Notion / Excel；工具不重要，字段一致才重要。',fontSize:18,color:'#dbe7bd',bold:true,typeface:'Aptos'});
  return s;
}
