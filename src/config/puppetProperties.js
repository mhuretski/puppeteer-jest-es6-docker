'use strict';
export const viewport = {
    width: 1200,
    height: 1080,
};

export const debugProps = {
    headless: false,
    slowMo: 150,
    args: [`--no-sandbox --window-size=${viewport.width},${viewport.height}`],
};

export const defaultProps = {args: ['--no-sandbox']};