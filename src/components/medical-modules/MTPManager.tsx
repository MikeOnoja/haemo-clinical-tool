import { useState } from "react";
import { useMTPManager } from "../../hooks/useMTPManager";

export function MTPManager({ patientId }: { patientId: string }) {
  const { runMTP, result, loading } = useMTPManager();

  const [form, setForm] = useState({
    weight: 70,
    activeBleeding: false,
    trauma: false,
    obstetric: false,
    hb: 8,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runMTP(form, patientId);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Massive Transfusion Protocol (MTP)</h3>

      <input
        type="number"
        value={form.weight}
        onChange={(e) =>
          setForm({ ...form, weight: Number(e.target.value) })
        }
        placeholder="Weight"
      />

      <input
        type="number"
        value={form.hb}
        onChange={(e) =>
          setForm({ ...form, hb: Number(e.target.value) })
        }
        placeholder="Hb"
      />

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

      <button type="submit" disabled={loading}>
        {loading ? "Processing..." : "Run MTP"}
      </button>

      {result && (
        <div style={{ marginTop: 16 }}>
          <h4>{result.pack}</h4>
          <p>{result.message}</p>
          <p>RBC: {result.rbcUnits}</p>
          <p>FFP: {result.ffpUnits}</p>
          <p>Platelets: {result.plateletUnits}</p>
          <p>Cryo: {result.cryoUnits}</p>
        </div>
      )}
    </form>
  );
}