"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Screen = "home" | "lessons" | "transfer" | "prices" | "request" | "rider" | "admin";
type PriceKind = "lesson" | "pack" | "rent" | "promo";
type SkillState = {
  experience: string;
  people: string;
  swim: string;
  fitness: string;
  health: string;
  height: number;
  weight: number;
};
type LeadDraft = {
  name: string;
  messenger: string;
  service: string;
  people: string;
  date: string;
  pickup: string;
  note: string;
};
type Recommendation = {
  title: string;
  service: string;
  text: string;
  pills: string[];
};
type PriceItem = {
  kind: PriceKind;
  service: string;
  title: string;
  description: string;
  value: string;
};

const initialSkill: SkillState = {
  experience: "first",
  people: "1",
  swim: "confident",
  fitness: "normal",
  health: "none",
  height: 175,
  weight: 75,
};

const initialLead: LeadDraft = {
  name: "",
  messenger: "",
  service: "Групповой урок · $50",
  people: "1",
  date: "",
  pickup: "Нячанг · центр",
  note: "",
};

const skillGroups = [
  {
    key: "experience",
    label: "Вы уже пробовали сёрфинг?",
    options: [
      ["first", "Первый раз"],
      ["tried", "Пробовал пару раз"],
      ["basic", "Встаю на пену"],
      ["progress", "Хочу прогресс"],
    ],
  },
  {
    key: "people",
    label: "Сколько вас?",
    options: [
      ["1", "Я один / одна"],
      ["2", "Нас двое"],
      ["3", "Нас трое"],
      ["4", "4+ человека"],
    ],
  },
  {
    key: "swim",
    label: "Как плаваете?",
    options: [
      ["confident", "Уверенно"],
      ["ok", "Нормально"],
      ["weak", "Неуверенно"],
      ["fear", "Есть страх глубины"],
    ],
  },
  {
    key: "fitness",
    label: "Физическая форма",
    options: [
      ["normal", "Обычная"],
      ["sport", "Спортивная"],
      ["easy", "Нужен мягкий темп"],
      ["kid", "Ребёнок / старший возраст"],
    ],
  },
  {
    key: "health",
    label: "Есть ограничения?",
    options: [
      ["none", "Нет"],
      ["back", "Спина / суставы"],
      ["sun", "Быстро устаю / солнце"],
      ["unsure", "Лучше уточнить"],
    ],
  },
] as const;

const priceItems: PriceItem[] = [
  { kind: "lesson", service: "Групповой урок · $50", title: "Групповой урок", description: "До 4 учеников, уровень подбирается перед стартом.", value: "$50" },
  { kind: "lesson", service: "Персональный 1:1 · $80", title: "Персональный 1:1", description: "Максимум внимания инструктора и быстрый старт.", value: "$80" },
  { kind: "lesson", service: "Персональный 2:1 · $70/чел.", title: "Персональный 2:1", description: "Для пары или двух друзей.", value: "$70" },
  { kind: "lesson", service: "Персональный 3:1 · $60/чел.", title: "Персональный 3:1", description: "Для небольшой компании.", value: "$60" },
  { kind: "pack", service: "Just Try · $100", title: "Just Try", description: "Входный пакет для первого знакомства.", value: "$100" },
  { kind: "pack", service: "Base Light · $150", title: "Base Light", description: "База, чтобы закрепить первые ощущения.", value: "$150" },
  { kind: "pack", service: "Base Pro · $230", title: "Base Pro", description: "Больше практики и устойчивый прогресс.", value: "$230" },
  { kind: "pack", service: "Skill Up · $240", title: "Skill Up", description: "Для тех, кто уже начал и хочет расти дальше.", value: "$240" },
  { kind: "pack", service: "2gether 4ever · $400", title: "2gether 4ever", description: "Пакет для двоих.", value: "$400" },
  { kind: "rent", service: "Аренда доски · 1 час · 200k", title: "Аренда 1 час", description: "Surf board.", value: "200k" },
  { kind: "rent", service: "Аренда доски · 2 часа · 300k", title: "Аренда 2 часа", description: "Surf board.", value: "300k" },
  { kind: "rent", service: "Rent No Limits · 1 месяц · 3.900k / $150", title: "Rent No Limits", description: "Месяц аренды для тех, кто остаётся надолго.", value: "$150" },
  { kind: "promo", service: "Акция: день рождения", title: "День рождения", description: "-15% на урок и -50% на аренду от 1 дня.", value: "акция" },
  { kind: "promo", service: "Акция: компания от 4 человек", title: "Компания от 4 человек", description: "-10% для дружной группы.", value: "-10%" },
  { kind: "promo", service: "Акция: привёл друга", title: "Привёл друга", description: "2 часа аренды доски бесплатно.", value: "gift" },
];

