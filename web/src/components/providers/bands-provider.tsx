import * as React from "react";

import { useAuth } from "@/components/providers/auth-provider";
import {
  createBandBandsPost,
  deleteBandBandsBandIdDelete,
  getBandBandsBandIdGet,
  listBandsBandsGet,
  renameBandBandsBandIdRenamePatch,
} from "@/lib/api/generated/bands-service";
import type { BandOut } from "@/lib/api/generated/model";
import { getErrorMessage } from "@/lib/bands";

type BandsContextValue = {
  bands: BandOut[];
  selectedBandId: string | null;
  selectedBand: BandOut | null;
  selectedBandDetails: BandOut | null;
  bandsLoading: boolean;
  detailsLoading: boolean;
  bandsError: string | null;
  selectedBandError: string | null;
  selectBand: (bandId: string | null) => void;
  refreshBands: () => Promise<void>;
  createBand: (name: string) => Promise<BandOut>;
  renameBand: (bandId: string, name: string) => Promise<BandOut>;
  deleteBand: (bandId: string) => Promise<void>;
};

const STORAGE_KEY = "wband:selected-band-id";

const defaultValue: BandsContextValue = {
  bands: [],
  selectedBandId: null,
  selectedBand: null,
  selectedBandDetails: null,
  bandsLoading: false,
  detailsLoading: false,
  bandsError: null,
  selectedBandError: null,
  selectBand: () => undefined,
  refreshBands: async () => undefined,
  createBand: async () => {
    throw new Error("BandsProvider is not mounted");
  },
  renameBand: async () => {
    throw new Error("BandsProvider is not mounted");
  },
  deleteBand: async () => undefined,
};

const BandsContext = React.createContext<BandsContextValue>(defaultValue);

function getStoredBandId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEY);
}

function pickSelectedBandId(
  requestedBandId: string | null,
  storedBandId: string | null,
  bands: BandOut[],
) {
  const availableIds = new Set(bands.map((band) => band.id));

  if (requestedBandId && availableIds.has(requestedBandId)) {
    return requestedBandId;
  }

  if (storedBandId && availableIds.has(storedBandId)) {
    return storedBandId;
  }

  return bands[0]?.id ?? null;
}

export function BandsProvider({ children }: React.PropsWithChildren) {
  const auth = useAuth();
  const [bands, setBands] = React.useState<BandOut[]>([]);
  const [selectedBandId, setSelectedBandId] = React.useState<string | null>(
    () => getStoredBandId(),
  );
  const [selectedBandDetails, setSelectedBandDetails] =
    React.useState<BandOut | null>(null);
  const [bandsLoading, setBandsLoading] = React.useState(false);
  const [detailsLoading, setDetailsLoading] = React.useState(false);
  const [bandsError, setBandsError] = React.useState<string | null>(null);
  const [selectedBandError, setSelectedBandError] = React.useState<
    string | null
  >(null);

  const selectedBand = React.useMemo(
    () => bands.find((band) => band.id === selectedBandId) ?? null,
    [bands, selectedBandId],
  );

  const refreshBands = React.useCallback(async () => {
    if (!auth.authenticated) {
      setBands([]);
      setSelectedBandId(null);
      setSelectedBandDetails(null);
      setBandsError(null);
      setSelectedBandError(null);
      return;
    }

    setBandsLoading(true);

    try {
      const response = await listBandsBandsGet({ limit: 200, offset: 0 });
      const nextSelectedBandId = pickSelectedBandId(
        selectedBandId,
        getStoredBandId(),
        response,
      );

      setBands(response);
      setBandsError(null);
      setSelectedBandId(nextSelectedBandId);
    } catch (error) {
      setBandsError(getErrorMessage(error));
    } finally {
      setBandsLoading(false);
    }
  }, [auth.authenticated, selectedBandId]);

  React.useEffect(() => {
    void refreshBands();
  }, [refreshBands]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (selectedBandId) {
      window.localStorage.setItem(STORAGE_KEY, selectedBandId);
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }, [selectedBandId]);

  React.useEffect(() => {
    if (!auth.authenticated || !selectedBandId) {
      setSelectedBandDetails(null);
      setSelectedBandError(null);
      setDetailsLoading(false);
      return;
    }

    let cancelled = false;
    const currentBandId = selectedBandId;

    async function loadSelectedBand() {
      setDetailsLoading(true);

      try {
        const response = await getBandBandsBandIdGet(currentBandId);

        if (cancelled) {
          return;
        }

        setSelectedBandDetails(response);
        setSelectedBandError(null);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setSelectedBandDetails(null);
        setSelectedBandError(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      }
    }

    void loadSelectedBand();

    return () => {
      cancelled = true;
    };
  }, [auth.authenticated, selectedBandId]);

  const createBand = React.useCallback(async (name: string) => {
    const response = await createBandBandsPost({ name });

    setBands((current) => [...current, response]);
    setSelectedBandId(response.id);
    setSelectedBandDetails(response);
    setBandsError(null);

    return response;
  }, []);

  const renameBand = React.useCallback(async (bandId: string, name: string) => {
    const response = await renameBandBandsBandIdRenamePatch(bandId, { name });

    setBands((current) =>
      current.map((band) => (band.id === bandId ? response : band)),
    );
    setSelectedBandDetails((current) =>
      current?.id === bandId ? response : current,
    );
    setBandsError(null);
    setSelectedBandError(null);

    return response;
  }, []);

  const deleteBand = React.useCallback(
    async (bandId: string) => {
      await deleteBandBandsBandIdDelete(bandId);

      const remainingBands = bands.filter((band) => band.id !== bandId);
      const nextSelectedBandId = pickSelectedBandId(
        selectedBandId === bandId ? null : selectedBandId,
        null,
        remainingBands,
      );

      setBands(remainingBands);
      setSelectedBandId(nextSelectedBandId);
      setSelectedBandDetails((current) =>
        current?.id === bandId ? null : current,
      );
      setBandsError(null);
      setSelectedBandError(null);
    },
    [bands, selectedBandId],
  );

  const value = React.useMemo<BandsContextValue>(
    () => ({
      bands,
      selectedBandId,
      selectedBand,
      selectedBandDetails,
      bandsLoading,
      detailsLoading,
      bandsError,
      selectedBandError,
      selectBand: setSelectedBandId,
      refreshBands,
      createBand,
      renameBand,
      deleteBand,
    }),
    [
      bands,
      selectedBandId,
      selectedBand,
      selectedBandDetails,
      bandsLoading,
      detailsLoading,
      bandsError,
      selectedBandError,
      refreshBands,
      createBand,
      renameBand,
      deleteBand,
    ],
  );

  return (
    <BandsContext.Provider value={value}>{children}</BandsContext.Provider>
  );
}

export function useBands() {
  return React.useContext(BandsContext);
}

