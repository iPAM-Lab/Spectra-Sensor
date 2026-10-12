export async function slide04(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', paper='#fbfaf6', amber='#d8913f', soft='#526860';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:300,height:24,text:'03  /  检索式的骨架',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:96,width:1000,height:58,text:'把自然语言，翻译成数据库听得懂的逻辑。',fontSize:36,color:ink,bold:true,typeface:'Aptos Display'});
  const blocks=[['对象','near infrared spectroscopy','近红外光谱'],['任务','quantitative analysis','定量分析'],['方法','chemometrics OR machine learning','化学计量学 / 机器学习'],['场景','soil OR tea OR pharmaceutical','土壤 / 茶叶 / 药物']];
  blocks.forEach((b,i)=>{const x=80+i*285;ctx.addShape(s,{x,y:232,width:245,height:170,fill:i===1?'#dbe7bd':'#f4f0e6',line:{style:'solid',fill:'#d6d8cf',width:1}});ctx.addText(s,{x:x+20,y:255,width:190,height:22,text:b[0],fontSize:15,color:amber,typeface:'Aptos Mono'});ctx.addText(s,{x:x+20,y:303,width:198,height:50,text:b[1],fontSize:18,color:ink,bold:true,typeface:'Aptos'});ctx.addText(s,{x:x+20,y:365,width:198,height:25,text:b[2],fontSize:13,color:soft,typeface:'Aptos'});if(i<3){ctx.addText(s,{x:x+250,y:296,width:35,height:40,text:'AND',fontSize:12,color:amber,bold:true,typeface:'Aptos Mono',align:'center'})}});
  ctx.addText(s,{x:80,y:470,width:1100,height:35,text:'(“near infrared spectroscopy”) AND (“quantitative analysis”) AND (chemometrics OR “machine learning”)',fontSize:19,color:'#fffdf8',bold:true,typeface:'Aptos Mono',fill:ink,insets:{left:18,right:18,top:8,bottom:8}});
  ctx.addText(s,{x:80,y:580,width:1000,height:34,text:'三条规则：同义词用 OR；概念组之间用 AND；短语用引号锁定。',fontSize:18,color:ink,bold:true,typeface:'Aptos'});
  return s;
}