const serviceOptions = [
  "Групповой урок · $50",
  "Персональный 1:1 · $80",
  "Персональный 2:1 · $70/чел.",
  "Персональный 3:1 · $60/чел.",
  "Just Try · $100",
  "Base Light · $150",
  "Base Pro · $230",
  "Skill Up · $240",
  "2gether 4ever · $400",
  "Аренда доски · 1 час · 200k",
  "Аренда доски · 2 часа · 300k",
  "Аренда доски · 3 часа · 400k",
  "Rent Base Light · 4×2ч · 1.000k / $40",
  "Rent Base Pro · 8×2ч · 1.600k / $60",
  "Rent Terminator · 12×2ч · 2.400k / $90",
  "Rent No Limits · 1 месяц · 3.900k / $150",
  "Акция: День рождения",
  "Акция: компания от 4 человек",
  "Акция: привёл друга",
];

const demoLeads: LeadDraft[] = [
  {
    name: "Марина",
    messenger: "@demo_rider",
    service: "Групповой урок · $50",
    people: "1",
    date: "завтра",
    pickup: "Нячанг · центр",
    note: "Хочу присоединиться к общей машине.",
  },
  {
    name: "Илья и Аня",
    messenger: "WhatsApp указан",
    service: "Персональный 2:1 · $70/чел.",
    people: "2",
    date: "уточнить",
    pickup: "Нячанг · север",
    note: "Первый раз, хотим спокойный темп.",
  },
];

function boardAdvice(skill: SkillState) {
  if (skill.height >= 185 || skill.weight >= 88) return "доска: wide soft-top 9 ft";
  if (skill.weight <= 55) return "доска: soft-top 7–8 ft";
  return "доска: soft-top 8–9 ft";
}

function getRecommendation(skill: SkillState): Recommendation {
  const safety = skill.swim === "weak" || skill.swim === "fear" || skill.health !== "none" || skill.fitness === "kid";
  const people = Number(skill.people);
  if (safety) {
    return {
      title: "Персональный безопасный старт · $80",
      service: "Персональный 1:1 · $80",
      text: "Лучше начать 1:1: инструктор держит темп под вас, выбирает спокойный участок и даёт больше контроля на воде.",
      pills: [boardAdvice(skill), "темп: мягкий", "безопасность: мелководье / жилет"],
    };
  }
  if (skill.experience === "progress" || skill.experience === "basic") {
    return {
      title: "Skill Up · $240",
      service: "Skill Up · $240",
      text: "Вы уже ловили пену или хотите прогресс — нужен не просто урок, а серия с задачами: позиция, поворот, самостоятельная практика.",
      pills: [boardAdvice(skill), "фокус: прогресс", "формат: уроки + аренда"],
    };
  }
  if (people === 2) {
    return {
      title: "Персональный 2:1 · $70/чел.",
      service: "Персональный 2:1 · $70/чел.",
      text: "Оптимально для пары или двух друзей: один ритм, больше поддержки и проще договориться о трансфере.",
      pills: [boardAdvice(skill), "темп: общий", "формат: 2 человека"],
    };
  }
  if (people >= 3) {
    return {
      title: "Групповой урок · $50",
      service: "Групповой урок · $50",
      text: "Для компании выгоднее группа: до 4 учеников на инструктора, уровень подбирается перед стартом.",
      pills: [boardAdvice(skill), "формат: компания", "трансфер: проще собрать"],
    };
  }
  return {
    title: "Групповой урок · $50",
    service: "Групповой урок · $50",
    text: "Лучший первый вход: до 4 человек на инструктора, группа по уровню и понятный темп. Если вы один, можно присоединиться к общей машине.",
    pills: [boardAdvice(skill), "темп: спокойный", "спот: мелководье"],
  };
}

function classifyLead(lead: LeadDraft) {
  const service = lead.service || "";
  const pickup = lead.pickup || "";
  const note = lead.note || "";
  const noTransfer = pickup.includes("Без") || note.toLowerCase().includes("самостоятельно") || note.toLowerCase().includes("не нужен");
  const rideNeeded = !noTransfer && (pickup.includes("Нячанг") || note.toLowerCase().includes("трансфер") || note.toLowerCase().includes("райд"));
  const safeCheck = note.toLowerCase().includes("страх") || note.toLowerCase().includes("спина") || note.toLowerCase().includes("сустав") || service.includes("Персон");
  const progress = service.includes("Skill") || service.includes("Base Pro") || service.includes("Base Light");
  let priority = "обычная";
  let badge = "новая";
  let hint = "Проверить дату, контакт и подтвердить формат урока вручную.";
  let next = "Уточнить детали";
  if (safeCheck) {
    priority = "внимание";
    badge = "safety";
    hint = "Не подтверждать автоматически: нужен ручной контакт инструктора по темпу, глубине и ограничениям.";
    next = "Передать инструктору";
  } else if (rideNeeded && lead.people === "1") {
    priority = "горячая";
    badge = "райд 3/4";
    hint = "Один райдер из Нячанга: предложить ближайшую машину, где 3 из 4 мест заняты.";
    next = "Закрыть место";
  } else if (progress) {
    priority = "прогресс";
    badge = "серия";
    hint = "Это не разовый интерес: предложить серию и закрепить инструктора/цель прогресса.";
    next = "Собрать план";
  } else if (noTransfer) {
    priority = "простая";
    badge = "без райда";
    hint = "Трансфер не нужен: отправить точку встречи и время урока после подтверждения волн.";
    next = "Дать точку";
  }
  return { priority, badge, hint, next };
}

