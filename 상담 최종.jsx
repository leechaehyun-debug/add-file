import React, { useState } from "react";
import {
  Heart, Star, Sparkles, Crown, Cloud, Flower2, BookOpen, Feather,
  Home, Calendar, Clock, CheckCircle2, MessageCircle, Users, Sprout,
  GraduationCap, User, ChevronRight, ChevronLeft, Bell, AlertCircle,
  LogOut, X, Plus, Eye, RotateCcw, Check, ClipboardList, CalendarDays,
  CalendarClock, ShieldCheck, PenSquare, ArrowLeft, Smile, Sun,
} from "lucide-react";

/* ============================== 목업 데이터 ============================== */

const COUNSEL_TYPES = [
  { id: "friend", label: "친구·교우관계", desc: "친구와의 갈등, 따돌림, 관계 고민", icon: Users },
  { id: "school", label: "학교생활·마음 고민", desc: "학교생활이 힘들거나 마음이 답답한 경우", icon: Sprout },
  { id: "study", label: "학업·진로", desc: "공부, 성적, 진로에 관한 고민", icon: GraduationCap },
  { id: "personal", label: "개인적인 고민", desc: "가족이나 개인적인 문제", icon: Home },
  { id: "etc", label: "그냥 선생님과 이야기하고 싶어요", desc: "딱히 분류하기 어려운 경우", icon: MessageCircle },
];

const URGENCY = {
  low: { label: "일반 상담이에요", desc: "시간이 될 때 상담하고 싶어요.", dot: "bg-green-400", chip: "bg-green-50 text-green-700 border-green-200" },
  mid: { label: "조금 급해요", desc: "가능하면 빠른 시간에 이야기하고 싶어요.", dot: "bg-amber-400", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  high: { label: "가능한 빨리 이야기하고 싶어요", desc: "선생님의 빠른 확인이 필요해요.", dot: "bg-rose-400", chip: "bg-rose-50 text-rose-700 border-rose-200" },
};

const STATUS = {
  requested: { label: "신청됨", dot: "bg-amber-400", chip: "bg-amber-50 text-amber-700 border-amber-200" },
  checked: { label: "확인함", dot: "bg-blue-400", chip: "bg-blue-50 text-blue-700 border-blue-200" },
  scheduled: { label: "상담 예정", dot: "bg-purple-400", chip: "bg-purple-50 text-purple-700 border-purple-200" },
  done: { label: "상담 완료", dot: "bg-green-400", chip: "bg-green-50 text-green-700 border-green-200" },
  canceled: { label: "취소됨", dot: "bg-gray-300", chip: "bg-gray-50 text-gray-500 border-gray-200" },
};

const initialAvailability = {
  "8월 24일 월요일": [
    { time: "08:20", booked: false },
    { time: "12:40", booked: true },
    { time: "15:40", booked: false },
    { time: "16:10", booked: false },
  ],
  "8월 25일 화요일": [
    { time: "12:40", booked: false },
    { time: "16:10", booked: false },
  ],
  "8월 26일 수요일": [
    { time: "08:20", booked: false },
    { time: "15:40", booked: true },
  ],
};

const initialRequests = [
  { id: 1, studentName: "김하늘", type: "friend", method: "만남", date: "8월 24일 월요일", time: "15:40", applied: "8월 20일", message: "친구랑 요즘 자주 다퉈서 마음이 힘들어요.", urgency: "mid", status: "scheduled", checked: true },
  { id: 2, studentName: "이수아", type: "study", method: "글", date: "8월 25일 화요일", time: "12:40", applied: "8월 20일", message: "", urgency: "low", status: "requested", checked: false },
  { id: 3, studentName: "박도윤", type: "personal", method: "만남", date: "8월 24일 월요일", time: "08:20", applied: "8월 19일", message: "요즘 집안일로 마음이 복잡해요.", urgency: "high", status: "requested", checked: false },
  { id: 4, studentName: "최지안", type: "school", method: "만남", date: "8월 19일 수요일", time: "15:40", applied: "8월 15일", message: "", urgency: "low", status: "done", checked: true, result: "관찰" },
  { id: 5, studentName: "정민서", type: "etc", method: "글", date: "-", time: "-", applied: "8월 18일", message: "그냥 이야기하고 싶어요.", urgency: "low", status: "canceled", checked: true },
  { id: 6, studentName: "김하늘", type: "school", method: "만남", date: "8월 10일", time: "13:00", applied: "8월 8일", message: "", urgency: "low", status: "done", checked: true, result: "완료" },
  { id: 7, studentName: "한서준", type: "friend", method: "글", date: "-", time: "-", applied: "8월 20일", message: "", urgency: "high", status: "requested", checked: false, quick: true },
];

const typeMeta = (id) => COUNSEL_TYPES.find((t) => t.id === id) || COUNSEL_TYPES[4];

/* ============================== 공통 UI ============================== */

function Deco({ className, children }) {
  return <div className={`pointer-events-none select-none absolute text-pink-200 ${className}`}>{children}</div>;
}

function PageShell({ children, tone = "student" }) {
  const bg =
    tone === "student"
      ? "bg-gradient-to-b from-pink-50 via-orange-50 to-purple-50"
      : "bg-gradient-to-b from-purple-50 via-orange-50 to-pink-50";
  return (
    <div className={`relative min-h-full w-full ${bg} overflow-hidden`}>
      <Deco className="top-4 left-4"><Cloud size={40} strokeWidth={1.5} /></Deco>
      <Deco className="top-6 right-6"><Star size={22} strokeWidth={1.5} className="text-amber-300" /></Deco>
      <Deco className="bottom-10 left-6"><Flower2 size={28} strokeWidth={1.5} className="text-purple-200" /></Deco>
      <Deco className="bottom-24 right-8"><Sparkles size={24} strokeWidth={1.5} className="text-pink-300" /></Deco>
      <div className="relative z-10 mx-auto max-w-md min-h-full px-5 pb-8 pt-6">{children}</div>
    </div>
  );
}

function Card({ children, className = "", onClick, selected }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl bg-white/90 border ${
        selected ? "border-pink-300 ring-2 ring-pink-200" : "border-pink-100"
      } shadow-sm p-4 transition-all ${onClick ? "cursor-pointer active:scale-[0.98] hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-full py-4 text-base font-bold shadow-sm transition-all active:scale-[0.98] ${
        disabled
          ? "bg-pink-100 text-pink-300 cursor-not-allowed"
          : "bg-pink-400 hover:bg-pink-500 text-white"
      } ${className}`}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-full py-3.5 text-sm font-semibold text-purple-500 bg-white/80 border border-purple-200 hover:bg-purple-50 active:scale-[0.98] transition-all ${className}`}
    >
      {children}
    </button>
  );
}

