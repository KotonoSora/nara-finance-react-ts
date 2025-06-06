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
      "{{APP_NAME}} helped me save 20% of my monthly income. The AI spending analysis revealed unnecessary expenses I never noticed! The app is convenient and automatically categorizes my transactions with great accuracy.",
    author: "Minh Tran",
    position: "Digital Marketing Freelancer",
    location: "Ho Chi Minh City",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "personal",
    stats: [
      {
        label: "Savings",
        value: "20%/month",
      },
      {
        label: "Time using",
        value: "8 months",
      },
    ],
    date: "2025-04-15",
  },
  {
    quote:
      "I've tried many expense tracking apps, but {{APP_NAME}} is the first one I've used consistently for 6 months. The interface is simple and easy to use! I especially love the smart budgeting feature.",
    author: "Lan Nguyen",
    position: "Chief Accountant",
    location: "Hanoi",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "business",
    stats: [
      {
        label: "Time saved",
        value: "2 hours/week",
      },
    ],
    date: "2025-03-28",
  },
  {
    quote:
      "The cash flow analysis and forecasting feature helps me plan my finances more accurately. It's especially useful for business planning and expense management.",
    author: "Hùng Phạm",
    position: "SME Business Owner",
    location: "Đà Nẵng",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "business",
    stats: [
      {
        label: "Growth",
        value: "32%/year",
      },
      {
        label: "Cost reduction",
        value: "15%",
      },
    ],
    date: "2025-04-02",
  },
  {
    quote:
      "Thanks to {{APP_NAME}}, I've been able to create a long-term savings plan to buy a house. The bill reminder feature ensures I never miss a payment, saving me from late fees.",
    author: "Thảo Lê",
    position: "Office Worker",
    location: "Cần Thơ",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "personal",
    stats: [
      {
        label: "Savings",
        value: "10 million VND/year",
      },
      {
        label: "Time using",
        value: "5 months",
      },
    ],
    date: "2025-05-01",
  },
  {
    quote:
      "{{APP_NAME}} helps me optimize my personal investment portfolio. The detailed analysis reports and smart investment suggestions enable me to make better decisions.",
    author: "Việt Hoàng",
    position: "Individual Investor",
    location: "Hải Phòng",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "investment",
    stats: [
      {
        label: "Profit increase",
        value: "18%/year",
      },
    ],
    date: "2025-04-20",
  },
  {
    quote:
      "The tax settlement feature of {{APP_NAME}} is a lifesaver! Preparing tax documents now takes only a few minutes instead of hours like before.",
    author: "Mai Anh",
    position: "Freelancer",
    location: "Nha Trang",
    avatar: undefined,
    rating: 5,
    verified: true,
    useCase: "business",
    stats: [
      {
        label: "Time saved",
        value: "10 hours/year",
      },
      {
        label: "Tax cost reduction",
        value: "5%",
      },
    ],
    date: "2025-05-10",
  },
];

export default testimonials;
