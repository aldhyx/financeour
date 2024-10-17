import { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  createContext,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

type ClosedCbHandler<T> = (val?: T) => void;
type SheetContext<T, R> = {
  showSheetAsync: (data?: T) => Promise<R>;
  showSheet: (data?: T) => void;
};

type InternalSheetContext<T, R> = {
  sheetData?: T;
  setSheetData: (data?: T) => void;
  closedCbRef: MutableRefObject<ClosedCbHandler<R> | null>;
  sheetRef: MutableRefObject<BottomSheetModal | null>;
};

/**
 * Factory function to create reusable sheet contexts.
 *
 * NOTE: Do not call this inside a react component, call it outside a react component.
 */
function createSheetContext<T, R>() {
  const SheetContext = createContext<SheetContext<T, R> | null>(null);
  const ISheetContext = createContext<InternalSheetContext<T, R> | null>(null);

  const useSheetContext = () => {
    const context = useContext(SheetContext);
    if (!context) {
      throw new Error(
        'useSheetContext must be used within the appropriate SheetProvider'
      );
    }
    return context;
  };

  const useInternalSheetContext = () => {
    const context = useContext(ISheetContext);
    if (!context) {
      throw new Error(
        'useInternalSheetContext must be used within the appropriate SheetProvider'
      );
    }
    return context;
  };

  const InternalSheetProvider = ({ children }: { children: ReactNode }) => {
    const closedCbRef = useRef<ClosedCbHandler<R> | null>(null);
    const sheetRef = useRef<BottomSheetModal | null>(null);
    const [sheetData, setSheetData] = useState<T>();

    return (
      <ISheetContext.Provider
        value={{
          closedCbRef,
          sheetRef,
          sheetData,
          setSheetData,
        }}
      >
        {children}
      </ISheetContext.Provider>
    );
  };

  const SheetProvider = ({ children }: { children: ReactNode }) => {
    const { closedCbRef, sheetRef, setSheetData } = useInternalSheetContext();

    const showSheetAsync: SheetContext<T, R>['showSheetAsync'] = useCallback(
      async (data) =>
        new Promise((resolve) => {
          setSheetData(data);
          sheetRef.current?.present(data);

          const closeCbHandler: ClosedCbHandler<R> = (v) => {
            resolve(v as R);
          };

          closedCbRef.current = closeCbHandler;
        }),
      [sheetRef, closedCbRef, setSheetData]
    );

    const showSheet: SheetContext<T, R>['showSheet'] = (data) => {
      sheetRef.current?.present(data);
    };

    return (
      <SheetContext.Provider value={{ showSheetAsync, showSheet }}>
        {children}
      </SheetContext.Provider>
    );
  };

  return {
    useSheetContext,
    useInternalSheetContext,
    InternalSheetProvider,
    SheetProvider,
  };
}

export { createSheetContext };
