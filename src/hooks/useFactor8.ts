import { useState, useCallback } from "react";
import {
  calculateFactor8,
  type Factor8Input,
  type Factor8Result,
} from "../domain/hematology/factor8.engine";

export function useFactor8() {
  const [result, setResult] = useState<Factor8Result | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = useCallback((input: Factor8Input) => {
    setLoading(true);

    const res = calculateFactor8(input);

    setResult(res);
    setLoading(false);
  }, []);

  return { result, loading, calculate };
}