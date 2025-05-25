interface LandingPageContextType {
  name: string;
  description: string;
  slogan: string;
  domain: string;
  title: string;
  version: string;
  copyrightTime: string;
  companyInformation: {
    name: string;
    address: string;
    phone: string;
    email: string;
    taxId?: string;
  };
}
