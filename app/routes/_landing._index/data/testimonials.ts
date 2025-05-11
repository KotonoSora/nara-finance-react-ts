interface Testimonial {
  quote: string;
  author: string;
  position: string;
  location: string;
  avatar?: string;
  rating: number;
  verified: boolean;
  useCase: "personal" | "business" | "investment";
  stats?: {
    label: string;
    value: string;
  }[];
  date: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "{{APP_NAME}} giúp tôi tiết kiệm được 20% thu nhập mỗi tháng. AI phân tích chi tiêu giúp tôi nhận ra nhiều khoản phí không cần thiết! App rất tiện lợi, tự động phân loại giao dịch chính xác.",
    author: "Minh Trần",
    position: "Digital Marketing Freelancer",
    location: "TP. Hồ Chí Minh",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "personal",
    stats: [
      {
        label: "Tiết kiệm",
        value: "20%/tháng",
      },
      {
        label: "Thời gian dùng",
        value: "8 tháng",
      },
    ],
    date: "2025-04-15",
  },
  {
    quote:
      "Tôi đã thử nhiều app quản lý chi tiêu nhưng {{APP_NAME}} là app đầu tiên tôi dùng được liên tục 6 tháng. Giao diện đơn giản, dễ dùng! Đặc biệt yêu thích tính năng lập ngân sách thông minh.",
    author: "Lan Nguyễn",
    position: "Kế toán trưởng",
    location: "Hà Nội",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "business",
    stats: [
      {
        label: "Thời gian tiết kiệm",
        value: "2 giờ/tuần",
      },
    ],
    date: "2025-03-28",
  },
  {
    quote:
      "Tính năng phân tích và dự báo dòng tiền giúp tôi lên kế hoạch tài chính chính xác hơn. Đặc biệt hữu ích cho việc lập kế hoạch kinh doanh và quản lý chi phí công ty.",
    author: "Hùng Phạm",
    position: "Chủ doanh nghiệp SME",
    location: "Đà Nẵng",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "business",
    stats: [
      {
        label: "Tăng trưởng",
        value: "32%/năm",
      },
      {
        label: "Chi phí giảm",
        value: "15%",
      },
    ],
    date: "2025-04-02",
  },
  {
    quote:
      "Nhờ {{APP_NAME}}, tôi đã lập được kế hoạch tiết kiệm dài hạn để mua nhà. Tính năng nhắc nhở hóa đơn giúp tôi không bao giờ lỡ thanh toán, tiết kiệm được nhiều khoản phí phạt.",
    author: "Thảo Lê",
    position: "Nhân viên văn phòng",
    location: "Cần Thơ",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "personal",
    stats: [
      {
        label: "Tiết kiệm",
        value: "10 triệu VNĐ/năm",
      },
      {
        label: "Thời gian dùng",
        value: "5 tháng",
      },
    ],
    date: "2025-05-01",
  },
  {
    quote:
      "{{APP_NAME}} giúp tôi tối ưu hóa danh mục đầu tư cá nhân. Báo cáo phân tích chi tiết và gợi ý đầu tư thông minh giúp tôi đưa ra quyết định đúng đắn hơn.",
    author: "Việt Hoàng",
    position: "Nhà đầu tư cá nhân",
    location: "Hải Phòng",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "investment",
    stats: [
      {
        label: "Lợi nhuận tăng",
        value: "18%/năm",
      },
    ],
    date: "2025-04-20",
  },
  {
    quote:
      "Tính năng quyết toán thuế của {{APP_NAME}} là cứu tinh cho tôi! Việc chuẩn bị hồ sơ thuế giờ đây chỉ mất vài phút thay vì hàng giờ như trước đây.",
    author: "Mai Anh",
    position: "Kinh doanh tự do",
    location: "Nha Trang",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "business",
    stats: [
      {
        label: "Thời gian tiết kiệm",
        value: "10 giờ/năm",
      },
      {
        label: "Chi phí thuế giảm",
        value: "5%",
      },
    ],
    date: "2025-05-10",
  },
];

export default testimonials;
