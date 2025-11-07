"use client";

import Lottie from "lottie-react";

interface LottieAnimationProps {

    animationData: any;
    className?: string;
}

export function LottieAnimation({
    animationData,
    className,
}: LottieAnimationProps) {
    return (
        <Lottie
            // And we use the animationData prop here
            animationData={animationData}
            loop={true}
            autoplay={true}
            className={className}
        />
    );
}