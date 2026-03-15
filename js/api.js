const BASE_URL = 'https://api.mangadex.org';
const UPLOADS_URL = 'https://uploads.mangadex.org';

// Função para buscar capítulos em PT-BR
async function getMangaChapters(mangaId) {
    try {
        // Busca capítulos em PT-BR, ordenados do mais novo para o mais antigo
        const url = `${BASE_URL}/manga/${mangaId}/feed?translatedLanguage[]=pt-br&order[chapter]=desc&limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Remove capítulos duplicados (mesmo número)
        if (!data.data) return [];
        const uniqueChapters = data.data.filter((v, i, a) => a.findIndex(t => (t.attributes.chapter === v.attributes.chapter)) === i);
        
        return uniqueChapters;
    } catch (err) {
        console.error("Erro ao carregar capítulos:", err);
        return [];
    }
}
