// Sample news data (in a real app, this would come from an API or database)
const newsData = [
    {
        title: "Đội The Llamas Đoạt Chức Vô Địch",
        excerpt: "Đội của chúng ta đã đạt được chiến thắng tuyệt vời trong giải đấu vô địch gần đây...",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-20",
        category: "Thành Tích",
        readTime: "5 phút đọc"
    },
    {
        title: "Ra Mắt Chương Trình Huấn Luyện Mới",
        excerpt: "Chúng tôi vui mừng thông báo về chương trình huấn luyện toàn diện mới...",
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-18",
        category: "Huấn Luyện",
        readTime: "4 phút đọc"
    },
    {
        title: "Sự Kiện Cộng Đồng Thành Công",
        excerpt: "Sự kiện cộng đồng cuối tuần trước đã thu hút hơn 500 người tham gia...",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-15",
        category: "Sự Kiện",
        readTime: "3 phút đọc"
    },
    {
        title: "Điểm Sáng: Cầu Thủ John Doe",
        excerpt: "Tìm hiểu về một trong những ngôi sao đang lên và hành trình thành công của họ...",
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-12",
        category: "Cầu Thủ",
        readTime: "6 phút đọc"
    },
    {
        title: "Chiến Thắng Trận Đấu Quan Trọng",
        excerpt: "Đội của chúng ta đã có chiến thắng ấn tượng trước đối thủ mạnh...",
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-10",
        category: "Thành Tích",
        readTime: "4 phút đọc"
    },
    {
        title: "Buổi Tập Luyện Đặc Biệt",
        excerpt: "Các cầu thủ đã có buổi tập luyện đặc biệt với huấn luyện viên nổi tiếng...",
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-08",
        category: "Huấn Luyện",
        readTime: "3 phút đọc"
    },
    {
        title: "Gặp Gỡ Các Fan Hâm Mộ",
        excerpt: "Đội bóng đã có buổi gặp gỡ thân mật với các fan hâm mộ trung thành...",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-05",
        category: "Sự Kiện",
        readTime: "5 phút đọc"
    }
];

export function load() {
    // Get featured news (first article)
    const featuredNews = newsData[0];

    // Get all other news items
    const allNewsItems = newsData.slice(1);

    // Get categories with counts
    const categories = [
        { name: "Tất Cả", count: allNewsItems.length },
        { name: "Thành Tích", count: allNewsItems.filter(item => item.category === "Thành Tích").length },
        { name: "Huấn Luyện", count: allNewsItems.filter(item => item.category === "Huấn Luyện").length },
        { name: "Sự Kiện", count: allNewsItems.filter(item => item.category === "Sự Kiện").length },
        { name: "Cầu Thủ", count: allNewsItems.filter(item => item.category === "Cầu Thủ").length }
    ];

    return {
        featuredNews,
        allNewsItems,
        categories
    };
} 