function TopBar({ title, onBack, right }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <button
        onClick={onBack}
        className={`h-9 w-9 flex items-center justify-center rounded-full bg-white/80 border border-pink-100 text-pink-400 ${!onBack && "invisible"}`}
      >
        <ArrowLeft size={18} />
      </button>
      <h1 className="text-[15px] font-bold text-stone-600">{title}</h1>
      <div className="h-9 w-9 flex items-center justify-center">{right}</div>
    </div>
  );
}

function StepDots({ step, total }) {
  return (
    <div className="flex gap-1.5 justify-center mb-5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-pink-400" : "w-1.5 bg-pink-100"}`} />
      ))}
    </div>
  );
}

function Chip({ tone, children }) {
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{children}</span>;
}

/* ============================== 로그인 ============================== */

const TEACHER_PIN = "1234";

function TeacherPinScreen({ onBack, onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const press = (d) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setError(false);
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (next === TEACHER_PIN) {
          onSuccess();
        } else {
          setError(true);
          setPin("");
        }
      }, 150);
    }
  };
  const backspace = () => { setError(false); setPin((p) => p.slice(0, -1)); };

  return (
    <PageShell tone="teacher">
      <TopBar title="담임교사 로그인" onBack={onBack} />
      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center mb-3">
          <ShieldCheck className="text-purple-400" size={24} />
        </div>
        <p className="font-bold text-stone-700 text-sm mb-1">비밀번호 4자리를 입력해주세요</p>
        <p className="text-xs text-stone-400">학생과 다른 화면이라 확인이 필요해요</p>
      </div>

      <div className="flex justify-center gap-3 mb-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-3.5 w-3.5 rounded-full border ${pin.length > i ? "bg-purple-400 border-purple-400" : "bg-white border-purple-200"} transition-all`} />
        ))}
      </div>
      <p className={`text-center text-xs mb-6 h-4 ${error ? "text-rose-400 font-semibold" : "text-transparent"}`}>비밀번호가 올바르지 않아요</p>

      <div className="grid grid-cols-3 gap-3 max-w-[260px] mx-auto">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            onClick={() => press(d)}
            className="h-14 rounded-2xl bg-white/90 border border-purple-100 text-lg font-bold text-stone-600 active:scale-95 transition-all shadow-sm"
          >
            {d}
          </button>
        ))}
        <div />
        <button onClick={() => press("0")} className="h-14 rounded-2xl bg-white/90 border border-purple-100 text-lg font-bold text-stone-600 active:scale-95 transition-all shadow-sm">0</button>
        <button onClick={backspace} className="h-14 rounded-2xl bg-white/60 border border-purple-100 text-stone-400 flex items-center justify-center active:scale-95 transition-all">
          <ArrowLeft size={18} />
        </button>
      </div>
      <p className="text-center text-[11px] text-stone-300 mt-6">데모 비밀번호: 1234</p>
    </PageShell>
  );
}

