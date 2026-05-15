"use client";

import { useEffect, useState } from "react";
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI } from "@tonconnect/ui-react";

type Tab = "home" | "city" | "shop" | "wardrobe" | "profile";
type BoostType = "none" | "x2" | "x3";

type BusinessKey =
  | "lemonade"
  | "coffee"
  | "carWash"
  | "gym"
  | "cinema"
  | "bank"
  | "hotel"
  | "office"
  | "cryptoLab"
  | "airport"
  | "spaceTower";

type SkinKey = "default" | "cap" | "goldSuit" | "cyberMask" | "king";

type Business = {
  key: BusinessKey;
  title: string;
  price: number;
  bonus: number;
  color: string;
  label: string;
};

type Skin = {
  key: SkinKey;
  title: string;
  price: number;
  diamondPrice?: number;
  emoji: string;
  bonus: string;
};

type DiamondPack = {
  id: string;
  title: string;
  diamonds: number;
  ton: number;
  nanotons: string;
  tag: string;
};

const BOOST_DURATION = 300;
const MANIFEST_URL = "https://mini-empire-mbkr.vercel.app/tonconnect-manifest.json";
const OWNER_WALLET_ADDRESS = "UQAS3MPUQ51E4j1Dn0-rBZ9Eh-1lLSARiMHpKsrDygprL8am";

const diamondPacks: DiamondPack[] = [
  { id: "starter", title: "Starter Pack", diamonds: 100, ton: 0.5, nanotons: "500000000", tag: "Basic" },
  { id: "value", title: "Value Pack", diamonds: 250, ton: 1, nanotons: "1000000000", tag: "+25% bonus" },
  { id: "pro", title: "Pro Pack", diamonds: 600, ton: 2, nanotons: "2000000000", tag: "+50% bonus" },
  { id: "empire", title: "Empire Pack", diamonds: 1500, ton: 5, nanotons: "5000000000", tag: "Best value" },
];

const businesses: Business[] = [
  { key: "lemonade", title: "Lemonade Stand", price: 300, bonus: 5, color: "bg-yellow-500", label: "SHOP" },
  { key: "coffee", title: "Coffee Bar", price: 900, bonus: 12, color: "bg-orange-500", label: "CAFE" },
  { key: "carWash", title: "Car Wash", price: 2200, bonus: 25, color: "bg-blue-500", label: "WASH" },
  { key: "gym", title: "Gym", price: 5000, bonus: 55, color: "bg-red-500", label: "GYM" },
  { key: "cinema", title: "Cinema", price: 12000, bonus: 120, color: "bg-pink-500", label: "MOVIE" },
  { key: "bank", title: "Bank", price: 28000, bonus: 300, color: "bg-emerald-500", label: "BANK" },
  { key: "hotel", title: "Hotel", price: 65000, bonus: 750, color: "bg-purple-500", label: "HOTEL" },
  { key: "office", title: "IT Office", price: 150000, bonus: 1800, color: "bg-cyan-500", label: "IT" },
  { key: "cryptoLab", title: "Crypto Lab", price: 400000, bonus: 5000, color: "bg-lime-500", label: "LAB" },
  { key: "airport", title: "Private Airport", price: 900000, bonus: 12000, color: "bg-sky-500", label: "AIR" },
  { key: "spaceTower", title: "Space Tower", price: 2500000, bonus: 40000, color: "bg-violet-500", label: "SPACE" },
];

const skins: Skin[] = [
  { key: "default", title: "Default Boss", price: 0, emoji: "🧍", bonus: "Basic style" },
  { key: "cap", title: "Street Cap", price: 5000, emoji: "🧢", bonus: "+ Street vibe" },
  { key: "goldSuit", title: "Gold Suit", price: 50000, emoji: "🕴️", bonus: "+ Rich look" },
  { key: "cyberMask", title: "Cyber Mask", price: 150000, emoji: "🤖", bonus: "+ Cyberpunk style" },
  { key: "king", title: "Empire King", price: 0, diamondPrice: 1000, emoji: "👑", bonus: "+ Premium king status" },
];

