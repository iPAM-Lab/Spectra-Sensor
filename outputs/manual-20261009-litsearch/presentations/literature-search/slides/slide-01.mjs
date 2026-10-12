export async function slide01(presentation, ctx) {
  const s = presentation.slides.add();
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:'#172c28',line:ctx.line()});
  ctx.addShape(s,{x:0,y:0,width:18,height:720,fill:'#d8913f',line:ctx.line()});
  ctx.addText(s,{x:86,y:76,width:820,height:30,text:'研究生学术能力工作坊  /  01',fontSize:16,color:'#b9d9d2',typeface:'Aptos Mono'});
  ctx.addText(s,{x:82,y:160,width:950,height:170,text:'从“搜到论文”\n到“找到证据”',fontSize:56,color:'#fffdf8',bold:true,typeface:'Aptos Display'});
  ctx.addText(s,{x:87,y:372,width:700,height:68,text:'文献检索：数据库、检索式与高质量论文判断',fontSize:24,color:'#dbe7bd',typeface:'Aptos'});
  ctx.addShape(s,{x:88,y:500,width:220,height:2,fill:'#d8913f',line:ctx.line()});
  ctx.addText(s,{x:88,y:524,width:520,height:34,text:'Google Scholar · Web of Science · IEEE Xplore · 中国知网',fontSize:14,color:'#9eb7ad',typeface:'Aptos Mono'});
  ctx.addText(s,{x:88,y:640,width:300,height:22,text:'适用对象：研究生 / 科研入门',fontSize:13,color:'#89a097',typeface:'Aptos'});
  ctx.addText(s,{x:1080,y:640,width:120,height:22,text:'2026.10',fontSize:13,color:'#89a097',typeface:'Aptos Mono',align:'right'});
  return s;
}