function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState("student");
  const [askPin, setAskPin] = useState(false);

  if (askPin) {
    return <TeacherPinScreen onBack={() => setAskPin(false)} onSuccess={() => onLogin("teacher")} />;
  }

  return (
    <PageShell tone="student">
      <div className="flex flex-col items-center mt-6 mb-8">
        <div className="h-16 w-16 rounded-full bg-white/90 border border-pink-100 shadow-sm flex items-center justify-center mb-3">
          <Feather className="text-pink-400" size={28} strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold text-stone-700">마음 편지함</h1>
        <p className="text-xs text-stone-400 mt-1">담임 선생님과 이야기하는 작은 창구</p>
      </div>

      <div className="flex bg-white/70 rounded-full p-1 border border-pink-100 mb-6">
        <button
          onClick={() => setTab("student")}
          className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${tab === "student" ? "bg-pink-400 text-white" : "text-stone-400"}`}
        >
          학생
        </button>
        <button
          onClick={() => setTab("teacher")}
          className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-all ${tab === "teacher" ? "bg-purple-400 text-white" : "text-stone-400"}`}
        >
          담임교사
        </button>
      </div>

      <Card className="mb-4">
        {tab === "student" ? (
          <div className="flex items-center gap-3 py-2">
            <div className="h-11 w-11 rounded-full bg-pink-100 flex items-center justify-center text-pink-400 font-bold">하</div>
            <div>
              <p className="font-bold text-stone-700 text-sm">김하늘 학생</p>
              <p className="text-xs text-stone-400">1학년 3반 (데모 계정)</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 py-2">
            <div className="h-11 w-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-400 font-bold">채</div>
            <div>
              <p className="font-bold text-stone-700 text-sm">김채현 선생님</p>
              <p className="text-xs text-stone-400">1학년 3반 담임 (데모 계정)</p>
            </div>
          </div>
        )}
      </Card>

      <PrimaryButton
        onClick={() => (tab === "teacher" ? setAskPin(true) : onLogin(tab))}
        className={tab === "teacher" ? "bg-purple-400 hover:bg-purple-500" : ""}
      >
        {tab === "student" ? "학생으로 들어가기 🌷" : "담임교사로 들어가기"}
      </PrimaryButton>
    </PageShell>
  );
}

/* ============================== 학생 화면들 ============================== */

function StudentHome({ requests, onStart, onQuickHelp, onGoStatus }) {
  const mine = requests.filter((r) => r.studentName === "김하늘");
  const next = mine.find((r) => r.status === "scheduled") || mine.find((r) => r.status === "requested" || r.status === "checked");

  return (
    <PageShell tone="student">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-bold text-stone-700">오늘도 반가워요, 하늘님 🌷</p>
          <p className="text-xs text-stone-400 mt-0.5">1학년 3반 · 김채현 선생님 반</p>
        </div>
        <button onClick={onGoStatus} className="h-10 w-10 rounded-full bg-white/80 border border-pink-100 flex items-center justify-center text-pink-400">
          <ClipboardList size={18} />
        </button>
      </div>

      <button
        onClick={onStart}
        className="w-full rounded-3xl bg-gradient-to-br from-pink-400 to-pink-300 text-white p-5 text-left shadow-md mb-3 active:scale-[0.98] transition-all relative overflow-hidden"
      >
        <Sparkles className="absolute top-3 right-4 text-white/40" size={26} />
        <p className="text-[13px] text-white/90 mb-1">눌러서 시작해요</p>
        <p className="text-lg font-bold flex items-center gap-1.5">💗 선생님께 상담 신청하기</p>
      </button>

      <button
        onClick={onQuickHelp}
        className="w-full rounded-3xl bg-white/90 border border-purple-100 p-4 text-left shadow-sm mb-6 active:scale-[0.98] transition-all"
      >
        <p className="font-bold text-purple-500 flex items-center gap-1.5">🙋 선생님, 저 좀 봐주세요</p>
        <p className="text-xs text-stone-400 mt-1">이유를 적지 않아도 선생님께 신호를 보낼 수 있어요</p>
      </button>

      <p className="text-xs font-bold text-stone-400 mb-2 px-1">나의 상담 신청 현황</p>
      {next ? (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-pink-400">다음 상담</span>
            <Chip tone={STATUS[next.status].chip}>
              <span className={`h-1.5 w-1.5 rounded-full ${STATUS[next.status].dot}`} />
              {STATUS[next.status].label}
            </Chip>
          </div>
          <p className="font-bold text-stone-700">{next.date} {next.time !== "-" && `오후 ${next.time}`}</p>
          <p className="text-sm text-stone-400 mb-2">{typeMeta(next.type).label}</p>
          <p className="text-xs text-stone-500 flex items-center gap-1">
            {next.checked ? <><CheckCircle2 size={14} className="text-green-400" /> 선생님 확인 완료</> : <><Clock size={14} className="text-amber-400" /> 선생님 확인 대기 중</>}
          </p>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-stone-400 text-center py-2">아직 신청한 상담이 없어요.</p>
        </Card>
      )}
    </PageShell>
  );
}

