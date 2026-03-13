const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

async function getMangaList(title = "") {
    try {
        // Se não tiver título, ele busca os mais populares por ordem de seguidores
        const searchParams = title 
            ? `&title=${encodeURIComponent(title)}` 
            : "&order[followedCount]=desc";

        const ratings = "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic";
        
        const response = await fetch(`${BASE_URL}/manga?limit=24&includes[]=cover_art${searchParams}${ratings}`);
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) return [];

        return data.data.map(manga => {
            const coverRel = manga.relationships.find(r => r.type === 'cover_art');
            const coverFile = coverRel ? coverRel.attributes.fileName : "";
            return {
                id: manga.id,
                title: manga.attributes.title.en || manga.attributes.title.ja_ro || "Sem título",
                coverUrl: coverFile ? `${UPLOADS_URL}/covers/${manga.id}/${coverFile}.256.jpg` : "https://via.placeholder.com/256x380?text=Sem+Capa"
            };
        });
    } catch (err) {
        console.error("Erro na API:", err);
        return [];
    }
}

async function getMangaChapters(mangaId) {
    try {
        const ratings = "&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic";
        const response = await fetch(`${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&order[chapter]=desc&limit=100${ratings}`);
        const data = await response.json();
        return data.data || [];
    } catch (err) {
        return [];
    }
}
