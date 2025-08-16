export type Theme = 'light' | 'dark' | 'system';

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.classList.toggle('dark', isDark);
  localStorage.setItem('sb:theme', theme);
}

export function initTheme() {
  const saved = (localStorage.getItem('sb:theme') as Theme) || 'system';
  applyTheme(saved);
  
  // OSテーマ変更にも追随
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = () => {
    const current = (localStorage.getItem('sb:theme') as Theme) || 'system';
    if (current === 'system') {
      applyTheme(current);
    }
  };
  
  if (mq.addEventListener) {
    mq.addEventListener('change', handleChange);
  } else {
    // Fallback for older browsers
    mq.addListener(handleChange);
  }
}

export function initBrightness() {
  const saved = localStorage.getItem('sb:bgdim');
  const value = saved ? parseFloat(saved) : 0.15;
  document.documentElement.style.setProperty('--bg-dim', value.toString());
}

export function setBrightness(value: number) {
  document.documentElement.style.setProperty('--bg-dim', value.toString());
  localStorage.setItem('sb:bgdim', value.toString());
}