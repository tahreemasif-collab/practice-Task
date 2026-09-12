import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as ArrowUpRight, C as ChartColumn, D as BedDouble, E as Bell, O as Bath, S as CloudUpload, T as Building2, _ as Handshake, a as Sparkles, b as Ellipsis, c as Ruler, d as Plus, f as MapPin, g as KeyRound, h as LayoutDashboard, i as TriangleAlert, k as Banknote, l as Radio, m as LayoutGrid, n as Video, o as Settings, p as List, r as Users, s as Search, t as Wrench, u as Radar, v as Globe, w as CalendarClock, x as Command, y as Eye } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CJZOwd_w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var mainMenu = [
	{
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		label: "Listings",
		icon: Building2,
		active: true
	},
	{
		label: "Buyer matcher",
		icon: Radar,
		badge: "AI"
	},
	{
		label: "Offers",
		icon: Handshake,
		badge: "4"
	},
	{
		label: "Virtual tours",
		icon: Video
	}
];
var portfolio = [
	{
		label: "Landlord portal",
		icon: KeyRound
	},
	{
		label: "Applicants",
		icon: Users
	},
	{
		label: "Portal syndication",
		icon: Search
	},
	{
		label: "Insights",
		icon: ChartColumn
	}
];
function Sidebar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "hidden w-[264px] shrink-0 flex-col justify-between bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
						className: "size-5",
						strokeWidth: 2.2
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-lg font-bold leading-none",
					children: "PropLens"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-[11px] uppercase tracking-[0.18em] text-sidebar-muted",
					children: "Agent OS"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
				title: "Main menu",
				items: mainMenu
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
				title: "Portfolio",
				items: portfolio
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-sidebar-border bg-sidebar-accent p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5 text-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-display text-sm font-semibold",
					children: "Premium GMB page"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs leading-relaxed text-sidebar-muted",
					children: "Get an SEO landing page linked straight from your Google Business Profile."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-4 w-full rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90",
					children: "Upgrade branch"
				})
			]
		})]
	});
}
function NavGroup({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "mt-3 space-y-1",
			children: items.map(({ label, icon: Icon, active, badge }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-sidebar-accent font-semibold text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-[18px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-left",
						children: label
					}),
					badge ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary",
						children: badge
					}) : null,
					active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-primary" }) : null
				]
			}, label))
		})]
	});
}
function Topbar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-border bg-surface/85 px-5 py-4 backdrop-blur-md lg:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border border-border bg-background px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4 shrink-0 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
					placeholder: "Search properties, applicants, landlords or postcodes…",
					"aria-label": "Search PropLens"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "hidden items-center gap-1 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command, { className: "size-3" }), "K"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "hidden h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add property"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(IconButton, {
					label: "Notifications",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-[18px]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2.5 top-2.5 size-2 rounded-full bg-accent" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconButton, {
					label: "Settings",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-[18px]" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 rounded-xl border border-border bg-background py-1.5 pl-1.5 pr-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-8 place-items-center rounded-lg bg-primary-soft text-sm font-bold text-primary",
						children: "AW"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden leading-tight sm:block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Amelia Ward"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Kensington branch"
						})]
					})]
				})
			]
		})]
	});
}
function IconButton({ children, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"aria-label": label,
		className: "relative grid size-11 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-muted",
		children
	});
}
var stats = [
	{
		label: "Live listings",
		value: "184",
		delta: "+16 this week",
		hint: "Across 3 UK branches",
		icon: Building2,
		tone: "primary"
	},
	{
		label: "AI buyer matches",
		value: "72",
		delta: "+9 overnight",
		hint: "Auto-sent to applicants",
		icon: Radar,
		tone: "accent"
	},
	{
		label: "Offers in play",
		value: "23",
		delta: "6 awaiting reply",
		hint: "£14.2m pipeline value",
		icon: Handshake,
		tone: "success"
	},
	{
		label: "Tenancies expiring",
		value: "11",
		delta: "next 60 days",
		hint: "4 renewals unsent",
		icon: KeyRound,
		tone: "warning"
	}
];
var toneMap = {
	primary: "bg-primary-soft text-primary",
	accent: "bg-accent-soft text-accent",
	success: "bg-success-soft text-success",
	warning: "bg-warning-soft text-warning"
};
function StatCards() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
		children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "panel p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid size-10 place-items-center rounded-xl ${toneMap[s.tone]}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground",
						children: s.delta
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 font-display text-4xl font-bold tracking-tight",
					children: s.value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium",
					children: s.label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: s.hint
				})
			]
		}, s.label))
	});
}
var properties = [
	{
		id: "PL-1042",
		title: "Clarendon Terrace",
		address: "18 Clarendon Rd, Notting Hill",
		city: "London",
		price: 125e4,
		status: "Available",
		beds: 4,
		baths: 2,
		sqft: 1980,
		agent: "Sarah Whitfield",
		views: 3120,
		tour: true,
		portals: [
			"Rightmove",
			"Zoopla",
			"OnTheMarket"
		],
		image: "/assets/prop-1-CqpcIiHp.jpg"
	},
	{
		id: "PL-1043",
		title: "Deansgate Penthouse",
		address: "Tower 3, Deansgate Square",
		city: "Manchester",
		price: 2400,
		priceSuffix: "pcm",
		status: "Under offer",
		beds: 3,
		baths: 2,
		sqft: 1420,
		agent: "Omar Rahman",
		views: 1875,
		tour: true,
		portals: ["Rightmove", "Zoopla"],
		image: "/assets/prop-2-DhaElkOL.jpg"
	},
	{
		id: "PL-1044",
		title: "Willow Barn Cottage",
		address: "Church Lane, Bourton",
		city: "Cotswolds",
		price: 875e3,
		status: "Sold STC",
		beds: 5,
		baths: 3,
		sqft: 2640,
		agent: "Helen Marsh",
		views: 2410,
		tour: false,
		portals: ["Rightmove", "OnTheMarket"],
		image: "/assets/prop-3-CScBpYHs.jpg"
	},
	{
		id: "PL-1045",
		title: "Kelvin Wharf Apt 12",
		address: "Kelvin Wharf, Southbank",
		city: "Bristol",
		price: 1650,
		priceSuffix: "pcm",
		status: "Let agreed",
		beds: 2,
		baths: 1,
		sqft: 890,
		agent: "Danny Okafor",
		views: 1204,
		tour: true,
		portals: ["Zoopla", "OnTheMarket"],
		image: "/assets/prop-4-lfM-x5vt.jpg"
	},
	{
		id: "PL-1046",
		title: "Harrogate Meadows",
		address: "7 Meadow Rise, Alwoodley",
		city: "Leeds",
		price: 41e4,
		status: "Available",
		beds: 4,
		baths: 2,
		sqft: 1560,
		agent: "Priya Nair",
		views: 962,
		tour: false,
		portals: ["Rightmove"],
		image: "/assets/prop-5-CCbQGw69.jpg"
	},
	{
		id: "PL-1047",
		title: "New Town Stone Flat",
		address: "42 Dundas Street",
		city: "Edinburgh",
		price: 525e3,
		status: "Available",
		beds: 3,
		baths: 1,
		sqft: 1180,
		agent: "Callum Reid",
		views: 1490,
		tour: true,
		portals: [
			"Rightmove",
			"Zoopla",
			"OnTheMarket"
		],
		image: "/assets/prop-6-B1-TTLgH.jpg"
	}
];
var buyerMatches = [
	{
		id: "BM-01",
		buyer: "The Hendersons",
		budget: "£1.1m – £1.3m",
		wants: [
			"Garden",
			"Outstanding school",
			"Zone 2"
		],
		property: "Clarendon Terrace",
		score: 96
	},
	{
		id: "BM-02",
		buyer: "Aisha Malik",
		budget: "£2,000 – £2,600 pcm",
		wants: [
			"City centre",
			"Concierge",
			"Parking"
		],
		property: "Deansgate Penthouse",
		score: 91
	},
	{
		id: "BM-03",
		buyer: "James & Ola Boateng",
		budget: "£380k – £450k",
		wants: [
			"4 beds",
			"Driveway",
			"New build"
		],
		property: "Harrogate Meadows",
		score: 88
	},
	{
		id: "BM-04",
		buyer: "Fiona Craig",
		budget: "£480k – £540k",
		wants: ["Period features", "Walk to centre"],
		property: "New Town Stone Flat",
		score: 84
	}
];
var offers = [
	{
		id: "OF-3391",
		property: "Clarendon Terrace",
		buyer: "The Hendersons",
		offer: 1195e3,
		asking: 125e4,
		stage: "Counter sent",
		chain: "Chain free",
		updated: "2 min ago"
	},
	{
		id: "OF-3390",
		property: "Willow Barn Cottage",
		buyer: "R. Fothergill",
		offer: 862e3,
		asking: 875e3,
		stage: "Accepted",
		chain: "1 in chain",
		updated: "18 min ago"
	},
	{
		id: "OF-3388",
		property: "Harrogate Meadows",
		buyer: "J & O Boateng",
		offer: 396e3,
		asking: 41e4,
		stage: "New offer",
		chain: "Mortgage in principle",
		updated: "1 hr ago"
	},
	{
		id: "OF-3384",
		property: "New Town Stone Flat",
		buyer: "F. Craig",
		offer: 498e3,
		asking: 525e3,
		stage: "Withdrawn",
		chain: "Chain free",
		updated: "Yesterday"
	}
];
var landlordAlerts = [
	{
		id: "LA-01",
		landlord: "M. Okonjo",
		property: "Kelvin Wharf Apt 12",
		type: "Tenancy expiry",
		detail: "AST ends in 34 days — renewal not yet issued",
		when: "Due 22 Sep"
	},
	{
		id: "LA-02",
		landlord: "Greenhill Estates",
		property: "Deansgate Penthouse",
		type: "Maintenance",
		detail: "Boiler pressure fault reported by tenant",
		when: "Today"
	},
	{
		id: "LA-03",
		landlord: "S. Whitfield Ltd",
		property: "12 Baker Mews",
		type: "Rent received",
		detail: "£1,850 cleared to client account",
		when: "Today"
	},
	{
		id: "LA-04",
		landlord: "T. Aldridge",
		property: "5 Marsh View",
		type: "Arrears",
		detail: "£920 outstanding — 11 days late",
		when: "Escalated"
	}
];
var gbc = (n) => new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP",
	maximumFractionDigits: 0
}).format(n);
var filters = [
	"All",
	"Available",
	"Under offer",
	"Sold STC",
	"Let agreed"
];
var statusTone = {
	Available: "bg-success-soft text-success",
	"Under offer": "bg-warning-soft text-warning",
	"Sold STC": "bg-primary-soft text-primary",
	"Let agreed": "bg-accent-soft text-accent"
};
function PropertyGrid() {
	const [filter, setFilter] = (0, import_react.useState)("All");
	const [view, setView] = (0, import_react.useState)("grid");
	const shown = (0, import_react.useMemo)(() => filter === "All" ? properties : properties.filter((p) => p.status === filter), [filter]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "Portfolio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [shown.length, " properties · syndicated to Rightmove, Zoopla & OnTheMarket"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-xl border border-border bg-card p-1",
						children: ["grid", "list"].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setView(v),
							"aria-label": `${v} view`,
							className: cn("grid size-8 place-items-center rounded-lg transition-colors", view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"),
							children: v === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-4" })
						}, v))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-3.5 text-sm font-semibold transition-colors hover:bg-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "size-4 text-primary" }), " Syndicate all"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: filters.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(f),
					className: cn("rounded-full border px-3.5 py-1.5 text-sm transition-colors", filter === f ? "border-transparent bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"),
					children: f
				}, f))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-5 grid gap-5", view === "grid" ? "sm:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"),
				children: shown.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyCard, {
					property: p,
					horizontal: view === "list"
				}, p.id))
			})
		]
	});
}
function PropertyCard({ property: p, horizontal }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("panel group overflow-hidden transition-shadow hover:shadow-[var(--shadow-lift)]", horizontal && "sm:flex"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden", horizontal && "sm:w-72 sm:shrink-0"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.image,
					alt: `${p.title}, ${p.city}`,
					width: 800,
					height: 600,
					loading: "lazy",
					className: "h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-full"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-card/95 px-2.5 py-1 text-xs font-medium backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }), p.city]
				}),
				p.tour ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-foreground/85 px-2.5 py-1 text-xs font-medium text-background backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-3.5" }), " 360°"]
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-bold",
						children: p.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: p.address
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": "More actions",
						className: "text-muted-foreground hover:text-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-display text-2xl font-bold",
					children: [gbc(p.price), p.priceSuffix ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-sm font-medium text-muted-foreground",
						children: p.priceSuffix
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BedDouble, { className: "size-4" }),
								" ",
								p.beds,
								" beds"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bath, { className: "size-4" }),
								" ",
								p.baths,
								" baths"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ruler, { className: "size-4" }),
								" ",
								p.sqft.toLocaleString("en-GB"),
								" sq ft"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-1.5",
					children: p.portals.map((portal) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground",
						children: portal
					}, portal))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between border-t border-border pt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusTone[p.status]),
						children: p.status
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.agent }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-3.5" }),
								" ",
								p.views.toLocaleString("en-GB")
							]
						})]
					})]
				})
			]
		})]
	});
}
var alertIcon = {
	"Tenancy expiry": CalendarClock,
	Maintenance: Wrench,
	"Rent received": Banknote,
	Arrears: TriangleAlert
};
var alertTone = {
	"Tenancy expiry": "bg-warning-soft text-warning",
	Maintenance: "bg-primary-soft text-primary",
	"Rent received": "bg-success-soft text-success",
	Arrears: "bg-destructive-soft text-destructive"
};
function InsightPanels() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 grid gap-5 xl:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "panel p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid size-10 place-items-center rounded-xl bg-accent-soft text-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "AI buyer matcher"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Ranked on budget, area, garden, schools"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "hidden items-center gap-1 text-sm font-semibold text-primary sm:flex",
					children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: buyerMatches.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl border border-border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold",
								children: m.buyer
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: m.budget
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-lg bg-primary-soft px-2 py-1 font-display text-sm font-bold text-primary",
								children: [m.score, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-1.5",
							children: m.wants.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground",
								children: w
							}, w))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 h-1.5 overflow-hidden rounded-full bg-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${m.score}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: ["Auto-suggested: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: m.property
							})]
						})
					]
				}, m.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "panel p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-10 place-items-center rounded-xl bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "Landlord portal feed"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Rent, maintenance & tenancy alerts"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "hidden items-center gap-1 text-sm font-semibold text-primary sm:flex",
						children: ["Open portal ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-5 space-y-3",
					children: landlordAlerts.map((a) => {
						const Icon = alertIcon[a.type];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 rounded-xl border border-border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid size-9 shrink-0 place-items-center rounded-lg ${alertTone[a.type]}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-semibold",
											children: a.property
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "shrink-0 text-xs text-muted-foreground",
											children: a.when
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-sm text-muted-foreground",
										children: a.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: ["Landlord: ", a.landlord]
									})
								]
							})]
						}, a.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 rounded-xl bg-muted p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Rental income this month"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-3xl font-bold",
							children: "£128,460"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "97.4% collected · 3 accounts in arrears"
						})
					]
				})
			]
		})]
	});
}
var stageTone = {
	"New offer": "bg-primary-soft text-primary",
	"Counter sent": "bg-warning-soft text-warning",
	Accepted: "bg-success-soft text-success",
	Withdrawn: "bg-destructive-soft text-destructive"
};
function OfferTracker() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "panel mt-8 overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3 border-b border-border p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-10 place-items-center rounded-xl bg-primary-soft text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold",
					children: "Offer & negotiation tracker"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Live view shared with buyers and vendors"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2 rounded-full bg-success-soft px-3 py-1.5 text-xs font-semibold text-success",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3.5" }), " Realtime"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[760px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "Property"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "Buyer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "Offer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "vs asking"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "Position"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 font-medium",
							children: "Stage"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3 text-right font-medium",
							children: "Updated"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: offers.map((o) => {
					const diff = Math.round((o.offer - o.asking) / o.asking * 1e3) / 10;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0 hover:bg-muted/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 font-medium",
								children: o.property
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 text-muted-foreground",
								children: o.buyer
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 font-display font-bold",
								children: gbc(o.offer)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: cn("px-5 py-4 font-medium", diff >= 0 ? "text-success" : "text-destructive"),
								children: [
									diff > 0 ? "+" : "",
									diff,
									"%"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 text-muted-foreground",
								children: o.chain
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded-full px-2.5 py-1 text-xs font-semibold", stageTone[o.stage]),
									children: o.stage
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 text-right text-xs text-muted-foreground",
								children: o.updated
							})
						]
					}, o.id);
				}) })]
			})
		})]
	});
}
function Dashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Topbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 px-5 py-6 lg:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Wednesday · Kensington branch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 text-3xl font-bold",
							children: "Good morning, Amelia"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Google search feed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "live · 42 enquiries today"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCards, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "panel mt-8 flex flex-wrap items-center gap-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-10 place-items-center rounded-xl bg-accent-soft text-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-[220px] flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-bold",
									children: "Live city availability"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: "Buyers arriving from your Google Business Profile see real-time stock by city."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: [
									"London 38",
									"Manchester 24",
									"Bristol 17",
									"Leeds 21",
									"Edinburgh 12"
								].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-primary" }), c]
								}, c))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyGrid, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfferTracker, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InsightPanels, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "mt-10 border-t border-border pt-6 text-xs text-muted-foreground",
						children: "PropLens · CRM & property portal for UK estate and letting agents."
					})
				]
			})]
		})]
	});
}
//#endregion
export { Dashboard as component };