function Game() {
  const [tonConnectUI] = useTonConnectUI();
  const [tab, setTab] = useState<Tab>("home");
  const [balance, setBalance] = useState(500);
  const [diamonds, setDiamonds] = useState(0);
  const [income, setIncome] = useState(1);
  const [level, setLevel] = useState(1);
  const [clicks, setClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [clickWarning, setClickWarning] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  const [activeBoost, setActiveBoost] = useState<BoostType>("none");
  const [boostTimeLeft, setBoostTimeLeft] = useState(0);
  const [vipCityGlow, setVipCityGlow] = useState(false);

  const [ownedSkins, setOwnedSkins] = useState<Record<SkinKey, boolean>>({
    default: true,
    cap: false,
    goldSuit: false,
    cyberMask: false,
    king: false,
  });

  const [activeSkin, setActiveSkin] = useState<SkinKey>("default");

  const [owned, setOwned] = useState<Record<BusinessKey, boolean>>({
    lemonade: false,
    coffee: false,
    carWash: false,
    gym: false,
    cinema: false,
    bank: false,
    hotel: false,
    office: false,
    cryptoLab: false,
    airport: false,
    spaceTower: false,
  });

  const boostMultiplier = activeBoost === "x3" ? 3 : activeBoost === "x2" ? 2 : 1;
  const boostedIncome = income * boostMultiplier;
  const ownedCount = Object.values(owned).filter(Boolean).length;
  const cityPower = ownedCount * 10 + level * 8 + (vipCityGlow ? 25 : 0);
  const population = 120 + ownedCount * 420 + level * 90;

  useEffect(() => {
    const saved = localStorage.getItem("mini-empire-save-v5");

    if (saved) {
      const data = JSON.parse(saved);
      setBalance(data.balance ?? 500);
      setDiamonds(data.diamonds ?? 0);
      setIncome(data.income ?? 1);
      setLevel(data.level ?? 1);
      setClicks(data.clicks ?? 0);
      setOwned(data.owned ?? owned);
      setOwnedSkins(data.ownedSkins ?? ownedSkins);
      setActiveSkin(data.activeSkin ?? "default");
      setActiveBoost(data.activeBoost ?? "none");
      setBoostTimeLeft(data.boostTimeLeft ?? 0);
      setVipCityGlow(data.vipCityGlow ?? false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "mini-empire-save-v5",
      JSON.stringify({
        balance,
        diamonds,
        income,
        level,
        clicks,
        owned,
        ownedSkins,
        activeSkin,
        activeBoost,
        boostTimeLeft,
        vipCityGlow,
      })
    );
  }, [balance, diamonds, income, level, clicks, owned, ownedSkins, activeSkin, activeBoost, boostTimeLeft, vipCityGlow]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + Math.floor(boostedIncome / 20));
    }, 1000);

    return () => clearInterval(interval);
  }, [boostedIncome]);

  useEffect(() => {
    if (boostTimeLeft <= 0) {
      setActiveBoost("none");
      return;
    }

    const timer = setInterval(() => {
      setBoostTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [boostTimeLeft]);

  useEffect(() => {
    if (balance >= 2500000) setLevel(10);
    else if (balance >= 900000) setLevel(9);
    else if (balance >= 500000) setLevel(8);
    else if (balance >= 200000) setLevel(7);
    else if (balance >= 100000) setLevel(6);
    else if (balance >= 50000) setLevel(5);
    else if (balance >= 20000) setLevel(4);
    else if (balance >= 8000) setLevel(3);
    else if (balance >= 2500) setLevel(2);
    else setLevel(1);
  }, [balance]);

  const collectProfit = () => {
    const now = Date.now();

    if (now - lastClickTime < 100) {
      setClickWarning("Tap limit: max 10 taps/sec.");
      return;
    }

    setClickWarning("");
    setLastClickTime(now);
    setBalance((prev) => prev + boostedIncome);
    setClicks((prev) => prev + 1);
  };

  const buyBusiness = (business: Business) => {
    if (balance < business.price || owned[business.key]) return;

    setBalance((prev) => prev - business.price);
    setIncome((prev) => prev + business.bonus);
    setOwned((prev) => ({ ...prev, [business.key]: true }));
  };

  const activateDiamondBoost = (type: BoostType, price: number) => {
    if (activeBoost !== "none" || diamonds < price) return;

    setDiamonds((prev) => prev - price);
    setActiveBoost(type);
    setBoostTimeLeft(BOOST_DURATION);
  };

  const buyVipGlow = () => {
    if (vipCityGlow || diamonds < 300) return;

    setDiamonds((prev) => prev - 300);
    setVipCityGlow(true);
  };

  const buySkin = (skin: Skin) => {
    if (ownedSkins[skin.key]) {
      setActiveSkin(skin.key);
      return;
    }

    if (skin.diamondPrice) {
      if (diamonds < skin.diamondPrice) return;

      setDiamonds((prev) => prev - skin.diamondPrice!);
      setOwnedSkins((prev) => ({ ...prev, [skin.key]: true }));
      setActiveSkin(skin.key);
      return;
    }

    if (balance < skin.price) return;

    setBalance((prev) => prev - skin.price);
    setOwnedSkins((prev) => ({ ...prev, [skin.key]: true }));
    setActiveSkin(skin.key);
  };

  const buyDiamondPack = async (pack: DiamondPack) => {
    try {
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: OWNER_WALLET_ADDRESS,
            amount: pack.nanotons,
          },
        ],
      });

      setDiamonds((prev) => prev + pack.diamonds);
      setPaymentMessage(`${pack.title} paid. ${pack.diamonds} diamonds added.`);
   } catch (error) {
      setPaymentMessage("Payment was cancelled or failed.");
    }
  };

 

  const resetProgress = () => {
    localStorage.removeItem("mini-empire-save-v5");
    window.location.reload();
  };

  const activeSkinData = skins.find((s) => s.key === activeSkin) ?? skins[0];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-4 pt-8 pb-28">
      <h1 className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_18px_rgba(255,215,0,0.95)] mb-2 tracking-wide">
        MINI EMPIRE
      </h1>

      <p className="text-gray-400 mb-5">Build your 3D city inside Telegram</p>

      {tab === "home" && (
        <>
          <StatsCard
            balance={balance}
            diamonds={diamonds}
            income={boostedIncome}
            baseIncome={income}
            level={level}
            activeBoost={activeBoost}
            boostTimeLeft={boostTimeLeft}
            clickWarning={clickWarning}
            collectProfit={collectProfit}
          />

          <CharacterCard skin={activeSkinData} />

          <CityView level={level} owned={owned} large={false} vipCityGlow={vipCityGlow} activeBoost={activeBoost} />

          <div className="bg-zinc-900 p-5 rounded-2xl w-80 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Starter Upgrades</h2>

            {businesses.slice(0, 4).map((business) => (
              <BusinessButton
                key={business.key}
                business={business}
                owned={owned[business.key]}
                balance={balance}
                onClick={() => buyBusiness(business)}
              />
            ))}
          </div>
        </>
      )}

      {tab === "city" && (
        <>
          <CityView level={level} owned={owned} large vipCityGlow={vipCityGlow} activeBoost={activeBoost} />

          <div className="bg-zinc-900 p-5 rounded-2xl w-80 shadow-2xl mb-5">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">City Control</h2>

            <div className="space-y-3">
              <CityStat label="Population" value={population.toLocaleString()} />
              <CityStat label="City Power" value={`${cityPower}%`} />
              <CityStat label="Districts" value={`${ownedCount}/11`} />
              <CityStat label="Passive/sec" value={`$${Math.floor(boostedIncome / 20).toLocaleString()}`} />
              <CityStat label="VIP Glow" value={vipCityGlow ? "Active" : "Locked"} />
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-2xl w-80 shadow-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-3">Districts</h2>

            <Perk unlocked={owned.lemonade || owned.coffee} text="Market District opened" />
            <Perk unlocked={owned.gym || owned.cinema} text="Entertainment District opened" />
            <Perk unlocked={owned.bank || owned.hotel} text="Luxury District opened" />
            <Perk unlocked={owned.office || owned.cryptoLab} text="Tech District opened" />
            <Perk unlocked={owned.airport || owned.spaceTower} text="Elite Skyline opened" />
            <Perk unlocked={vipCityGlow} text="VIP Neon City Glow activated" />
          </div>
        </>
      )}

      {tab === "shop" && (
        <div className="bg-zinc-900 p-5 rounded-2xl w-80 shadow-2xl">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Empire Shop</h2>

          <div className="mb-4 flex justify-center">
            <TonConnectButton />
          </div>

          <div className="mb-5 text-sm text-zinc-300">
            Diamonds: <span className="text-cyan-300 font-bold">{diamonds.toLocaleString()}</span>
          </div>

          <h3 className="text-lg font-bold text-cyan-300 mb-3">Buy Diamonds</h3>

          {diamondPacks.map((pack) => (
            <button
              key={pack.id}
              onClick={() => buyDiamondPack(pack)}
              className="w-full mb-3 bg-cyan-700 hover:bg-cyan-600 py-3 rounded-xl font-bold active:scale-95 transition"
            >
              <div>{pack.title}: {pack.diamonds} Diamonds</div>
              <div className="text-xs text-cyan-100">{pack.ton} TON · {pack.tag}</div>
            </button>
          ))}

          {paymentMessage && (
            <div className="mb-5 rounded-xl bg-cyan-950/70 p-3 text-xs text-cyan-200">
              {paymentMessage}
            </div>
          )}

          <h3 className="text-lg font-bold text-purple-300 mb-3">Premium Boosts</h3>

          <button
            onClick={() => activateDiamondBoost("x2", 50)}
            disabled={activeBoost !== "none" || diamonds < 50}
            className="w-full mb-3 bg-purple-600 disabled:bg-zinc-700 disabled:text-gray-500 py-3 rounded-xl font-bold active:scale-95 transition"
          >
            2X Boost 5 min — 50 Diamonds
          </button>

          <button
            onClick={() => activateDiamondBoost("x3", 70)}
            disabled={activeBoost !== "none" || diamonds < 70}
            className="w-full mb-5 bg-fuchsia-600 disabled:bg-zinc-700 disabled:text-gray-500 py-3 rounded-xl font-bold active:scale-95 transition"
          >
            3X Boost 5 min — 70 Diamonds
          </button>

          <h3 className="text-lg font-bold text-yellow-300 mb-3">Premium City</h3>

          <button
            onClick={buyVipGlow}
            disabled={vipCityGlow || diamonds < 300}
            className="w-full mb-5 bg-yellow-600 disabled:bg-zinc-700 disabled:text-gray-500 py-3 rounded-xl font-bold active:scale-95 transition"
          >
            {vipCityGlow ? "VIP City Glow Active" : "VIP City Glow — 300 Diamonds"}
          </button>

          <h3 className="text-lg font-bold text-cyan-300 mb-3">Big Buildings</h3>

          {businesses.slice(4).map((business) => (
            <BusinessButton
              key={business.key}
              business={business}
              owned={owned[business.key]}
              balance={balance}
              onClick={() => buyBusiness(business)}
            />
          ))}

          <p className="mt-4 text-xs text-zinc-500">
            Next step: connect these packs to TON Connect + backend verification.
          </p>
        </div>
      )}

      {tab === "wardrobe" && (
        <div className="bg-zinc-900 p-5 rounded-2xl w-80 shadow-2xl">
          <h2 className="text-2xl font-bold text-yellow-400 mb-2">Wardrobe</h2>

          <div className="mb-4 text-sm text-zinc-300">
            Diamonds: <span className="text-cyan-300 font-bold">{diamonds.toLocaleString()}</span>
          </div>

          <div className="mb-5">
            <CharacterCard skin={activeSkinData} />
          </div>

          {skins.map((skin) => (
            <button
              key={skin.key}
              onClick={() => buySkin(skin)}
              disabled={
                !ownedSkins[skin.key] &&
                ((skin.diamondPrice && diamonds < skin.diamondPrice) ||
                  (!skin.diamondPrice && balance < skin.price))
              }
              className="w-full mb-3 bg-zinc-800 disabled:bg-zinc-700 disabled:text-gray-500 text-white py-3 px-3 rounded-xl text-sm active:scale-95 transition"
            >
              {ownedSkins[skin.key]
                ? activeSkin === skin.key
                  ? `${skin.emoji} ${skin.title} — Equipped`
                  : `${skin.emoji} Equip ${skin.title}`
                : skin.diamondPrice
                ? `${skin.emoji} Buy ${skin.title} — ${skin.diamondPrice} Diamonds`
                : `${skin.emoji} Buy ${skin.title} — $${skin.price.toLocaleString()}`}
            </button>
          ))}
        </div>
      )}

      {tab === "profile" && (
        <div className="bg-zinc-900 p-6 rounded-2xl w-80 shadow-2xl">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">Profile</h2>

          <CharacterCard skin={activeSkinData} />

          <div className="space-y-3 text-sm mt-5">
            <ProfileRow label="Level" value={level.toString()} />
            <ProfileRow label="Balance" value={`$ ${balance.toLocaleString()}`} />
            <ProfileRow label="Diamonds" value={diamonds.toLocaleString()} />
            <ProfileRow label="Income/click" value={`$ ${boostedIncome.toLocaleString()}`} />
            <ProfileRow label="Base income" value={`$ ${income.toLocaleString()}`} />
            <ProfileRow label="Active boost" value={activeBoost === "none" ? "None" : activeBoost.toUpperCase()} />
            <ProfileRow label="Total clicks" value={clicks.toString()} />
            <ProfileRow label="Buildings" value={`${ownedCount}/11`} />
            <ProfileRow label="Skin" value={activeSkinData.title} />
            <ProfileRow label="VIP Glow" value={vipCityGlow ? "Active" : "Locked"} />
          </div>

          <button onClick={resetProgress} className="w-full mt-6 bg-red-600 py-3 rounded-xl font-bold">
            Reset Progress
          </button>
        </div>
      )}

      <div className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-800 grid grid-cols-5 py-4">
        <NavButton label="Home" active={tab === "home"} onClick={() => setTab("home")} />
        <NavButton label="City" active={tab === "city"} onClick={() => setTab("city")} />
        <NavButton label="Shop" active={tab === "shop"} onClick={() => setTab("shop")} />
        <NavButton label="Skin" active={tab === "wardrobe"} onClick={() => setTab("wardrobe")} />
        <NavButton label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <Game />
    </TonConnectUIProvider>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function CharacterCard({ skin }: { skin: Skin }) {
  return (
    <div className="bg-zinc-900 p-4 rounded-2xl w-80 shadow-2xl mb-5 border border-zinc-800">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-purple-700 flex items-center justify-center text-5xl shadow-[0_0_25px_rgba(250,204,21,0.35)]">
          {skin.emoji}
        </div>

        <div>
          <h2 className="text-xl font-bold text-yellow-400">{skin.title}</h2>
          <p className="text-sm text-zinc-400">{skin.bonus}</p>
          <p className="text-xs text-cyan-300 mt-1">Empire Founder</p>
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  balance,
  diamonds,
  income,
  baseIncome,
  level,
  activeBoost,
  boostTimeLeft,
  clickWarning,
  collectProfit,
}: {
  balance: number;
  diamonds: number;
  income: number;
  baseIncome: number;
  level: number;
  activeBoost: BoostType;
  boostTimeLeft: number;
  clickWarning: string;
  collectProfit: () => void;
}) {
  return (
    <div className="bg-zinc-900 p-6 rounded-2xl w-80 shadow-2xl hover:scale-[1.02] transition mb-5">
      <div className="flex justify-between mb-4">
        <span>Balance:</span>
        <span className="text-green-400 animate-pulse">$ {balance.toLocaleString()}</span>
      </div>

      <div className="flex justify-between mb-4">
        <span>Diamonds:</span>
        <span className="text-cyan-300">{diamonds.toLocaleString()}</span>
      </div>

      <div className="flex justify-between mb-4">
        <span>Level:</span>
        <span className="text-blue-400">{level}</span>
      </div>

      <div className="flex justify-between mb-3">
        <span>Income/click:</span>
        <span className="text-yellow-400">$ {income.toLocaleString()}</span>
      </div>

      {activeBoost !== "none" && (
        <div className="mb-5 rounded-xl bg-purple-900/40 p-3 text-sm text-purple-200">
          Boost {activeBoost.toUpperCase()} active: {formatTime(boostTimeLeft)}
          <div className="text-xs text-zinc-400">Base income: ${baseIncome.toLocaleString()}</div>
        </div>
      )}

      {clickWarning && <div className="mb-3 text-xs text-red-300">{clickWarning}</div>}

      <button
        onClick={collectProfit}
        className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-300 transition active:scale-95"
      >
        Collect Profit
      </button>
    </div>
  );
}

