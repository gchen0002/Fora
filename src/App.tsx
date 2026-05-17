import { BrowserRouter, Routes, Route } from "react-router-dom";
import { VariationFive } from "@/components/variations/VariationFive";
import { VariationOne } from "@/components/variations/VariationOne";
import { FeedOne } from "@/components/feeds/FeedOne";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<VariationFive />} />
        <Route path="/1" element={<VariationOne />} />
        <Route path="/feed" element={<FeedOne />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
