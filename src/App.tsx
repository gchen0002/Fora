import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VariationFive } from "@/components/variations/VariationFive";
import { FeedOne } from "@/components/feeds/FeedOne";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariationFive />} />
        <Route path="/feed" element={<FeedOne />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
