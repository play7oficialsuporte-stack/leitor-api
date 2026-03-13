const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

// 1. Busca mangás e retorna com a URL da capa pronta
async function getMangaList(title = "") {
    const query = title ? `&title=${title}` : "";
    const response = await fetch(`${BASE_URL}/manga?limit=20&includes[]=cover_art${query}`);
    const data = await response.json();
    
    return data.data.map(manga => {
        const coverFile = manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName;
        return {
            id: manga.id,
            title: manga.attributes.title.en || manga.attributes.title.ja_ro || "Sem título",
            description: manga.attributes.description.en || "Sem descrição",
            coverUrl: `${UPLOADS_URL}/covers/${manga.id}/${coverFile}.256.jpg` // .256.jpg para carregar rápido
        };
    });
}

// 2. Busca os capítulos em Português (Brasil)
async function getMangaChapters(mangaId) {
    const response = await fetch(`${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&order[chapter]=desc&limit=50`);
    const data = await response.json();
    return data.data;
}
