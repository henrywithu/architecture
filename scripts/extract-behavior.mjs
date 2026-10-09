import fs from 'node:fs';import ts from 'typescript';
let original=fs.readFileSync('research/main-original.js','utf8');const assets=JSON.parse(fs.readFileSync('src/data-assets.json','utf8'));
for(const [u,p]of Object.entries(assets).sort((a,b)=>b[0].length-a[0].length))original=original.replaceAll(u,p);
const ast=ts.createSourceFile('reference.js',original,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
const functions=new Map(ast.statements.filter(ts.isFunctionDeclaration).map(n=>[n.name.text,n]));
const groups={
 'motion/preloader':['initPreloader','animatePreloaederIntro','animatePreloaederShort'],
 'motion/transition':['animateTransition'],
 'motion/text':['animateTextH','animateTextP','animateCtn','animateLine'],
 'motion/scroll':['initThemeChange','initHeaderHide','initAllParallax','initSectionTransition','initScrollElementsReveal','initHighlightText','initMarquee','initPlayPauseVideoScroll','initScrollVideo'],
 'motion/hover':['initMagneticEffect','initMapPins','initNavItemHover','initMenuItemHover','initFloatingTips'],
 'controllers/content':['initIndexCounter','initNextEntityCard','initOther'],
 'controllers/accordion':['initBenefitCard','initAccordion','initLoadMore'],
 'controllers/sliders':['initSlider','initSliderText','initSliderFreemode'],
 'controllers/tabs':['initTabs','initTabsHilight','initTabsText','initSummerWinterSwitcher'],
 'controllers/dialogs':['initModalCta','initModalMedia','initModalMenu','initModalVimVideo'],
 'controllers/audio':['initSoundToggle'],
 'rendering/HalftoneRenderer':['initCanvasEffect','createCanvasInstance'],
 'scenes/hero':['initSceneHeroOver','initSceneHeroBg'],
 'scenes/prologue':['initSceneProlog'],
 'scenes/about':['initSceneAbout'],
 'scenes/seasons':['initSceneSeasons'],
 'scenes/benefits':['initSceneBenefitsIntro','initSceneBenefitsOutro'],
 'scenes/finance':['initSceneFin'],
 'scenes/developer':['initSceneDevOver','initSceneDevBg'],
 'scenes/factoids':['initSceneFactoid'],
 'scenes/faq':['initSceneFaq'],
 'scenes/footer':['initSceneFooter'],
 'scenes/articles':['initSceneArticleDark','initSceneArticleLight','initSceneError']
};
const paths=Object.fromEntries(Object.entries(groups).flatMap(([p,ns])=>ns.map(n=>[n,p])));
Object.assign(paths,{initAllScenes:'core/scenes',initScripts:'core/initialize',initLenis:'core/scroll',lockScroll:'core/scroll',unlockScroll:'core/scroll',initPageTransitions:'core/router'});
// Extract the exact original shader, expanding its 5×5 alpha-neighbor stencil.
const renderer=functions.get('createCanvasInstance');let shader;
function findShader(n){if(ts.isVariableDeclaration(n)&&n.name.getText(ast)==='s'&&ts.isObjectLiteralExpression(n.initializer))shader=n.initializer.getText(ast);ts.forEachChild(n,findShader);}findShader(renderer);
const shaders=Function('i',`return (${shader})`)(2);
for(const name of ['vertex','fragment'])fs.writeFileSync(`src/rendering/shaders/halftone.${name}.glsl`,shaders[name].trim()+'\n');
const runtimeNames=['lenis','breakPoint','globalSceneManager','durS','durM','durL','stagger','delayReveal','framesPromise'];
for(const [file,names]of Object.entries(groups)){
 const deps=new Set();let body='';
 for(const name of names){const node=functions.get(name);let text=node.getText(ast);
  for(const other of Object.keys(paths))if(!names.includes(other)&&new RegExp(`\\b${other}\\b`).test(text))deps.add(other);
  text=text.replace(/\b(lenis|breakPoint|globalSceneManager|durS|durM|durL|stagger|delayReveal|framesPromise)\b(?!\s*:)/g,'runtime.$1');
  if(name==='createCanvasInstance')text=text.replace(shader,'{ vertex: vertexShader, fragment: fragmentShader }');
  body+='export '+text+'\n';
 }
 let source=ts.createSourceFile('adapted.ts',body,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
 const f=ts.factory,any=f.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
 const param=p=>f.updateParameterDeclaration(p,p.modifiers,p.dotDotDotToken,p.name,p.dotDotDotToken||p.initializer?undefined:f.createToken(ts.SyntaxKind.QuestionToken),any,p.initializer);
 const transformer=context=>{
  const visit=node=>{
   if(ts.isFunctionDeclaration(node))return f.updateFunctionDeclaration(node,node.modifiers,node.asteriskToken,node.name,node.typeParameters,node.parameters.map(param),any,ts.visitNode(node.body,visit));
   if(ts.isArrowFunction(node))return f.updateArrowFunction(node,node.modifiers,node.typeParameters,node.parameters.map(param),any,node.equalsGreaterThanToken,ts.visitNode(node.body,visit));
   if(ts.isFunctionExpression(node))return f.updateFunctionExpression(node,node.modifiers,node.asteriskToken,node.name,node.typeParameters,[f.createParameterDeclaration(undefined,undefined,'this',undefined,any),...node.parameters.map(param)],any,ts.visitNode(node.body,visit));
   if(ts.isMethodDeclaration(node))return f.updateMethodDeclaration(node,node.modifiers,node.asteriskToken,node.name,node.questionToken,node.typeParameters,[f.createParameterDeclaration(undefined,undefined,'this',undefined,any),...node.parameters.map(param)],any,ts.visitNode(node.body,visit));
   if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name))return f.updateVariableDeclaration(node,node.name,node.exclamationToken,any,ts.visitNode(node.initializer,visit));
   if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)&&node.expression.name.text==='addEventListener')return f.createCallExpression(f.createIdentifier('listen'),undefined,[ts.visitNode(node.expression.expression,visit),...node.arguments.map(a=>ts.visitNode(a,visit))]);
   if(ts.isNewExpression(node)&&ts.isIdentifier(node.expression)&&['IntersectionObserver','ResizeObserver','MutationObserver'].includes(node.expression.text))return f.createCallExpression(f.createIdentifier('manageObserver'),undefined,[ts.visitEachChild(node,visit,context)]);
   return ts.visitEachChild(node,visit,context);
  };return root=>ts.visitNode(root,visit);
 };
 const result=ts.transform(source,[transformer]);body=ts.createPrinter().printFile(result.transformed[0]);result.dispose();
 const relative=p=>'../'+p;
 const depByFile={};for(const d of deps)(depByFile[paths[d]]??=[]).push(d);
 const imports=Object.entries(depByFile).map(([p,ns])=>`import { ${ns.join(', ')} } from '${relative(p)}';`).join('\n');
 const shaderImports=file==='rendering/HalftoneRenderer'?"import vertexShader from './shaders/halftone.vertex.glsl?raw';\nimport fragmentShader from './shaders/halftone.fragment.glsl?raw';\n":'';
 const globals=[...['gsap','ScrollTrigger','SplitText','Flip','Swiper'].filter(n=>new RegExp(`\\b${n}\\b`).test(body))];
 const runtimeImports=['runtime',...globals].join(', ');
 fs.writeFileSync(`src/${file}.ts`,`/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.\n * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */\nimport { ${runtimeImports} } from '../core/runtime';\nimport { listen, manageObserver } from '../core/Lifecycle';\n${imports}\n${shaderImports}${body}`);
}
console.log('Extracted',Object.keys(groups).length,'behavior modules and two original GLSL shaders');
