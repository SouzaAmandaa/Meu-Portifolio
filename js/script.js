// Menu mobile
const menuBtn = document.getElementById('menuBtn');
const menu = document.getElementById('menu');
menuBtn.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  menuBtn.setAttribute('aria-expanded', aberto);
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('aberto')));

// Tema claro/escuro
const raiz = document.documentElement;
try { const salvo = localStorage.getItem('tema'); if (salvo) raiz.dataset.tema = salvo; } catch (e) {}
document.getElementById('temaBtn').addEventListener('click', () => {
  const novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro';
  raiz.dataset.tema = novo;
  try { localStorage.setItem('tema', novo); } catch (e) {}
});

// Gráfico de barras do topo
const grafico = document.getElementById('grafico');
[40, 65, 50, 85, 70, 100].forEach(h => {
  const barra = document.createElement('i');
  grafico.appendChild(barra);
  setTimeout(() => barra.style.height = h + '%', 150);
});

// Curiosidades sobre a Amanda
const curiosidades = [
  'Meu anime favorito é Hunter x Hunter.',
  'Passei no meu primeiro concurso público aos 21 anos.',
  'Meu cachorro, o Bilbo, é o meu amor todo.',
  'Adoro jogos de modo história, como The Witcher 3.',
  'Ajudo ONGs que cuidam de animais de rua e doentes.',
  'Adoro fazer bolos e doces.',
  'Leio de ficção a filosofia, passando por história, política e economia.',
  'Vou ao Lollapalooza em 2027 para ver a The Neighbourhood.',
  'Meu vício do momento é Stardew Valley.'
];
let atual = -1;
const texto = document.getElementById('curiosidade');
document.getElementById('curiosidadeBtn').addEventListener('click', () => {
  let n;
  do { n = Math.floor(Math.random() * curiosidades.length); } while (n === atual);
  atual = n;
  texto.textContent = curiosidades[n];
});

// Filtro das paixões
const botoes = document.querySelectorAll('#filtros button');
const cartoes = document.querySelectorAll('.card[data-cat]');
botoes.forEach(b => b.addEventListener('click', () => {
  botoes.forEach(x => x.classList.toggle('ativo', x === b));
  cartoes.forEach(c => c.classList.toggle('oculto', b.dataset.filtro !== 'todas' && c.dataset.cat !== b.dataset.filtro));
}));

// Galerias de fotos (várias fotos por cartão) e ampliação
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
let lbFotos = [], lbPos = 0, lbAlt = '';
function mostrarLb() {
  lbImg.src = lbFotos[lbPos];
  lbImg.alt = lbAlt + ' (foto ' + (lbPos + 1) + ' de ' + lbFotos.length + ')';
  document.getElementById('lbAnt').hidden = document.getElementById('lbProx').hidden = lbFotos.length < 2;
}
function moverLb(d) { lbPos = (lbPos + d + lbFotos.length) % lbFotos.length; mostrarLb(); }
document.getElementById('lbAnt').addEventListener('click', () => moverLb(-1));
document.getElementById('lbProx').addEventListener('click', () => moverLb(1));
document.getElementById('lbFechar').addEventListener('click', () => lb.close());
lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
lb.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') moverLb(-1);
  if (e.key === 'ArrowRight') moverLb(1);
});

document.querySelectorAll('.galeria').forEach(g => {
  const fotos = g.dataset.fotos.split(',').map(f => f.trim()).filter(Boolean);
  const img = g.querySelector('img');
  const alt = img.alt;
  let pos = 0;
  const contador = document.createElement('span');
  contador.className = 'contador';
  function atualizar() {
    img.src = fotos[pos];
    img.alt = alt + (fotos.length > 1 ? ' (foto ' + (pos + 1) + ' de ' + fotos.length + ')' : '');
    contador.textContent = (pos + 1) + '/' + fotos.length;
  }
  if (fotos.length > 1) {
    [['esq', '‹', -1, 'Foto anterior'], ['dir', '›', 1, 'Próxima foto']].forEach(([cls, txt, d, rotulo]) => {
      const b = document.createElement('button');
      b.className = 'seta ' + cls; b.textContent = txt; b.setAttribute('aria-label', rotulo);
      b.addEventListener('click', e => { e.stopPropagation(); pos = (pos + d + fotos.length) % fotos.length; atualizar(); });
      g.appendChild(b);
    });
    g.appendChild(contador);
  }
  atualizar();
  img.tabIndex = 0;
  const abrir = () => { lbFotos = fotos; lbPos = pos; lbAlt = alt; mostrarLb(); lb.showModal(); };
  img.addEventListener('click', abrir);
  img.addEventListener('keydown', e => { if (e.key === 'Enter') abrir(); });
});
