import { BarChart3, Calendar, PieChart, SaveIcon } from "lucide-react";

const benefits = [
  {
    Icon: BarChart3,
    title: "Lưu trữ giao dịch tự động",
    description:
      "AI tự động phân loại và ghi lại mọi giao dịch trong thời gian thực, giúp bạn không bỏ sót bất kỳ khoản chi nào.",
    stats: "Tiết kiệm 2 giờ/tuần",
    terms: [
      {
        term: "Phân loại giao dịch tự động",
        definition:
          "Sử dụng AI để tự động nhận diện và phân loại các giao dịch vào các danh mục phù hợp như ăn uống, di chuyển, mua sắm, v.v.",
      },
    ],
  },
  {
    Icon: Calendar,
    title: "Lập ngân sách cá nhân hóa",
    description:
      "Tạo kế hoạch chi tiêu linh hoạt chỉ với 3 bước đơn giản, tự động điều chỉnh theo thói quen của bạn.",
    stats: "3 bước đơn giản",
    terms: [
      {
        term: "Ngân sách cá nhân hóa",
        definition:
          "Kế hoạch tài chính được điều chỉnh dựa trên thói quen chi tiêu và mục tiêu cá nhân của bạn.",
      },
    ],
  },
  {
    Icon: SaveIcon,
    title: "Tối ưu tiết kiệm",
    description:
      "Tiết kiệm đến 20% mỗi tháng nhờ AI phân tích chi tiêu và đề xuất cắt giảm hợp lý.",
    stats: "Tiết kiệm 20%/tháng",
    terms: [
      {
        term: "AI phân tích chi tiêu",
        definition:
          "Công nghệ trí tuệ nhân tạo phân tích mô hình chi tiêu để tìm ra các khoản chi không cần thiết và đề xuất cách tiết kiệm.",
      },
    ],
  },
  {
    Icon: PieChart,
    title: "Quyết toán thuế dễ dàng",
    description:
      "Tự động phân loại thu nhập và chi phí, xuất báo cáo thuế chính xác chỉ với 1 cú nhấp.",
    stats: "Chính xác 99.9%",
    terms: [
      {
        term: "Quyết toán thuế",
        definition:
          "Quá trình tổng hợp và báo cáo thu nhập, chi phí trong năm để tính toán số thuế phải nộp hoặc được hoàn trả.",
      },
    ],
  },
];

export default benefits;
