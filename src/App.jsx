import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame, Utensils, Plus, Trash2, Search, Settings, Check, RefreshCw,
  Droplets, Info, Download, Bug, Sparkles, Globe, Database, Scale, PlusCircle
} from 'lucide-react';

// ============================================================================
// 1. VERIFIED ICMR-NIN (IFCT 2017) & USDA CORE LOCAL DATABASE (OFFLINE-FIRST)
// Macros are calibrated per 100g cooked/edible portion AND standard household unit
// ============================================================================
const IFCT_CORE_FOODS = [
  // Rotational High-Protein Vegetarian Staples (Non-Paneer/Non-Soya Daily Options)
  { id: 'ifct_moong_dal', name: 'Yellow Moong Dal Tadka (Cooked)', category: 'Dal & Legumes', unitName: '1 Katori (150g)', unitGrams: 150, per100g: { cal: 105, p: 6.8, c: 15.2, f: 1.8, fib: 3.4 }, veg: true },
  { id: 'ifct_masoor_dal', name: 'Whole Masoor Dal (Cooked)', category: 'Dal & Legumes', unitName: '1 Katori (150g)', unitGrams: 150, per100g: { cal: 114, p: 7.6, c: 16.8, f: 1.6, fib: 4.1 }, veg: true },
  { id: 'ifct_toor_dal', name: 'Arhar / Toor Dal (Cooked)', category: 'Dal & Legumes', unitName: '1 Katori (150g)', unitGrams: 150, per100g: { cal: 108, p: 6.4, c: 16.0, f: 2.0, fib: 3.1 }, veg: true },
  { id: 'ifct_rajma', name: 'Rajma Masala (Home Cooked)', category: 'Dal & Legumes', unitName: '1 Katori (160g)', unitGrams: 160, per100g: { cal: 128, p: 7.5, c: 18.5, f: 2.6, fib: 5.2 }, veg: true },
  { id: 'ifct_kala_chana', name: 'Kala Chana Masala (Dry/Semi-Gravy)', category: 'Dal & Legumes', unitName: '1 Katori (150g)', unitGrams: 150, per100g: { cal: 138, p: 8.2, c: 20.4, f: 2.5, fib: 6.1 }, veg: true },
  { id: 'ifct_chole', name: 'Kabuli Chana / Chole (Home Style)', category: 'Dal & Legumes', unitName: '1 Katori (160g)', unitGrams: 160, per100g: { cal: 142, p: 7.8, c: 21.0, f: 3.1, fib: 5.4 }, veg: true },
  { id: 'ifct_sprouts', name: 'Steamed Green Moong Sprouts Salad', category: 'High-Protein Snacks', unitName: '1 Bowl (120g)', unitGrams: 120, per100g: { cal: 74, p: 6.2, c: 11.4, f: 0.5, fib: 4.0 }, veg: true },
  { id: 'ifct_roasted_chana', name: 'Roasted Bengal Gram (Bhuna Chana)', category: 'High-Protein Snacks', unitName: '1 Handful (40g)', unitGrams: 40, per100g: { cal: 369, p: 22.5, c: 58.1, f: 5.2, fib: 11.8 }, veg: true },
  { id: 'ifct_sattu', name: 'Chana Sattu Flour (Unsweetened Drink)', category: 'High-Protein Snacks', unitName: '3 Tbsp (45g)', unitGrams: 45, per100g: { cal: 387, p: 20.6, c: 63.2, f: 5.6, fib: 10.5 }, veg: true },
  { id: 'ifct_besan_chilla', name: 'Besan Chilla with Veggies', category: 'Breakfast & Tiffin', unitName: '2 Medium Chillas (140g)', unitGrams: 140, per100g: { cal: 168, p: 9.2, c: 21.5, f: 5.0, fib: 4.2 }, veg: true },
  { id: 'ifct_moong_chilla', name: 'Moong Dal Chilla (Pesarattu)', category: 'Breakfast & Tiffin', unitName: '2 Medium Chillas (140g)', unitGrams: 140, per100g: { cal: 154, p: 10.1, c: 20.2, f: 3.8, fib: 3.9 }, veg: true },
  
  // Dairy & Plant Fats
  { id: 'ifct_dahi', name: 'Homemade Toned Milk Curd (Dahi)', category: 'Dairy & Alternatives', unitName: '1 Katori (150g)', unitGrams: 150, per100g: { cal: 62, p: 3.8, c: 4.6, f: 3.1, fib: 0 }, veg: true },
  { id: 'ifct_buttermilk', name: 'Spiced Chaas / Buttermilk', category: 'Dairy & Alternatives', unitName: '1 Glass (250ml)', unitGrams: 250, per100g: { cal: 29, p: 1.8, c: 2.4, f: 1.2, fib: 0 }, veg: true },
  { id: 'ifct_milk_toned', name: 'Toned Milk (Boiled, No Sugar)', category: 'Dairy & Alternatives', unitName: '1 Glass (250ml)', unitGrams: 250, per100g: { cal: 59, p: 3.3, c: 4.8, f: 3.0, fib: 0 }, veg: true },
  { id: 'ifct_peanuts', name: 'Roasted Peanuts / Groundnuts', category: 'High-Protein Snacks', unitName: '1 Small Bowl (30g)', unitGrams: 30, per100g: { cal: 567, p: 25.8, c: 16.1, f: 49.2, fib: 8.5 }, veg: true },
  { id: 'ifct_peanut_butter', name: 'Natural Unsweetened Peanut Butter', category: 'High-Protein Snacks', unitName: '1 Tbsp (16g)', unitGrams: 16, per100g: { cal: 588, p: 28.0, c: 18.0, f: 50.0, fib: 8.0 }, veg: true },

  // Occasional High-Protein Vegetarian (For 1-2x/week rotation)
  { id: 'ifct_paneer_raw', name: 'Low-Fat Cow Milk Paneer', category: 'Dairy & Alternatives', unitName: '1 Serving (80g)', unitGrams: 80, per100g: { cal: 215, p: 18.5, c: 3.2, f: 14.5, fib: 0 }, veg: true },
  { id: 'ifct_soya_chunks', name: 'Soya Chunks Bhurji (Dry Weight Basis)', category: 'Dal & Legumes', unitName: '1 Bowl Raw (40g)', unitGrams: 40, per100g: { cal: 345, p: 52.0, c: 33.0, f: 0.5, fib: 13.0 }, veg: true },

  // Indian Breads, Rice & Breakfast Staples
  { id: 'ifct_roti', name: 'Whole Wheat Phulka / Roti (No Ghee)', category: 'Breads & Grains', unitName: '1 Medium Roti (35g)', unitGrams: 35, per100g: { cal: 245, p: 8.6, c: 48.5, f: 1.7, fib: 7.2 }, veg: true },
  { id: 'ifct_rice', name: 'Steamed White / Basmati Rice (Cooked)', category: 'Breads & Grains', unitName: '1 Katori (150g)', unitGrams: 150, per100g: { cal: 120, p: 2.6, c: 26.5, f: 0.3, fib: 0.6 }, veg: true },
  { id: 'ifct_oats', name: 'Rolled Oats (Dry Weight for Porridge/Upma)', category: 'Breakfast & Tiffin', unitName: '1 Bowl Dry (50g)', unitGrams: 50, per100g: { cal: 379, p: 13.2, c: 67.7, f: 6.5, fib: 10.1 }, veg: true },
  { id: 'ifct_poha', name: 'Kanda Batata Poha with Peanuts', category: 'Breakfast & Tiffin', unitName: '1 Medium Plate (160g)', unitGrams: 160, per100g: { cal: 135, p: 3.4, c: 23.0, f: 3.5, fib: 1.9 }, veg: true },
  { id: 'ifct_idli', name: 'Steamed Rice & Urad Dal Idli', category: 'Breakfast & Tiffin', unitName: '2 Medium Idlis (110g)', unitGrams: 110, per100g: { cal: 128, p: 4.2, c: 26.0, f: 0.6, fib: 1.5 }, veg: true },
  { id: 'ifct_mixed_veg', name: 'Seasonal Mixed Veg Sabzi (Home Style)', category: 'Sabzi & Sides', unitName: '1 Katori (140g)', unitGrams: 140, per100g: { cal: 82, p: 2.2, c: 10.5, f: 3.6, fib: 3.8 }, veg: true },
  { id: 'ifct_bhindi', name: 'Bhindi Masala (Dry Stir Fry)', category: 'Sabzi & Sides', unitName: '1 Katori (130g)', unitGrams: 130, per100g: { cal: 88, p: 2.1, c: 8.4, f: 5.2, fib: 3.6 }, veg: true },
  { id: 'ifct_tadka_oil', name: 'Cooking Oil / Ghee (Family Kitchen Tadka Buffer)', category: 'Sabzi & Sides', unitName: '1 Teaspoon (5g)', unitGrams: 5, per100g: { cal: 900, p: 0, c: 0, f: 100, fib: 0 }, veg: true },
];

