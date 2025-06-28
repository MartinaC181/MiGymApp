import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import theme from '../constants/theme';
import globalStyles from '../styles/global';

interface BirthDateWheelProps {
  isVisible: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
  initialDate?: Date | null;
}

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const CENTER_INDEX = Math.floor(VISIBLE_ITEMS / 2); // 2

const monthsES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const WheelColumn = React.memo(
  ({ data, onChange, initialIndex, width }: { 
    data: string[]; 
    onChange: (idx: number) => void; 
    initialIndex: number;
    width: number;
  }) => {
    const listRef = useRef<FlatList>(null);
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    useEffect(() => {
      setSelectedIndex(initialIndex);
      onChange(initialIndex);
    }, [initialIndex]);

    useEffect(() => {
      if (listRef.current && data.length > 0) {
        // Scroll to position the initial item in the center
        const offset = initialIndex * ITEM_HEIGHT;
        setTimeout(() => {
          listRef.current?.scrollToOffset({ 
            offset: offset, 
            animated: false 
          });
        }, 50);
      }
    }, [initialIndex, data.length]);

    const handleScroll = (event: any) => {
      const offset = event.nativeEvent.contentOffset.y;
      const index = Math.round(offset / ITEM_HEIGHT);
      
      if (index >= 0 && index < data.length && index !== selectedIndex) {
        setSelectedIndex(index);
        onChange(index);
      }
    };

    const renderItem = ({ item, index }: { item: string; index: number }) => {
      const isSelected = index === selectedIndex;
      
      return (
        <View style={[styles.itemContainer, { width }]}>
          <Text style={[
            styles.itemText,
            isSelected && styles.selectedItemText
          ]}>
            {item}
          </Text>
        </View>
      );
    };

    return (
      <View style={[styles.columnContainer, { width }]}>
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item, index) => `${item}-${index}`}
          bounces={false}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          onMomentumScrollEnd={handleScroll}
          onScrollEndDrag={handleScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({ 
            length: ITEM_HEIGHT, 
            offset: ITEM_HEIGHT * index, 
            index 
          })}
          renderItem={renderItem}
          contentContainerStyle={{ 
            paddingTop: CENTER_INDEX * ITEM_HEIGHT,
            paddingBottom: CENTER_INDEX * ITEM_HEIGHT
          }}
        />
      </View>
    );
  }
);

export default function BirthDateWheel({ isVisible, onClose, onDateSelect, initialDate }: BirthDateWheelProps) {
  const initDate = initialDate || new Date();

  const [dayIdx, setDayIdx] = useState(initDate.getDate() - 1);
  const [monthIdx, setMonthIdx] = useState(initDate.getMonth());
  const [yearIdx, setYearIdx] = useState(() => {
    const currentYear = new Date().getFullYear();
    return currentYear - initDate.getFullYear();
  });

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const arr: string[] = [];
    for (let y = currentYear; y >= 1950; y--) {
      arr.push(String(y));
    }
    return arr;
  }, []);

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')), []);
  const months = monthsES;

  const formatSelectedDate = () => {
    const selectedYear = Number(years[yearIdx]);
    const selectedMonth = monthIdx;
    const selectedDay = Math.min(Number(days[dayIdx]), new Date(selectedYear, selectedMonth + 1, 0).getDate());
    
    return `${String(selectedDay).padStart(2, '0')}/${String(selectedMonth + 1).padStart(2, '0')}/${selectedYear}`;
  };

  const handleOk = () => {
    const selectedYear = Number(years[yearIdx]);
    const selectedMonth = monthIdx;
    const selectedDay = Math.min(Number(days[dayIdx]), new Date(selectedYear, selectedMonth + 1, 0).getDate());
    const date = new Date(selectedYear, selectedMonth, selectedDay);
    onDateSelect(date);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={globalStyles.modalOverlay}>
        <View style={styles.container}>
          <Text style={styles.header}>FECHA DE NACIMIENTO</Text>
          
          <Text style={styles.selectedDateDisplay}>
            {formatSelectedDate()}
          </Text>

          <View style={styles.wheelContainer}>
            {/* Líneas indicadoras */}
            <View style={styles.selectionIndicator}>
              <View style={styles.indicatorLine} />
              <View style={[styles.indicatorLine, { marginTop: ITEM_HEIGHT }]} />
            </View>
            
            <View style={styles.wheelRow}>
              <View style={styles.columnWrapper}>
                <Text style={styles.columnLabel}>Día</Text>
                <WheelColumn 
                  data={days} 
                  onChange={setDayIdx} 
                  initialIndex={dayIdx}
                  width={80}
                />
              </View>
              
              <View style={styles.columnWrapper}>
                <Text style={styles.columnLabel}>Mes</Text>
                <WheelColumn 
                  data={months} 
                  onChange={setMonthIdx} 
                  initialIndex={monthIdx}
                  width={80}
                />
              </View>
              
              <View style={styles.columnWrapper}>
                <Text style={styles.columnLabel}>Año</Text>
                <WheelColumn 
                  data={years} 
                  onChange={setYearIdx} 
                  initialIndex={yearIdx}
                  width={80}
                />
              </View>
            </View>
          </View>

          <View style={globalStyles.modalButtons}>
            <TouchableOpacity style={globalStyles.modalButtonSecondary} onPress={handleCancel}>
              <Text style={globalStyles.modalButtonSecondaryText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={globalStyles.modalButtonPrimary} onPress={handleOk}>
              <Text style={globalStyles.modalButtonPrimaryText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    minWidth: '90%',
    maxWidth: '95%',
    padding: theme.spacing.lg,
  },
  header: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  selectedDateDisplay: {
    fontSize: theme.typography.fontSize.title,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: '#F0F8FF',
    borderRadius: theme.borderRadius.md,
  },
  wheelContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
    marginBottom: theme.spacing.md,
  },
  selectionIndicator: {
    position: 'absolute',
    top: CENTER_INDEX * ITEM_HEIGHT, // Exactly at the center
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    zIndex: 10,
    justifyContent: 'space-between',
    pointerEvents: 'none',
  },
  indicatorLine: {
    height: 2,
    backgroundColor: theme.colors.primary,
    marginHorizontal: theme.spacing.sm,
    borderRadius: 1,
    opacity: 0.8,
  },
  wheelRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: '100%',
  },
  columnWrapper: {
    alignItems: 'center',
  },
  columnLabel: {
    fontSize: theme.typography.fontSize.small,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  columnContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: theme.typography.fontSize.medium,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    opacity: 0.6,
    textAlign: 'center',
  },
  selectedItemText: {
    fontSize: theme.typography.fontSize.large + 2,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary,
    opacity: 1,
    textAlign: 'center',
  },
}); 