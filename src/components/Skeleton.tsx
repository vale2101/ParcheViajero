import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { colors, radius, spacing } from '../styles/theme';

interface SkeletonProps {
  width: number | `${number}%`;
  height: number;
  radius?: number;
}

export function Skeleton({ width, height, radius: r = radius.sm }: SkeletonProps) {
  const opacidad = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacidad, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacidad, {
          toValue: 0.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacidad]);

  return (
    <Animated.View
      style={{
        width,
        height,
        borderRadius: r,
        backgroundColor: colors.beige,
        opacity: opacidad,
      }}
    />
  );
}

export function SkeletonText({
  width = '70%',
  height = 14,
}: {
  width?: SkeletonProps['width'];
  height?: number;
}) {
  return <Skeleton width={width} height={height} radius={6} />;
}

export function SkeletonAvatar({ size = 48 }) {
  return <Skeleton width={size} height={size} radius={size / 2} />;
}

export function SkeletonListItem() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
      <SkeletonAvatar size={56} />
      <View style={{ flex: 1, gap: spacing.sm }}>
        <SkeletonText width="80%" height={16} />
        <SkeletonText width="50%" height={12} />
      </View>
    </View>
  );
}

export function SkeletonCard({ alto = 220 }: { alto?: number }) {
  return (
    <View style={{ gap: spacing.md }}>
      <Skeleton width="100%" height={alto} radius={radius.lg} />
      <SkeletonText width="70%" height={18} />
      <SkeletonText width="40%" height={14} />
    </View>
  );
}

export function SkeletonStat() {
  return (
    <View
      style={{
        flexBasis: '45%',
        flexGrow: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        borderRadius: 18,
        padding: 14,
        minHeight: 74,
      }}>
      <Skeleton width={46} height={46} radius={14} />
      <View style={{ flex: 1, gap: spacing.sm }}>
        <SkeletonText width="40%" height={22} />
        <SkeletonText width="90%" height={12} />
      </View>
    </View>
  );
}
