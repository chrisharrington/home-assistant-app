import Color from 'color';

const background = Color('#0d131f'),
    background2 = background.lighten(0.6),
    primary = Color('#f7cd25');

export default {
    primary,
    secondary: Color('#ff5f00'),
    text1: Color('#ffffff'),
    text2: primary,
    text3: Color('#747677'),
    textPositive: Color('#32a852'),
    textNegative: Color('red'),
    error: Color('#fd413c'),
    success: Color('#35bd18'),
    background1: Color('#0d131f'),
    background2,
    background3: Color('black'),
    button1: Color('#fde033'),
    button2: Color('#fcac13'),
    button3: Color('#1e2948')
}