declare module 'react-virtualized-auto-sizer' {
  export interface Size {
    height: number;
    width: number;
  }

  export interface AutoSizerProps {
    children: (size: Size) => React.ReactNode;
    className?: string;
    defaultHeight?: number;
    defaultWidth?: number;
    disableHeight?: boolean;
    disableWidth?: boolean;
    onResize?: (size: Size) => void;
    style?: React.CSSProperties;
  }

  export default function AutoSizer(props: AutoSizerProps): JSX.Element;
}