function CityView({
  level,
  owned,
  vipCityGlow,
  activeBoost,
  large = false,
}: {
  level: number;
  owned: Record<BusinessKey, boolean>;
  vipCityGlow: boolean;
  activeBoost: BoostType;
  large?: boolean;
}) {
  return (
    <div
      className={`relative w-80 ${large ? "h-[480px]" : "h-64"} mb-6 rounded-3xl overflow-hidden border ${
        vipCityGlow ? "border-yellow-400 shadow-[0_0_45px_rgba(250,204,21,0.45)]" : "border-zinc-700 shadow-2xl"
      } bg-gradient-to-b from-indigo-950 via-purple-950 to-black`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#facc15,transparent_18%)] opacity-25"></div>
      {vipCityGlow && <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>}
      {activeBoost !== "none" && <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>}

      <div className="absolute top-12 left-8 w-1 h-1 rounded-full bg-white shadow-[0_0_12px_white]"></div>
      <div className="absolute top-24 right-16 w-1 h-1 rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(34,211,238,1)]"></div>
      <div className="absolute top-36 left-28 w-1 h-1 rounded-full bg-yellow-200 shadow-[0_0_12px_rgba(250,204,21,1)]"></div>

      <div className="absolute top-6 right-8 w-24 h-24 bg-yellow-300 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute top-20 left-6 w-16 h-16 bg-cyan-400 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-[-55px] w-[440px] h-44 bg-zinc-800 rotate-[-8deg] rounded-t-[45%] border-t border-zinc-700 shadow-[0_-20px_50px_rgba(0,0,0,0.7)]"></div>

      <div className="absolute bottom-20 left-[-10px] w-96 h-14 bg-zinc-700 rotate-[-8deg] rounded-full opacity-80"></div>
      <div className="absolute bottom-28 left-10 w-72 h-8 bg-zinc-600 rotate-[8deg] rounded-full opacity-60"></div>
      <div className="absolute bottom-14 left-8 w-20 h-5 bg-black/30 rotate-[-8deg] rounded-full blur-sm"></div>
      <div className="absolute bottom-18 right-10 w-24 h-6 bg-black/30 rotate-[-8deg] rounded-full blur-sm"></div>
      <div className="absolute bottom-32 left-32 w-28 h-6 bg-black/30 rotate-[8deg] rounded-full blur-sm"></div>

      <div className="absolute bottom-24 left-0 w-full h-[2px] bg-cyan-400 opacity-40 shadow-[0_0_14px_rgba(34,211,238,0.9)]"></div>
      <div className="absolute bottom-36 left-0 w-full h-[2px] bg-purple-400 opacity-30 shadow-[0_0_14px_rgba(192,132,252,0.9)]"></div>

      <Building x="left-8" y="bottom-28" w="w-12" h="h-20" color="bg-zinc-700" label="" />

      {owned.lemonade && <Building x="left-24" y="bottom-28" w="w-14" h="h-28" color="bg-yellow-500" label="SHOP" dark />}
      {owned.coffee && <Building x="left-40" y="bottom-28" w="w-14" h="h-24" color="bg-orange-500" label="CAFE" dark />}
      {owned.carWash && <Building x="right-8" y="bottom-28" w="w-20" h="h-16" color="bg-blue-500" label="WASH" />}
      {owned.gym && <Building x="right-28" y="bottom-28" w="w-16" h="h-24" color="bg-red-500" label="GYM" />}
      {owned.cinema && <Building x="left-8" y="bottom-48" w="w-20" h="h-24" color="bg-pink-500" label="MOVIE" />}
      {owned.bank && <Building x="left-32" y="bottom-48" w="w-16" h="h-40" color="bg-emerald-500" label="BANK" />}
      {owned.hotel && <Building x="right-12" y="bottom-48" w="w-20" h="h-44" color="bg-purple-500" label="HOTEL" />}
      {owned.office && <Building x="left-56" y="bottom-52" w="w-14" h="h-52" color="bg-cyan-500" label="IT" />}
      {owned.cryptoLab && <Building x="right-32" y="bottom-60" w="w-16" h="h-56" color="bg-lime-500" label="LAB" dark />}
      {owned.airport && <Building x="left-16" y="bottom-72" w="w-24" h="h-20" color="bg-sky-500" label="AIR" />}
      {owned.spaceTower && <Building x="right-20" y="bottom-72" w="w-16" h="h-72" color="bg-violet-500" label="SPACE" />}

      <div className="absolute top-4 left-4 text-xs text-zinc-300">City Level {level}</div>
      <div className="absolute top-4 right-4 text-xs text-cyan-300">
        {vipCityGlow ? "VIP Glow" : activeBoost !== "none" ? "Boosted City" : "Neo District"}
      </div>

      <div className="absolute bottom-4 left-4 right-4 h-2 rounded-full bg-black/40 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-yellow-400 via-cyan-400 to-purple-500"
          style={{ width: `${Math.min(100, level * 10)}%` }}
        ></div>
      </div>
    </div>
  );
}

function Building({
  x,
  y,
  w,
  h,
  color,
  label,
  dark = false,
}: {
  x: string;
  y: string;
  w: string;
  h: string;
  color: string;
  label: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`absolute ${x} ${y} ${w} ${h} ${color} rounded-t-xl shadow-2xl border-r-4 border-b-4 border-black/30 skew-y-[-7deg]`}
    >
      <div className={`text-[10px] font-black text-center mt-2 ${dark ? "text-black" : "text-white"}`}>
        {label}
      </div>

      <div className="grid grid-cols-2 gap-1 p-2 mt-2">
        <span className="h-2 bg-yellow-300 rounded shadow-[0_0_8px_rgba(250,204,21,0.9)]"></span>
        <span className="h-2 bg-yellow-300 rounded shadow-[0_0_8px_rgba(250,204,21,0.9)]"></span>
        <span className="h-2 bg-yellow-300 rounded shadow-[0_0_8px_rgba(250,204,21,0.9)]"></span>
        <span className="h-2 bg-yellow-300 rounded shadow-[0_0_8px_rgba(250,204,21,0.9)]"></span>
      </div>
    </div>
  );
}

