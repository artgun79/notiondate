
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings, Search, Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, RefreshCw, ExternalLink } from 'lucide-react';
import { getLiveWeather } from './services/weatherService';
import { WeatherData, Theme } from './types';

const ScoreBox: React.FC<{ 
  value: string | React.ReactNode; 
  animate?: boolean;
  textColor?: string;
  fontSize?: string;
  animationType?: 'roll' | 'blink';
}> = ({ 
  value, 
  animate = false, 
  textColor = "text-white", 
  fontSize = "text-xl",
  animationType = 'roll'
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (animate && prevValueRef.current !== value) {
      setIsAnimating(true);
      if (animationType === 'roll') {
        const timer = setTimeout(() => {
          setDisplayValue(value);
          setIsAnimating(false);
          prevValueRef.current = value;
        }, 400);
        return () => clearTimeout(timer);
      } else {
        setDisplayValue(value);
        const timer = setTimeout(() => {
          setIsAnimating(false);
          prevValueRef.current = value;
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      setDisplayValue(value);
      prevValueRef.current = value;
    }
  }, [value, animate, animationType]);

  return (
    <div className="relative flex items-center justify-center overflow-hidden h-auto">
      <div 
        className={`${textColor} font-serif-custom ${fontSize} font-bold transition-all duration-300 ease-in-out ${
          animationType === 'roll' && isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        } ${animationType === 'blink' && isAnimating ? 'opacity-30' : 'opacity-100'}`}
      >
        {displayValue}
      </div>
      {animationType === 'roll' && isAnimating && (
        <div className={`absolute inset-0 flex items-center justify-center ${textColor} font-serif-custom ${fontSize} font-bold -translate-y-full animate-[rollIn_0.4s_ease-in-out_forwards]`}>
          {value}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState('인천 서구');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const isHoliday = (date: Date) => {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const mmdd = `${m.toString().padStart(2, '0')}${d.toString().padStart(2, '0')}`;
    const fixedHolidays = ['0101', '0301', '0505', '0606', '0815', '1003', '1009', '1225'];
    const variableHolidays2025 = ['0127', '0128', '0129', '0130', '0505', '0506', '1005', '1006', '1007', '1008'];
    return fixedHolidays.includes(mmdd) || variableHolidays2025.includes(mmdd);
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = useCallback(async (loc: string) => {
    setIsLoadingWeather(true);
    try {
      const data = await getLiveWeather(loc);
      setWeather(data);
    } catch (err) { console.error(err); } finally { setIsLoadingWeather(false); }
  }, []);

  useEffect(() => {
    fetchWeather(location);
    const weatherTimer = setInterval(() => fetchWeather(location), 30 * 60 * 1000);
    return () => clearInterval(weatherTimer);
  }, [fetchWeather, location]);

  const yearFull = time.getFullYear().toString();
  const monthStr = (time.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = time.getDate().toString().padStart(2, '0');
  const weekdayIndex = time.getDay();
  const weekdayStr = weekdays[weekdayIndex];
  
  const isSun = weekdayIndex === 0;
  const isSat = weekdayIndex === 6;
  const isPublicHoliday = isHoliday(time);
  const standardTextColor = theme === Theme.DARK ? "text-[#E3E3E3]" : "text-[#37352F]";
  
  let weekdayColor = standardTextColor;
  if (isSun || isPublicHoliday) weekdayColor = "text-red-500";
  else if (isSat) weekdayColor = "text-blue-500";

  const hour12 = time.getHours() % 12 || 12;
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const ampm = time.getHours() >= 12 ? '오후' : '오전';
  const fullTimeStr = `${hour12}:${minutes}:${seconds}`;

  const getWeatherIcon = (condition: string) => {
    const c = condition.toLowerCase();
    if (c.includes('맑음') || c.includes('sun')) return <Sun className="w-8 h-8 text-yellow-400" />;
    if (c.includes('비') || c.includes('rain')) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (c.includes('눈') || c.includes('snow')) return <CloudSnow className="w-8 h-8 text-blue-100" />;
    if (c.includes('구름') || c.includes('흐림') || c.includes('cloud')) return <Cloud className="w-8 h-8 text-gray-400" />;
    return <Wind className="w-8 h-8 text-gray-300" />;
  };

  return (
    <div className={`w-full h-full min-h-screen flex items-center justify-center p-0 transition-colors duration-300 font-serif-custom ${theme === Theme.DARK ? 'bg-[#191919]' : 'bg-transparent'}`}>
      <style>{`
        @keyframes rollIn { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
      
      <div className={`relative w-full max-w-[200px] rounded-lg py-2 px-0 shadow-none border-none transition-all duration-300 text-center ${theme === Theme.DARK ? 'bg-[#2F2F2F]' : 'bg-gray-100'}`}>
        
        <div className="absolute top-1 right-1 flex items-center gap-0.5 opacity-0 hover:opacity-100 transition-opacity z-20">
          <button onClick={() => fetchWeather(location)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><RefreshCw size={8} /></button>
          <button onClick={() => setTheme(prev => prev === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)} className="p-1 rounded-full text-[8px]">{theme === Theme.LIGHT ? '🌙' : '☀️'}</button>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"><Settings size={8} /></button>
        </div>

        {isSettingsOpen && (
          <div className="absolute inset-0 z-30 p-2 flex flex-col bg-inherit rounded-lg">
            <button onClick={() => setIsSettingsOpen(false)} className="self-end text-[8px] text-gray-400 mb-1">닫기</button>
            <div className="flex gap-1">
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (fetchWeather(location), setIsSettingsOpen(false))} className="flex-1 px-1 py-0.5 text-[10px] border rounded bg-white dark:bg-gray-800 text-black dark:text-white" />
              <button onClick={() => { fetchWeather(location); setIsSettingsOpen(false); }} className="bg-blue-500 text-white px-1 py-0.5 rounded text-[10px]"><Search size={10} /></button>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-1">
          {/* Date Section: YYYY-MM-DD 요일 */}
          <div className="flex items-center justify-center h-8 w-full gap-0.5">
            <ScoreBox value={yearFull} textColor={standardTextColor} animationType="roll" fontSize="text-sm" />
            <div className="font-bold text-gray-400">-</div>
            <ScoreBox value={monthStr} textColor={standardTextColor} animationType="roll" fontSize="text-sm" />
            <div className="font-bold text-gray-400">-</div>
            <ScoreBox value={dayStr} textColor={standardTextColor} animationType="roll" fontSize="text-sm" />
            <div className="w-1" />
            <ScoreBox value={weekdayStr} textColor={weekdayColor} animationType="roll" fontSize="text-sm" />
          </div>

          <div className="w-[85%] h-[1px] bg-gray-200 dark:bg-gray-700" />

          {/* Time Section: 오전/오후 H:M:S */}
          <div className="flex items-center justify-center h-10 w-full gap-1.5">
             <ScoreBox value={ampm} textColor={standardTextColor} fontSize="text-[10px]" animationType="blink" />
             <ScoreBox value={fullTimeStr} textColor={standardTextColor} fontSize="text-xl" animationType="blink" animate={true} />
          </div>

          <div className="w-[85%] h-[1px] bg-gray-200 dark:bg-gray-700" />

          {/* Weather Section */}
          <div className="flex items-center justify-center h-10 w-full gap-3">
            <div className="flex flex-col items-center leading-none">
              <span className="text-[6px] uppercase font-bold text-gray-400">{location}</span>
              {weather ? (
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-base font-black">{Math.round(weather.temp)}°C</span>
                  <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 truncate max-w-[50px]">{weather.condition}</span>
                </div>
              ) : (
                <div className="animate-pulse w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
              )}
            </div>
            <div className="scale-75">
              {weather ? getWeatherIcon(weather.condition) : <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />}
            </div>
          </div>
        </div>

        {weather?.sources?.[0] && (
          <div className="mt-0.5 flex justify-center opacity-0 hover:opacity-10 transition-opacity">
            <a href={weather.sources[0].uri} target="_blank" rel="noopener" className="text-[4px] text-gray-400 flex items-center gap-0.5">
              <ExternalLink size={3} /> {weather.sources[0].title}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
