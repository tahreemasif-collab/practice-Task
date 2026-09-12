import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import prop4 from "@/assets/prop-4.jpg";
import prop5 from "@/assets/prop-5.jpg";
import prop6 from "@/assets/prop-6.jpg";

export type ListingStatus = "Available" | "Under offer" | "Let agreed" | "Sold STC";

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  price: number;
  priceSuffix?: string;
  status: ListingStatus;
  beds: number;
  baths: number;
  sqft: number;
  agent: string;
  views: number;
  tour: boolean;
  portals: Array<"Rightmove" | "Zoopla" | "OnTheMarket">;
  image: string;
}

export const properties: Property[] = [
  {
    id: "PL-1042",
    title: "Clarendon Terrace",
    address: "18 Clarendon Rd, Notting Hill",
    city: "London",
    price: 1250000,
    status: "Available",
    beds: 4,
    baths: 2,
    sqft: 1980,
    agent: "Sarah Whitfield",
    views: 3120,
    tour: true,
    portals: ["Rightmove", "Zoopla", "OnTheMarket"],
    image: prop1,
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
    image: prop2,
  },
  {
    id: "PL-1044",
    title: "Willow Barn Cottage",
    address: "Church Lane, Bourton",
    city: "Cotswolds",
    price: 875000,
    status: "Sold STC",
    beds: 5,
    baths: 3,
    sqft: 2640,
    agent: "Helen Marsh",
    views: 2410,
    tour: false,
    portals: ["Rightmove", "OnTheMarket"],
    image: prop3,
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
    image: prop4,
  },
  {
    id: "PL-1046",
    title: "Harrogate Meadows",
    address: "7 Meadow Rise, Alwoodley",
    city: "Leeds",
    price: 410000,
    status: "Available",
    beds: 4,
    baths: 2,
    sqft: 1560,
    agent: "Priya Nair",
    views: 962,
    tour: false,
    portals: ["Rightmove"],
    image: prop5,
  },
  {
    id: "PL-1047",
    title: "New Town Stone Flat",
    address: "42 Dundas Street",
    city: "Edinburgh",
    price: 525000,
    status: "Available",
    beds: 3,
    baths: 1,
    sqft: 1180,
    agent: "Callum Reid",
    views: 1490,
    tour: true,
    portals: ["Rightmove", "Zoopla", "OnTheMarket"],
    image: prop6,
  },
];

export interface BuyerMatch {
  id: string;
  buyer: string;
  budget: string;
  wants: string[];
  property: string;
  score: number;
}

export const buyerMatches: BuyerMatch[] = [
  {
    id: "BM-01",
    buyer: "The Hendersons",
    budget: "£1.1m – £1.3m",
    wants: ["Garden", "Outstanding school", "Zone 2"],
    property: "Clarendon Terrace",
    score: 96,
  },
  {
    id: "BM-02",
    buyer: "Aisha Malik",
    budget: "£2,000 – £2,600 pcm",
    wants: ["City centre", "Concierge", "Parking"],
    property: "Deansgate Penthouse",
    score: 91,
  },
  {
    id: "BM-03",
    buyer: "James & Ola Boateng",
    budget: "£380k – £450k",
    wants: ["4 beds", "Driveway", "New build"],
    property: "Harrogate Meadows",
    score: 88,
  },
  {
    id: "BM-04",
    buyer: "Fiona Craig",
    budget: "£480k – £540k",
    wants: ["Period features", "Walk to centre"],
    property: "New Town Stone Flat",
    score: 84,
  },
];

export interface Offer {
  id: string;
  property: string;
  buyer: string;
  offer: number;
  asking: number;
  stage: "New offer" | "Counter sent" | "Accepted" | "Withdrawn";
  chain: string;
  updated: string;
}

export const offers: Offer[] = [
  {
    id: "OF-3391",
    property: "Clarendon Terrace",
    buyer: "The Hendersons",
    offer: 1195000,
    asking: 1250000,
    stage: "Counter sent",
    chain: "Chain free",
    updated: "2 min ago",
  },
  {
    id: "OF-3390",
    property: "Willow Barn Cottage",
    buyer: "R. Fothergill",
    offer: 862000,
    asking: 875000,
    stage: "Accepted",
    chain: "1 in chain",
    updated: "18 min ago",
  },
  {
    id: "OF-3388",
    property: "Harrogate Meadows",
    buyer: "J & O Boateng",
    offer: 396000,
    asking: 410000,
    stage: "New offer",
    chain: "Mortgage in principle",
    updated: "1 hr ago",
  },
  {
    id: "OF-3384",
    property: "New Town Stone Flat",
    buyer: "F. Craig",
    offer: 498000,
    asking: 525000,
    stage: "Withdrawn",
    chain: "Chain free",
    updated: "Yesterday",
  },
];

export interface LandlordAlert {
  id: string;
  landlord: string;
  property: string;
  type: "Tenancy expiry" | "Maintenance" | "Rent received" | "Arrears";
  detail: string;
  when: string;
}

export const landlordAlerts: LandlordAlert[] = [
  {
    id: "LA-01",
    landlord: "M. Okonjo",
    property: "Kelvin Wharf Apt 12",
    type: "Tenancy expiry",
    detail: "AST ends in 34 days — renewal not yet issued",
    when: "Due 22 Sep",
  },
  {
    id: "LA-02",
    landlord: "Greenhill Estates",
    property: "Deansgate Penthouse",
    type: "Maintenance",
    detail: "Boiler pressure fault reported by tenant",
    when: "Today",
  },
  {
    id: "LA-03",
    landlord: "S. Whitfield Ltd",
    property: "12 Baker Mews",
    type: "Rent received",
    detail: "£1,850 cleared to client account",
    when: "Today",
  },
  {
    id: "LA-04",
    landlord: "T. Aldridge",
    property: "5 Marsh View",
    type: "Arrears",
    detail: "£920 outstanding — 11 days late",
    when: "Escalated",
  },
];

export const gbc = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(n);