function TypeSelect({ onBack, onNext, selected, setSelected }) {
  return (
    <PageShell tone="student">
      <TopBar title="상담 신청" onBack={onBack} />
      <StepDots step={0} total={5} />
      <p className="text-lg font-bold text-stone-700 mb-1">어떤 이야기를 나누고 싶나요?</p>
      <p className="text-xs text-stone-400 mb-5">자세히 몰라도 괜찮아요, 가까운 것을 골라주세요</p>
      <div className="space-y-3 mb-6">
        {COUNSEL_TYPES.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.id} selected={selected === t.id} onClick={() => setSelected(t.id)}>
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${selected === t.id ? "bg-pink-400 text-white" : "bg-pink-50 text-pink-400"}`}>
                  <Icon size={19} />
                </div>
                <div>
                  <p className="font-bold text-stone-700 text-sm">{t.label}</p>
                  <p className="text-xs text-stone-400">{t.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <PrimaryButton disabled={!selected} onClick={onNext}>다음 <ChevronRight className="inline" size={16} /></PrimaryButton>
    </PageShell>
  );
}

function MethodSelect({ onBack, onNext, method, setMethod }) {
  const options = [
    { id: "만남", label: "🪑 직접 만나서 이야기할래요", desc: "정해진 시간에 선생님과 만나요" },
    { id: "글", label: "✉️ 먼저 글로 이야기할래요", desc: "글로 편하게 마음을 전해요" },
  ];
  return (
    <PageShell tone="student">
      <TopBar title="상담 신청" onBack={onBack} />
      <StepDots step={1} total={5} />
      <p className="text-lg font-bold text-stone-700 mb-5">어떤 방법이 편할까요?</p>
      <div className="space-y-3 mb-6">
        {options.map((o) => (
          <Card key={o.id} selected={method === o.id} onClick={() => setMethod(o.id)} className="py-5">
            <p className="font-bold text-stone-700">{o.label}</p>
            <p className="text-xs text-stone-400 mt-1">{o.desc}</p>
          </Card>
        ))}
      </div>
      <PrimaryButton disabled={!method} onClick={onNext}>다음 <ChevronRight className="inline" size={16} /></PrimaryButton>
    </PageShell>
  );
}

function ScheduleSelect({ onBack, onNext, availability, date, setDate, time, setTime }) {
  return (
    <PageShell tone="student">
      <TopBar title="상담 신청" onBack={onBack} />
      <StepDots step={2} total={5} />
      <p className="text-lg font-bold text-stone-700 mb-1">언제가 편한가요?</p>
      <p className="text-xs text-stone-400 mb-5">선생님이 등록한 시간만 보여요</p>
      <div className="space-y-4 mb-6">
        {Object.entries(availability).map(([d, slots]) => (
          <div key={d}>
            <p className="text-sm font-bold text-stone-600 mb-2 flex items-center gap-1.5"><CalendarDays size={15} className="text-purple-300" />{d}</p>
            <div className="grid grid-cols-4 gap-2">
              {slots.map((s) => {
                const isSel = date === d && time === s.time;
                return (
                  <button
                    key={s.time}
                    disabled={s.booked}
                    onClick={() => { setDate(d); setTime(s.time); }}
                    className={`rounded-2xl py-2.5 text-xs font-bold border transition-all ${
                      s.booked
                        ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed"
                        : isSel
                        ? "bg-pink-400 text-white border-pink-400"
                        : "bg-pink-50 text-pink-500 border-pink-100 hover:bg-pink-100"
                    }`}
                  >
                    {s.time}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <PrimaryButton disabled={!date || !time} onClick={onNext}>다음 <ChevronRight className="inline" size={16} /></PrimaryButton>
    </PageShell>
  );
}

function MessageStep({ onBack, onNext, message, setMessage }) {
  return (
    <PageShell tone="student">
      <TopBar title="상담 신청" onBack={onBack} />
      <StepDots step={3} total={5} />
      <p className="text-lg font-bold text-stone-700 mb-1">선생님께 미리 알려드리고 싶은 내용이 있나요?</p>
      <p className="text-xs text-pink-400 mb-4">자세히 적지 않아도 괜찮아요. 작성하지 않고 바로 상담을 신청할 수도 있어요. 🌷</p>
      <Card className="mb-6">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="편하게 적어주세요 (선택 사항)"
          rows={6}
          className="w-full resize-none outline-none text-sm text-stone-600 placeholder:text-stone-300 bg-transparent"
        />
      </Card>
      <PrimaryButton onClick={onNext}>다음 <ChevronRight className="inline" size={16} /></PrimaryButton>
    </PageShell>
  );
}

function UrgencyStep({ onBack, onNext, urgency, setUrgency }) {
  return (
    <PageShell tone="student">
      <TopBar title="상담 신청" onBack={onBack} />
      <StepDots step={4} total={5} />
      <p className="text-lg font-bold text-stone-700 mb-5">선생님의 도움이 얼마나 빨리 필요하나요?</p>
      <div className="space-y-3 mb-6">
        {Object.entries(URGENCY).map(([key, u]) => (
          <Card key={key} selected={urgency === key} onClick={() => setUrgency(key)}>
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${u.dot}`} />
              <div>
                <p className="font-bold text-stone-700 text-sm">{u.label}</p>
                <p className="text-xs text-stone-400">{u.desc}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <PrimaryButton disabled={!urgency} onClick={onNext}>다음 <ChevronRight className="inline" size={16} /></PrimaryButton>
    </PageShell>
  );
}

function ConfirmStep({ onBack, onSubmit, draft }) {
  const t = typeMeta(draft.type);
  return (
    <PageShell tone="student">
      <TopBar title="신청 확인" onBack={onBack} />
      <Card className="mb-4">
        <p className="text-xs font-bold text-pink-400 mb-3">신청 내용</p>
        <div className="space-y-2 text-sm text-stone-600">
          <div className="flex justify-between"><span className="text-stone-400">상담 분야</span><span className="font-semibold">{t.label}</span></div>
          <div className="flex justify-between"><span className="text-stone-400">상담 방법</span><span className="font-semibold">{draft.method}</span></div>
          <div className="flex justify-between"><span className="text-stone-400">희망 시간</span><span className="font-semibold">{draft.date} {draft.time}</span></div>
          <div className="flex justify-between"><span className="text-stone-400">긴급도</span><span className="font-semibold">{URGENCY[draft.urgency].label}</span></div>
        </div>
      </Card>
      <Card className="mb-6 bg-purple-50/80 border-purple-100">
        <div className="flex gap-2">
          <ShieldCheck size={18} className="text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-500 leading-relaxed">
            <p className="font-bold text-stone-600 mb-1">상담 내용은 다른 학생에게 공개되지 않아요.</p>
            <p>다만 학생의 안전을 위해 도움이 필요한 상황에서는 보호자 또는 학교의 다른 선생님과 함께 도움을 요청할 수 있어요.</p>
          </div>
        </div>
      </Card>
      <PrimaryButton onClick={onSubmit}>상담 신청 완료하기 💗</PrimaryButton>
    </PageShell>
  );
}

