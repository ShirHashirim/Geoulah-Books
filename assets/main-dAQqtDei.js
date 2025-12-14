import{i,H as c,a as r}from"./header-DMeG9USy.js";class l{constructor(t,e){this.container=t,this.app=e}render(t){if(!this.container)return;if(!t||t.length===0){this.container.innerHTML=`<p class="no-books">${i.t("noBooksFound")}</p>`;return}const e=this.app.getState().currentLanguage,a="/Geoulah-Books/";this.container.innerHTML=t.map(o=>`
      <article class="book-card">
        <div class="book-cover">
          <img src="${a}${o.coverImage}" alt="${o.title[e]}" loading="lazy">
        </div>
        <div class="book-info">
          <h3 class="book-title">${o.title[e]}</h3>
          <p class="book-author">${o.author}</p>
          <div class="book-actions">
            <!-- FIXED: Relative link, no leading slash -->
            <a href="book.html?id=${o.slug}" class="btn-secondary">
              ${i.t("readMore")}
            </a>
          </div>
        </div>
      </article>
    `).join("")}}new c(document.querySelector(".site-header"),r);const d=new l(document.querySelector("#book-grid"),r);async function s(){try{const n=await r.services.books.getAll(),t=r.getState().currentLanguage,e=n.find(a=>a.featured);if(e){const a=document.querySelector(".hero-content");a&&(a.innerHTML=`
          <h1>${e.title[t]}</h1>
          <p>${e.description[t]}</p>
          <a href="book.html?id=${e.slug}" class="btn-primary">
            ${i.t("startReading")}
          </a>
        `)}d.render(n)}catch(n){console.error("App init failed:",n)}}document.addEventListener("app:languageChange",()=>{s()});s();
