import { useCallback, useEffect, useState } from "react";

/**
 * Hook genérico de listado. Sirve tanto para endpoints paginados
 * (devuelven {data, meta:{page, per_page, total}}) como para endpoints
 * que devuelven un array plano (planes, servicios): en ese caso
 * `meta` queda null y la paginación se desactiva en la UI.
 *
 * @param {(params) => Promise<{data, meta}>} fetchFn
 * @param {object} params - se re-ejecuta el fetch cuando cambian sus valores
 */
export function usePaginatedResource(fetchFn, params) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [reloadTick, setReloadTick] = useState(0);

  const reload = useCallback(() => setReloadTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    fetchFn(params)
      .then((res) => {
        if (cancelled) return;
        setRows(
          Array.isArray(res.data) ? res.data : res.data ? [res.data] : [],
        );
        setMeta(res.meta ?? null);
        setStatus("success");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.friendlyMessage || "No se pudo cargar la información.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params), reloadTick]);

  return { rows, meta, status, error, reload, isLoading: status === "loading" };
}
