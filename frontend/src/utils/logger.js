// AudioPulse Structured Frontend Logger & Event Store

const logListeners = new Set();
let logHistory = [];

const logStyles = {
  auth: 'background: #6366f1; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  api: 'background: #06b6d4; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  theme: 'background: #f59e0b; color: #000; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  info: 'background: #10b981; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
  error: 'background: #ef4444; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
};

const addLog = (category, title, details = {}, status = 200) => {
  const entry = {
    id: Date.now() + Math.random().toString(36).substr(2, 4),
    timestamp: new Date().toLocaleTimeString(),
    category,
    title,
    details,
    status,
  };

  logHistory = [entry, ...logHistory].slice(0, 100); // Keep last 100 logs
  logListeners.forEach((listener) => listener(logHistory));
};

export const logger = {
  auth: (action, details = {}) => {
    console.log(`%c[Auth]`, logStyles.auth, action, details);
    addLog('AUTH', action, details, 200);
  },

  api: (method, url, status, data = {}) => {
    const color = status >= 400 ? '#ef4444' : '#10b981';
    console.log(
      `%c[API] %c${method} ${url} - ${status}`,
      logStyles.api,
      `color: ${color}; font-weight: bold;`,
      data
    );
    addLog('API', `${method} ${url}`, data, status);
  },

  theme: (newTheme) => {
    console.log(`%c[Theme]`, logStyles.theme, `Switched to ${newTheme} mode`);
    addLog('THEME', `Theme changed to ${newTheme}`, { theme: newTheme }, 200);
  },

  info: (msg, data = {}) => {
    console.log(`%c[Info]`, logStyles.info, msg, data);
    addLog('INFO', msg, data, 200);
  },

  error: (msg, error = {}) => {
    console.error(`%c[Error]`, logStyles.error, msg, error);
    addLog('ERROR', msg, error, 500);
  },

  getHistory: () => logHistory,

  subscribe: (callback) => {
    logListeners.add(callback);
    callback(logHistory);
    return () => logListeners.delete(callback);
  },

  clearHistory: () => {
    logHistory = [];
    logListeners.forEach((listener) => listener(logHistory));
  },
};
