import { Show } from "@clerk/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { FeedOne } from "@/components/feeds/FeedOne";
import { VariationFive } from "@/components/variations/VariationFive";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/goal" element={<FeedRoute />} />
        <Route path="/stack" element={<FeedRoute />} />
        <Route path="/feed" element={<FeedRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

function HomeRoute() {
  return (
    <>
      <Show when="signed-out">
        <VariationFive />
      </Show>
      <Show when="signed-in">
        <FeedOne />
      </Show>
    </>
  );
}

function FeedRoute() {
  return (
    <>
      <Show when="signed-out">
        <VariationFive />
      </Show>
      <Show when="signed-in">
        <FeedOne />
      </Show>
    </>
  );
}

export default App;
