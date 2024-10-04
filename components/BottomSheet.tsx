import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

type GBottomSheetProps = {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    children: React.ReactNode;
    setSheetIndex?: (index: number) => void;
};

const GBottomSheet = ({ visible, setVisible, children, setSheetIndex }: GBottomSheetProps) => {
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '60%'], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (setSheetIndex) {
      setSheetIndex(index);
    }

    if (index === -1) {
      setVisible(false);
    }

  }, []);

  useEffect(() => {
    visible ? bottomSheetModalRef.current?.present() : bottomSheetModalRef.current?.dismiss();
  } , [visible]);

  // renders
  return (
    <BottomSheetModalProvider>
      <View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          handleComponent={() => null}
          onChange={handleSheetChanges}
          overDragResistanceFactor={0}
        >
          <BottomSheetView style={styles.contentContainer}>
            {children}
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#151616',
    },
    contentContainer: {
      flex: 1,
    backgroundColor: '#151616',
  },
});

export default GBottomSheet;