import { useState } from "react";
import { useMTPManager } from "../../hooks/useMTPManager";

import { ClinicalInput } from "../clinical-ui/ClinicalInput";
import { ClinicalSelect } from "../clinical-ui/ClinicalSelect";
import { ClinicalButton } from "../clinical-ui/ClinicalButton";
import { ResultPanel } from "../clinical-ui/ResultPanel";
import { LoadingOverlay } from "../clinical-ui/LoadingOverlay";

export function MTPManager({ patientId }: { patientId: string }) {
  const { runMTP, result, loading } = useMTPManager();

  const [form, setForm] = useState({
    weight: 70,
    hb: 8,
    activeBleeding: false,
    trauma: false,
    obstetric: false,
    shock: "stable",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runMTP(form, patientId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Massive Transfusion Protocol (MTP)</h3>

      <ClinicalInput
        type="number"
        value={form.weight}
        onChange={(e) =>
          setForm({ ...form, weight: Number(e.target.value) })
        }
        placeholder="Weight (kg)"
      />

      <ClinicalInput
        type="number"
        value={form.hb}
        onChange={(e) =>
          setForm({ ...form, hb: Number(e.target.value) })
        }
        placeholder="Hb (g/dL)"
      />

      <ClinicalSelect
        value={form.shock}
        onChange={(e) =>
          setForm({ ...form, shock: e.target.value })
        }
      >
        <option value="stable">Stable</option>
        <option value="compensated">Compensated shock</option>
        <option value="decompensated">Decompensated shock</option>
      </ClinicalSelect>

      <label>
        <input
          type="checkbox"
          checked={form.activeBleeding}
          onChange={(e) =>
            setForm({ ...form, activeBleeding: e.target.checked })
          }
        />
        Active bleeding
      </label>

      <label>
        <input
          type="checkbox"
          checked={form.trauma}
          onChange={(e) =>
            setForm({ ...form, trauma: e.target.checked })
          }
        />
        Trauma
      </label>

      <label>
        <input
          type="checkbox"
          checked={form.obstetric}
          onChange={(e) =>
            setForm({ ...form, obstetric: e.target.checked })
          }
        />
        Obstetric
      </label>

      <ClinicalButton type="submit" disabled={loading}>
        Run MTP Protocol
      </ClinicalButton>

      {loading && <LoadingOverlay />}

      {result && (
        <ResultPanel>
          {typeof result === "string" ? (
            <p>{result}</p>
          ) : (
            <>
              <h4>{result.title}</h4>
          <p>{result.message}</p>

          <hr />

          <p>🩸 RBC: {result.rbcUnits} units</p>
          <p>🧪 FFP: {result.ffpUnits} units</p>
          <p>🟡 Platelets: {result.plateletUnits}</p>
          <p>❄ Cryoprecipitate: {result.cryoUnits}</p>
          </>
          )}
        </ResultPanel>
      )}
    </form>
  );
}