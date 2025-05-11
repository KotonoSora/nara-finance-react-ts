interface FAQ {
  question: string;
  answer: string;
  category: "pricing" | "security" | "features" | "getting-started";
  helpful?: number;
  relatedLinks?: {
    text: string;
    url: string;
  }[];
  updatedAt?: string;
}

const faqs: FAQ[] = [
  // Pricing
  {
    question: "{{APP_NAME}} có miễn phí không?",
    answer:
      "Có bản dùng thử miễn phí 14 ngày, không cần thẻ tín dụng! Sau đó, bạn có thể chọn gói Basic (miễn phí) hoặc Pro (chỉ từ 49k/tháng) tùy theo nhu cầu sử dụng.",
    category: "pricing",
    helpful: 245,
    relatedLinks: [
      {
        text: "So sánh các gói",
        url: "/pricing",
      },
      {
        text: "Chính sách hoàn tiền",
        url: "/refund-policy",
      },
    ],
    updatedAt: "2025-04-01",
  },
  {
    question: "Có thể nâng cấp hoặc hủy gói bất kỳ lúc nào không?",
    answer:
      "Có, bạn có thể nâng cấp, hạ cấp hoặc hủy gói bất kỳ lúc nào qua cài đặt tài khoản. Các thay đổi có hiệu lực ngay lập tức, và bạn sẽ được hoàn tiền tỷ lệ cho thời gian chưa sử dụng nếu hủy gói Pro.",
    category: "pricing",
    helpful: 180,
    relatedLinks: [
      {
        text: "Quản lý gói đăng ký",
        url: "/account/subscription",
      },
      {
        text: "Chính sách hoàn tiền",
        url: "/refund-policy",
      },
    ],
    updatedAt: "2025-05-12",
  },

  // Security
  {
    question: "Dữ liệu của tôi có an toàn không?",
    answer:
      "Chúng tôi sử dụng mã hóa cấp ngân hàng (AES-256), xác thực 2 yếu tố và tuân thủ các tiêu chuẩn bảo mật quốc tế như ISO 27001, PCI DSS. Dữ liệu của bạn được lưu trữ an toàn trên máy chủ đặt tại Việt Nam.",
    category: "security",
    helpful: 389,
    relatedLinks: [
      {
        text: "Chính sách bảo mật",
        url: "/privacy",
      },
      {
        text: "Trung tâm bảo mật",
        url: "/security",
      },
    ],
    updatedAt: "2025-04-15",
  },
  {
    question: "Làm thế nào để bật xác thực hai yếu tố (2FA)?",
    answer:
      "Bạn có thể bật 2FA trong phần cài đặt bảo mật của tài khoản. Chỉ cần làm theo hướng dẫn để liên kết với ứng dụng xác thực (như Google Authenticator) hoặc số điện thoại. Điều này tăng cường bảo mật cho tài khoản của bạn.",
    category: "security",
    helpful: 120,
    relatedLinks: [
      {
        text: "Hướng dẫn cài đặt 2FA",
        url: "/security/2fa-guide",
      },
      {
        text: "Trung tâm bảo mật",
        url: "/security",
      },
    ],
    updatedAt: "2025-05-10",
  },

  // Features
  {
    question: "Tôi có cần biết tài chính không?",
    answer:
      "Không, {{APP_NAME}} được thiết kế đơn giản cho mọi người. AI của chúng tôi sẽ tự động phân tích và đưa ra các gợi ý phù hợp với trình độ của bạn. Bạn chỉ cần theo dõi các giao dịch và thực hiện theo hướng dẫn.",
    category: "features",
    helpful: 156,
    relatedLinks: [
      {
        text: "Hướng dẫn sử dụng",
        url: "/guides",
      },
      {
        text: "Video hướng dẫn",
        url: "/tutorials",
      },
    ],
    updatedAt: "2025-03-28",
  },
  {
    question: "Có hỗ trợ quyết toán thuế thật không?",
    answer:
      "{{APP_NAME}} tích hợp trực tiếp với hệ thống của Tổng cục Thuế. Chúng tôi tự động phân loại thu nhập và chi phí theo quy định thuế TNCN, giúp bạn dễ dàng khai báo và quyết toán thuế cuối năm. Hệ thống được cập nhật thường xuyên theo các quy định mới nhất.",
    category: "features",
    helpful: 234,
    relatedLinks: [
      {
        text: "Hướng dẫn quyết toán thuế",
        url: "/tax-guide",
      },
    ],
    updatedAt: "2025-05-10",
  },
  {
    question: "Tính năng lập ngân sách hoạt động như thế nào?",
    answer:
      "AI của {{APP_NAME}} phân tích thói quen chi tiêu của bạn và đề xuất ngân sách cá nhân hóa dựa trên thu nhập, chi phí định kỳ và mục tiêu tài chính. Bạn có thể điều chỉnh ngân sách bất kỳ lúc nào, và hệ thống sẽ cảnh báo nếu bạn chi tiêu vượt mức.",
    category: "features",
    helpful: 190,
    relatedLinks: [
      {
        text: "Hướng dẫn lập ngân sách",
        url: "/budgeting-guide",
      },
      {
        text: "Tính năng cho người mới",
        url: "/features/beginners",
      },
    ],
    updatedAt: "2025-05-11",
  },

  // Getting Started
  {
    question: "Mất bao lâu để bắt đầu?",
    answer:
      "Chỉ 5 phút để thiết lập và bắt đầu quản lý tài chính! Quy trình đơn giản: (1) Đăng ký tài khoản, (2) Kết nối ngân hàng hoặc ví điện tử (tùy chọn), (3) Thiết lập mục tiêu tài chính. AI sẽ tự động theo dõi và phân tích các giao dịch của bạn.",
    category: "getting-started",
    helpful: 423,
    relatedLinks: [
      {
        text: "Ngân hàng hỗ trợ",
        url: "/supported-banks",
      },
      {
        text: "Hướng dẫn kết nối",
        url: "/connect",
      },
    ],
    updatedAt: "2025-04-10",
  },
  {
    question: "Tôi cần kết nối tài khoản ngân hàng không?",
    answer:
      "Kết nối tài khoản ngân hàng là tùy chọn, nhưng sẽ giúp tự động hóa việc theo dõi chi tiêu. Chúng tôi hỗ trợ kết nối an toàn với hơn 25 ngân hàng tại Việt Nam. Bạn cũng có thể nhập giao dịch thủ công hoặc quét hóa đơn.",
    category: "getting-started",
    helpful: 156,
    relatedLinks: [
      {
        text: "Danh sách ngân hàng hỗ trợ",
        url: "/supported-banks",
      },
      {
        text: "Hướng dẫn kết nối",
        url: "/connect-bank",
      },
    ],
    updatedAt: "2025-05-01",
  },
  {
    question: "Dùng app có cần kỹ năng kế toán không?",
    answer:
      "Không! {{APP_NAME}} được thiết kế để dễ sử dụng cho mọi người, không cần kiến thức kế toán. AI của chúng tôi sẽ tự động xử lý và phân loại giao dịch. Với giao diện trực quan và hướng dẫn chi tiết, bạn có thể bắt đầu quản lý tài chính hiệu quả ngay lập tức.",
    category: "getting-started",
    helpful: 198,
    relatedLinks: [
      {
        text: "Video hướng dẫn sử dụng",
        url: "/tutorials",
      },
      {
        text: "Các tính năng cho người mới",
        url: "/features/beginners",
      },
    ],
    updatedAt: "2025-05-11",
  },
  {
    question: "Tôi có thể sử dụng {{APP_NAME}} trên nhiều thiết bị không?",
    answer:
      "Có, {{APP_NAME}} hỗ trợ đồng bộ hóa dữ liệu trên nhiều thiết bị, bao gồm điện thoại, máy tính bảng và trình duyệt web. Chỉ cần đăng nhập bằng cùng một tài khoản để truy cập dữ liệu tài chính của bạn mọi lúc, mọi nơi.",
    category: "getting-started",
    helpful: 142,
    relatedLinks: [
      {
        text: "Tải ứng dụng",
        url: "/download",
      },
      {
        text: "Hướng dẫn đồng bộ",
        url: "/sync-guide",
      },
    ],
    updatedAt: "2025-05-12",
  },
];

export default faqs;
