import { Show } from "@clerk/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { VariationFive } from "@/components/variations/VariationFive";
import { DailyStackScreen } from "@/daily-stack/DailyStackScreen";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariationFive />} />
        <Route
          path="/feed"
          element={
            <>
              <Show when="signed-out">
                <VariationFive />
              </Show>
              <Show when="signed-in">
                <DailyStackScreen />
              </Show>
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
