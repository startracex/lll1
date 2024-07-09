const rgb = (...a) => a.join(" ");

type RGBValues<T = ReturnType<typeof rgb>> = [T, T, T, T, T, T, T, T, T, T];

const darkgray: RGBValues = [
  rgb(121, 121, 121),
  rgb(109, 109, 109),
  rgb(97, 97, 97),
  rgb(85, 85, 85),
  rgb(73, 73, 73),
  rgb(61, 61, 61),
  rgb(48, 48, 48),
  rgb(36, 36, 36),
  rgb(24, 24, 24),
  rgb(12, 12, 12),
];

const lightgray: RGBValues = [
  rgb(243, 243, 243),
  rgb(231, 231, 231),
  rgb(219, 219, 219),
  rgb(206, 206, 206),
  rgb(194, 194, 194),
  rgb(182, 182, 182),
  rgb(170, 170, 170),
  rgb(158, 158, 158),
  rgb(146, 146, 146),
  rgb(133, 133, 133),
];

const teal: RGBValues = [
  rgb(240, 253, 251),
  rgb(203, 252, 246),
  rgb(151, 248, 237),
  rgb(91, 237, 225),
  rgb(42, 215, 206),
  rgb(17, 187, 181),
  rgb(11, 150, 148),
  rgb(13, 120, 120),
  rgb(16, 94, 95),
  rgb(18, 79, 79),
];

const blue: RGBValues = [
  rgb(239, 249, 255),
  rgb(214, 244, 255),
  rgb(181, 238, 255),
  rgb(131, 230, 255),
  rgb(72, 213, 255),
  rgb(30, 184, 255),
  rgb(6, 156, 255),
  rgb(0, 136, 255),
  rgb(8, 103, 197),
  rgb(13, 89, 155),
];

const green: RGBValues = [
  rgb(233, 255, 228),
  rgb(204, 255, 196),
  rgb(158, 255, 144),
  rgb(95, 255, 80),
  rgb(41, 254, 29),
  rgb(7, 229, 0),
  rgb(0, 184, 0),
  rgb(0, 135, 0),
  rgb(7, 109, 8),
  rgb(11, 92, 13),
];

const red: RGBValues = [
  rgb(253, 243, 243),
  rgb(253, 231, 230),
  rgb(251, 208, 208),
  rgb(247, 172, 170),
  rgb(241, 124, 123),
  rgb(231, 76, 79),
  rgb(215, 57, 68),
  rgb(178, 30, 44),
  rgb(149, 28, 43),
  rgb(128, 27, 43),
];

const purple: RGBValues = [
  rgb(251, 245, 255),
  rgb(244, 233, 254),
  rgb(236, 215, 253),
  rgb(221, 183, 251),
  rgb(199, 137, 247),
  rgb(178, 92, 240),
  rgb(158, 58, 227),
  rgb(136, 41, 199),
  rgb(114, 38, 163),
  rgb(94, 32, 131),
];

const orange: RGBValues = [
  rgb(255, 252, 234),
  rgb(255, 245, 197),
  rgb(255, 235, 133),
  rgb(255, 218, 70),
  rgb(255, 199, 27),
  rgb(255, 165, 0),
  rgb(226, 124, 0),
  rgb(187, 85, 2),
  rgb(152, 66, 8),
  rgb(124, 54, 11),
];

const yellow: RGBValues = [
  rgb(252, 255, 231),
  rgb(246, 255, 193),
  rgb(241, 255, 134),
  rgb(242, 255, 65),
  rgb(250, 255, 13),
  rgb(255, 247, 0),
  rgb(209, 184, 0),
  rgb(166, 134, 2),
  rgb(137, 104, 10),
  rgb(116, 84, 15),
];

const pink: RGBValues = [
  rgb(255, 241, 244),
  rgb(255, 227, 234),
  rgb(255, 204, 219),
  rgb(255, 161, 189),
  rgb(255, 102, 150),
  rgb(249, 58, 123),
  rgb(231, 23, 104),
  rgb(195, 13, 88),
  rgb(163, 14, 80),
  rgb(139, 16, 75),
];

export const presetsRGB = {
  darkgray,
  lightgray,
  teal,
  blue,
  green,
  red,
  purple,
  orange,
  yellow,
  pink,
};
