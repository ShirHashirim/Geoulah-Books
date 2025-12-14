import{H as l,a as s,i as r}from"./header-DMeG9USy.js";const n=document.querySelector(".site-header");n&&new l(n,s);const d=new URLSearchParams(window.location.search),i=d.get("id");i&&h(i);async function h(t){try{const e=await s.services.books.getById(t);if(!e)throw new Error("Book not found");const o=s.getState().currentLanguage;document.title=`${e.title[o]} - Geoulah Books`,u(e,o)}catch(e){console.error(e),document.getElementById("book-detail").innerHTML="<p>Book not found.</p>"}}function u(t,e){const o=document.getElementById("book-detail"),c="/Geoulah-Books/";o.innerHTML=`
    <div class="book-hero">
      <img src="${c}${t.coverImage}" alt="${t.title[e]}">
      <div class="info">
        <h1>${t.title[e]}</h1>
        <p class="author">${t.author}</p>
        <p class="desc">${t.description[e]}</p>
      </div>
    </div>
    
    <div class="chapter-list">
      <h2>${r.t("tableOfContents")}</h2>
      <ul>
        ${t.chapters.map(a=>`
          <li>
            <!-- FIXED: Relative Link (No leading slash) -->
            <a href="chapter.html?book=${t.slug}&chapter=${a.slug}">
              <span class="num">${a.id}</span>
              <span class="title">${a.title[e]}</span>
            </a>
          </li>
        `).join("")}
      </ul>
    </div>
  `}
