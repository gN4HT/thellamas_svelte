// Sample news data (in a real app, this would come from an API or database)
const allNewsItems = [
    {
        title: "Đội The Llamas Đoạt Chức Vô Địch",
        excerpt: "Đội của chúng ta đã đạt được chiến thắng tuyệt vời trong giải đấu vô địch gần đây...",
        content: `
            <p>Đội The Llamas đã có một mùa giải đáng nhớ với những chiến thắng ấn tượng và tinh thần đồng đội tuyệt vời. Trong trận chung kết, đội đã thể hiện sự xuất sắc với chiến thắng 3-1 trước đối thủ mạnh nhất giải.</p>
            
            <h2>Những Khoảnh Khắc Đáng Nhớ</h2>
            <p>Trận đấu bắt đầu với nhịp độ cao, cả hai đội đều tạo ra nhiều cơ hội nguy hiểm. Phút 25, tiền đạo của chúng ta đã mở tỷ số với một cú đánh đầu đẹp mắt từ quả tạt góc.</p>
            
            <h2>Chiến Thuật Thông Minh</h2>
            <p>Huấn luyện viên trưởng đã có những điều chỉnh chiến thuật rất hiệu quả trong hiệp hai, giúp đội kiểm soát tốt hơn trận đấu và tạo ra nhiều cơ hội ghi bàn.</p>
            
            <h2>Chặng Đường Phía Trước</h2>
            <p>Với chiến thắng này, đội đã chính thức giành quyền tham dự giải đấu cấp cao hơn trong mùa giải tới. Các cầu thủ và ban huấn luyện đều rất phấn khởi với kết quả này.</p>
        `,
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-20",
        category: "Thành Tích",
        readTime: "5 phút đọc",
        author: "Admin",
        tags: ["Vô Địch", "Giải Đấu", "Thành Tích"]
    },
    {
        title: "Ra Mắt Chương Trình Huấn Luyện Mới",
        excerpt: "Chúng tôi vui mừng thông báo về chương trình huấn luyện toàn diện mới...",
        content: `
            <p>Chương trình huấn luyện mới của chúng tôi được thiết kế để phát triển toàn diện kỹ năng của các cầu thủ, từ kỹ thuật cơ bản đến chiến thuật nâng cao.</p>
            
            <h2>Nội Dung Chương Trình</h2>
            <p>Chương trình bao gồm các buổi tập luyện chuyên sâu về kỹ thuật, chiến thuật, thể lực và tâm lý thi đấu. Mỗi buổi tập được thiết kế để phù hợp với trình độ và mục tiêu của từng cầu thủ.</p>
            
            <h2>Đội Ngũ Huấn Luyện</h2>
            <p>Chúng tôi tự hào về đội ngũ huấn luyện viên giàu kinh nghiệm, những người đã từng làm việc với nhiều đội bóng chuyên nghiệp trong và ngoài nước.</p>
            
            <h2>Lộ Trình Phát Triển</h2>
            <p>Chương trình được chia thành các giai đoạn, mỗi giai đoạn có mục tiêu và nội dung huấn luyện riêng, giúp cầu thủ phát triển một cách có hệ thống.</p>
        `,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-18",
        category: "Huấn Luyện",
        readTime: "4 phút đọc",
        author: "Admin",
        tags: ["Huấn Luyện", "Chương Trình", "Phát Triển"]
    },
    {
        title: "Sự Kiện Cộng Đồng Thành Công",
        excerpt: "Sự kiện cộng đồng cuối tuần trước đã thu hút hơn 500 người tham gia...",
        content: `
            <p>Sự kiện cộng đồng của chúng tôi đã thành công rực rỡ với sự tham gia đông đảo của người hâm mộ và các cầu thủ.</p>
            
            <h2>Hoạt Động Đa Dạng</h2>
            <p>Người tham gia đã có cơ hội tham gia nhiều hoạt động thú vị như thi đấu giao hữu, chụp ảnh với cầu thủ, và tham gia các trò chơi vận động.</p>
            
            <h2>Kết Nối Cộng Đồng</h2>
            <p>Sự kiện này đã tạo ra một không gian tuyệt vời để kết nối người hâm mộ với đội bóng và tạo ra những kỷ niệm đáng nhớ.</p>
            
            <h2>Những Khoảnh Khắc Đáng Nhớ</h2>
            <p>Buổi gặp gỡ đã tạo ra nhiều khoảnh khắc đáng nhớ, từ những trận đấu giao hữu sôi nổi đến những buổi chụp ảnh thân mật với các cầu thủ.</p>
        `,
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-15",
        category: "Sự Kiện",
        readTime: "3 phút đọc",
        author: "Admin",
        tags: ["Cộng Đồng", "Sự Kiện", "Kết Nối"]
    },
    {
        title: "Điểm Sáng: Cầu Thủ John Doe",
        excerpt: "Tìm hiểu về một trong những ngôi sao đang lên và hành trình thành công của họ...",
        content: `
            <p>John Doe đã có một mùa giải ấn tượng với những màn trình diễn xuất sắc và tinh thần thi đấu quyết liệt.</p>
            
            <h2>Hành Trình Thành Công</h2>
            <p>Từ một cầu thủ trẻ đầy tiềm năng, John đã phát triển thành một ngôi sao sáng của đội bóng. Anh đã ghi được 15 bàn thắng và có 8 pha kiến tạo trong mùa giải này.</p>
            
            <h2>Phong Cách Thi Đấu</h2>
            <p>Với tốc độ và kỹ thuật điêu luyện, John luôn là mối đe dọa với bất kỳ hàng phòng ngự nào. Anh cũng nổi tiếng với tinh thần đồng đội và khả năng phối hợp tuyệt vời.</p>
            
            <h2>Mục Tiêu Tương Lai</h2>
            <p>John đang đặt mục tiêu cao hơn cho mùa giải tới và hy vọng sẽ góp phần đưa đội bóng lên một tầm cao mới.</p>
        `,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-12",
        category: "Cầu Thủ",
        readTime: "6 phút đọc",
        author: "Admin",
        tags: ["Cầu Thủ", "Ngôi Sao", "Thành Tích"]
    },
    {
        title: "Chiến Thắng Trận Đấu Quan Trọng",
        excerpt: "Đội của chúng ta đã có chiến thắng ấn tượng trước đối thủ mạnh...",
        content: `
            <p>Trong một trận đấu đầy kịch tính, đội The Llamas đã xuất sắc đánh bại đối thủ mạnh với tỷ số 2-0.</p>
            
            <h2>Diễn Biến Trận Đấu</h2>
            <p>Trận đấu bắt đầu với nhịp độ cao, cả hai đội đều tạo ra nhiều cơ hội nguy hiểm. Phút 35, đội của chúng ta đã mở tỷ số với một pha phối hợp đẹp mắt.</p>
            
            <h2>Chiến Thuật Thông Minh</h2>
            <p>Huấn luyện viên đã có những điều chỉnh chiến thuật rất hiệu quả, giúp đội kiểm soát tốt trận đấu và tạo ra nhiều cơ hội ghi bàn.</p>
            
            <h2>Những Đóng Góp Quan Trọng</h2>
            <p>Đặc biệt phải kể đến những đóng góp xuất sắc của các cầu thủ chủ chốt. Họ đã thể hiện được tinh thần đồng đội và sự quyết tâm cao độ.</p>
        `,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-10",
        category: "Thành Tích",
        readTime: "4 phút đọc",
        author: "Admin",
        tags: ["Chiến Thắng", "Thành Tích", "Trận Đấu"]
    },
    {
        title: "Buổi Tập Luyện Đặc Biệt",
        excerpt: "Các cầu thủ đã có buổi tập luyện đặc biệt với huấn luyện viên nổi tiếng...",
        content: `
            <p>Buổi tập luyện đặc biệt với huấn luyện viên nổi tiếng đã mang lại nhiều bài học quý giá cho các cầu thủ.</p>
            
            <h2>Nội Dung Tập Luyện</h2>
            <p>Các cầu thủ đã được hướng dẫn về các kỹ thuật mới và chiến thuật tiên tiến. Buổi tập tập trung vào việc cải thiện kỹ năng cá nhân và phối hợp đồng đội.</p>
            
            <h2>Những Bài Học Quý Giá</h2>
            <p>Huấn luyện viên đã chia sẻ nhiều kinh nghiệm quý báu từ sự nghiệp của mình, giúp các cầu thủ có thêm động lực và định hướng phát triển.</p>
            
            <h2>Kết Quả Tích Cực</h2>
            <p>Các cầu thủ đều tỏ ra rất phấn khởi và học hỏi được nhiều điều mới từ buổi tập này.</p>
        `,
        image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-08",
        category: "Huấn Luyện",
        readTime: "3 phút đọc",
        author: "Admin",
        tags: ["Huấn Luyện", "Kỹ Thuật", "Phát Triển"]
    },
    {
        title: "Gặp Gỡ Các Fan Hâm Mộ",
        excerpt: "Đội bóng đã có buổi gặp gỡ thân mật với các fan hâm mộ trung thành...",
        content: `
            <p>Buổi gặp gỡ với người hâm mộ đã tạo ra một không khí vô cùng ấm áp và thân thiện.</p>
            
            <h2>Hoạt Động Đa Dạng</h2>
            <p>Người hâm mộ đã có cơ hội tham gia nhiều hoạt động thú vị như chụp ảnh với cầu thủ, xin chữ ký, và tham gia các trò chơi vận động.</p>
            
            <h2>Kết Nối Cộng Đồng</h2>
            <p>Sự kiện này đã tạo ra một không gian tuyệt vời để kết nối người hâm mộ với đội bóng và tạo ra những kỷ niệm đáng nhớ.</p>
            
            <h2>Những Khoảnh Khắc Đáng Nhớ</h2>
            <p>Buổi gặp gỡ đã tạo ra nhiều khoảnh khắc đáng nhớ, từ những trận đấu giao hữu sôi nổi đến những buổi chụp ảnh thân mật với các cầu thủ.</p>
        `,
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
        date: "2024-03-05",
        category: "Sự Kiện",
        readTime: "5 phút đọc",
        author: "Admin",
        tags: ["Fan Hâm Mộ", "Sự Kiện", "Cộng Đồng"]
    }
];

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export function load({ params }) {
    // Find the article that matches the slug
    const article = allNewsItems.find(item => generateSlug(item.title) === params.slug);

    if (!article) {
        return {
            article: null
        };
    }

    // Get related articles (excluding current article)
    const relatedNews = allNewsItems
        .filter(item => item !== article)
        .slice(0, 2);

    return {
        article: {
            ...article,
            relatedNews
        }
    };
} 