import math, struct, json, os
from xml.sax.saxutils import escape
# Optimized lathed GLB: body, label, ribbed lid, tamper ring. Built as genuine meshes.
positions=[]; views=[]; access=[]; meshes=[]; blob=bytearray()
def add_buffer(vals,typ,n):
 global blob
 while len(blob)%4: blob+=b'\0'
 start=len(blob);raw=struct.pack('<'+('f' if typ==5126 else 'H')*len(vals),*vals);blob+=raw
 views.append({'buffer':0,'byteOffset':start,'byteLength':len(raw)})
 a={'bufferView':len(views)-1,'componentType':typ,'count':len(vals)//n,'type':{1:'SCALAR',2:'VEC2',3:'VEC3'}[n]}
 if n==3:
  a['min']=[min(vals[i::3]) for i in range(3)];a['max']=[max(vals[i::3]) for i in range(3)]
 access.append(a);return len(access)-1

def lathe(name,profile,mat,rib=False,segments=96):
 verts=[];norms=[];uvs=[];idx=[]
 for j,(r,y) in enumerate(profile):
  prv=profile[max(0,j-1)];nxt=profile[min(len(profile)-1,j+1)];dr=nxt[0]-prv[0];dy=nxt[1]-prv[1];den=math.hypot(dr,dy) or 1
  for i in range(segments+1):
   a=i/segments*math.tau;rr=r+(0.009*(0.5+0.5*math.cos(i/segments*math.tau*64)) if rib else 0)
   verts.extend([rr*math.sin(a),y,rr*math.cos(a)]);norms.extend([dy/den*math.sin(a),-dr/den,dy/den*math.cos(a)]);uvs.extend([i/segments,j/(len(profile)-1)])
 for j in range(len(profile)-1):
  for i in range(segments):
   a=j*(segments+1)+i;b=a+segments+1;idx.extend([a,a+1,b,a+1,b+1,b])
 meshes.append({'name':name,'primitives':[{'attributes':{'POSITION':add_buffer(verts,5126,3),'NORMAL':add_buffer(norms,5126,3),'TEXCOORD_0':add_buffer(uvs,5126,2)},'indices':add_buffer(idx,5123,1),'material':mat}]})
lathe('BottleBody',[(0,-1.27),(.55,-1.27),(.63,-1.23),(.66,-1.15),(.66,.64),(.64,.77),(.58,.88),(.49,.96),(.48,1.08),(0,1.08)],0)
lathe('Label',[(.664,-.98),(.664,.59)],1)
lathe('Lid',[(0,1.05),(.48,1.05),(.64,1.06),(.675,1.1),(.675,1.43),(.65,1.48),(0,1.48)],2,True,256)
lathe('TamperRing',[(.50,.99),(.64,.99),(.66,1.01),(.66,1.055),(.64,1.07)],2)
materials=[{'name':'SoftIvory','pbrMetallicRoughness':{'baseColorFactor':[.88,.86,.83,1],'metallicFactor':.05,'roughnessFactor':.28}}, {'name':'PrintedLabel','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':.04,'roughnessFactor':.5}}, {'name':'RibbedLid','pbrMetallicRoughness':{'baseColorFactor':[.95,.94,.92,1],'metallicFactor':.04,'roughnessFactor':.25}}]
doc={'asset':{'version':'2.0','generator':'eMCapsulados procedural packaging'},'scene':0,'scenes':[{'nodes':list(range(len(meshes)))}],'nodes':[{'mesh':i,'name':m['name']} for i,m in enumerate(meshes)],'meshes':meshes,'materials':materials,'buffers':[{'byteLength':len(blob)}],'bufferViews':views,'accessors':access}
j=json.dumps(doc,separators=(',',':')).encode()
while len(j)%4:j+=b' '
while len(blob)%4:blob+=b'\0'
with open('public/models/essential-bottle.glb','wb') as f:f.write(struct.pack('<III',0x46546c67,2,12+8+len(j)+8+len(blob))+struct.pack('<II',len(j),0x4e4f534a)+j+struct.pack('<II',len(blob),0x004e4942)+blob)
# Matching 2D studio packshots for the lightweight catalog.
items=[('magnesio','Magnésio','#7F66C1','#C9B4F2','01',60),('vitamina-d3','Vitamina D3','#536FA8','#A6C7F5','02',60),('colageno','Colágeno','#AA769C','#EDBDDB','03',60),('vitamina-c','Vitamina C','#B5925C','#F5D698','04',60),('complexo-b','Complexo B','#6B79B8','#C5CDF9','05',60),('zinco','Zinco','#6D9B97','#C0E1D4','06',60),('omega-3','Ômega 3','#4C779D','#AADAE8','07',90),('coenzima-q10','Coenzima Q10','#B67E68','#EDC5AF','08',60),('biotina','Biotina','#A181AE','#E4C4EE','09',60),('fibras','Fibras','#7D976E','#CEDCBB','10',60),('cromo','Cromo','#647E87','#B7D4DB','11',60),('multivitaminico','Multi Daily','#6E67A4','#C7C1E8','12',60),('selenio','Selênio','#74958B','#BFDED2','13',60),('vitamina-b12','Vitamina B12','#9671A1','#DDC0E8','14',60),('calcio','Cálcio','#8294AF','#CDDCEE','15',60)]
for id,name,color,accent,num,caps in items:
 ribs=''.join(f'<path d="M{x} 55v39" stroke="#deddd9" stroke-width="1.4"/>' for x in range(130,273,4))
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="470" viewBox="0 0 400 470"><defs>
 <linearGradient id="body"><stop stop-color="#cfcfcf"/><stop offset=".18" stop-color="#f7f5ee"/><stop offset=".55" stop-color="#ffffff"/><stop offset=".85" stop-color="#eeece7"/><stop offset="1" stop-color="#bfc1c3"/></linearGradient>
 <linearGradient id="label"><stop stop-color="{color}"/><stop offset=".35" stop-color="{accent}"/><stop offset=".6" stop-color="{accent}"/><stop offset="1" stop-color="{color}"/></linearGradient>
 <linearGradient id="lid" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dddedf"/></linearGradient>
 <radialGradient id="shadow"><stop stop-color="#25203b" stop-opacity=".2"/><stop offset="1" stop-color="#25203b" stop-opacity="0"/></radialGradient>
 <clipPath id="shape"><path d="M121 160Q121 133 145 120L145 95H255V120Q279 133 279 160V363Q279 385 257 389H143Q121 385 121 363Z"/></clipPath>
 </defs><ellipse cx="200" cy="405" rx="112" ry="17" fill="url(#shadow)"/><path d="M121 160Q121 133 145 120L145 95H255V120Q279 133 279 160V363Q279 385 257 389H143Q121 385 121 363Z" fill="url(#body)"/>
 <g clip-path="url(#shape)"><rect x="120" y="160" width="160" height="204" fill="url(#label)"/>
 <path d="M105 334C180 226 224 330 293 212M109 345C180 237 225 341 296 223M110 356C180 248 225 352 299 234" fill="none" stroke="white" stroke-opacity=".22"/>
 <text x="139" y="187" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#211b39">eMCapsulados</text>
 <text x="139" y="207" font-family="Arial,sans-serif" font-size="5.4" letter-spacing="1.7" fill="#332845">ESSENTIAL COLLECTION</text>
 <text x="139" y="245" font-family="Arial,sans-serif" font-size="{18 if len(name)>10 else 23}" font-weight="600" letter-spacing="-.5" fill="#241a38">{escape(name)}</text>
 <text x="139" y="266" font-family="Arial,sans-serif" font-size="6.1" letter-spacing=".4" fill="#332845">SUPLEMENTO ALIMENTAR EM CÁPSULAS</text>
 <text x="139" y="330" font-family="Arial,sans-serif" font-size="29" fill="#2e2346">{num}</text>
 <path d="M139 341H261" stroke="#39264b" stroke-opacity=".4" stroke-width=".5"/>
 <text x="139" y="353" font-family="Arial,sans-serif" font-size="6.6" fill="#39264b">{caps} CÁPSULAS</text><text x="262" y="353" text-anchor="end" font-family="Arial,sans-serif" font-size="5" fill="#39264b">LINHA DEMONSTRATIVA</text></g>
 <rect x="128" y="94" width="144" height="13" rx="3" fill="#dddeda"/><rect x="123" y="50" width="154" height="49" rx="10" fill="url(#body)"/>{ribs}<ellipse cx="200" cy="53" rx="73" ry="6" fill="#f7f6f2"/>
 </svg>'''
 open(f'public/products/{id}.svg','w').write(svg)
print('Generated model:',os.path.getsize('public/models/essential-bottle.glb'),'bytes; 15 packshots')