function HomeActionIcon({ type }: { type: "lesson" | "transfer" | "price" }) {
  if (type === "transfer") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs><linearGradient id="gradVanB" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1CC7C1"/><stop offset="100%" stopColor="#0C6D76"/></linearGradient></defs>
        <rect x="6" y="20" width="24" height="12" rx="5" fill="url(#gradVanB)"/>
        <path d="M30 22h6l5 5v5h-4" fill="none" stroke="#0F5D63" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="34" r="4" fill="#F5B94F"/><circle cx="34" cy="34" r="4" fill="#F5B94F"/>
        <path d="M12 18c3-2 5-5 6-9M18 9c2 1 4 3 5 5M18 9c-2 1-4 3-5 5" fill="none" stroke="#4F9B38" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (type === "price") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <defs><linearGradient id="gradWaveC" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#23D5D0"/><stop offset="100%" stopColor="#0D6E78"/></linearGradient></defs>
        <path d="M8 30c5-5 9-7 14-7 5 0 9 2 18 10-1 1-3 3-6 3-4 0-6-4-9-4-2 0-3 1-4 3-2 3-5 4-9 4-2 0-3-.3-4-1 0-3 0-5 0-8Z" fill="url(#gradWaveC)"/>
        <rect x="9" y="9" width="3" height="11" rx="1.5" fill="#8F633D"/><rect x="22.5" y="6" width="3" height="14" rx="1.5" fill="#8F633D"/><rect x="36" y="9" width="3" height="11" rx="1.5" fill="#8F633D"/>
        <path d="M7 20h34" stroke="#F2C774" strokeWidth="2.2" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs><linearGradient id="gradBoardA" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#23D5D0"/><stop offset="100%" stopColor="#0D6E78"/></linearGradient></defs>
      <circle cx="34" cy="14" r="7" fill="#F5B94F"/>
      <path d="M17 9c7 0 9 5 9 14s-2 16-9 16-9-7-9-16 2-14 9-14Z" fill="url(#gradBoardA)"/>
      <path d="M17 14c3 4 4 8 4 13s-1 8-4 10" fill="none" stroke="#EAFDFC" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M8 35c4 1.8 8 1.8 12 0 4 1.8 8 1.8 12 0" fill="none" stroke="#0F5D63" strokeWidth="2.3" strokeLinecap="round"/>
    </svg>
  );
}

function NavIcon({ type }: { type: "home" | "lessons" | "transfer" | "prices" }) {
  if (type === "transfer") return <HomeActionIcon type="transfer"/>;
  if (type === "prices") return <HomeActionIcon type="price"/>;
  if (type === "lessons") return <HomeActionIcon type="lesson"/>;
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs><linearGradient id="navA" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#23D5D0"/><stop offset="100%" stopColor="#0D6E78"/></linearGradient></defs>
      <path d="M7 29c6-6 11-8 16-8 5 0 10 2 18 10-1 1-3 3-6 3-4 0-6-4-9-4-2 0-4 1-5 3-2 3-5 4-8 4-3 0-5-1-6-3 0-2 0-3 0-5Z" fill="url(#navA)"/>
      <path d="M15 20c2-5 7-8 13-9" fill="none" stroke="#F2C774" strokeWidth="2.3" strokeLinecap="round"/>
    </svg>
  );
}

