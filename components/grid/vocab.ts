export const BINARY_GLYPHS = ["0", "1"];
export const MECHANICAL_VOCAB = ["Ra0.8", "Ø", "20g6", "±0.1", "ISO", "ČSN", "⟂", "⌖", "M6×1", "R3"];
export const ELECTRICAL_VOCAB = ["PWM", "ADC", "GND", "5V", "IO4", "PWR", "I2C", "SPI", "UART", "3.3V", "Hz", "Ω", "φ", "τ", "μ"];

// Two-glyph pools for the binary-style grids (mode="binary", matching
// SoftwareSection's 0/1 treatment) — diameter/perpendicularity for
// mechanical, plus/minus for electrical, X/Y for hero.
export const MECHANICAL_BINARY = ["Ø", "⟂"];
export const ELECTRICAL_BINARY = ["+", "-"];
export const HERO_BINARY = ["X", "Y"];
