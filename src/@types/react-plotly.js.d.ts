declare module 'react-plotly.js' {
    import * as React from 'react';
    import Plotly from 'plotly.js';

    export interface PlotParams {
        data: Partial<Plotly.PlotData>[];
        layout?: Partial<Plotly.Layout>;
        config?: Partial<Plotly.Config>;
        frames?: Partial<Plotly.Frame>[];
        onInitialized?: (figure: Readonly<Plotly.Figure>, graphDiv: HTMLDivElement) => void;
        onUpdate?: (figure: Readonly<Plotly.Figure>, graphDiv: HTMLDivElement) => void;
        onPurge?: (graphDiv: HTMLDivElement) => void;
        onError?: (err: any) => void;
        style?: React.CSSProperties;
        className?: string;
        useResizeHandler?: boolean;
        debug?: boolean;
    }

    const Plot: React.FC<PlotParams>;
    export default Plot;
}