export default function TrueSurfApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [skill, setSkill] = useState<SkillState>(initialSkill);
  const [lead, setLead] = useState<LeadDraft>(initialLead);
  const [savedLead, setSavedLead] = useState<LeadDraft | null>(null);
  const [priceFilter, setPriceFilter] = useState<PriceKind | "all">("all");
  const [toast, setToast] = useState("");
  const [adminStatuses, setAdminStatuses] = useState<Record<string, string>>({});
  const [rideDate, setRideDate] = useState("");
  const [rideTime, setRideTime] = useState("Утро · 08:30–10:00");
  const [ridePeople, setRidePeople] = useState("1");
  const [rideArea, setRideArea] = useState("Нячанг · центр");
  const resultRef = useRef<HTMLDivElement>(null);
  const createRideRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      const raw = window.localStorage.getItem("trueSurfLeadDraftV6") || window.localStorage.getItem("trueSurfLeadDraftV13");
      if (raw) {
        try {
          const restored = JSON.parse(raw) as LeadDraft;
          setSavedLead(restored);
          setLead(restored);
        } catch {
          setSavedLead(null);
        }
      }
      try {
        setAdminStatuses(JSON.parse(window.localStorage.getItem("trueSurfAdminStatuses") || "{}") as Record<string, string>);
      } catch {
        setAdminStatuses({});
      }
    }, 0);
    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const recommendation = useMemo(() => getRecommendation(skill), [skill]);
  const leads = useMemo(() => savedLead ? [savedLead, ...demoLeads] : demoLeads, [savedLead]);
  const topAvatar = (savedLead?.name || "R").trim().charAt(0).toUpperCase() || "R";

  function showToast(text: string) {
    setToast(text);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 2200);
  }

  function go(next: Screen) {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function fillRequestFromRide(note: string, people = "1", pickup = "Нячанг · центр", date = "") {
    setLead((current) => ({ ...current, note, people, pickup, date: date || current.date }));
    showToast("Перенесли трансфер в заявку");
    go("request");
  }

  function choosePrice(item: PriceItem) {
    setLead((current) => ({ ...current, service: item.service, note: "Выбрана позиция из прайса: " + item.service }));
    showToast("Позиция добавлена в заявку");
    go("request");
  }

  function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.localStorage.setItem("trueSurfLeadDraftV6", JSON.stringify(lead));
    window.localStorage.setItem("trueSurfLeadDraftV13", JSON.stringify(lead));
    setSavedLead(lead);
    showToast("Демо-заявка сохранена в кабинете");
    go("rider");
  }

  function updateAdminStatus(index: number, action: "confirmed" | "ride" | "message") {
    const labels = { confirmed: "подтверждено", ride: "в работе", message: "написать" };
    const next = { ...adminStatuses, [index]: labels[action] };
    setAdminStatuses(next);
    window.localStorage.setItem("trueSurfAdminStatuses", JSON.stringify(next));
    showToast("Demo-статус обновлён: " + labels[action]);
  }

  const riderLevel = savedLead
    ? savedLead.service.includes("Skill")
      ? "Прогресс"
      : savedLead.service.includes("Индивиду") || savedLead.service.includes("Персон")
        ? "Персонально"
        : savedLead.service.includes("Групп")
          ? "Первый старт"
          : "Выбран"
    : "Подобрать";

  return (
    <>
      <div className="app">
        <header className="top">
          <div className="brand" aria-label="TRUE SURF">
            <div className="mark" aria-hidden="true"/>
            <div className="wordmark"><strong>TRUE SURF</strong><span>умный сёрфинг · Bai Dai</span></div>
          </div>
          <div className="top-actions">
            <button className="admin-pill" type="button" onClick={() => go("admin")}><span>⚙︎</span><span>Админ</span></button>
            <button className="rider-pill" type="button" onClick={() => go("rider")}><span className="mini-avatar">{topAvatar}</span><span>Райдер</span></button>
          </div>
        </header>

        <main>
          <section className={"screen" + (screen === "home" ? " active" : "")} id="home">
            <div className="hero">
              <div className="tribal" aria-hidden="true"/>
              <span className="eyebrow">⛺ Камрань · Bai Dai · из Нячанга</span>
              <h1>До волны без суеты <em>даже если вы один</em></h1>
              <p>Подберём урок по уровню, соберём общий трансфер от 4 человек и доведём до первого настоящего поворота на волне.</p>
              <div className="hero-actions">
                <button className="btn primary" type="button" onClick={() => go("lessons")}>Подобрать урок</button>
                <button className="btn dark" type="button" onClick={() => go("transfer")}>Собрать трансфер</button>
              </div>
            </div>
            <div className="quick">
              <div className="quick-card"><b>10 лет</b><span>на пике волны и в своём комьюнити</span></div>
              <div className="quick-card"><b>до 4</b><span>ученика на одного инструктора</span></div>
              <div className="quick-card"><b>2–3 ч</b><span>урок, доска, вода и съёмка</span></div>
            </div>
            <div className="section-title"><h2>С чего начать</h2><small>урок · райд · сет</small></div>
            <div className="tile-grid">
              <button className="action-tile" type="button" onClick={() => go("lessons")}>
                <div className="action-icon"><HomeActionIcon type="lesson"/></div>
                <div className="action-copy"><b>Подбор уровня</b><span>Первый раз, персонально, парой или с абонементом на прогресс — поможем выбрать без лишних слов.</span></div><div className="chev">›</div>
              </button>
              <button className="action-tile" type="button" onClick={() => go("transfer")}>
                <div className="action-icon"><HomeActionIcon type="transfer"/></div>
                <div className="action-copy"><b>Трансфер</b><span>Если вас один или двое — не проблема. Школа собирает общую машину из Нячанга, когда набирается 4 человека.</span></div><div className="chev">›</div>
              </button>
              <button className="action-tile" type="button" onClick={() => go("prices")}>
                <div className="action-icon"><HomeActionIcon type="price"/></div>
                <div className="action-copy"><b>Приезжайте на волну</b><span>Смотрите стоимость уроков и пакетов: всё коротко, чисто и без перегруза.</span></div><div className="chev">›</div>
              </button>
            </div>
            <div className="pool" aria-label="Ближайшая общая машина">
              <div className="pool-top"><div><div className="pill">Сегодня едет общая машина</div><h3>В машине уже 3 серфера из 4</h3><p>Маршрут Нячанг → Bai Dai. Осталось <b>1 свободное место</b>, чтобы трансфер закрылся.</p></div></div>
              <div className="pool-stats"><div><div className="bar"><div className="fill" style={{ width: "75%" }}/></div><div className="helper">3 из 4 мест занято · как только группа собрана, администратор подтверждает время и точку выезда.</div></div><div className="seat-big">3 / 4<small>мест занято</small></div></div>
              <button className="btn primary" type="button" onClick={() => go("transfer")} style={{ width: "100%", marginTop: 10 }}>Смотреть трансфер</button>
            </div>
          </section>

          <section className={"screen" + (screen === "lessons" ? " active" : "")} id="lessons">
            <div className="skill-hero"><div className="tribal" aria-hidden="true"/><h2>Найдём вашу волну</h2><p>Короткий surf-check: опыт, состав, плавание, форма и ограничения. В конце — ваш формат урока и путь к записи.</p></div>
            <form className="card" onSubmit={(event) => event.preventDefault()}>
              {skillGroups.slice(0, 4).map((group) => (
                <div className="field" key={group.key}>
                  <label>{group.label}</label>
                  <div className="choice-grid">
                    {group.options.map(([value, label]) => (
                      <button className={"choice" + (skill[group.key] === value ? " active" : "")} type="button" key={value} onClick={() => setSkill((current) => ({ ...current, [group.key]: value }))}>{label}</button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="range-row"><label htmlFor="heightRange">Рост</label><output>{skill.height} см</output><input id="heightRange" type="range" min="120" max="205" value={skill.height} onChange={(event) => setSkill((current) => ({ ...current, height: Number(event.target.value) }))}/></div>
              <div className="range-row"><label htmlFor="weightRange">Вес</label><output>{skill.weight} кг</output><input id="weightRange" type="range" min="35" max="125" value={skill.weight} onChange={(event) => setSkill((current) => ({ ...current, weight: Number(event.target.value) }))}/></div>
              {skillGroups.slice(4).map((group) => (
                <div className="field" style={{ marginTop: 14 }} key={group.key}>
                  <label>{group.label}</label>
                  <div className="choice-grid">
                    {group.options.map(([value, label]) => (
                      <button className={"choice" + (skill[group.key] === value ? " active" : "")} type="button" key={value} onClick={() => setSkill((current) => ({ ...current, [group.key]: value }))}>{label}</button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="btn sea" type="button" style={{ width: "100%", marginTop: 12 }} onClick={() => { resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); showToast("Урок подобран под ваши параметры"); }}>Показать мой surf-start</button>
            </form>
            <div className="skill-result show" ref={resultRef}>
              <div className="result-label">Твой surf-start</div><h3>{recommendation.title}</h3><p>{recommendation.text}</p>
              <div className="board-line">{recommendation.pills.map((pill) => <span className="board-pill" key={pill}>{pill}</span>)}</div>
              <button className="btn primary" type="button" style={{ width: "100%" }} onClick={() => { setLead((current) => ({ ...current, service: recommendation.service, people: Number(skill.people) >= 4 ? "4+" : skill.people })); go("request"); }}>Записаться на этот урок</button>
            </div>
            <div className="safety-note">Если плавание неуверенное, есть страх глубины или ограничения по спине/суставам — приложение не делает медицинских обещаний. Оно предлагает более безопасный формат: мягкая доска, спокойный темп, жилет/мелководье и ручное подтверждение инструктором.</div>
          </section>

          <section className={"screen" + (screen === "transfer" ? " active" : "")} id="transfer">
            <div className="ride-hero v11"><div className="tribal" aria-hidden="true"/><h2>Райд до Bai Dai — всё под контролем</h2><p>Вы в Нячанге. Волна в Камрани. Выберите готовую машину, создайте свой выезд или отметьте, что доберётесь сами.</p></div>
            <div className="ride-mode-grid" aria-label="Быстрый выбор трансфера">
              <button className="ride-mode primary" type="button" onClick={() => fillRequestFromRide("Трансфер: Сегодня 09:00 · Нячанг центр · 3 из 4 мест. Хочу присоединиться / уточнить место.")}><div className="ride-mode-icon">🚐</div><div><strong>Хочу в ближайшую машину</strong><span>Подходит, если вы один: сегодня осталось 1 место.</span></div></button>
              <button className="ride-mode" type="button" onClick={() => createRideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}><div className="ride-mode-icon">＋</div><div><strong>Создать свой выезд</strong><span>Если дата или район не подходят — школа попробует добрать людей.</span></div></button>
              <button className="ride-mode" type="button" onClick={() => fillRequestFromRide("Трансфер не нужен. Доберусь до Bai Dai самостоятельно, нужна только точка встречи и время урока.", "1", "Без трансфера")}><div className="ride-mode-icon">🏄</div><div><strong>Я доберусь сам</strong><span>Для тех, кто на байке, такси или уже рядом с Bai Dai.</span></div></button>
            </div>
            <div className="ride-rule"><b>Как читать “3 из 4”:</b> это не рейтинг и не уровень. Это места в общей машине. Сейчас 3 места уже заняты, 1 место свободно. Когда становится 4 из 4 — администратор подтверждает pickup и время.</div>
            <div className="section-title"><h2>Готовые машины</h2><small>выберите слот</small></div>
            <article className="ride-card-v11 priority">
              <div className="ride-card-head"><div><h3>Сегодня · 09:00</h3><p>Нячанг центр → Bai Dai. Машина почти собрана — лучший вариант для одного человека.</p></div><div className="seat-meter">3 из 4<small>занято</small></div></div>
              <div className="ride-progress v11" aria-hidden="true"><i style={{ width: "75%" }}/></div>
              <div className="seat-copy"><span><b>Свободно 1</b>можно занять сейчас</span><span><b>Pickup</b>центр Нячанга</span></div>
              <div className="tagrow"><span className="tag">самый быстрый вариант</span><span className="tag">подходит одиночке</span></div>
              <div className="ride-cta-stack"><button className="btn primary" type="button" onClick={() => fillRequestFromRide("Трансфер: Сегодня 09:00 · Нячанг центр · 3 из 4 мест. Хочу присоединиться / уточнить место.")}>Забрать последнее место</button></div>
            </article>
            <article className="ride-card-v11">
              <div className="ride-card-head"><div><h3>Завтра · 08:30</h3><p>Центр / север Нячанга → Bai Dai. Хорошо для пары или двух друзей.</p></div><div className="seat-meter">2 из 4<small>занято</small></div></div>
              <div className="ride-progress v11" aria-hidden="true"><i style={{ width: "50%" }}/></div>
              <div className="seat-copy"><span><b>Свободно 2</b>можно ехать парой</span><span><b>Pickup</b>центр / север</span></div>
              <div className="ride-cta-stack"><button className="btn sea" type="button" onClick={() => fillRequestFromRide("Трансфер: Завтра 08:30 · центр/север Нячанга · 2 из 4 мест. Хочу присоединиться / уточнить место.", "1", "Нячанг · север")}>Выбрать этот выезд</button></div>
            </article>
            <article className="ride-card-v11">
              <div className="ride-card-head"><div><h3>Суббота · 09:00</h3><p>Машина уже набрана. Можно встать в ожидание или создать отдельный выезд.</p></div><div className="seat-meter">4 из 4<small>мест нет</small></div></div>
              <div className="ride-progress v11" aria-hidden="true"><i style={{ width: "100%" }}/></div>
              <div className="ride-cta-stack two"><button className="btn ghost" type="button" onClick={() => fillRequestFromRide("Трансфер: Суббота 09:00 · лист ожидания. Хочу присоединиться / уточнить место.")}>Встать в ожидание</button><button className="btn sea" type="button" onClick={() => createRideRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}>Создать свой</button></div>
            </article>
            <div className="section-title" ref={createRideRef}><h2>Создать свой выезд</h2><small>если слота нет</small></div>
            <div className="ride-form-card">
              <h3>Школа попробует собрать машину под вас</h3><p>Оставьте дату, время, сколько вас и район pickup. Если до 4 человек добирается группа — администратор подтверждает трансфер.</p>
              <div className="ride-form-grid">
                <div className="inline"><div className="field"><label htmlFor="rideDate">Дата</label><input id="rideDate" type="date" value={rideDate} onChange={(event) => setRideDate(event.target.value)}/></div><div className="field"><label htmlFor="rideTime">Время</label><select id="rideTime" value={rideTime} onChange={(event) => setRideTime(event.target.value)}><option>Утро · 08:30–10:00</option><option>День · 12:00–14:00</option><option>Гибко по волнам</option></select></div></div>
                <div className="inline"><div className="field"><label htmlFor="ridePeople">Сколько вас</label><select id="ridePeople" value={ridePeople} onChange={(event) => setRidePeople(event.target.value)}><option value="1">Я один / одна</option><option value="2">Нас двое</option><option value="3">Нас трое</option><option value="4+">Нас 4+</option></select></div><div className="field"><label htmlFor="rideArea">Где забрать</label><select id="rideArea" value={rideArea} onChange={(event) => setRideArea(event.target.value)}><option>Нячанг · центр</option><option>Нячанг · север</option><option>Нячанг · юг / An Vien</option><option>Отель уточню позже</option></select></div></div>
                <button className="btn sea" type="button" style={{ width: "100%" }} onClick={() => fillRequestFromRide("Трансфер: хочу создать свой выезд. Дата: " + (rideDate || "уточнить") + ", время: " + rideTime + ", людей: " + ridePeople + ", pickup: " + rideArea + ".", ridePeople, rideArea, rideDate)}>Создать заявку на трансфер</button>
              </div>
            </div>
            <div className="ride-no-card"><h3>Без трансфера</h3><p>Если у вас свой транспорт или такси, отметьте это в заявке — школа подтвердит только время урока и точку встречи на Bai Dai.</p><button className="btn ghost" type="button" style={{ width: "100%" }} onClick={() => fillRequestFromRide("Трансфер не нужен. Доберусь до Bai Dai самостоятельно, нужна только точка встречи и время урока.", "1", "Без трансфера")}>Мне трансфер не нужен</button></div>
          </section>

          <section className={"screen" + (screen === "prices" ? " active" : "")} id="prices">
            <div className="screen-hero price-hero"><div className="screen-hero-board" aria-hidden="true"/><h2>Сеты для первого раза и прогресса</h2><p>Карточки кликабельны: выберите урок, пакет, аренду или акцию — позиция сразу попадёт в заявку.</p></div>
            <div className="price-tabs">
              {([["all", "Все"], ["lesson", "Уроки"], ["pack", "Пакеты"], ["rent", "Аренда"], ["promo", "Акции"]] as const).map(([value, label]) => <button className={priceFilter === value ? "active" : ""} type="button" key={value} onClick={() => setPriceFilter(value)}>{label}</button>)}
            </div>
            <div className="price-list">
              {priceItems.filter((item) => priceFilter === "all" || item.kind === priceFilter).map((item) => (
                <button className="price-card" type="button" key={item.service} onClick={() => choosePrice(item)}><div><h3>{item.title}</h3><p>{item.description}</p></div><div className="price-value">{item.value}</div><div className="select-line">Выбрать и перейти к заявке</div></button>
              ))}
            </div>
          </section>

          <section className={"screen" + (screen === "request" ? " active" : "")} id="request">
            <div className="section-title"><h2>Заявка</h2><small>demo only</small></div>
            <div className="card dark-card"><h3>Мы всё соберём за вас</h3><p>Оставьте контакт, дату и сколько вас. Заявка сохраняется как демо, без реальной отправки в CRM или Telegram.</p></div>
            <form className="card" onSubmit={submitLead}>
              <div className="field"><label htmlFor="name">Имя</label><input id="name" name="name" placeholder="Например, Антон" required value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })}/></div>
              <div className="field"><label htmlFor="messenger">Telegram или WhatsApp</label><input id="messenger" name="messenger" placeholder="@username или +84..." required value={lead.messenger} onChange={(event) => setLead({ ...lead, messenger: event.target.value })}/></div>
              <div className="inline"><div className="field"><label htmlFor="service">Что интересует</label><select id="service" name="service" value={lead.service} onChange={(event) => setLead({ ...lead, service: event.target.value })}>{serviceOptions.map((option) => <option key={option}>{option}</option>)}</select></div><div className="field"><label htmlFor="people">Сколько вас</label><select id="people" name="people" value={lead.people} onChange={(event) => setLead({ ...lead, people: event.target.value })}><option>1</option><option>2</option><option>3</option><option>4+</option></select></div></div>
              <div className="inline"><div className="field"><label htmlFor="date">Дата</label><input id="date" type="date" name="date" value={lead.date} onChange={(event) => setLead({ ...lead, date: event.target.value })}/></div><div className="field"><label htmlFor="pickup">Откуда выезд</label><select id="pickup" name="pickup" value={lead.pickup} onChange={(event) => setLead({ ...lead, pickup: event.target.value })}><option>Нячанг · центр</option><option>Нячанг · север</option><option>Нячанг · юг / An Vien</option><option>Без трансфера</option><option>Отель уточню позже</option></select></div></div>
              <div className="field"><label htmlFor="note">Комментарий</label><textarea id="note" name="note" placeholder="Например: мы вдвоём, готовы присоединиться к общей машине завтра" value={lead.note} onChange={(event) => setLead({ ...lead, note: event.target.value })}/></div>
              <button className="btn sea" style={{ width: "100%" }} type="submit">Сохранить демо-заявку</button>
            </form>
          </section>

          <section className={"screen" + (screen === "rider" ? " active" : "")} id="rider">
            <div className="rider-hero"><div className="tribal" aria-hidden="true"/><h2>Мой путь к волне</h2><p>Урок, райд, контакт и следующий шаг — в одном месте. Пока это demo-профиль, но логика уже как в настоящем кабинете райдера.</p><div className="rider-name"><div className="avatar">{topAvatar}</div><div><b>{savedLead?.name || "Новый райдер"}</b><span>{savedLead?.messenger || "Контакт ещё не указан"}</span></div></div></div>
            <div className="profile-grid"><div className="profile-stat"><small>Уровень</small><b>{riderLevel}</b></div><div className="profile-stat"><small>Статус</small><b>{savedLead ? "Ожидает" : "Demo"}</b></div></div>
            {!savedLead ? (
              <div className="empty-account"><h3>Пока нет заявки</h3><p>Сначала подберите уровень, выберите райд или сет. После демо-заявки здесь появится ваш план поездки к волне.</p><div className="rider-actions"><button className="btn primary" type="button" onClick={() => go("lessons")}>Подобрать уровень</button><button className="btn dark" type="button" onClick={() => go("transfer")}>Выбрать райд</button></div></div>
            ) : (
              <div className="wave-plan">
                <div className="wave-plan-head"><div><h3>Wave-план райдера</h3><p>Всё, что нужно перед выездом к волне. Администратор школы подтверждает детали вручную.</p></div><div className="status-badge">ожидает подтверждения</div></div>
                <div className="plan-row"><div className="plan-icon">🏄</div><div><strong>Урок / сет</strong><span>{savedLead.service || "—"}</span></div></div>
                <div className="plan-row"><div className="plan-icon">🚐</div><div><strong>Райд / pickup</strong><span>{savedLead.pickup || "—"}</span></div></div>
                <div className="plan-row"><div className="plan-icon">📅</div><div><strong>Дата</strong><span>{savedLead.date || "уточнить с администратором"}</span></div></div>
                <div className="plan-row"><div className="plan-icon">👥</div><div><strong>Сколько вас</strong><span>{savedLead.people || "—"}</span></div></div>
                <div className="plan-row"><div className="plan-icon">✍️</div><div><strong>Комментарий</strong><span>{savedLead.note || "без комментария"}</span></div></div>
                <div className="rider-actions"><button className="btn sea" type="button" onClick={() => go("request")}>Изменить заявку</button><a className="btn ghost" href="https://t.me/truesurf" target="_blank" rel="noreferrer">Telegram школы</a></div>
              </div>
            )}
            <div className="mini-note">В полном продукте здесь должны быть реальные статусы: заявка получена, трансфер собирается, машина подтверждена, урок подтверждён, история занятий и прогресс райдера. В этом прототипе кабинет читает только локальную demo-заявку.</div>
          </section>

          <section className={"screen" + (screen === "admin" ? " active" : "")} id="admin">
            <div className="admin-hero"><div className="tribal" aria-hidden="true"/><h2>Умная админка школы</h2><p>Демо-пульт администратора: заявки, райды, подсказки по уровню и следующие действия. Без реальной отправки в CRM или Telegram.</p></div>
            <div className="admin-grid"><div className="admin-stat"><small>Новые заявки</small><b>{leads.length}</b></div><div className="admin-stat"><small>Райд сегодня</small><b>{savedLead?.pickup.includes("Нячанг") ? "4 / 4" : "3 / 4"}</b></div><div className="admin-stat"><small>Нужно действие</small><b>{leads.length}</b></div><div className="admin-stat"><small>Статус</small><b>Demo</b></div></div>
            <div className="section-title"><h2>Входящие</h2><small>smart sorting</small></div>
            <div className="admin-board">
              {leads.map((item, index) => {
                const classification = classifyLead(item);
                const hot = classification.priority === "горячая" || classification.priority === "внимание";
                return (
                  <article className={"lead-card" + (hot ? " hot" : "")} key={item.name + index}>
                    <div className="lead-top"><div><h3>{item.name || "Новый райдер"}</h3><p>{item.messenger || "контакт не указан"} · {item.date || "дата не выбрана"}</p></div><div className={"priority" + (classification.priority === "внимание" ? " warn" : "")}>{classification.badge}<br/><small>{adminStatuses[index] || "ожидает"}</small></div></div>
                    <div className="tagrow"><span className="tag">{item.service || "услуга не выбрана"}</span><span className="tag">{item.people || "1"} чел.</span><span className="tag">{item.pickup || "pickup уточнить"}</span></div>
                    <div className="smart-note">{classification.hint}</div>
                    <div className="admin-actions three"><button className="mini-btn primary" type="button" onClick={() => updateAdminStatus(index, "confirmed")}>Подтвердить</button><button className="mini-btn wood" type="button" onClick={() => updateAdminStatus(index, "ride")}>{classification.next}</button><button className="mini-btn" type="button" onClick={() => updateAdminStatus(index, "message")}>Написать</button></div>
                  </article>
                );
              })}
            </div>
            <div className="section-title"><h2>Райды</h2><small>пул мест</small></div>
            <div className="card">
              <div className="ops-row"><div className="ops-icon">🚐</div><div><strong>Сегодня · 09:00</strong><span>Нячанг центр → Bai Dai · осталось 1 место</span></div><div className="ops-badge">3 / 4</div></div>
              <div className="ops-row"><div className="ops-icon">🌊</div><div><strong>Завтра · 08:30</strong><span>Центр / север Нячанга · удобно для пары</span></div><div className="ops-badge">2 / 4</div></div>
              <div className="ops-row"><div className="ops-icon">⏳</div><div><strong>Суббота · 09:00</strong><span>Машина набрана · новых райдеров в лист ожидания</span></div><div className="ops-badge">4 / 4</div></div>
            </div>
            <div className="section-title"><h2>Умные подсказки</h2><small>что делать</small></div>
            <div className="card dark-card"><h3>Операционный фокус</h3><p>Если заявка от одного райдера из Нячанга — сначала предложить общий райд 3/4. Если есть страх глубины или ограничения — не подтверждать группу автоматически, отдать инструктору на ручное решение.</p></div>
            <div className="admin-note">Это demo-админка в рамках прототипа: кнопки имитируют операционные действия и меняют статус локально. Реальных записей, сообщений, оплат, CRM-записей или Telegram-отправок здесь нет.</div>
          </section>
        </main>

        <nav className="bottom-nav" aria-label="Основная навигация">
          <div className="nav-inner">
            {([
              ["home", "Лайн-ап"],
              ["lessons", "Уровень"],
              ["transfer", "Райд"],
              ["prices", "Прайс"],
            ] as const).map(([id, label]) => (
              <button className={"nav-btn" + (screen === id ? " active" : "")} type="button" key={id} onClick={() => go(id)}>
                <div className="iconbox" aria-hidden="true"><NavIcon type={id}/></div><span>{label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
      <div className={"toast" + (toast ? " show" : "")} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
