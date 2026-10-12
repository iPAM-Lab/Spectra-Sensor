export async function slide07(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', paper='#fbfaf6', amber='#d8913f', cyan='#b9d9d2', soft='#526860';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:340,height:24,text:'06  /  课堂案例：近红外光谱',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:96,width:1050,height:58,text:'同一个主题，如何从“搜概念”走到“找缺口”？',fontSize:35,color:ink,bold:true,typeface:'Aptos Display'});
  ctx.addText(s,{x:76,y:198,width:1080,height:32,text:'研究问题：如何提升近红外光谱定量模型在小样本场景中的稳健性？',fontSize:20,color:ink,bold:true,typeface:'Aptos'});
  const steps=[['A','核心词','near infrared\nsmall sample'],['B','方法词','chemometrics\npreprocessing'],['C','证据词','robustness\ncalibration'],['D','追踪链','cited by\nrelated articles']];
  steps.forEach((st,i)=>{const x=76+i*282;ctx.addShape(s,{x,y:282,width:245,height:178,fill:i===3?'#dbe7bd':'#f4f0e6',line:{style:'solid',fill:'#d6d8cf',width:1}});ctx.addText(s,{x:x+20,y:305,width:30,height:28,text:st[0],fontSize:16,color:amber,typeface:'Aptos Mono'});ctx.addText(s,{x:x+68,y:304,width:140,height:28,text:st[1],fontSize:21,color:ink,bold:true,typeface:'Aptos Display'});ctx.addText(s,{x:x+20,y:364,width:200,height:55,text:st[2],fontSize:17,color:soft,typeface:'Aptos Mono'});if(i<3)ctx.addText(s,{x:x+254,y:350,width:28,height:32,text:'→',fontSize:23,color:amber,bold:true,typeface:'Aptos'});});
  ctx.addText(s,{x:76,y:535,width:1080,height:70,text:'最终输出不是“我找到了 30 篇”，而是：3 篇奠基论文 + 5 篇近年方法论文 + 1 个尚未解决的研究缺口。',fontSize:20,color:'#fffdf8',bold:true,typeface:'Aptos',fill:ink,insets:{left:18,right:18,top:12,bottom:12}});
  return s;
}
