import { useRef, useState } from 'react';
import {
  PanResponder,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';
import { utf8ToBase64 } from '@/lib/base64';

type Point = { x: number; y: number };

type Props = {
  onChange: (dataUri: string | null) => void;
};

function pointsToSvgPath(strokes: Point[][]): string {
  return strokes
    .map((stroke) => {
      if (stroke.length === 0) return '';
      const [first, ...rest] = stroke;
      return `M ${first.x} ${first.y} ${rest.map((p) => `L ${p.x} ${p.y}`).join(' ')}`;
    })
    .join(' ');
}

function toDataUri(strokes: Point[][]): string | null {
  if (strokes.every((s) => s.length === 0)) return null;
  const path = pointsToSvgPath(strokes);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><path d="${path}" stroke="#111" stroke-width="2" fill="none"/></svg>`;
  return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
}

export default function SignaturePad({ onChange }: Props) {
  const [strokes, setStrokes] = useState<Point[][]>([[]]);
  const strokesRef = useRef(strokes);
  strokesRef.current = strokes;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX: x, locationY: y } = evt.nativeEvent;
        const next = [...strokesRef.current, [{ x, y }]];
        strokesRef.current = next;
        setStrokes(next);
        onChange(toDataUri(next));
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX: x, locationY: y } = evt.nativeEvent;
        const current = strokesRef.current;
        const last = current[current.length - 1] ?? [];
        const next = [...current.slice(0, -1), [...last, { x, y }]];
        strokesRef.current = next;
        setStrokes(next);
        onChange(toDataUri(next));
      },
    }),
  ).current;

  function clear() {
    const empty: Point[][] = [[]];
    strokesRef.current = empty;
    setStrokes(empty);
    onChange(null);
  }

  const path = pointsToSvgPath(strokes);

  return (
    <View style={styles.wrap}>
      <View style={styles.pad} {...panResponder.panHandlers}>
        {path ? (
          <Text style={styles.hint}>Signatur registrert</Text>
        ) : (
          <Text style={styles.hint}>Signer med fingeren her</Text>
        )}
      </View>
      <Text style={styles.clear} onPress={clear}>
        Tøm signatur
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  pad: {
    height: 120,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: { color: '#64748b', fontSize: 14 },
  clear: { color: '#2563eb', fontSize: 14, textAlign: 'right' },
});
