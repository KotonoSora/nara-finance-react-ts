import {
  Calendar,
  Clock,
  FileText,
  LineChart,
  Lock,
  PieChart,
  TrendingUp,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

interface BenefitTerm {
  term: string;
  definition: string;
  relatedTerms?: string[];
  learnMoreUrl?: string;
}

interface BenefitStat {
  value: string;
  label: string;
  trend?: "up" | "down" | "neutral";
  change?: string;
  timeframe?: "daily" | "weekly" | "monthly" | "yearly" | "once";
  baselineValue?: string;
  sourceInfo?: string;
  highlight?: boolean;
}

interface BenefitFeature {
  name: string;
  description?: string;
  status: "available" | "beta" | "coming-soon";
  requiresPlan?: "free" | "pro" | "enterprise";
}

interface Benefit {
  Icon: LucideIcon;
  title: string;
  description: string;
  category: "automation" | "analytics" | "planning" | "security";
  subCategory:
    | "transactions"
    | "budgeting"
    | "taxes"
    | "investments"
    | "savings";
  highlight?: boolean;
  stats?: BenefitStat[];
  terms: BenefitTerm[];
  features: BenefitFeature[];
  comingSoon?: boolean;
  priority: number;
  demoUrl?: string;
  setupComplexity: "simple" | "moderate" | "advanced";
  integrations?: string[];
}

const benefits: Benefit[] = [
  {
    title: "Tiết kiệm thời gian đáng kể",
    description:
      "Tiết kiệm trung bình 20 giờ mỗi tháng nhờ tự động hóa việc theo dõi chi tiêu và quản lý tài chính.",
    Icon: Clock,
    category: "automation",
    subCategory: "transactions",
    setupComplexity: "simple",
    priority: 1,
    highlight: true,
    stats: [
      {
        value: "20h",
        label: "tiết kiệm/tháng",
        timeframe: "monthly",
        sourceInfo: "Dựa trên khảo sát người dùng Q1/2025",
        highlight: true,
      },
    ],
    features: [
      {
        name: "Tự động phân loại",
        status: "available",
        description: "Phân loại thông minh mọi giao dịch ngay khi phát sinh",
      },
      {
        name: "Nhận diện hóa đơn",
        status: "available",
        description: "Quét và xử lý hóa đơn tự động bằng AI",
      },
    ],
    terms: [
      {
        term: "tự động hóa",
        definition:
          "Hệ thống tự động xử lý và phân loại các giao dịch mà không cần thao tác thủ công",
      },
    ],
  },
  {
    title: "Theo dõi thu chi tự động",
    description:
      "Kết nối trực tiếp với ngân hàng để tự động cập nhật và phân loại mọi giao dịch ngay khi phát sinh.",
    Icon: LineChart,
    category: "automation",
    subCategory: "transactions",
    setupComplexity: "moderate",
    priority: 2,
    features: [
      {
        name: "Kết nối ngân hàng",
        status: "available",
        description: "Hỗ trợ 25+ ngân hàng tại Việt Nam",
      },
      {
        name: "Phân loại AI",
        status: "available",
        description: "Độ chính xác lên đến 98%",
      },
    ],
    stats: [
      {
        value: "98%",
        label: "độ chính xác",
        sourceInfo: "Dựa trên dữ liệu thực tế Q1/2025",
      },
    ],
    terms: [
      {
        term: "Phân loại AI",
        definition:
          "Hệ thống trí tuệ nhân tạo tự động nhận diện và phân loại các giao dịch theo danh mục",
      },
    ],
  },
  {
    title: "Đề xuất ngân sách thông minh",
    description:
      "AI phân tích mẫu chi tiêu và đưa ra đề xuất ngân sách phù hợp với thói quen và mục tiêu của bạn.",
    Icon: PieChart,
    category: "analytics",
    subCategory: "budgeting",
    setupComplexity: "simple",
    priority: 3,
    features: [
      {
        name: "Dự báo chi tiêu",
        status: "available",
        description: "Dự đoán các khoản chi phí định kỳ",
      },
      {
        name: "Mục tiêu tài chính",
        status: "beta",
        description: "Tự động điều chỉnh ngân sách theo mục tiêu",
      },
    ],
    terms: [
      {
        term: "Dự báo chi tiêu",
        definition:
          "Sử dụng AI để phân tích mẫu chi tiêu và dự đoán các khoản chi phí trong tương lai",
      },
    ],
  },
  {
    title: "Nhắc nhở hóa đơn thông minh",
    description:
      "Không bao giờ bỏ lỡ thanh toán với hệ thống nhắc nhở tự động và theo dõi hóa đơn định kỳ.",
    Icon: Calendar,
    category: "planning",
    subCategory: "budgeting",
    setupComplexity: "simple",
    priority: 4,
    features: [
      {
        name: "Nhắc nhở tự động",
        status: "available",
        description: "Thông báo trước các khoản thanh toán",
      },
      {
        name: "Lịch thanh toán",
        status: "available",
        description: "Xem và quản lý tất cả hóa đơn trong một lịch",
      },
    ],
    terms: [
      {
        term: "Nhắc nhở tự động",
        definition:
          "Hệ thống gửi thông báo trước thời hạn thanh toán để đảm bảo không bỏ lỡ các khoản phải trả",
      },
    ],
  },
  {
    title: "Hỗ trợ quyết toán thuế",
    description:
      "Tự động tổng hợp và phân loại các khoản thu chi theo quy định thuế, giúp việc quyết toán thuế TNCN dễ dàng hơn.",
    Icon: FileText,
    category: "automation",
    subCategory: "taxes",
    setupComplexity: "moderate",
    priority: 5,
    features: [
      {
        name: "Báo cáo thuế",
        status: "available",
        description: "Tự động tạo báo cáo theo mẫu của Tổng cục Thuế",
      },
      {
        name: "Tư vấn thuế AI",
        status: "coming-soon",
        description: "Tư vấn tối ưu thuế dựa trên tình hình tài chính",
        requiresPlan: "pro",
      },
    ],
    terms: [
      {
        term: "Quyết toán thuế",
        definition:
          "Quá trình tổng kết và báo cáo thu nhập cá nhân với cơ quan thuế theo quy định pháp luật",
      },
    ],
    integrations: ["Tổng cục Thuế", "MISA"],
  },
  {
    title: "Bảo mật tài chính tối ưu",
    description:
      "Bảo vệ dữ liệu tài chính của bạn với mã hóa cấp ngân hàng, xác thực hai yếu tố và tuân thủ các tiêu chuẩn bảo mật quốc tế.",
    Icon: Lock,
    category: "security",
    subCategory: "transactions",
    setupComplexity: "simple",
    priority: 6,
    features: [
      {
        name: "Mã hóa AES-256",
        status: "available",
        description: "Mã hóa cấp ngân hàng cho dữ liệu giao dịch",
      },
      {
        name: "Xác thực 2FA",
        status: "available",
        description: "Bảo mật tài khoản với xác thực hai yếu tố",
      },
    ],
    stats: [
      {
        value: "100%",
        label: "tuân thủ PCI DSS",
        sourceInfo: "Chứng nhận bảo mật Q1/2025",
      },
    ],
    terms: [
      {
        term: "Mã hóa AES-256",
        definition:
          "Tiêu chuẩn mã hóa tiên tiến để bảo vệ dữ liệu giao dịch khỏi truy cập trái phép",
      },
    ],
  },
  {
    title: "Phân tích đầu tư thông minh",
    description:
      "Theo dõi và tối ưu hóa danh mục đầu tư với các công cụ phân tích AI, giúp bạn đưa ra quyết định đầu tư sáng suốt hơn.",
    Icon: TrendingUp,
    category: "analytics",
    subCategory: "investments",
    setupComplexity: "moderate",
    priority: 7,
    features: [
      {
        name: "Phân tích danh mục",
        status: "beta",
        description: "Đánh giá hiệu suất đầu tư theo thời gian thực",
        requiresPlan: "pro",
      },
      {
        name: "Gợi ý đầu tư",
        status: "coming-soon",
        description: "Đề xuất đầu tư dựa trên hồ sơ rủi ro",
        requiresPlan: "enterprise",
      },
    ],
    stats: [
      {
        value: "18%",
        label: "tăng trưởng trung bình",
        timeframe: "yearly",
        sourceInfo: "Dựa trên dữ liệu người dùng Q1/2025",
      },
    ],
    terms: [
      {
        term: "Phân tích danh mục",
        definition:
          "Công cụ AI đánh giá hiệu suất và rủi ro của các khoản đầu tư trong danh mục",
      },
    ],
    integrations: ["VNDirect", "SSI"],
  },
];

export default benefits;
