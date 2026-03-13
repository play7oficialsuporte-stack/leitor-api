const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

async function getMangaList(title = "") {
    try {
        const query = title ? `&title=${title}` : "";
        // O parâmetro includes[]=cover_art é vital para as fotos aparecerem
        const response = await fetch(`${BASE_URL}/manga?limit=24&includes[]=cover_art${query}&contentRating[]=safe&contentRating[]=suggestive`);
        const data = await response.json();
        
        return data.data.map(manga => {
            const coverRel = manga.relationships.find(r => r.type === 'cover_art');
            const coverFile = coverRel ? coverRel.attributes.fileName : "";
            return {
                id: manga.id,
                title: manga.attributes.title.en || manga.attributes.title.ja_ro || "Sem título",
                coverUrl: coverFile ? `${UPLOADS_URL}/covers/${manga.id}/${coverFile}.256.jpg` : "https://via.placeholder.com/256x380?text=No+Cover"
            };
        });
    } catch (err) {
        return [];
    }
}

async function getMangaChapters(mangaId) {
    try {
        const response = await fetch(`${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&order[chapter]=desc&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`);
        const data = await response.json();
        return data.data;
    } catch (err) {
        return [];
    }
}
