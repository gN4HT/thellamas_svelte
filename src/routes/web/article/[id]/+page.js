import articlesData from '$lib/articles.json';

export function load({ params }) {
    const id = Number(params.id);
    
    if (isNaN(id)) {
        throw new Error("ID không hợp lệ");
    }

    const article = articlesData.articles.find(a => a.id === id);

    if (!article) {
        return { status: 404, error: new Error("Bài viết không tồn tại") };
    }

    return { 
        article,
        giaitri: articlesData.giaitri,  // Lấy dữ liệu từ đúng phần "giaitri"
        congnghe: articlesData.congnghe // Lấy dữ liệu từ đúng phần "congnghe"
    };
}
