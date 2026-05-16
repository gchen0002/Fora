import { Show } from "@clerk/react";

import { DailyStackScreen } from "@/daily-stack/DailyStackScreen";
import { LandingPage } from "@/landing/LandingPage";

function App() {
  return (
    <>
      <Show when="signed-out">
        <LandingPage />
      </Show>
      <Show when="signed-in">
        <DailyStackScreen />
      </Show>
    </>
  );
}

export default App;
