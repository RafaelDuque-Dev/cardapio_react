import React, { useEffect, useMemo, useState } from "react";
import "./App.css"; // ✅ importa o CSS externo
import BackgroundCarousel from "./components/BackgroundCarousel";


// App.jsx — substitua seu src/App.jsx por este arquivo em um projeto Create React App
// O componente injeta estilos automaticamente para não precisar configurar CSS externo.

export default function App() {
  // dados iniciais (simulam um backend JSON)
  const initialProducts = [
    { id: 1, name: "Hambúrguer Artesanal", price: 25.0, category: "Lanches", img: "https://images.pexels.com/photos/34223536/pexels-photo-34223536.jpeg", desc: "Pão brioche, 180g, queijo e molho especial" },
    { id: 2, name: "Batata Frita", price: 10.0, category: "Acompanhamentos", img: "https://images.pexels.com/photos/18339330/pexels-photo-18339330.jpeg", desc: "Porção média, crocante" },
    { id: 3, name: "Refrigerante Lata", price: 6.0, category: "Bebidas", img: "https://images.pexels.com/photos/3686790/pexels-photo-3686790.jpeg", desc: "350ml" },
    { id: 4, name: "Milkshake Chocolate", price: 15.0, category: "Sobremesas", img: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg", desc: "300ml, cobertura chocolate" },
    { id: 5, name: "Cheeseburger Duplo", price: 32.0, category: "Lanches", img: "https://images.pexels.com/photos/15010292/pexels-photo-15010292.jpeg", desc: "Dobro de carne e queijo" },
    { id: 6, name: "Água Mineral", price: 4.0, category: "Bebidas", img: "https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg", desc: "500ml" },
    { id: 7, name: "Onion Rings", price: 12.0, category: "Acompanhamentos", img: "https://images.pexels.com/photos/1797171/pexels-photo-1797171.jpeg", desc: "Porção com molho" },
    { id: 8, name: "Brownie Quente", price: 14.0, category: "Sobremesas", img: "https://images.pexels.com/photos/24246159/pexels-photo-24246159.jpeg", desc: "Com sorvete" }
  ];

  // criar imagens SVG simples como data URLs (por estética)
  const makeImg = (text, bg) => {
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='${bg}' /><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='#fff'>${text}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  };

  const products = useMemo(() => initialProducts.map((p, i) => ({ ...p, img: p.img || makeImg(p.name.split(" ")[0], ["#D45959","#6D9BD1","#E6A23C","#67C23A"][i%4]) })), []);

  const categories = useMemo(() => ["Tudo", ...Array.from(new Set(products.map(p => p.category)))], [products]);

  // estados
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tudo");
  const [cart, setCart] = useState(() => (JSON.parse(localStorage.getItem("cart_v1")) || {}));
  const [sort, setSort] = useState("popular");

  // persistir carrinho
  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(cart));
  }, [cart]);


  // filtragem e ordenação
  const filtered = useMemo(() => {
    let list = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    if (category !== "Tudo") list = list.filter(p => p.category === category);
    if (sort === "price-asc") list = list.sort((a,b) => a.price - b.price);
    if (sort === "price-desc") list = list.sort((a,b) => b.price - a.price);
    return list;
  }, [products, query, category, sort]);

  // carrinho: estrutura { productId: qty }
  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(c => { const copy = { ...c }; delete copy[id]; return copy; });
  const changeQty = (id, delta) => setCart(c => { const copy = { ...c }; copy[id] = Math.max(0, (copy[id] || 0) + delta); if (copy[id] === 0) delete copy[id]; return copy; });

  const cartItems = Object.entries(cart).map(([id, qty]) => {
    const p = products.find(x => x.id === Number(id));
    return { ...p, qty };
  });

  const subtotal = cartItems.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <div className="app">
      <BackgroundCarousel /> {/* 🔥 Fundo com carrossel */}
      <header>
        <div className="brand">
          <div className="logo">CD</div>
          <div>
            <h1>Cardápio Digital — Kairos</h1>
            <p className="lead">Pronto, elegante e responsivo — toque para pedir ou compartilhe o link</p>
          </div>
        </div>

        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:700}}>Aberto</div>
            <div style={{fontSize:12,color:'#9AA4B2'}}>Entrega e retirada</div>
          </div>
        </div>
      </header>


      <div className="controls">
        <div className="search">
          <input className="searchin" placeholder="Pesquisar por nome..." value={query} onChange={e=>setQuery(e.target.value)} />
        </div>

        <div>
          <select className="select" value={category} onChange={e=>setCategory(e.target.value)}>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div>
          <select className="select" value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="popular">Mais populares</option>
            <option value="price-asc">Preço: Menor</option>
            <option value="price-desc">Preço: Maior</option>
          </select>
        </div>
      </div>

      <main>
        <div className="grid">
          {filtered.map(p => (
            <article key={p.id} className="card">
              <div className="img" style={{backgroundImage:`url('${p.img}')`}} />
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <div className="name">{p.name}</div>
                  <div className="cat">{p.category} • <span className="small">{p.desc}</span></div>
                </div>
                <div className="price">R$ {p.price.toFixed(2)}</div>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center',justifyContent:'space-between'}}>
                <button className="add" onClick={()=>addToCart(p.id)}>Adicionar</button>
                <button className="smallbtn" onClick={()=>navigator.share ? navigator.share({title: p.name, text: `${p.name} — R$${p.price.toFixed(2)}`, url: window.location.href}) : alert('Compartilhe o link manualmente')}>Compartilhar</button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <div className="cart">
        <h3>Carrinho</h3>
        {cartItems.length === 0 ? <div style={{color:'var(--muted)'}}>Carrinho vazio</div> : (
          <div>
            {cartItems.map(it => (
              <div key={it.id} className="item">
                <img src={it.img} alt="" style={{width:54,height:40,objectFit:'cover',borderRadius:8}} />
                <div style={{flex:1}}>
                  <div style={{fontWeight:600}}>{it.name}</div>
                  <div className="small">R$ {it.price.toFixed(2)}</div>
                </div>
                <div className="qty">
                  <button className="smallbtn" onClick={()=>changeQty(it.id,-1)}>-</button>
                  <div>{it.qty}</div>
                  <button className="smallbtn" onClick={()=>changeQty(it.id,1)}>+</button>
                  <button className="smallbtn" onClick={()=>removeFromCart(it.id)}>Remover</button>
                </div>
              </div>
            ))}

            <div style={{display:'flex',justifyContent:'space-between',marginTop:8,fontWeight:700}}>
              <div>Subtotal</div>
              <div>R$ {subtotal.toFixed(2)}</div>
            </div>

            <div style={{display:'flex',gap:8,marginTop:10}}>
              <button className="add" style={{flex:1}} onClick={()=>alert('Fluxo de checkout não implementado — integrar com WhatsApp, Stripe ou API de pedidos.')}>Finalizar</button>
              <button className="smallbtn" onClick={()=>setCart({})}>Limpar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
