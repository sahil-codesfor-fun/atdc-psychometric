import LayoutWrapper from "@/components/wrapper/LayoutWrapper";

export const metadata = {
  title: "ATDC Psychometric Portal",
  description: "Official Psychometric, Behavioral & Career Assessment Framework by Advanced Training & Development Consultant (ATDC).",
  icons: {
    icon: "/logo.jpeg",
    shortcut: "/logo.jpeg",
    apple: "/logo.jpeg",
  },
};

export default function MainLayout({ children }) {
  return (
    <LayoutWrapper>
      {children}
    </LayoutWrapper>
  );
}

