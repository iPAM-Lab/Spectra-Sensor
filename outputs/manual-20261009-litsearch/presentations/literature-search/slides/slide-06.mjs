export async function slide06(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', paper='#f4f0e6', amber='#d8913f', soft='#526860';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:330,height:24,text:'05  /  高质量论文的四个信号',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:96,width:1050,height:58,text:'“高质量”不是一个标签，而是一组可核验的证据。',fontSize:35,color:ink,bold:true,typeface:'Aptos Display'});
  const items=[['01','来源','期刊 / 会议是否与主题匹配？是否被目标数据库收录？'],['02','方法','研究设计、样本、对照和统计方法是否说清楚？'],['03','影响','引用量只是线索；更重要的是谁在引用、如何引用。'],['04','可复现','数据、代码、参数和限制是否足够让别人检查？']];
  items.forEach((it,i)=>{const x=76+(i%2)*570,y=220+Math.floor(i/2)*170;ctx.addText(s,{x,y,width:60,height:35,text:it[0],fontSize:18,color:amber,typeface:'Aptos Mono'});ctx.addText(s,{x:x+78,y,width:180,height:34,text:it[1],fontSize:25,color:ink,bold:true,typeface:'Aptos Display'});ctx.addText(s,{x:x+78,y:y+50,width:375,height:58,text:it[2],fontSize:16,color:soft,typeface:'Aptos'});ctx.addShape(s,{x,y:y+118,width:455,height:1,fill:'#c9c9bb',line:ctx.line()});});
  ctx.addText(s,{x:76,y:598,width:1100,height:32,text:'课堂练习：每组挑 1 篇论文，用这四个信号写出 4 句判断。',fontSize:18,color:ink,bold:true,typeface:'Aptos'});
  return s;
}
