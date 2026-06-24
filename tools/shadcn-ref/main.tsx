import { createRoot } from 'react-dom/client';
import { App } from './App';
import { BarApp } from './BarApp';
import { LineApp } from './LineApp';
import { PieApp } from './PieApp';
import { RadialApp } from './RadialApp';
import { RadarApp } from './RadarApp';

if (new URLSearchParams(location.search).get('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

const type = new URLSearchParams(location.search).get('type');
const Root =
  type === 'bar'
    ? BarApp
    : type === 'line'
      ? LineApp
      : type === 'pie'
        ? PieApp
        : type === 'radial'
          ? RadialApp
          : type === 'radar'
            ? RadarApp
            : App;

createRoot(document.getElementById('root')!).render(<Root />);
