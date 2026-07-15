import { notFound } from "next/navigation";
import { games } from "@/data/games";
import GameFrame from "@/components/GameFrame";
import SupportButton from "@/components/SupportButton";

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);
  if (!game) return {};
  return {
    title: game.title,
    description: game.description,
    openGraph: {
      title: game.title,
      description: game.description,
      images: [{ url: game.image, width: 1920, height: 1080 }],
    },
    twitter: {
      card: "summary_large_image",
      images: [game.image],
    },
  };
}

const gameComponents: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  "spend-a-billion": () => import("./spend-a-billion"),
  "old-web-explorer": () => import("./old-web-explorer"),
  "scale-shifter": () => import("./scale-shifter"),
  "ranker": () => import("./ranker"),
  "sandboxels": () => import("./sandboxels"),
};

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = games.find((g) => g.slug === slug);

  if (!game) notFound();

  const loadGame = gameComponents[slug];
  if (!loadGame) notFound();

  const GameModule = await loadGame();
  const GameContent = GameModule.default;

  return (
    <GameFrame title={game.title}>
      <GameContent />
      <div className="absolute bottom-4 right-4">
        <SupportButton />
      </div>
    </GameFrame>
  );
}