const MEAL_SLOTS = ['Breakfast (Post-Workout)', 'Lunch (Thali)', 'Evening Fuel', 'Dinner'];

const STORAGE_KEY = 'nutrithali_v2_realworld_state';

export default function App() {
  // Load saved state or initialize with a realistic Recomposition profile
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to read local storage', e);
    }
    return {
      profile: {
        age: 22,
        gender: 'male',
        heightCm: 165,
        weightKg: 90,
        activityMultiplier: 1.375, // Desk role + 3-4x/wk morning workouts
        deficitKcal: 450,          // Steady body recomposition cut
        proteinPerKg: 1.35,        // Realistic whole-food vegetarian target (~120g)
      },
      customFoods: [],
      waterGlasses: 4,
      logs: {
        'Breakfast (Post-Workout)': [
          { foodId: 'ifct_besan_chilla', name: 'Besan Chilla with Veggies', grams: 140, per100g: { cal: 168, p: 9.2, c: 21.5, f: 5.0, fib: 4.2 } },
          { foodId: 'ifct_dahi', name: 'Homemade Toned Milk Curd (Dahi)', grams: 150, per100g: { cal: 62, p: 3.8, c: 4.6, f: 3.1, fib: 0 } },
        ],
        'Lunch (Thali)': [
          { foodId: 'ifct_rajma', name: 'Rajma Masala (Home Cooked)', grams: 200, per100g: { cal: 128, p: 7.5, c: 18.5, f: 2.6, fib: 5.2 } },
          { foodId: 'ifct_roti', name: 'Whole Wheat Phulka / Roti (No Ghee)', grams: 70, per100g: { cal: 245, p: 8.6, c: 48.5, f: 1.7, fib: 7.2 } },
          { foodId: 'ifct_sprouts', name: 'Steamed Green Moong Sprouts Salad', grams: 120, per100g: { cal: 74, p: 6.2, c: 11.4, f: 0.5, fib: 4.0 } },
        ],
        'Evening Fuel': [
          { foodId: 'ifct_sattu', name: 'Chana Sattu Flour (Unsweetened Drink)', grams: 45, per100g: { cal: 387, p: 20.6, c: 63.2, f: 5.6, fib: 10.5 } },
          { foodId: 'ifct_roasted_chana', name: 'Roasted Bengal Gram (Bhuna Chana)', grams: 40, per100g: { cal: 369, p: 22.5, c: 58.1, f: 5.2, fib: 11.8 } },
        ],
        'Dinner': [
          { foodId: 'ifct_moong_dal', name: 'Yellow Moong Dal Tadka (Cooked)', grams: 200, per100g: { cal: 105, p: 6.8, c: 15.2, f: 1.8, fib: 3.4 } },
          { foodId: 'ifct_mixed_veg', name: 'Seasonal Mixed Veg Sabzi (Home Style)', grams: 140, per100g: { cal: 82, p: 2.2, c: 10.5, f: 3.6, fib: 3.8 } },
          { foodId: 'ifct_roti', name: 'Whole Wheat Phulka / Roti (No Ghee)', grams: 70, per100g: { cal: 245, p: 8.6, c: 48.5, f: 1.7, fib: 7.2 } },
        ],
      },
    };
  });

  // UI & Live API Search State
  const [activeMeal, setActiveMeal] = useState('Breakfast (Post-Workout)');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('local'); // 'local' (ICMR-NIN) | 'api' (Open Food Facts Live)
  const [apiResults, setApiResults] = useState([]);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Custom Food Form
  const [newFood, setNewFood] = useState({ name: '', unitGrams: 100, cal: 150, p: 10, c: 20, f: 3, fib: 2 });

  // Persist to Android/Browser localStorage on every state update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Storage quota exceeded', e);
    }
  }, [state]);

  // Calculate BMR, TDEE, and Daily Macro Targets (Mifflin-St Jeor)
  const targets = useMemo(() => {
    const { age, gender, heightCm, weightKg, activityMultiplier, deficitKcal, proteinPerKg } = state.profile;
    const s = gender === 'male' ? 5 : -161;
    const bmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + s);
    const tdee = Math.round(bmr * activityMultiplier);
    const cal = Math.max(1300, tdee - deficitKcal);
    const p = Math.round(weightKg * proteinPerKg);
    const f = Math.round((cal * 0.25) / 9);
    const c = Math.max(50, Math.round((cal - p * 4 - f * 9) / 4));
    return { bmr, tdee, cal, p, c, f, fib: 32 };
  }, [state.profile]);

  // Compute Consumed Macros across all meals
  const totals = useMemo(() => {
    let cal = 0, p = 0, c = 0, f = 0, fib = 0;
    Object.values(state.logs).forEach((items) => {
      items.forEach((item) => {
        const factor = item.grams / 100;
        cal += item.per100g.cal * factor;
        p += item.per100g.p * factor;
        c += item.per100g.c * factor;
        f += item.per100g.f * factor;
        fib += (item.per100g.fib || 0) * factor;
      });
    });
    return {
      cal: Math.round(cal),
      p: Math.round(p),
      c: Math.round(c),
      f: Math.round(f),
      fib: Math.round(fib),
    };
  }, [state.logs]);

  // Live Open Food Facts API v2 Search (India + Global catalog)
  const searchOpenFoodFacts = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingApi(true);
    setApiError('');
    try {
      const url = `https://world.openfoodfacts.org/api/v2/search?search_terms=${encodeURIComponent(
        searchQuery.trim()
      )}&page_size=12&fields=code,product_name,brands,nutriments,serving_quantity`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const parsed = (data.products || [])
        .filter((prod) => prod.product_name && prod.nutriments)
        .map((prod) => {
          const n = prod.nutriments;
          const kcal =
            n['energy-kcal_100g'] ||
            (n['energy_100g'] ? Math.round(n['energy_100g'] / 4.184) : 0);
          return {
            id: `off_${prod.code || Math.random()}`,
            name: `${prod.product_name}${prod.brands ? ` (${prod.brands.split(',')[0]})` : ''}`,
            category: 'Open Food Facts (Live API)',
            unitName: prod.serving_quantity ? `1 Serving (${prod.serving_quantity}g)` : '100g Standard',
            unitGrams: Number(prod.serving_quantity) || 100,
            per100g: {
              cal: Math.round(Number(kcal) || 0),
              p: Number(Number(n.proteins_100g || 0).toFixed(1)),
              c: Number(Number(n.carbohydrates_100g || 0).toFixed(1)),
              f: Number(Number(n.fat_100g || 0).toFixed(1)),
              fib: Number(Number(n.fiber_100g || 0).toFixed(1)),
            },
          };
        })
        .filter((item) => item.per100g.cal > 0);

      setApiResults(parsed);
      if (parsed.length === 0) {
        setApiError('No verified macro entries found for that query. Try a simpler brand or food name.');
      }
    } catch (err) {
      setApiError('Network error reaching Open Food Facts API. Check your internet connection.');
    } finally {
      setIsSearchingApi(false);
    }
  };

  // Add Food to Active Meal
  const addFoodToMeal = (food, customGrams) => {
    const grams = customGrams || food.unitGrams || 100;
    setState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [activeMeal]: [
          ...(prev.logs[activeMeal] || []),
          {
            uid: `${Date.now()}_${Math.random()}`,
            foodId: food.id,
            name: food.name,
            grams,
            per100g: food.per100g,
          },
        ],
      },
    }));
  };

  // Update Grams in Meal Log
  const updateItemGrams = (mealName, index, deltaGrams) => {
    setState((prev) => {
      const updated = [...prev.logs[mealName]];
      const nextGrams = Math.max(5, updated[index].grams + deltaGrams);
      updated[index] = { ...updated[index], grams: nextGrams };
      return {
        ...prev,
        logs: { ...prev.logs, [mealName]: updated },
      };
    });
  };

  // Remove Item from Meal Log
  const removeItem = (mealName, index) => {
    setState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [mealName]: prev.logs[mealName].filter((_, i) => i !== index),
      },
    }));
  };

  // Add +1 tsp Cooking Oil/Ghee Tadka Buffer to a Meal
  const addTadkaBuffer = (mealName) => {
    const tadkaFood = IFCT_CORE_FOODS.find((f) => f.id === 'ifct_tadka_oil');
    if (!tadkaFood) return;
    setState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [mealName]: [
          ...prev.logs[mealName],
          {
            uid: `${Date.now()}_tadka`,
            foodId: tadkaFood.id,
            name: tadkaFood.name,
            grams: 5,
            per100g: tadkaFood.per100g,
          },
        ],
      },
    }));
  };

  // Save Custom Home Food
  const handleSaveCustomFood = (e) => {
    e.preventDefault();
    if (!newFood.name.trim()) return;
    const created = {
      id: `custom_${Date.now()}`,
      name: newFood.name.trim(),
      category: 'My Custom Home Foods',
      unitName: `${newFood.unitGrams}g Serving`,
      unitGrams: Number(newFood.unitGrams) || 100,
      per100g: {
        cal: Number(newFood.cal),
        p: Number(newFood.p),
        c: Number(newFood.c),
        f: Number(newFood.f),
        fib: Number(newFood.fib),
      },
    };
    setState((prev) => ({
      ...prev,
      customFoods: [created, ...prev.customFoods],
    }));
    addFoodToMeal(created);
    setShowCustomModal(false);
    setNewFood({ name: '', unitGrams: 100, cal: 150, p: 10, c: 20, f: 3, fib: 2 });
  };

  // Copy Diagnostics Snapshot for Bug Reporting
  const copyBugReportSnapshot = () => {
    const payload = {
      appVersion: '2.0.0-IFCT-OFF-Hybrid',
      timestamp: new Date().toISOString(),
      targets,
      totals,
      profile: state.profile,
      loggedMealCounts: Object.fromEntries(
        Object.entries(state.logs).map(([k, v]) => [k, v.length])
      ),
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopyFeedback('Diagnostic JSON copied! Paste it in chat if you spot any bug.');
    setTimeout(() => setCopyFeedback(''), 4000);
  };

  const allLocalFoods = useMemo(
    () => [...state.customFoods, ...IFCT_CORE_FOODS],
    [state.customFoods]
  );

  const filteredLocalFoods = useMemo(() => {
    if (!searchQuery.trim()) return allLocalFoods;
    const q = searchQuery.toLowerCase();
    return allLocalFoods.filter(
      (f) => f.name.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)
    );
  }, [allLocalFoods, searchQuery]);

  const proteinGap = Math.max(0, targets.p - totals.p);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">NutriThali v2.0</h1>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ICMR-NIN + Live API
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-World Gram Scaling & Offline Storage</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyBugReportSnapshot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title="Copy state JSON to report a bug"
            >
              <Bug className="w-3.5 h-3.5 text-amber-400" />
              <span>Bug Report Log</span>
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Targets ({targets.cal} kcal)</span>
            </button>
          </div>
        </div>
        {copyFeedback && (
          <div className="max-w-5xl mx-auto mt-2 px-3 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            {copyFeedback}
          </div>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-5 space-y-6">
        {/* Collapsible BMR / TDEE Calibration Panel */}
        {showSettings && (
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-emerald-400" />
                Mifflin-St Jeor Body Recomposition Calibration
              </h2>
              <span className="text-xs text-slate-400">
                BMR: {targets.bmr} kcal | TDEE: {targets.tdee} kcal
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <label className="space-y-1">
                <span className="text-slate-400">Weight (kg)</span>
                <input
                  type="number"
                  value={state.profile.weightKg}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      profile: { ...s.profile, weightKg: Number(e.target.value) || 70 },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400">Height (cm)</span>
                <input
                  type="number"
                  value={state.profile.heightCm}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      profile: { ...s.profile, heightCm: Number(e.target.value) || 165 },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400">Age</span>
                <input
                  type="number"
                  value={state.profile.age}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      profile: { ...s.profile, age: Number(e.target.value) || 22 },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400">Daily Deficit (kcal)</span>
                <input
                  type="number"
                  step="50"
                  value={state.profile.deficitKcal}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      profile: { ...s.profile, deficitKcal: Number(e.target.value) || 0 },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </label>
              <label className="space-y-1">
                <span className="text-slate-400">Protein (g/kg)</span>
                <input
                  type="number"
                  step="0.05"
                  value={state.profile.proteinPerKg}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      profile: { ...s.profile, proteinPerKg: Number(e.target.value) || 1.2 },
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </label>
            </div>
          </section>
        )}

        {/* Real-Time Macro Progress Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Calories', val: totals.cal, max: targets.cal, unit: 'kcal', color: 'bg-emerald-500' },
            { label: 'Protein', val: totals.p, max: targets.p, unit: 'g', color: 'bg-sky-500' },
            { label: 'Carbs', val: totals.c, max: targets.c, unit: 'g', color: 'bg-amber-500' },
            { label: 'Fats', val: totals.f, max: targets.f, unit: 'g', color: 'bg-rose-500' },
            { label: 'Fiber', val: totals.fib, max: targets.fib, unit: 'g', color: 'bg-purple-500' },
          ].map((m) => {
            const pct = Math.min(100, Math.round((m.val / (m.max || 1)) * 100));
            return (
              <div key={m.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">{m.label}</span>
                  <span className="text-[11px] text-slate-400">{pct}%</span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{m.val}</span>
                  <span className="text-xs text-slate-400">/ {m.max}{m.unit}</span>
                </div>
                <div className="mt-2.5 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${m.color} transition-all duration-300`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </section>

        {/* Smart Whole-Food Rotation Coach */}
        {proteinGap > 8 && (
          <section className="bg-slate-900/90 border border-sky-500/30 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-sky-400 shrink-0" />
              <div className="text-xs">
                <span className="font-semibold text-white">
                  {proteinGap}g Protein Remaining Today:
                </span>{' '}
                <span className="text-slate-300">
                  Close the gap with whole-food rotational staples (no daily paneer/soya or supplements needed):
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ifct_sattu', label: '+45g Chana Sattu (9.3g P)' },
                { id: 'ifct_roasted_chana', label: '+40g Bhuna Chana (9g P)' },
                { id: 'ifct_moong_dal', label: '+150g Moong Dal (10.2g P)' },
              ].map((s) => {
                const foodObj = IFCT_CORE_FOODS.find((f) => f.id === s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => foodObj && addFoodToMeal(foodObj)}
                    className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-medium"
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Main 2-Column Workspace: Meal Log (Left) + Dual-Source Food Search (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 4-Meal Planner with Gram Controls & Tadka Buffer */}
          <div className="lg:col-span-7 space-y-4">
            {MEAL_SLOTS.map((mealName) => {
              const items = state.logs[mealName] || [];
              const mealCal = Math.round(
                items.reduce((acc, i) => acc + (i.per100g.cal * i.grams) / 100, 0)
              );
              const mealP = Math.round(
                items.reduce((acc, i) => acc + (i.per100g.p * i.grams) / 100, 0)
              );
              const isSelected = activeMeal === mealName;

              return (
                <div
                  key={mealName}
                  onClick={() => setActiveMeal(mealName)}
                  className={`rounded-2xl border p-4 transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          isSelected ? 'bg-emerald-400' : 'bg-slate-600'
                        }`}
                      />
                      <h3 className="font-semibold text-sm text-white">{mealName}</h3>
                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                          Active Slot
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-300 font-medium">
                        {mealCal} kcal · <strong className="text-sky-400">{mealP}g P</strong>
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addTadkaBuffer(mealName);
                        }}
                        className="text-[11px] px-2 py-1 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30"
                        title="Add 1 tsp (5g) cooking oil/ghee for shared family gravy accuracy"
                      >
                        +1 tsp Tadka Oil
                      </button>
                    </div>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-slate-500 py-3">
                      No items logged. Select this meal and tap any food on the right to add.
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-800/70 mt-2">
                      {items.map((item, idx) => {
                        const factor = item.grams / 100;
                        const itemCal = Math.round(item.per100g.cal * factor);
                        const itemP = (item.per100g.p * factor).toFixed(1);
                        return (
                          <div
                            key={item.uid || idx}
                            className="py-2.5 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-slate-200 truncate">{item.name}</p>
                              <p className="text-slate-400">
                                {itemCal} kcal · <span className="text-sky-400">{itemP}g P</span> ·{' '}
                                {Math.round(item.per100g.c * factor)}g C ·{' '}
                                {Math.round(item.per100g.f * factor)}g F
                              </p>
                            </div>

                            {/* Exact Gram Adjuster */}
                            <div
                              className="flex items-center gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => updateItemGrams(mealName, idx, -25)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                -25g
                              </button>
                              <span className="w-14 text-center font-semibold text-white bg-slate-950 py-1 rounded border border-slate-800">
                                {item.grams}g
                              </span>
                              <button
                                onClick={() => updateItemGrams(mealName, idx, 25)}
                                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                              >
                                +25g
                              </button>
                              <button
                                onClick={() => removeItem(mealName, idx)}
                                className="p-1.5 text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dual-Engine Food Database (ICMR-NIN Offline + Open Food Facts Live API) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 sticky top-20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-white">
                  Add to: <span className="text-emerald-400">{activeMeal}</span>
                </h3>
                <button
                  onClick={() => setShowCustomModal(true)}
                  className="text-xs flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Custom Recipe
                </button>
              </div>

              {/* Source Switcher: Offline ICMR-NIN vs Live Open Food Facts API */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setSearchMode('local')}
                  className={`py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 ${
                    searchMode === 'local'
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  ICMR-NIN (Offline)
                </button>
                <button
                  onClick={() => setSearchMode('api')}
                  className={`py-1.5 px-2 rounded-lg font-medium flex items-center justify-center gap-1.5 ${
                    searchMode === 'api'
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  OpenFoodFacts (Live)
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchMode === 'api' && searchOpenFoodFacts()}
                    placeholder={
                      searchMode === 'local'
                        ? 'Search dal, chana, sattu, roti, dahi...'
                        : 'Type brand or food (e.g., Amul, Oats, Bread)...'
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {searchMode === 'api' && (
                  <button
                    onClick={searchOpenFoodFacts}
                    disabled={isSearchingApi}
                    className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium flex items-center gap-1"
                  >
                    {isSearchingApi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Fetch'}
                  </button>
                )}
              </div>

              {apiError && searchMode === 'api' && (
                <p className="text-xs text-amber-400 bg-amber-950/40 border border-amber-800/50 rounded-lg p-2">
                  {apiError}
                </p>
              )}

              {/* Results List */}
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-800/70 pr-1">
                {(searchMode === 'local' ? filteredLocalFoods : apiResults).map((food) => {
                  const defaultCal = Math.round((food.per100g.cal * food.unitGrams) / 100);
                  const defaultP = ((food.per100g.p * food.unitGrams) / 100).toFixed(1);
                  return (
                    <div
                      key={food.id}
                      className="py-2.5 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-100 truncate">{food.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {food.unitName}: <strong>{defaultCal} kcal</strong> ·{' '}
                          <span className="text-sky-400 font-semibold">{defaultP}g P</span> (100g:{' '}
                          {food.per100g.cal} kcal, {food.per100g.p}g P)
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => addFoodToMeal(food, food.unitGrams)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-medium"
                        >
                          + {food.unitGrams}g
                        </button>
                        <button
                          onClick={() => addFoodToMeal(food, 100)}
                          className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          +100g
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Custom Home Food Modal */}
        {showCustomModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <form
              onSubmit={handleSaveCustomFood}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full space-y-3 text-xs"
            >
              <h3 className="text-sm font-bold text-white">Add Custom Home Recipe (Per 100g)</h3>
              <input
                type="text"
                required
                placeholder="Food / Recipe Name (e.g., Mom's Dal Khichdi)"
                value={newFood.name}
                onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
              <div className="grid grid-cols-2 gap-2.5">
                <label>
                  <span className="text-slate-400">Default Serving (g)</span>
                  <input
                    type="number"
                    value={newFood.unitGrams}
                    onChange={(e) => setNewFood({ ...newFood, unitGrams: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </label>
                <label>
                  <span className="text-slate-400">Calories / 100g</span>
                  <input
                    type="number"
                    value={newFood.cal}
                    onChange={(e) => setNewFood({ ...newFood, cal: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </label>
                <label>
                  <span className="text-slate-400">Protein (g) / 100g</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newFood.p}
                    onChange={(e) => setNewFood({ ...newFood, p: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </label>
                <label>
                  <span className="text-slate-400">Carbs (g) / 100g</span>
                  <input
                    type="number"
                    step="0.1"
                    value={newFood.c}
                    onChange={(e) => setNewFood({ ...newFood, c: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  Save & Log
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}