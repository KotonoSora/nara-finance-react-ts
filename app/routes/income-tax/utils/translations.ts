export type Language = "en" | "vi" | "ja";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation and Buttons
  "Button.CalculateTax": {
    en: "Calculate Tax",
    vi: "Tính thuế",
    ja: "税金を計算",
  },

  // Field Labels
  "Tax.Country": {
    en: "Country",
    vi: "Quốc gia",
    ja: "国",
  },
  "Tax.State": {
    en: "State",
    vi: "Tiểu bang",
    ja: "州",
  },
  "Tax.Income": {
    en: "Annual Income",
    vi: "Thu nhập hàng năm",
    ja: "年収",
  },
  "Tax.AdditionalIncome": {
    en: "Additional Income",
    vi: "Thu nhập khác",
    ja: "追加収入",
  },
  "Tax.ResidencyStatus": {
    en: "Residency Status",
    vi: "Tình trạng cư trú",
    ja: "居住者区分",
  },
  "Tax.FilingStatus": {
    en: "Filing Status",
    vi: "Tình trạng khai thuế",
    ja: "申告区分",
  },
  "Tax.Dependents": {
    en: "Number of Dependents",
    vi: "Số người phụ thuộc",
    ja: "扶養家族人数",
  },
  "Tax.Deductions": {
    en: "Deductions",
    vi: "Các khoản giảm trừ",
    ja: "所得控除",
  },
  "Tax.Credits": {
    en: "Tax Credits",
    vi: "Tín dụng thuế",
    ja: "税額控除",
  },
  "Tax.Amount": {
    en: "Amount",
    vi: "Số tiền",
    ja: "金額",
  },
  "Tax.DeductionType": {
    en: "Deduction Type",
    vi: "Loại giảm trừ",
    ja: "控除種類",
  },
  "Tax.CreditType": {
    en: "Credit Type",
    vi: "Loại tín dụng",
    ja: "控除種類",
  },
  "Tax.UseItemizedDeductions": {
    en: "Use Itemized Deductions",
    vi: "Sử dụng khoản khấu trừ chi tiết",
    ja: "項目別控除を使用",
  },
  "Tax.AdvancedOptions": {
    en: "Show Advanced Options",
    vi: "Hiển thị tùy chọn nâng cao",
    ja: "詳細オプションを表示",
  },
  "Tax.NotAvailableNonResident": {
    en: "(Not available for non-residents)",
    vi: "(Không có sẵn cho người không cư trú)",
    ja: "(非居住者は利用不可)",
  },

  // Statuses
  "Status.Resident": {
    en: "Resident",
    vi: "Người cư trú",
    ja: "居住者",
  },
  "Status.NonResident": {
    en: "Non-Resident",
    vi: "Người không cư trú",
    ja: "非居住者",
  },
  "Status.Single": {
    en: "Single",
    vi: "Độc thân",
    ja: "独身",
  },
  "Status.Married": {
    en: "Married",
    vi: "Đã kết hôn",
    ja: "既婚",
  },
  "Status.HeadOfHousehold": {
    en: "Head of Household",
    vi: "Chủ hộ",
    ja: "世帯主",
  },

  // Help Text
  "Help.ResidencyStatus": {
    en: "Non-residents may be subject to different tax rates and limitations",
    vi: "Người không cư trú có thể chịu mức thuế và hạn chế khác",
    ja: "非居住者は異なる税率や制限が適用される場合があります",
  },
  "Help.AdditionalIncome": {
    en: "Include other income sources like dividends, rental income, etc.",
    vi: "Bao gồm các nguồn thu nhập khác như cổ tức, thu nhập cho thuê, v.v.",
    ja: "配当収入、賃貸収入などのその他の収入源を含む",
  },
  "Help.StateSelection": {
    en: "Select your state for state tax calculation",
    vi: "Chọn tiểu bang để tính thuế tiểu bang",
    ja: "州税計算のために州を選択",
  },
  "Help.DisclaimerNote": {
    en: "* All calculations are estimates based on projected 2025 tax rates",
    vi: "* Tất cả các tính toán là ước tính dựa trên mức thuế dự kiến năm 2025",
    ja: "* すべての計算は2025年の予測税率に基づく概算です",
  },

  // Help text for dependents
  "Help.DependentsUS": {
    en: "Qualifying child: Under 19 (24 if student) or permanently disabled. Qualifying relative: Must not exceed gross income test.",
    vi: "Con đủ điều kiện: Dưới 19 tuổi (24 nếu là sinh viên) hoặc khuyết tật vĩnh viễn. Người thân đủ điều kiện: Không vượt quá mức thu nhập quy định.",
    ja: "扶養子女：19歳未満（学生の場合24歳未満）または永久障害者。扶養親族：一定の所得基準を超えない者。",
  },
  "Help.DependentsVN": {
    en: "Qualifying dependents: Children under 18, elderly parents, disabled relatives. Income must not exceed VND 1M monthly.",
    vi: "Người phụ thuộc hợp lệ: Con dưới 18 tuổi, cha mẹ già, người thân khuyết tật. Thu nhập không vượt quá 1 triệu đồng/tháng.",
    ja: "扶養対象：18歳未満の子供、高齢の親、障害のある親族。月収100万ドン以下。",
  },
  "Help.DependentsJP": {
    en: "Dependents must be under 16 years old or disabled. For elderly dependents (70+), additional deductions may apply. Income must not exceed ¥480,000 annually.",
    vi: "Người phụ thuộc phải dưới 16 tuổi hoặc khuyết tật. Với người cao tuổi (70+), có thể được giảm trừ thêm. Thu nhập không vượt quá 480.000 yên/năm.",
    ja: "扶養控除対象は16歳未満または障害者。高齢者（70歳以上）は追加控除が適用される場合があります。年収48万円以下。",
  },
  "Help.DependentsCA": {
    en: "Eligible dependents include children under 18, disabled relatives, and supported parents/grandparents. Income thresholds apply.",
    vi: "Người phụ thuộc hợp lệ bao gồm trẻ em dưới 18 tuổi, người thân khuyết tật, và cha mẹ/ông bà được hỗ trợ. Áp dụng giới hạn thu nhập.",
    ja: "扶養控除対象は18歳未満の子供、障害のある親族、扶養している親・祖父母。所得制限あり。",
  },
  "Help.DependentsUK": {
    en: "Child Benefit available for children under 16 (or 20 if in approved education). Income restrictions apply for high earners.",
    vi: "Trợ cấp trẻ em áp dụng cho trẻ dưới 16 tuổi (hoặc 20 nếu đang học). Có hạn chế với người thu nhập cao.",
    ja: "16歳未満（認定教育機関に在学中の場合は20歳未満）の子供に対する児童手当。高所得者には制限あり。",
  },
  "Help.DependentsKR": {
    en: "Includes children under 20, elderly parents over 60, and disabled family members. Income must not exceed ₩1.5M annually.",
    vi: "Bao gồm trẻ em dưới 20 tuổi, cha mẹ trên 60 tuổi, và người thân khuyết tật. Thu nhập không vượt quá 1,5 triệu won/năm.",
    ja: "20歳未満の子供、60歳以上の親、障害のある家族。年収150万ウォン以下。",
  },
  "Help.DependentsSG": {
    en: "Qualifying dependents include children under 16, disabled family members, and elderly parents. Income cap of SGD 4,000 annually.",
    vi: "Người phụ thuộc đủ điều kiện bao gồm trẻ em dưới 16 tuổi, người thân khuyết tật, và cha mẹ già. Giới hạn thu nhập 4.000 SGD/năm.",
    ja: "扶養控除対象は16歳未満の子供、障害のある家族、高齢の親。年収4,000シンガポールドル以下。",
  },
  "Help.DependentDeduction": {
    en: "Amount deducted from taxable income for each qualifying dependent",
    vi: "Số tiền giảm trừ thu nhập chịu thuế cho mỗi người phụ thuộc đủ điều kiện",
    ja: "扶養控除対象者1人あたりの所得控除額",
  },

  // Country-specific dependent requirements
  "Help.DependentRequirements": {
    en: "Dependent Requirements",
    vi: "Yêu cầu về người phụ thuộc",
    ja: "扶養控除の要件",
  },
  "Help.DependentIncome": {
    en: "Income limits and other restrictions may apply",
    vi: "Có thể áp dụng giới hạn thu nhập và các hạn chế khác",
    ja: "所得制限やその他の制限が適用される場合があります",
  },

  // Help text for tax credits
  "Help.ChildTaxCredit": {
    en: "Credit for qualifying children under 17. Amount varies by income level and number of children.",
    vi: "Tín dụng thuế cho trẻ em dưới 17 tuổi. Số tiền thay đổi theo mức thu nhập và số lượng trẻ em.",
    ja: "17歳未満の扶養子女に対する税額控除。所得水準と子どもの数により控除額が異なります。",
  },
  "Help.RetirementSaving": {
    en: "Credit for contributions to qualified retirement accounts. Credit percentage based on income level.",
    vi: "Tín dụng thuế cho đóng góp vào tài khoản hưu trí. Phần trăm tín dụng dựa trên mức thu nhập.",
    ja: "適格退職金口座への拠出に対する税額控除。所得水準により控除率が異なります。",
  },
  "Help.CreditLimits": {
    en: "Tax credits may be limited based on income level and other factors",
    vi: "Tín dụng thuế có thể bị giới hạn dựa trên mức thu nhập và các yếu tố khác",
    ja: "税額控除は所得水準やその他の要因により制限される場合があります",
  },
  "Help.NonRefundableCredit": {
    en: "Non-refundable credits cannot reduce tax liability below zero",
    vi: "Tín dụng thuế không hoàn lại không thể giảm nghĩa vụ thuế xuống dưới 0",
    ja: "還付のない税額控除は納税額をゼロ以下にすることはできません",
  },

  // Existing translations
  "Tax.PersonalDeduction": {
    en: "Personal Deduction",
    vi: "Giảm trừ gia cảnh cá nhân",
    ja: "基礎控除",
  },
  "Tax.DependentDeduction": {
    en: "Dependent Deduction",
    vi: "Giảm trừ người phụ thuộc",
    ja: "扶養控除",
  },
  "Tax.CharitableDonation": {
    en: "Charitable Donations",
    vi: "Khoản đóng góp từ thiện",
    ja: "寄付金控除",
  },
  "Tax.EducationExpense": {
    en: "Education Expenses",
    vi: "Chi phí giáo dục",
    ja: "教育費控除",
  },
  "Tax.MedicalExpense": {
    en: "Medical Expenses",
    vi: "Chi phí y tế",
    ja: "医療費控除",
  },
  "Tax.MortgageInterest": {
    en: "Mortgage Interest",
    vi: "Lãi vay mua nhà",
    ja: "住宅ローン控除",
  },
  "Tax.ChildTaxCredit": {
    en: "Child Tax Credit",
    vi: "Giảm trừ thuế con cái",
    ja: "子育て支援控除",
  },
  "Tax.RetirementSaving": {
    en: "Retirement Savings Credit",
    vi: "Giảm trừ tiết kiệm hưu trí",
    ja: "年金控除",
  },

  // Tax Results
  "Results.Summary": {
    en: "Tax Calculation Summary",
    vi: "Tổng kết tính thuế",
    ja: "税金計算の概要",
  },
  "Results.Year": {
    en: "Estimated tax breakdown for tax year 2025",
    vi: "Ước tính chi tiết thuế cho năm 2025",
    ja: "2025年度の推定税金内訳",
  },
  "Results.NonResidentNote": {
    en: "(Non-Resident Rate Applied)",
    vi: "(Áp dụng thuế suất không cư trú)",
    ja: "(非居住者税率適用)",
  },
  "Results.GrossIncome": {
    en: "Gross Income",
    vi: "Thu nhập tổng",
    ja: "総収入",
  },
  "Results.TotalDeductions": {
    en: "Total Deductions",
    vi: "Tổng giảm trừ",
    ja: "控除総額",
  },
  "Results.TaxableIncome": {
    en: "Taxable Income",
    vi: "Thu nhập chịu thuế",
    ja: "課税所得",
  },
  "Results.TotalTax": {
    en: "Total Tax",
    vi: "Tổng thuế",
    ja: "税金総額",
  },
  "Results.EffectiveTaxRate": {
    en: "Effective Tax Rate",
    vi: "Thuế suất thực tế",
    ja: "実効税率",
  },
  "Results.NetIncome": {
    en: "Net Income",
    vi: "Thu nhập ròng",
    ja: "手取り収入",
  },
  "Results.FederalTax": {
    en: "Federal Tax",
    vi: "Thuế liên bang",
    ja: "国税",
  },
  "Results.StateTax": {
    en: "State Tax",
    vi: "Thuế tiểu bang",
    ja: "州税",
  },

  // Tooltips
  "Tooltip.GrossIncome": {
    en: "Total income before any deductions or taxes",
    vi: "Thu nhập trước khi trừ các khoản giảm trừ và thuế",
    ja: "控除や税金を差し引く前の総収入",
  },
  "Tooltip.TotalDeductions": {
    en: "Sum of all deductions including standard deduction, itemized deductions, and family deductions",
    vi: "Tổng các khoản giảm trừ bao gồm giảm trừ chuẩn, giảm trừ chi tiết và giảm trừ gia đình",
    ja: "基礎控除、項目別控除、家族控除を含む控除総額",
  },
  "Tooltip.NonResidentDeductions": {
    en: "Non-residents generally cannot claim deductions",
    vi: "Người không cư trú thường không được áp dụng các khoản giảm trừ",
    ja: "非居住者は通常、控除を申請できません",
  },
  "Tooltip.TaxableIncome": {
    en: "Income subject to tax after all deductions",
    vi: "Thu nhập chịu thuế sau khi trừ các khoản giảm trừ",
    ja: "すべての控除後の課税対象所得",
  },
  "Tooltip.TotalTaxResident": {
    en: "Total tax calculated based on tax brackets and credits",
    vi: "Tổng thuế được tính dựa trên các bậc thuế và tín dụng thuế",
    ja: "税率区分と税額控除に基づいて計算された総税額",
  },
  "Tooltip.TotalTaxNonResident": {
    en: "Flat rate of {rate}% applied to gross income",
    vi: "Áp dụng thuế suất cố định {rate}% trên thu nhập tổng",
    ja: "総収入に{rate}%の固定税率を適用",
  },
  "Tooltip.EffectiveTaxRate": {
    en: "Total tax as a percentage of gross income",
    vi: "Tỷ lệ phần trăm thuế trên thu nhập tổng",
    ja: "総収入に対する税金の割合",
  },

  // Additional Results Labels
  "Results.OfGrossIncome": {
    en: "of gross income",
    vi: "của thu nhập tổng",
    ja: "総収入に対して",
  },
  "Results.BracketsTitle": {
    en: "Tax Brackets Breakdown",
    vi: "Chi tiết các bậc thuế",
    ja: "税率区分の内訳",
  },
  "Results.BracketsDescription": {
    en: "How your income is taxed at different rates",
    vi: "Cách tính thuế theo từng mức thu nhập",
    ja: "所得に応じた税率の適用方法",
  },
  "Results.BracketsCaption": {
    en: "Tax calculation by income brackets",
    vi: "Tính thuế theo bậc thu nhập",
    ja: "所得区分ごとの税額計算",
  },
  "Results.DeductionsCreditsTitle": {
    en: "Deductions and Credits",
    vi: "Giảm trừ và Tín dụng thuế",
    ja: "所得控除と税額控除",
  },
  "Results.DeductionsCreditsDescription": {
    en: "Applied deductions and tax credits",
    vi: "Các khoản giảm trừ và tín dụng thuế đã áp dụng",
    ja: "適用された控除額",
  },
  "Results.InsuranceContributionsTitle": {
    en: "Insurance Contributions",
    vi: "Đóng góp bảo hiểm",
    ja: "保険料負担",
  },
  "Results.InsuranceContributionsDescription": {
    en: "Mandatory social security and insurance contributions",
    vi: "Các khoản đóng góp bảo hiểm xã hội bắt buộc",
    ja: "必須の社会保険料負担",
  },
  "Results.FamilyDeductionsTitle": {
    en: "Family Deductions",
    vi: "Giảm trừ gia cảnh",
    ja: "扶養控除",
  },
  "Results.FamilyDeductionsDescription": {
    en: "Personal and dependent deductions",
    vi: "Giảm trừ cá nhân và người phụ thuộc",
    ja: "基礎控除と扶養控除",
  },
  "Results.StateTaxTitle": {
    en: "State Tax Breakdown",
    vi: "Chi tiết thuế tiểu bang",
    ja: "州税の内訳",
  },
  "Results.StateTaxDescription": {
    en: "State tax calculation by income brackets",
    vi: "Tính thuế tiểu bang theo bậc thu nhập",
    ja: "州税の所得区分計算",
  },
  "Results.NonResidentTitle": {
    en: "Non-Resident Tax Information",
    vi: "Thông tin thuế người không cư trú",
    ja: "非居住者の課税情報",
  },
  "Results.NonResidentDescription": {
    en: "Special tax rules apply for non-residents",
    vi: "Áp dụng quy định thuế đặc biệt cho người không cư trú",
    ja: "非居住者には特別な税率が適用されます",
  },
  "Results.NonResidentFlatRate": {
    en: "As a non-resident, a flat tax rate of {rate}% is applied to your income. Most deductions and credits are not available for non-residents.",
    vi: "Là người không cư trú, mức thuế cố định {rate}% được áp dụng cho thu nhập của bạn. Hầu hết các khoản giảm trừ và tín dụng thuế không khả dụng cho người không cư trú.",
    ja: "非居住者の場合、{rate}%の固定税率が適用されます。ほとんどの控除は非居住者には適用されません。",
  },
  "Results.Type": {
    en: "Type",
    vi: "Loại",
    ja: "種類",
  },
  "Results.Details": {
    en: "Details",
    vi: "Chi tiết",
    ja: "詳細",
  },
  "Results.Amount": {
    en: "Amount",
    vi: "Số tiền",
    ja: "金額",
  },
  "Results.TaxRate": {
    en: "Tax Rate",
    vi: "Thuế suất",
    ja: "税率",
  },
  "Results.TaxableAmount": {
    en: "Taxable Amount",
    vi: "Thu nhập tính thuế",
    ja: "課税対象額",
  },
  "Results.Tax": {
    en: "Tax",
    vi: "Thuế",
    ja: "税額",
  },
  "Results.Dependents": {
    en: "dependents",
    vi: "người phụ thuộc",
    ja: "扶養家族",
  },
  "Results.BasicPersonalAmount": {
    en: "Basic personal amount",
    vi: "Mức giảm trừ cá nhân cơ bản",
    ja: "基礎控除額",
  },

  // Accessibility Labels
  "Results.ChartAriaLabel": {
    en: "Tax breakdown pie chart",
    vi: "Biểu đồ tròn phân tích thuế",
    ja: "税金内訳の円グラフ",
  },
  "Results.HelpAriaLabel": {
    en: "Help about {label}",
    vi: "Trợ giúp về {label}",
    ja: "{label}についてのヘルプ",
  },
  "Results.BracketsAriaLabel": {
    en: "Tax brackets breakdown",
    vi: "Chi tiết các bậc thuế",
    ja: "税率区分の詳細",
  },
  "Results.DeductionsCreditsAriaLabel": {
    en: "Deductions and credits breakdown",
    vi: "Chi tiết giảm trừ và tín dụng thuế",
    ja: "控除額の詳細",
  },
  "Results.InsuranceContributionsAriaLabel": {
    en: "Insurance contributions breakdown",
    vi: "Chi tiết đóng góp bảo hiểm",
    ja: "保険料負担の詳細",
  },
  "Results.FamilyDeductionsAriaLabel": {
    en: "Family deductions breakdown",
    vi: "Chi tiết giảm trừ gia cảnh",
    ja: "扶養控除の詳細",
  },
  "Results.StateTaxAriaLabel": {
    en: "State tax breakdown",
    vi: "Chi tiết thuế tiểu bang",
    ja: "州税の詳細",
  },
  "Results.NonResidentAriaLabel": {
    en: "Non-resident tax information",
    vi: "Thông tin thuế người không cư trú",
    ja: "非居住者の課税情報",
  },

  // Accessibility Labels for Tax Brackets
  "TaxRate.BracketAriaLabel": {
    en: "Tax bracket {index} of {total}",
    vi: "Bậc thuế {index} trong {total}",
    ja: "税率区分 {total}区分中の{index}番目",
  },
  "TaxRate.BracketButtonAriaLabel": {
    en: "View details for {rate}% tax bracket",
    vi: "Xem chi tiết cho bậc thuế {rate}%",
    ja: "税率{rate}%の詳細を表示",
  },
  "TaxRate.NavigationInstructions": {
    en: "Use arrow keys to navigate between tax brackets, Home to go to first bracket, End to go to last bracket",
    vi: "Sử dụng phím mũi tên để di chuyển giữa các bậc thuế, Home để đến bậc đầu tiên, End để đến bậc cuối cùng",
    ja: "矢印キーで税率区分を移動、Homeキーで最初の区分へ、Endキーで最後の区分へ移動",
  },

  // Tax Rate Dialog
  "TaxRate.Title": {
    en: "Tax Rate Details",
    vi: "Chi tiết thuế suất",
    ja: "税率の詳細",
  },
  "TaxRate.Description": {
    en: "This tax rate applies only to income within this bracket",
    vi: "Thuế suất này chỉ áp dụng cho thu nhập trong bậc này",
    ja: "この税率は、この所得区分内の所得にのみ適用されます",
  },
  "TaxRate.From": {
    en: "From",
    vi: "Từ",
    ja: "開始",
  },
  "TaxRate.To": {
    en: "To",
    vi: "Đến",
    ja: "終了",
  },
  "TaxRate.NoLimit": {
    en: "No limit",
    vi: "Không giới hạn",
    ja: "上限なし",
  },
  "TaxRate.MaxTax": {
    en: "Maximum tax in bracket",
    vi: "Thuế tối đa trong bậc",
    ja: "所得区分内の最大税額",
  },
  "TaxRate.Unlimited": {
    en: "Unlimited",
    vi: "Không giới hạn",
    ja: "制限なし",
  },
  "TaxRate.MarginalNote": {
    en: "Note: This is a marginal tax rate. You only pay this rate on income within this bracket, not on all your income.",
    vi: "Lưu ý: Đây là thuế suất biên. Bạn chỉ trả mức này cho thu nhập trong bậc này, không phải toàn bộ thu nhập.",
    ja: "注意：これは限界税率です。この税率は、この所得区分内の所得にのみ適用され、全所得に適用されるわけではありません。",
  },

  // Non-Resident Tax Information
  "NonResident.TaxRateTitle": {
    en: "Non-Resident Tax Rate",
    vi: "Thuế suất người không cư trú",
    ja: "非居住者税率",
  },
  "NonResident.TaxRateDescription": {
    en: "As a non-resident in {country}, your income is taxed at a flat rate of {rate}%",
    vi: "Là người không cư trú tại {country}, thu nhập của bạn chịu thuế suất cố định {rate}%",
    ja: "{country}の非居住者として、あなたの所得には{rate}%の固定税率が適用されます",
  },
  "NonResident.LimitationsNote": {
    en: "Most tax deductions and credits are not available to non-residents",
    vi: "Hầu hết các khoản giảm trừ và tín dụng thuế không áp dụng cho người không cư trú",
    ja: "非居住者には大半の所得控除や税額控除が適用されません",
  },
  "NonResident.TreatyNote": {
    en: "Tax rates may be affected by tax treaties between countries",
    vi: "Thuế suất có thể thay đổi theo hiệp định thuế giữa các quốc gia",
    ja: "税率は租税条約により異なる場合があります",
  },
  "NonResident.TaxRateButtonAriaLabel": {
    en: "View details about {rate}% non-resident tax rate",
    vi: "Xem chi tiết về thuế suất {rate}% cho người không cư trú",
    ja: "非居住者税率{rate}%の詳細を表示",
  },

  // Error Messages
  "Error.CalculationTitle": {
    en: "Tax Calculation Error",
    vi: "Lỗi Tính Thuế",
    ja: "税額計算エラー",
  },
  "Error.CalculationDescription": {
    en: "Sorry, there was an error calculating your taxes. Please try again or adjust your input values.",
    vi: "Xin lỗi, đã xảy ra lỗi khi tính thuế. Vui lòng thử lại hoặc điều chỉnh giá trị đầu vào.",
    ja: "申し訳ありません。税額の計算中にエラーが発生しました。入力値を確認して再試行してください。",
  },
  "Error.RetryButton": {
    en: "Try Again",
    vi: "Thử Lại",
    ja: "再試行",
  },

  // FAQ Translations
  "FAQ.Title": {
    en: "Frequently Asked Questions",
    vi: "Câu hỏi thường gặp",
    ja: "よくある質問",
  },
  "FAQ.StandardDeduction.Question": {
    en: "What is the standard deduction for my filing status?",
    vi: "Mức giảm trừ chuẩn cho tình trạng khai thuế của tôi là bao nhiêu?",
    ja: "私の申告区分における基礎控除額はいくらですか？",
  },
  "FAQ.StandardDeduction.US": {
    en: "For 2025: Single - $14,600, Married - $29,200, Head of Household - $21,900",
    vi: "Năm 2025: Độc thân - $14,600, Đã kết hôn - $29,200, Chủ hộ - $21,900",
    ja: "2025年: 独身 - $14,600, 既婚 - $29,200, 世帯主 - $21,900",
  },
  "FAQ.StandardDeduction.VN": {
    en: "Personal deduction of VND 11M per month for residents",
    vi: "Giảm trừ gia cảnh 11 triệu đồng/tháng cho người cư trú",
    ja: "居住者に対して月額1100万ドンの基礎控除",
  },
  "FAQ.DependentQualification.Question": {
    en: "Who qualifies as a dependent?",
    vi: "Ai đủ điều kiện là người phụ thuộc?",
    ja: "扶養控除の対象となるのは誰ですか？",
  },
  "FAQ.DependentQualification.US": {
    en: "Children under 19 (24 if student), permanently disabled individuals, and qualifying relatives who meet income and support tests.",
    vi: "Trẻ em dưới 19 tuổi (24 nếu là sinh viên), người khuyết tật vĩnh viễn, và người thân đủ điều kiện đáp ứng các yêu cầu về thu nhập và hỗ trợ.",
    ja: "19歳未満の子供（学生の場合24歳未満）、永久障害者、所得要件と扶養要件を満たす親族。",
  },
  "FAQ.DependentQualification.VN": {
    en: "Children under 18, elderly parents, disabled relatives. Monthly income must not exceed VND 1M.",
    vi: "Con dưới 18 tuổi, cha mẹ già, người thân khuyết tật. Thu nhập hàng tháng không vượt quá 1 triệu đồng.",
    ja: "18歳未満の子供、高齢の親、障害のある親族。月収100万ドン以下。",
  },
  "FAQ.TaxCredits.Question": {
    en: "How do tax credits work?",
    vi: "Tín dụng thuế hoạt động như thế nào?",
    ja: "税額控除はどのように機能しますか？",
  },
  "FAQ.TaxCredits.US": {
    en: "Tax credits directly reduce your tax liability. Child Tax Credit and Retirement Savings Credit are common examples.",
    vi: "Tín dụng thuế trực tiếp giảm nghĩa vụ thuế. Ví dụ phổ biến là Tín dụng thuế trẻ em và Tín dụng tiết kiệm hưu trí.",
    ja: "税額控除は税額を直接減額します。子育て支援控除や退職金口座控除が代表的です。",
  },
  "FAQ.ItemizedDeductions.Question": {
    en: "Should I itemize my deductions?",
    vi: "Tôi có nên kê khai giảm trừ chi tiết không?",
    ja: "項目別控除を使用すべきですか？",
  },
  "FAQ.ItemizedDeductions.Answer": {
    en: "Itemize if your total deductions exceed the standard deduction. Common itemized deductions include charitable donations, medical expenses, and mortgage interest.",
    vi: "Kê khai chi tiết nếu tổng giảm trừ vượt quá mức giảm trừ chuẩn. Các khoản giảm trừ phổ biến bao gồm đóng góp từ thiện, chi phí y tế và lãi vay mua nhà.",
    ja: "項目別控除の合計額が基礎控除額を超える場合に使用します。一般的な項目別控除には、寄付金、医療費、住宅ローン利子が含まれます。",
  },
  "FAQ.NonResidentRules.Question": {
    en: "What are the special rules for non-residents?",
    vi: "Có quy định đặc biệt nào cho người không cư trú?",
    ja: "非居住者に適用される特別な規則は何ですか？",
  },
  "FAQ.NonResidentRules.Answer": {
    en: "Non-residents are typically subject to flat tax rates and have limited access to deductions and credits. Income is generally taxed at source.",
    vi: "Người không cư trú thường chịu thuế suất cố định và hạn chế tiếp cận các khoản giảm trừ và tín dụng thuế. Thu nhập thường bị đánh thuế tại nguồn.",
    ja: "非居住者は通常、定率の税率が適用され、控除の利用が制限されます。所得は一般的に源泉徴収されます。",
  },
};

export function getTranslation(key: string, language: Language): string {
  return translations[key]?.[language] || key;
}

export const countryToLanguage: Record<string, Language> = {
  US: "en",
  UK: "en",
  CA: "en",
  VN: "vi",
  JP: "ja",
  KR: "en",
  SG: "en",
};

export const defaultDeductionTypes = [
  "Tax.CharitableDonation",
  "Tax.EducationExpense",
  "Tax.MedicalExpense",
  "Tax.MortgageInterest",
];

export const defaultCreditTypes = [
  "Tax.ChildTaxCredit",
  "Tax.RetirementSaving",
];
