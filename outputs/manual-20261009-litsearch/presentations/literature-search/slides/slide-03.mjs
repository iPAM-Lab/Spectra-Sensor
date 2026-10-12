export async function slide03(presentation, ctx) {
  const s=presentation.slides.add(); const ink='#172c28', paper='#f4f0e6', cyan='#b9d9d2', amber='#d8913f';
  ctx.addShape(s,{x:0,y:0,width:1280,height:720,fill:paper,line:ctx.line()});
  ctx.addText(s,{x:70,y:52,width:330,height:24,text:'02  /  四个入口，各有分工',fontSize:15,color:amber,typeface:'Aptos Mono'});
  ctx.addText(s,{x:68,y:96,width:850,height:58,text:'不要用一个数据库，承担所有检索任务。',fontSize:36,color:ink,bold:true,typeface:'Aptos Display'});
  const data=[['Google Scholar','找方向 / 找引用','覆盖广、上手快\n适合做“地图”','免费为主','#172c28'],['Web of Science','找高质量证据','引文索引强\n适合追踪影响力','机构订阅','#dbe7bd'],['IEEE Xplore','找工程与计算机方法','标准、会议、期刊集中\n适合技术主题','机构订阅','#b9d9d2'],['中国知网','找中文研究与本土场景','中文文献完整\n适合政策、行业与综述','机构订阅','#e9dfcc']];
  data.forEach((d,i)=>{const x=70+i*292;ctx.addShape(s,{x,y:224,width:254,height:320,fill:d[4],line:ctx.line()});ctx.addText(s,{x:x+22,y:250,width:210,height:46,text:d[0],fontSize:22,color:i===0?'#fffdf8':ink,bold:true,typeface:'Aptos Display'});ctx.addText(s,{x:x+22,y:322,width:205,height:28,text:d[1],fontSize:15,color:i===0?'#dbe7bd':amber,bold:true,typeface:'Aptos'});ctx.addText(s,{x:x+22,y:378,width:205,height:65,text:d[2],fontSize:16,color:i===0?'#b9d9d2':'#526860',typeface:'Aptos'});ctx.addShape(s,{x:x+22,y:472,width:205,height:1,fill:i===0?'#6d8b80':'#bfc9bd',line:ctx.line()});ctx.addText(s,{x:x+22,y:494,width:205,height:23,text:d[3],fontSize:13,color:i===0?'#9eb7ad':'#7d8b82',typeface:'Aptos Mono'});});
  ctx.addText(s,{x:70,y:604,width:1080,height:34,text:'推荐路径：Google Scholar 找术语 → WoS 验证质量 → IEEE / 知网补齐领域与中文证据。',fontSize:18,color:ink,bold:true,typeface:'Aptos'});
  return s;
}
