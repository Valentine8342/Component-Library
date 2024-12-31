import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, LinearGradient, Stop, Defs, ClipPath } from 'react-native-svg';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedProps,
  Easing,
  withRepeat,
  withSequence,
  useAnimatedStyle,
} from 'react-native-reanimated';

type LoadingIndicatorProps = {
  size?: number;
};

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const LoadingIndicatorSmile: React.FC<LoadingIndicatorProps> = ({ size = 150 }) => {
  const progress = useSharedValue(0);
  const rotationAngle = useSharedValue(0);
  const spinAngle = useSharedValue(0);
  const mouthWidth = useSharedValue(1);
  const waveOffset = useSharedValue(0);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    const duration = 5000;

    if (!loadingComplete) {
      waveOffset.value = withRepeat(
        withSequence(
          withTiming(20, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(-20, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }

    progress.value = withTiming(
      1,
      {
        duration,
        easing: Easing.linear,
      },
      () => {
        setLoadingComplete(true);
        
        waveOffset.value = 0;
        
        rotationAngle.value = withTiming(0, { duration: 300 });
        spinAngle.value = withTiming(360, { duration: 1000 });
        mouthWidth.value = withTiming(2, { duration: 1000 });
      }
    );

    const rotationLoop = () => {
      if (!loadingComplete) {
        rotationAngle.value = withRepeat(
          withSequence(
            withTiming(5, { duration: 300 }),
            withTiming(-5, { duration: 300 })
          ),
          -1,
          true
        );
      }
    };

    if (!loadingComplete && !isCancelled) {
      rotationLoop();
    }

    return () => {
      isCancelled = true;
    };
  }, [loadingComplete, progress, rotationAngle, spinAngle, mouthWidth, waveOffset]);

  const animatedProps = useAnimatedProps(() => {
    return {
      y: size * (1 - progress.value),
      height: size * progress.value,
    };
  });

  const animatedRotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotationAngle.value}deg` }
      ],
    };
  });

  const animatedSpinStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${spinAngle.value}deg` }
      ],
    };
  });

  const animatedMouthStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scaleX: mouthWidth.value }
      ]
    };
  });

  const animatedWavePath = useAnimatedProps(() => {
    const amplitude = loadingComplete ? 0 : 20;
    
    const path = `
      M0,${size * (1 - progress.value)} 
      Q${size * 0.25},${size * (1 - progress.value) + amplitude + waveOffset.value} 
        ${size * 0.5},${size * (1 - progress.value)} 
      T${size},${size * (1 - progress.value) + amplitude + waveOffset.value} 
      V${size} 
      H0 
      Z
    `;
    
    return { d: path };
  });

  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Animated.View
        style={[
          {
            width: size,
            height: size,
          },
          animatedRotationStyle,
          loadingComplete ? animatedSpinStyle : {},
        ]}
      >
        <AnimatedSvg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={[animatedRotationStyle, loadingComplete ? animatedSpinStyle : {}]}
        >
          <Defs>
            <LinearGradient
              id='background-gradient'
              x1='0%'
              y1='0%'
              x2='100%'
              y2='100%'
            >
              <Stop offset='0%' stopColor='#E0E0E0' />
              <Stop offset='100%' stopColor='#FFFFFF' />
            </LinearGradient>

            <LinearGradient
              id='liquid-gradient'
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <Stop offset='0%' stopColor='#FFD700' />
              <Stop offset='100%' stopColor='#FFA500' />
            </LinearGradient>

            <ClipPath id='smiley-circle-clip'>
              <Circle 
                cx={size / 2} 
                cy={size / 2} 
                r={size * 0.45} 
              />
            </ClipPath>
          </Defs>

          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={size * 0.45}
            fill='url(#background-gradient)'
          />

          <AnimatedPath
            animatedProps={animatedWavePath}
            fill='url(#liquid-gradient)'
            clipPath='url(#smiley-circle-clip)'
          />

          <AnimatedCircle
            cx={size * 0.35}
            cy={size * 0.4}
            r={size * 0.04}
            fill='black'
          />
          <AnimatedCircle
            cx={size * 0.35}
            cy={size * 0.4}
            r={size * 0.02}
            fill='white'
          />
          <AnimatedCircle
            cx={size * 0.65}
            cy={size * 0.4}
            r={size * 0.04}
            fill='black'
          />
          <AnimatedCircle
            cx={size * 0.65}
            cy={size * 0.4}
            r={size * 0.02}
            fill='white'
          />
          <AnimatedPath
            d={`M${size * 0.35},${size * 0.6} 
                Q${size / 2},${size * 0.75} 
                ${size * 0.65},${size * 0.6}`}
            fill='transparent'
            stroke='black'
            strokeWidth={size * 0.025}
            strokeLinecap='round'
            style={[
              {
                transform: [
                  { scaleY: 0.8 },
                  { translateY: size * 0.05 }
                ],
                transformOrigin: `${size / 2}px ${size * 0.6}px`
              }
            ]}
          />

          <AnimatedCircle
            cx={size * 0.35}
            cy={size * 0.4}
            r={size * 0.04}
            fill='black'
          />
          <AnimatedCircle
            cx={size * 0.33}
            cy={size * 0.38}
            r={size * 0.01}
            fill='white'
          />

          <AnimatedCircle
            cx={size * 0.65}
            cy={size * 0.4}
            r={size * 0.04}
            fill='black'
          />
          <AnimatedCircle
            cx={size * 0.63}
            cy={size * 0.38}
            r={size * 0.01}
            fill='white'
          />
        </AnimatedSvg>
      </Animated.View>
    </View>
  );
};

export default LoadingIndicatorSmile;