function BusinessButton({
  business,
  owned,
  balance,
  onClick,
}: {
  business: Business;
  owned: boolean;
  balance: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={owned || balance < business.price}
      className="w-full mb-3 bg-zinc-800 disabled:bg-zinc-700 disabled:text-gray-500 text-white py-3 px-3 rounded-xl text-sm active:scale-95 transition"
    >
      {owned
        ? `${business.title} Owned`
        : `Buy ${business.title} — $${business.price.toLocaleString()} (+${business.bonus})`}
    </button>
  );
}

function CityStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-800 pb-2">
      <span className="text-zinc-400">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

function Perk({ unlocked, text }: { unlocked: boolean; text: string }) {
  return (
    <div className={`text-sm p-3 rounded-xl mb-2 ${unlocked ? "bg-green-900/40 text-green-300" : "bg-zinc-800 text-zinc-500"}`}>
      {unlocked ? "Unlocked: " : "Locked: "}
      {text}
    </div>
  );
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "text-yellow-400 drop-shadow-[0_0_15px_rgba(255,215,0,0.9)] font-bold text-sm"
          : "text-zinc-400 text-sm"
      }
    >
      {label}
    </button>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-zinc-800 pb-2">
      <span className="text-zinc-400">{label}</span>
      <span className="text-white font-bold">{value}</span>
    </div>
  );
}