function CompleteScreen({ onHome }) {
  return (
    <PageShell tone="student">
      <div className="flex flex-col items-center justify-center text-center pt-16">
        <div className="h-20 w-20 rounded-full bg-pink-100 flex items-center justify-center mb-5 relative">
          <CheckCircle2 className="text-pink-400" size={38} />
          <Star size={16} className="text-amber-300 absolute -top-1 -right-1" />
          <Sparkles size={14} className="text-purple-300 absolute -bottom-1 -left-2" />
        </div>
        <p className="text-lg font-bold text-stone-700 mb-2">💗 상담 신청이 완료되었어요.</p>
        <p className="text-sm text-stone-500 leading-relaxed mb-8">
          선생님이 확인하면 알려드릴게요.<br />혼자 고민하지 않고 이야기해 줘서 고마워요.
        </p>
      </div>
      <PrimaryButton onClick={onHome}>홈으로 돌아가기</PrimaryButton>
    </PageShell>
  );
}

function MyStatusScreen({ onBack, requests }) {
  const mine = requests.filter((r) => r.studentName === "김하늘");
  return (
    <PageShell tone="student">
      <TopBar title="나의 상담 현황" onBack={onBack} />
      <div className="space-y-3">
        {mine.map((r) => (
          <Card key={r.id}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-stone-400">{r.applied} 신청</span>
              <Chip tone={STATUS[r.status].chip}>
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS[r.status].dot}`} />
                {STATUS[r.status].label}
              </Chip>
            </div>
            <p className="font-bold text-stone-700 text-sm">{typeMeta(r.type).label}</p>
            <p className="text-xs text-stone-400">{r.date} {r.time !== "-" && r.time}</p>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function QuickHelpModal({ onClose, onConfirm }) {
  return (
    <div className="absolute inset-0 z-20 bg-stone-900/30 flex items-end sm:items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-stone-300"><X size={20} /></button>
        <div className="flex flex-col items-center text-center pt-2">
          <Smile className="text-pink-400 mb-3" size={32} />
          <p className="font-bold text-stone-700 mb-2">선생님께 이야기하고 싶다는<br />알림을 보낼까요?</p>
          <p className="text-xs text-stone-400 mb-6">상담 내용을 작성하지 않아도 괜찮아요.</p>
        </div>
        <PrimaryButton onClick={onConfirm}>💗 네, 알려주세요</PrimaryButton>
        <button onClick={onClose} className="w-full text-center text-xs text-stone-400 mt-3 py-1">다음에 할게요</button>
      </div>
    </div>
  );
}

/* ============================== 학생 앱 컨트롤러 ============================== */

function StudentApp({ requests, setRequests, onLogout }) {
  const [screen, setScreen] = useState("home");
  const [draft, setDraft] = useState({ type: null, method: null, date: null, time: null, message: "", urgency: null });
  const [showQuick, setShowQuick] = useState(false);
  const [availability, setAvailability] = useState(initialAvailability);

  const resetDraft = () => setDraft({ type: null, method: null, date: null, time: null, message: "", urgency: null });

  const submit = () => {
    const newReq = {
      id: Date.now(),
      studentName: "김하늘",
      type: draft.type,
      method: draft.method,
      date: draft.date,
      time: draft.time,
      applied: "8월 20일",
      message: draft.message,
      urgency: draft.urgency,
      status: "requested",
      checked: false,
    };
    setRequests((prev) => [newReq, ...prev]);
    setAvailability((prev) => ({
      ...prev,
      [draft.date]: prev[draft.date].map((s) => (s.time === draft.time ? { ...s, booked: true } : s)),
    }));
    setScreen("complete");
  };

  const submitQuick = () => {
    setRequests((prev) => [
      { id: Date.now(), studentName: "김하늘", type: "etc", method: "-", date: "-", time: "-", applied: "8월 20일", message: "", urgency: "mid", status: "requested", checked: false, quick: true },
      ...prev,
    ]);
    setShowQuick(false);
  };

  return (
    <div className="relative h-full">
      {screen === "home" && (
        <StudentHome
          requests={requests}
          onStart={() => { resetDraft(); setScreen("type"); }}
          onQuickHelp={() => setShowQuick(true)}
          onGoStatus={() => setScreen("status")}
        />
      )}
      {screen === "type" && (
        <TypeSelect onBack={() => setScreen("home")} onNext={() => setScreen("method")} selected={draft.type} setSelected={(v) => setDraft({ ...draft, type: v })} />
      )}
      {screen === "method" && (
        <MethodSelect onBack={() => setScreen("type")} onNext={() => setScreen(draft.method === "만남" ? "schedule" : "message")} method={draft.method} setMethod={(v) => setDraft({ ...draft, method: v })} />
      )}
      {screen === "schedule" && (
        <ScheduleSelect
          onBack={() => setScreen("method")}
          onNext={() => setScreen("message")}
          availability={availability}
          date={draft.date}
          setDate={(v) => setDraft({ ...draft, date: v })}
          time={draft.time}
          setTime={(v) => setDraft({ ...draft, time: v })}
        />
      )}
      {screen === "message" && (
        <MessageStep onBack={() => setScreen(draft.method === "만남" ? "schedule" : "method")} onNext={() => setScreen("urgency")} message={draft.message} setMessage={(v) => setDraft({ ...draft, message: v })} />
      )}
      {screen === "urgency" && (
        <UrgencyStep onBack={() => setScreen("message")} onNext={() => setScreen("confirm")} urgency={draft.urgency} setUrgency={(v) => setDraft({ ...draft, urgency: v })} />
      )}
      {screen === "confirm" && <ConfirmStep onBack={() => setScreen("urgency")} onSubmit={submit} draft={draft} />}
      {screen === "complete" && <CompleteScreen onHome={() => setScreen("home")} />}
      {screen === "status" && <MyStatusScreen onBack={() => setScreen("home")} requests={requests} />}
      {showQuick && <QuickHelpModal onClose={() => setShowQuick(false)} onConfirm={submitQuick} />}

      <button onClick={onLogout} className="absolute top-2 right-2 z-30 h-8 w-8 rounded-full bg-white/70 flex items-center justify-center text-stone-400">
        <LogOut size={14} />
      </button>
    </div>
  );
}

/* ============================== 교사 화면들 ============================== */

function TeacherDashboard({ requests, onGoList, onGoAvailability, onGoStudent }) {
  const newCount = requests.filter((r) => r.status === "requested").length;
  const todayCount = requests.filter((r) => r.date === "8월 24일 월요일").length;
  const urgentCount = requests.filter((r) => r.urgency === "high" && r.status !== "done" && r.status !== "canceled").length;
  const doneCount = requests.filter((r) => r.status === "done").length;

  const stats = [
    { label: "새로운 상담 신청", value: newCount, color: "text-pink-500", icon: Bell },
    { label: "오늘 상담", value: todayCount, color: "text-purple-500", icon: CalendarClock },
    { label: "빠른 확인 필요", value: urgentCount, color: "text-rose-500", icon: AlertCircle },
    { label: "상담 완료", value: doneCount, color: "text-green-500", icon: CheckCircle2 },
  ];

  return (
    <PageShell tone="teacher">
      <p className="text-lg font-bold text-stone-700 mb-5">🌷 우리 반 상담 관리</p>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((s) => (
          <Card key={s.label} onClick={onGoList}>
            <s.icon size={16} className={s.color} />
            <p className="text-2xl font-bold text-stone-700 mt-2">{s.value}<span className="text-sm text-stone-400 font-medium">건</span></p>
            <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="space-y-3">
        <GhostButton onClick={onGoList}><span className="flex items-center justify-center gap-1.5"><ClipboardList size={15} /> 상담 신청 목록 보기</span></GhostButton>
        <GhostButton onClick={onGoAvailability}><span className="flex items-center justify-center gap-1.5"><Calendar size={15} /> 상담 가능 시간 관리</span></GhostButton>
        <GhostButton onClick={onGoStudent}><span className="flex items-center justify-center gap-1.5"><User size={15} /> 학생별 상담 이력</span></GhostButton>
      </div>
    </PageShell>
  );
}

const urgencyRank = { high: 0, mid: 1, low: 2 };

function RequestList({ requests, onBack, onOpen }) {
  const sorted = [...requests].sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
  return (
    <PageShell tone="teacher">
      <TopBar title="상담 신청 목록" onBack={onBack} />
      <div className="space-y-3">
        {sorted.map((r) => (
          <Card key={r.id} onClick={() => onOpen(r.id)}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-stone-700 text-sm">{r.studentName}{r.quick && <span className="ml-1 text-[10px] text-pink-400 font-semibold">🙋 즉시 요청</span>}</span>
              <Chip tone={URGENCY[r.urgency].chip}><span className={`h-1.5 w-1.5 rounded-full ${URGENCY[r.urgency].dot}`} />{URGENCY[r.urgency].label}</Chip>
            </div>
            <p className="text-xs text-stone-500">{typeMeta(r.type).label} · {r.applied} 신청</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-stone-400">{r.date} {r.time !== "-" && r.time}</span>
              <Chip tone={STATUS[r.status].chip}><span className={`h-1.5 w-1.5 rounded-full ${STATUS[r.status].dot}`} />{STATUS[r.status].label}</Chip>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function RequestDetail({ req, onBack, onUpdate }) {
  const [followup, setFollowup] = useState(null);
  if (!req) return null;
  const t = typeMeta(req.type);

  return (
    <PageShell tone="teacher">
      <TopBar title="상담 상세" onBack={onBack} />
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-stone-700">{req.studentName}</p>
          <Chip tone={STATUS[req.status].chip}><span className={`h-1.5 w-1.5 rounded-full ${STATUS[req.status].dot}`} />{STATUS[req.status].label}</Chip>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-stone-400">상담 종류</span><span className="font-semibold text-stone-600">{t.label}</span></div>
          <div className="flex justify-between"><span className="text-stone-400">신청 날짜</span><span className="font-semibold text-stone-600">{req.applied}</span></div>
          <div className="flex justify-between"><span className="text-stone-400">희망 시간</span><span className="font-semibold text-stone-600">{req.date} {req.time}</span></div>
          <div className="flex justify-between"><span className="text-stone-400">긴급도</span><span className="font-semibold text-stone-600">{URGENCY[req.urgency].label}</span></div>
        </div>
      </Card>
      <Card className="mb-4">
        <p className="text-xs font-bold text-stone-400 mb-2">학생이 작성한 사전 메시지</p>
        <p className="text-sm text-stone-600 leading-relaxed">{req.message || "작성한 내용이 없어요."}</p>
      </Card>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => onUpdate(req.id, { checked: true, status: req.status === "requested" ? "checked" : req.status })} className="rounded-2xl bg-blue-50 text-blue-500 text-xs font-bold py-3 border border-blue-100">상담 확인</button>
        <button onClick={() => onUpdate(req.id, { status: "scheduled" })} className="rounded-2xl bg-purple-50 text-purple-500 text-xs font-bold py-3 border border-purple-100">상담 시간 변경</button>
        <button onClick={() => onUpdate(req.id, { status: "done" })} className="rounded-2xl bg-green-50 text-green-500 text-xs font-bold py-3 border border-green-100">상담 완료</button>
        <button onClick={() => onUpdate(req.id, { status: "scheduled" })} className="rounded-2xl bg-pink-50 text-pink-500 text-xs font-bold py-3 border border-pink-100">추가 상담 예약</button>
      </div>

      {req.status === "done" && (
        <Card>
          <p className="text-xs font-bold text-stone-400 mb-3">상담 결과 (간단히만 기록해요)</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "완료", label: "✅ 상담 완료" },
              { id: "관찰", label: "👀 추후 관찰" },
              { id: "추가", label: "📅 추가 상담 필요" },
              { id: "지원", label: "🤝 추가 지원 고려" },
            ].map((o) => (
              <button
                key={o.id}
                onClick={() => { setFollowup(o.id); onUpdate(req.id, { result: o.id }); }}
                className={`rounded-2xl text-xs font-bold py-3 border ${
                  (followup || req.result) === o.id ? "bg-stone-600 text-white border-stone-600" : "bg-stone-50 text-stone-500 border-stone-100"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-400 mt-3 leading-relaxed">상담 상세 내용은 별도로 저장하지 않아요. 민감한 내용은 앱에 길게 기록하지 않는 것을 권장해요.</p>
        </Card>
      )}
    </PageShell>
  );
}

function TimeSlotRow({ date, slot, index, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(slot.time);

  if (slot.booked) {
    return (
      <div className="flex items-center justify-between rounded-2xl bg-gray-50 border border-gray-100 px-3 py-2.5">
        <span className="text-xs font-semibold text-gray-400">{slot.time} · 이미 학생이 예약함</span>
        <span className="text-[10px] text-gray-300">수정 불가</span>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-purple-50 border border-purple-200 px-3 py-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="예: 14:00"
          className="flex-1 bg-transparent outline-none text-sm font-semibold text-stone-700 min-w-0"
        />
        <button
          onClick={() => { if (value.trim()) { onSave(index, value.trim()); setEditing(false); } }}
          className="h-7 w-7 rounded-full bg-purple-400 text-white flex items-center justify-center shrink-0"
        >
          <Check size={14} />
        </button>
        <button onClick={() => { setValue(slot.time); setEditing(false); }} className="h-7 w-7 rounded-full bg-white text-stone-400 border border-stone-200 flex items-center justify-center shrink-0">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-2xl bg-pink-50 border border-pink-100 px-3 py-2.5">
      <span className="text-xs font-semibold text-pink-500">{slot.time}</span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => setEditing(true)} className="h-7 w-7 rounded-full bg-white text-pink-400 border border-pink-100 flex items-center justify-center">
          <PenSquare size={13} />
        </button>
        <button onClick={() => onDelete(index)} className="h-7 w-7 rounded-full bg-white text-stone-300 border border-stone-100 flex items-center justify-center">
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

function AvailabilityManage({ onBack, availability, setAvailability }) {
  const [newTimes, setNewTimes] = useState({});

  const saveSlot = (date, index, newTime) => {
    setAvailability((prev) => ({
      ...prev,
      [date]: prev[date].map((s, i) => (i === index ? { ...s, time: newTime } : s)),
    }));
  };

  const deleteSlot = (date, index) => {
    setAvailability((prev) => ({ ...prev, [date]: prev[date].filter((_, i) => i !== index) }));
  };

  const addSlot = (date) => {
    const t = (newTimes[date] || "").trim();
    if (!t) return;
    setAvailability((prev) => ({ ...prev, [date]: [...prev[date], { time: t, booked: false }] }));
    setNewTimes((prev) => ({ ...prev, [date]: "" }));
  };

  return (
    <PageShell tone="teacher">
      <TopBar title="상담 가능 시간 관리" onBack={onBack} />
      <p className="text-xs text-stone-400 mb-4 px-1">연필 아이콘으로 시간을 수정하고, 아래 입력창으로 새 시간을 등록할 수 있어요. 이미 예약된 시간은 수정할 수 없어요.</p>
      <div className="space-y-4">
        {Object.entries(availability).map(([d, slots]) => (
          <Card key={d}>
            <p className="font-bold text-stone-600 text-sm flex items-center gap-1.5 mb-3"><CalendarDays size={15} className="text-purple-300" />{d}</p>
            <div className="space-y-2 mb-3">
              {slots.map((s, i) => (
                <TimeSlotRow
                  key={`${d}-${i}`}
                  date={d}
                  slot={s}
                  index={i}
                  onSave={(idx, val) => saveSlot(d, idx, val)}
                  onDelete={(idx) => deleteSlot(d, idx)}
                />
              ))}
              {slots.length === 0 && <p className="text-xs text-stone-300 text-center py-2">등록된 시간이 없어요.</p>}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={newTimes[d] || ""}
                onChange={(e) => setNewTimes((prev) => ({ ...prev, [d]: e.target.value }))}
                placeholder="새 시간 추가 (예: 14:00)"
                className="flex-1 rounded-2xl bg-stone-50 border border-stone-100 px-3 py-2 text-xs outline-none text-stone-600 placeholder:text-stone-300 min-w-0"
              />
              <button onClick={() => addSlot(d)} className="h-8 w-8 rounded-full bg-pink-400 text-white flex items-center justify-center shrink-0">
                <Plus size={15} />
              </button>
            </div>
          </Card>
        ))}
        <button className="w-full rounded-2xl border border-dashed border-purple-200 text-purple-400 text-xs font-bold py-3">+ 상담 불가능한 날 지정하기</button>
      </div>
    </PageShell>
  );
}

function StudentHistoryList({ onBack, requests, onOpenStudent }) {
  const names = [...new Set(requests.map((r) => r.studentName))];
  return (
    <PageShell tone="teacher">
      <TopBar title="학생별 상담 이력" onBack={onBack} />
      <div className="space-y-2">
        {names.map((n) => (
          <Card key={n} onClick={() => onOpenStudent(n)}>
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700 text-sm">{n}</span>
              <ChevronRight size={16} className="text-stone-300" />
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

function StudentHistoryDetail({ name, requests, onBack }) {
  const mine = requests.filter((r) => r.studentName === name);
  return (
    <PageShell tone="teacher">
      <TopBar title={`${name} 학생`} onBack={onBack} />
      <div className="space-y-3">
        {mine.map((r) => (
          <Card key={r.id}>
            <p className="text-xs text-stone-400 mb-1">{r.applied}</p>
            <p className="font-bold text-stone-700 text-sm">{typeMeta(r.type).label}</p>
            <Chip tone={STATUS[r.status].chip}><span className={`h-1.5 w-1.5 rounded-full ${STATUS[r.status].dot}`} />{r.result ? `상담 완료 · ${r.result}` : STATUS[r.status].label}</Chip>
          </Card>
        ))}
      </div>
      <p className="text-[11px] text-stone-400 mt-4 text-center leading-relaxed">상담의 자세한 내용은 보관하지 않고, 진행 상태만 확인할 수 있어요.</p>
    </PageShell>
  );
}

/* ============================== 교사 앱 컨트롤러 ============================== */

function TeacherApp({ requests, setRequests, onLogout }) {
  const [screen, setScreen] = useState("dashboard");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [availability, setAvailability] = useState(initialAvailability);

  const updateRequest = (id, patch) => setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const selectedReq = requests.find((r) => r.id === selectedId);

  return (
    <div className="relative h-full">
      {screen === "dashboard" && (
        <TeacherDashboard
          requests={requests}
          onGoList={() => setScreen("list")}
          onGoAvailability={() => setScreen("availability")}
          onGoStudent={() => setScreen("studentList")}
        />
      )}
      {screen === "list" && (
        <RequestList requests={requests} onBack={() => setScreen("dashboard")} onOpen={(id) => { setSelectedId(id); setScreen("detail"); }} />
      )}
      {screen === "detail" && <RequestDetail req={selectedReq} onBack={() => setScreen("list")} onUpdate={updateRequest} />}
      {screen === "availability" && <AvailabilityManage onBack={() => setScreen("dashboard")} availability={availability} setAvailability={setAvailability} />}
      {screen === "studentList" && <StudentHistoryList onBack={() => setScreen("dashboard")} requests={requests} onOpenStudent={(n) => { setSelectedStudent(n); setScreen("studentDetail"); }} />}
      {screen === "studentDetail" && <StudentHistoryDetail name={selectedStudent} requests={requests} onBack={() => setScreen("studentList")} />}

      <button onClick={onLogout} className="absolute top-2 right-2 z-30 h-8 w-8 rounded-full bg-white/70 flex items-center justify-center text-stone-400">
        <LogOut size={14} />
      </button>
    </div>
  );
}

/* ============================== 루트 앱 ============================== */

export default function App() {
  const [role, setRole] = useState(null);
  const [requests, setRequests] = useState(initialRequests);

  return (
    <div className="w-full h-[780px] max-h-[95vh] rounded-[2rem] overflow-hidden border border-pink-100 shadow-lg bg-white mx-auto" style={{ maxWidth: 420 }}>
      <div className="h-full overflow-y-auto">
        {!role && <LoginScreen onLogin={setRole} />}
        {role === "student" && <StudentApp requests={requests} setRequests={setRequests} onLogout={() => setRole(null)} />}
        {role === "teacher" && <TeacherApp requests={requests} setRequests={setRequests} onLogout={() => setRole(null)} />}
        <p className="text-right text-[10px] text-stone-300 pr-4 pb-3 pt-1">제작자: 교사 이채현</p>
      </div>
    </div>
  );
}
