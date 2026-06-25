import type { Metadata } from "next";
import { ChatBox } from "@/components/ChatBox";

export const metadata: Metadata = {
  title: "Assistant · NeoTravel",
  description:
    "Décrivez votre besoin en langage naturel. L'assistant qualifie la demande et interroge le moteur déterministe : devis chiffré, infos manquantes ou cas complexe.",
};

export default function ChatPage() {
  return <ChatBox />;
}
