// ./components/ClientComponent.tsx
"use client";
import { VoiceProvider } from "@humeai/voice-react";
import Messages from "@/app/Messages";
import Controls from "@/app/Controls";

export default function ClientComponent({
  accessToken,
}: {
  accessToken: string;
}) {
  return (
    <VoiceProvider auth={{ type: "accessToken", value: accessToken }}
    configId={"2b58f4a9-976e-4db7-a968-eb5b6a9f7fa2"}
    >
      <Messages />
      <div className="pt-20">
        <Controls />
      </div>
    </VoiceProvider>
  );
}
