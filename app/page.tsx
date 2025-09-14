import { Header } from "@/components/main-header";
import { ContributorsButton } from "@/components/contributors-button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <ContributorsButton />
    </div>
  );
}
