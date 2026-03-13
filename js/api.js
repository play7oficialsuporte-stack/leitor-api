const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

async function getMangaList(title = "") {
    try {
        // Busca direta pelos mais populares sem filtros de idioma na capa (isso aumenta a chance de vir dados)
        let url = `${BASE_URL}/manga?limit=30&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&order[followedCount]=desc`;
        
        if (title) {
            url += `&title=${encodeURIComponent(title)}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) return [];

        return data.data.map(manga => {
            const coverRel = manga.relationships.find(r => r.type === 'cover_art');
            const coverFile = coverRel ? coverRel.attributes.fileName : "";
            return {
                id: manga.id,
                title: manga.attributes.title.en || manga.attributes.title.ja_ro || "Manga",
                coverUrl: coverFile ? `${UPLOADS_URL}/covers/${manga.id}/${coverFile}.256.jpg` : "https://via.placeholder.com/256x380?text=Sem+Capa"
            };
        });
    } catch (err) {
        console.error("Erro na requisição:", err);
        return [];
    }
}

async function getMangaChapters(mangaId) {
    try {
        // Aqui buscamos capítulos em PT-BR para a leitura
        const url = `${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&order[chapter]=desc&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
        const response = await fetch(url);
        const data = await response.json();
        return data.data || [];
    } catch (err) {
        return [];
    }
}
