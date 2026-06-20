import Link from "next/link";

const services = [
  {
    label: "Turnover repairs",
    detail:
      "Broken locks, leaky faucets, loose railings, AC issues — fixed in the window between guests.",
  },
  {
    label: "Appliance & fixture fixes",
    detail:
      "Lanai furniture, ceiling fans, washer/dryer, water heaters, pool equipment touch-ups.",
  },
  {
    label: "Drywall, paint & trim",
    detail:
      "Scuffed walls, salt-air wear, sun-faded trim — restored to guest-ready condition.",
  },
  {
    label: "Preventive walkthroughs",
    detail:
      "Scheduled check-ins between bookings to catch small problems before they become reviews.",
  },
];

const timeline = [
  {
    step: "Checkout",
    time: "11:00 AM",
    detail: "Guest leaves. Cleaning crew flags anything broken or worn.",
  },
  {
    step: "Request in",
    time: "Same day",
    detail: "You submit the job — what's wrong, photos, how urgent.",
  },
  {
    step: "Repair done",
    time: "Within 24–48 hrs",
    detail: "On-site fix before the next guest arrives.",
  },
  {
    step: "Check-in",
    time: "4:00 PM",
    detail: "Next guest walks into a unit that shows no sign of the gap.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      <header className="border-b border-shadow-green/10 px-6 py-5 flex items-center justify-between max-w-6xl w-full mx-auto">
        <span className="font-display text-xl tracking-wide uppercase text-shadow-green">
          Kaloha Repairs
        </span>
        <nav className="hidden sm:flex items-center gap-8 font-body text-sm text-shadow-green/80">
          <a href="#services" className="hover:text-rust transition-colors">
            Services
          </a>
          <a href="#how-it-works" className="hover:text-rust transition-colors">
            How it works
          </a>
          <a href="#estimate" className="hover:text-rust transition-colors">
            Get an estimate
          </a>
        </nav>
        <Link
          href="/request"
          className="font-body text-sm font-semibold bg-rust text-sand px-4 py-2 rounded-sm hover:bg-rust-dark transition-colors"
        >
          Submit a request
        </Link>
      </header>

      <section className="relative px-6 pt-16 pb-20 max-w-6xl w-full mx-auto overflow-hidden">
        <PalmTree className="hidden lg:block absolute -left-6 top-0 w-40 h-72 text-ink-grey/45 -scale-x-100" />
        <PalmTree className="hidden lg:block absolute -right-2 top-6 w-44 h-80 text-ink-grey/40" />

        <p className="font-utility text-xs uppercase tracking-[0.2em] text-palm mb-4 relative z-10">
          Kihei, Maui · Vacation rental repair specialist
        </p>
        <h1 className="font-display text-[2.75rem] sm:text-6xl leading-[1.05] tracking-tight text-shadow-green max-w-3xl relative z-10">
          The gap between checkout and check-in is the only deadline that matters.
        </h1>
        <p className="font-body text-lg text-shadow-green/70 max-w-xl mt-6 relative z-10">
          Kaloha Repairs handles the broken locks, leaky faucets, and worn-out
          fixtures that turn five-star reviews into three-star ones — fixed
          before your next guest ever notices.
        </p>
        <div className="flex flex-wrap gap-4 mt-8 relative z-10">
          <Link
            href="/request"
            className="font-body font-semibold bg-rust text-sand px-6 py-3 rounded-sm hover:bg-rust-dark transition-colors"
          >
            Submit a repair request
          </Link>
          <a
            href="#estimate"
            className="font-body font-semibold border border-shadow-green/20 text-shadow-green px-6 py-3 rounded-sm hover:border-rust hover:text-rust transition-colors"
          >
            Get a rough estimate first
          </a>
        </div>
      </section>

      <section
        id="how-it-works"
        className="px-6 py-16 bg-shadow-green text-sand"
      >
        <div className="max-w-6xl w-full mx-auto">
          <p className="font-utility text-xs uppercase tracking-[0.2em] text-sand/50 mb-2">
            How a request moves
          </p>
          <h2 className="font-display text-3xl mb-10">
            One booking window. Four moments that matter.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 relative">
            <div className="hidden sm:block absolute top-[10px] left-0 right-0 h-px bg-sand/15" />
            {timeline.map((item, i) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-3 sm:gap-0 sm:flex-col sm:items-start">
                  <span className="w-2.5 h-2.5 rounded-full bg-rust shrink-0 sm:mb-4 relative z-10" />
                  <span className="font-utility text-xs text-sand/50 sm:hidden">
                    {i + 1}
                  </span>
                </div>
                <p className="font-display text-lg mt-2 sm:mt-0">{item.step}</p>
                <p className="font-utility text-xs text-rust mt-1">
                  {item.time}
                </p>
                <p className="font-body text-sm text-sand/70 mt-2 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="px-6 py-20 max-w-6xl w-full mx-auto">
        <p className="font-utility text-xs uppercase tracking-[0.2em] text-palm mb-2">
          What gets fixed
        </p>
        <h2 className="font-display text-3xl text-shadow-green mb-10">
          Built for rental turnaround, not just repair.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-shadow-green/10">
          {services.map((service) => (
            <div key={service.label} className="bg-sand p-8">
              <h3 className="font-display text-xl text-shadow-green mb-2">
                {service.label}
              </h3>
              <p className="font-body text-sm text-shadow-green/70 leading-relaxed">
                {service.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="estimate"
        className="px-6 py-20 bg-palm/10 border-y border-palm/20"
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <p className="font-utility text-xs uppercase tracking-[0.2em] text-palm mb-2">
              Before you book
            </p>
            <h2 className="font-display text-3xl text-shadow-green max-w-md">
              Describe the problem and get a ballpark before submitting a request.
            </h2>
            <p className="font-body text-sm text-shadow-green/70 mt-3 max-w-md">
              Add a few photos and a quick description — you&apos;ll get a rough
              cost range so there are no surprises before work starts.
            </p>
          </div>
          <Link
            href="/request"
            className="font-body font-semibold bg-rust text-sand px-6 py-3 rounded-sm hover:bg-rust-dark transition-colors whitespace-nowrap"
          >
            Get my estimate
          </Link>
        </div>
      </section>

      <footer className="px-6 py-10 max-w-6xl w-full mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-shadow-green/60">
        <span className="font-display tracking-wide uppercase">
          Kaloha Repairs
        </span>
        <span className="font-body">Serving Kihei, Maui · Vacation rental upkeep</span>
      </footer>
    </main>
  );
}

function PalmTree({ className }: { className?: string }) {
  // A frond: a central rib plus many short leaflet strokes feathering off both sides,
  // giving a full, plumed look rather than a single bare line.
  const fronds = [
    { rib: "M100 116 C 72 96 36 90 6 100", flip: false, leaflets: 11 },
    { rib: "M100 114 C 80 84 50 62 18 54", flip: false, leaflets: 12 },
    { rib: "M101 111 C 90 76 72 46 44 24", flip: false, leaflets: 12 },
    { rib: "M103 110 C 106 74 120 40 144 16", flip: true, leaflets: 12 },
    { rib: "M105 112 C 124 84 152 64 182 56", flip: true, leaflets: 12 },
    { rib: "M106 116 C 132 100 160 94 188 102", flip: true, leaflets: 11 },
    { rib: "M104 120 C 124 114 144 116 160 128", flip: true, leaflets: 9 },
    { rib: "M102 121 C 86 118 70 120 56 130", flip: false, leaflets: 9 },
  ];

  function leafletsFor(ribPath: string, count: number, flip: boolean) {
    // Sample points roughly along the rib's bounding range and draw short
    // angled leaflet strokes off each side to fake a feathered frond.
    const leaflets = [];
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1);
      leaflets.push(
        <path
          key={`${ribPath}-${i}-${flip}`}
          d={describeLeaflet(ribPath, t, flip)}
          strokeWidth="3.2"
        />
      );
    }
    return leaflets;
  }

  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeLinecap="round" fill="none">
        {/* trunk, leaning, double-line with cross texture */}
        <g strokeWidth="3">
          <path d="M88 318 C84 270 74 230 84 190 C92 158 104 138 99 119" />
          <path d="M96 318 C92 268 81 226 91 188 C98 158 109 140 104 122" />
        </g>
        <g strokeWidth="2" opacity="0.6">
          <path d="M85 300 L94 295" />
          <path d="M83 281 L93 276" />
          <path d="M82 261 L93 256" />
          <path d="M84 241 L94 235" />
          <path d="M87 221 L97 214" />
          <path d="M90 201 L100 194" />
          <path d="M94 181 L103 173" />
          <path d="M98 160 L106 152" />
        </g>

        {/* full, feathered fronds */}
        <g strokeWidth="3" strokeLinecap="round">
          {fronds.map((f) => (
            <g key={f.rib}>
              <path d={f.rib} strokeWidth="3.5" />
              {leafletsFor(f.rib, f.leaflets, f.flip)}
            </g>
          ))}
        </g>

        {/* coconuts */}
        <g strokeWidth="2.5">
          <circle cx="94" cy="121" r="5.5" />
          <circle cx="103" cy="128" r="5" />
          <circle cx="97" cy="134" r="4.5" />
        </g>

        {/* grass tufts at base */}
        <g strokeWidth="2" opacity="0.85">
          <path d="M66 318 C 71 306 76 301 82 296" />
          <path d="M76 318 C 81 308 86 303 91 298" />
          <path d="M108 318 C 103 306 98 301 92 296" />
          <path d="M118 318 C 111 308 105 303 99 298" />
        </g>
      </g>
    </svg>
  );
}

// Approximates a point and tangent angle along a cubic path string by
// evaluating the Bezier directly, then places a short decorative leaflet
// stroke offset perpendicular to the rib, fuller at mid-frond, tapered at
// the tip and base.
function describeLeaflet(d: string, t: number, flip: boolean) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
  const [x0, y0, x1, y1, x2, y2, x3, y3] = nums;
  const cubic = (p0: number, p1: number, p2: number, p3: number, t: number) =>
    (1 - t) ** 3 * p0 +
    3 * (1 - t) ** 2 * t * p1 +
    3 * (1 - t) * t ** 2 * p2 +
    t ** 3 * p3;
  const px = cubic(x0, x1, x2, x3, t);
  const py = cubic(y0, y1, y2, y3, t);
  const dt = 0.001;
  const px2 = cubic(x0, x1, x2, x3, Math.min(1, t + dt));
  const py2 = cubic(y0, y1, y2, y3, Math.min(1, t + dt));
  const angle = Math.atan2(py2 - py, px2 - px);
  const perp = angle + (flip ? -1 : 1) * (Math.PI / 2 + 0.35);
  const len = 16 + 10 * Math.sin(t * Math.PI); // fuller in the middle, tapered at tip/base
  const ex = px + Math.cos(perp) * len;
  const ey = py + Math.sin(perp) * len;
  return `M${px.toFixed(1)} ${py.toFixed(1)} Q${(px + Math.cos(perp) * len * 0.5).toFixed(1)} ${(
    py +
    Math.sin(perp) * len * 0.5 -
    4
  ).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`;
}
