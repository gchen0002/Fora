import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { VariationOne } from "@/components/variations/VariationOne";
import { VariationTwo } from "@/components/variations/VariationTwo";
import { VariationThree } from "@/components/variations/VariationThree";
import { VariationFour } from "@/components/variations/VariationFour";
import { VariationFive } from "@/components/variations/VariationFive";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/1" replace />} />
        <Route path="/1" element={<VariationOne />} />
        <Route path="/2" element={<VariationTwo />} />
        <Route path="/3" element={<VariationThree />} />
        <Route path="/4" element={<VariationFour />} />
        <Route path="/5" element={<VariationFive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
