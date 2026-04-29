export interface ColorPalette {
  primary: string[]
  secondary: string[]
  success: string[]
  warning: string[]
  error: string[]
  neutral: string[]
}

export interface Typography {
  fontFamily: string
  fontSizeBase: string
}

export interface Spacing {
  unit: number
}

export interface ComponentTheme {
  borderRadius: string
}

export interface ThemeConfig {
  name: string
  colors: ColorPalette
  typography: Typography
  spacing: Spacing
  components: ComponentTheme
}
