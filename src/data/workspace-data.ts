import sudirman from "@/assets/loc-sudirman.jpg";
import kuningan from "@/assets/loc-kuningan.jpg";
import bsd from "@/assets/loc-bsd.jpg";
import bandung from "@/assets/loc-bandung.jpg";

export type Availability = "available" | "limited" | "full" | "unavailable";

export type WorkspaceType =
  | "Coworking"
  | "Hot Desk"
  | "Dedicated Desk"
  | "Private Office"
  | "Meeting Room"
  | "Day Pass"
  | "Event Space"
  | "Virtual Office";

export const workspaceTypes: {
  type: WorkspaceType;
  what: string;
  who: string;
  capacity: string;
  from: number | null;
  unit: string;
}[] = [
  {
    type: "Hot Desk",
    what: "Any open desk in the shared floor, first come first served.",
    who: "Freelancers and remote workers who move around",
    capacity: "1 person",
    from: 65000,
    unit: "day",
  },
  {
    type: "Dedicated Desk",
    what: "Your own assigned desk with a locker, kept as you left it.",
    who: "Full-time remote workers and solo founders",
    capacity: "1 person",
    from: 1450000,
    unit: "month",
  },
  {
    type: "Private Office",
    what: "A lockable room for your team with 24/7 access.",
    who: "Startups and small teams of 2–20",
    capacity: "2–20 people",
    from: 4800000,
    unit: "month",
  },
  {
    type: "Meeting Room",
    what: "Bookable by the hour with screen, whiteboard and video conferencing.",
    who: "Teams running client meetings and workshops",
    capacity: "4–16 people",
    from: 120000,
    unit: "hour",
  },
  {
    type: "Day Pass",
    what: "One full day in the coworking area, no commitment.",
    who: "Visitors and occasional users",
    capacity: "1 person",
    from: 89000,
    unit: "day",
  },
  {
    type: "Coworking",
    what: "Monthly access to the shared floor across all locations.",
    who: "Regulars who want flexibility",
    capacity: "1 person",
    from: 950000,
    unit: "month",
  },
  {
    type: "Event Space",
    what: "Open floor for launches, meetups and training days.",
    who: "Event organisers and community teams",
    capacity: "30–120 people",
    from: 950000,
    unit: "hour",
  },
  {
    type: "Virtual Office",
    what: "Business address, mail handling and meeting room credits.",
    who: "Remote-first companies needing a registered address",
    capacity: "—",
    from: 350000,
    unit: "month",
  },
];

export type Location = {
  slug: string;
  name: string;
  address: string;
  city: string;
  image: string;
  hours: string;
  access247: boolean;
  desksAvailable: number;
  desksTotal: number;
  roomsAvailable: number;
  roomsTotal: number;
  occupancy: number;
  amenities: string[];
  priceFrom: number;
  availability: Availability;
  types: WorkspaceType[];
  description: string;
  floors: number;
};

export const locations: Location[] = [
  {
    slug: "sudirman-tower",
    name: "Sattabi Sudirman Tower",
    address: "Jl. Jend. Sudirman Kav. 52-53, Level 18",
    city: "Jakarta",
    image: sudirman,
    hours: "Mon–Fri 07:00–22:00 · Sat 09:00–18:00",
    access247: true,
    desksAvailable: 24,
    desksTotal: 140,
    roomsAvailable: 4,
    roomsTotal: 9,
    occupancy: 82,
    amenities: ["Wi-Fi 1 Gbps", "Meeting rooms", "Pantry", "Printing", "Locker", "Parking", "Phone booths"],
    priceFrom: 89000,
    availability: "limited",
    types: ["Hot Desk", "Dedicated Desk", "Private Office", "Meeting Room", "Day Pass", "Virtual Office"],
    description:
      "Our flagship floor in the central business district, built for focused work with 12 phone booths, a quiet zone and nine meeting rooms overlooking Sudirman.",
    floors: 2,
  },
  {
    slug: "kuningan-mercury",
    name: "Sattabi Kuningan Mercury",
    address: "Jl. H.R. Rasuna Said Blok X-5, Level 7",
    city: "Jakarta",
    image: kuningan,
    hours: "Mon–Fri 08:00–21:00 · Sat 09:00–17:00",
    access247: false,
    desksAvailable: 41,
    desksTotal: 96,
    roomsAvailable: 6,
    roomsTotal: 7,
    occupancy: 57,
    amenities: ["Wi-Fi 1 Gbps", "Meeting rooms", "Pantry", "Printing", "Video conferencing", "Whiteboard"],
    priceFrom: 75000,
    availability: "available",
    types: ["Hot Desk", "Coworking", "Meeting Room", "Day Pass", "Event Space"],
    description:
      "A meeting-heavy location with seven glass rooms, all wired for video conferencing, plus a 60-seat event floor for launches and community nights.",
    floors: 1,
  },
  {
    slug: "bsd-green-office",
    name: "Sattabi BSD Green Office",
    address: "Green Office Park 5, Jl. BSD Grand Boulevard",
    city: "Tangerang",
    image: bsd,
    hours: "Mon–Fri 08:00–20:00",
    access247: true,
    desksAvailable: 12,
    desksTotal: 88,
    roomsAvailable: 2,
    roomsTotal: 5,
    occupancy: 86,
    amenities: ["Wi-Fi 1 Gbps", "Pantry", "Printing", "Locker", "Parking", "Monitor", "Shower"],
    priceFrom: 65000,
    availability: "limited",
    types: ["Hot Desk", "Dedicated Desk", "Private Office", "Meeting Room", "Day Pass"],
    description:
      "Suburban campus location with free parking, private office suites for teams of 4–20 and 24/7 access for resident members.",
    floors: 3,
  },
  {
    slug: "bandung-riau",
    name: "Sattabi Bandung Riau",
    address: "Jl. L.L.R.E. Martadinata 108",
    city: "Bandung",
    image: bandung,
    hours: "Mon–Sat 08:00–22:00",
    access247: false,
    desksAvailable: 33,
    desksTotal: 70,
    roomsAvailable: 3,
    roomsTotal: 4,
    occupancy: 52,
    amenities: ["Wi-Fi 500 Mbps", "Meeting rooms", "Pantry", "Coffee bar", "Printing", "Parking"],
    priceFrom: 55000,
    availability: "available",
    types: ["Hot Desk", "Coworking", "Meeting Room", "Day Pass", "Event Space"],
    description:
      "A converted heritage building with a coffee bar in the lounge, popular with design and product teams working out of Bandung.",
    floors: 2,
  },
];

export type Workspace = {
  id: string;
  name: string;
  type: WorkspaceType;
  locationSlug: string;
  floor: string;
  capacity: number;
  price: number;
  unit: "hour" | "day" | "month";
  amenities: string[];
  availability: Availability;
  slots: string[];
  image: string;
  description: string;
  cancellation: string;
};

export const workspaces: Workspace[] = [
  {
    id: "mr-301",
    name: "Meeting Room 301 — Cendana",
    type: "Meeting Room",
    locationSlug: "sudirman-tower",
    floor: "Level 18",
    capacity: 8,
    price: 180000,
    unit: "hour",
    amenities: ["65\" screen", "Video conferencing", "Whiteboard", "Wi-Fi 1 Gbps", "Water service"],
    availability: "available",
    slots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
    image: kuningan,
    description:
      "Corner room with daylight on two sides, a 65-inch screen with wireless casting and a full-wall whiteboard. Seats eight comfortably around an oak table.",
    cancellation: "Free cancellation up to 4 hours before the start time.",
  },
  {
    id: "hd-open-18",
    name: "Hot Desk — Open Floor 18A",
    type: "Hot Desk",
    locationSlug: "sudirman-tower",
    floor: "Level 18",
    capacity: 1,
    price: 89000,
    unit: "day",
    amenities: ["Wi-Fi 1 Gbps", "Monitor on request", "Locker", "Pantry", "Printing"],
    availability: "limited",
    slots: ["07:00", "09:00", "12:00", "15:00"],
    image: sudirman,
    description:
      "Any open desk on the main floor with height-adjustable chairs and power at every seat. Quiet zone is at the north end.",
    cancellation: "Free cancellation up to 1 hour before the start time.",
  },
  {
    id: "po-suite-4",
    name: "Private Office Suite 4",
    type: "Private Office",
    locationSlug: "bsd-green-office",
    floor: "Level 3",
    capacity: 6,
    price: 6900000,
    unit: "month",
    amenities: ["Lockable door", "24/7 access", "Monitor", "Locker", "Parking", "Pantry"],
    availability: "limited",
    slots: ["Available from 1 September"],
    image: bsd,
    description:
      "Six-desk lockable suite with a glass partition, storage cabinets and dedicated 24/7 credential access for every team member.",
    cancellation: "30 days notice before the end of the billing cycle.",
  },
  {
    id: "mr-702",
    name: "Meeting Room 702 — Palem",
    type: "Meeting Room",
    locationSlug: "kuningan-mercury",
    floor: "Level 7",
    capacity: 12,
    price: 260000,
    unit: "hour",
    amenities: ["Video conferencing", "Dual screens", "Whiteboard", "Catering on request"],
    availability: "limited",
    slots: ["08:00", "13:00", "16:00"],
    image: kuningan,
    description:
      "Our largest boardroom in Kuningan, wired for hybrid meetings with dual screens, a ceiling mic array and a 12-seat table.",
    cancellation: "Free cancellation up to 24 hours before the start time.",
  },
  {
    id: "dd-lane-b",
    name: "Dedicated Desk — Lane B12",
    type: "Dedicated Desk",
    locationSlug: "sudirman-tower",
    floor: "Level 17",
    capacity: 1,
    price: 1850000,
    unit: "month",
    amenities: ["Assigned desk", "Personal locker", "Monitor", "24/7 access", "Printing"],
    availability: "available",
    slots: ["Available now"],
    image: sudirman,
    description:
      "Your own desk by the window on Level 17, kept exactly as you leave it, with a personal locker and 24/7 credential access.",
    cancellation: "30 days notice before the end of the billing cycle.",
  },
  {
    id: "ev-loft",
    name: "Event Loft — Mercury Hall",
    type: "Event Space",
    locationSlug: "kuningan-mercury",
    floor: "Level 7",
    capacity: 60,
    price: 1250000,
    unit: "hour",
    amenities: ["Stage lighting", "PA system", "Projector", "Catering", "Registration desk"],
    availability: "available",
    slots: ["09:00", "13:00", "18:00"],
    image: bandung,
    description:
      "Open 60-seat floor for meetups, launches and training days, with a PA system, projector and a registration desk at the entrance.",
    cancellation: "Free cancellation up to 7 days before the event date.",
  },
  {
    id: "hd-lounge-bdg",
    name: "Hot Desk — Coffee Lounge",
    type: "Hot Desk",
    locationSlug: "bandung-riau",
    floor: "Ground floor",
    capacity: 1,
    price: 55000,
    unit: "day",
    amenities: ["Wi-Fi 500 Mbps", "Coffee bar", "Soft seating", "Printing"],
    availability: "available",
    slots: ["08:00", "10:00", "13:00", "16:00", "19:00"],
    image: bandung,
    description:
      "Relaxed lounge seating next to the coffee bar. Good for light work, calls with headphones and informal catch-ups.",
    cancellation: "Free cancellation up to 1 hour before the start time.",
  },
  {
    id: "mr-bdg-2",
    name: "Meeting Room 2 — Braga",
    type: "Meeting Room",
    locationSlug: "bandung-riau",
    floor: "Level 2",
    capacity: 6,
    price: 120000,
    unit: "hour",
    amenities: ["55\" TV", "Whiteboard", "Wi-Fi 500 Mbps"],
    availability: "full",
    slots: [],
    image: kuningan,
    description:
      "Compact six-seat room for interviews and stand-ups, with a 55-inch TV and a mobile whiteboard.",
    cancellation: "Free cancellation up to 4 hours before the start time.",
  },
];

export const amenities = [
  { name: "Wi-Fi 1 Gbps", detail: "Fibre with dual redundancy at every location" },
  { name: "Meeting rooms", detail: "4 to 16 seats, bookable by the hour" },
  { name: "Pantry", detail: "Coffee, tea and filtered water all day" },
  { name: "Printing", detail: "Scan, copy and print with pay-per-page credits" },
  { name: "Locker", detail: "Personal storage for desk members" },
  { name: "Parking", detail: "On-site parking, validated for day guests" },
  { name: "Monitor", detail: "27-inch monitors on request at any desk" },
  { name: "TV & screens", detail: "Wireless casting in every meeting room" },
  { name: "Whiteboard", detail: "Wall-mounted or mobile boards" },
  { name: "Video conferencing", detail: "Ceiling mics and 4K cameras in select rooms" },
];

export const plans = [
  {
    name: "Day Pass",
    price: "Rp 89,000",
    period: "per day",
    summary: "One full day in the coworking area.",
    benefits: ["1-day access", "Shared desk on the open floor", "Wi-Fi, pantry and printing", "Access valid for opening hours"],
    highlight: false,
  },
  {
    name: "Coworking",
    price: "Rp 950,000",
    period: "per month",
    summary: "Flexible workspace across every location.",
    benefits: ["Unlimited hot desk access", "All 4 locations", "2 meeting room credits", "Member events and community"],
    highlight: true,
  },
  {
    name: "Dedicated Desk",
    price: "Rp 1,850,000",
    period: "per month",
    summary: "Your own desk, kept as you left it.",
    benefits: ["Assigned desk and locker", "24/7 credential access", "5 meeting room credits", "Business address add-on"],
    highlight: false,
  },
  {
    name: "Private Office",
    price: "from Rp 4,800,000",
    period: "per month",
    summary: "A lockable room for your team.",
    benefits: ["Private lockable suite", "Team credentials included", "10 meeting room credits", "Guest passes each month"],
    highlight: false,
  },
  {
    name: "Meeting Room Credits",
    price: "Rp 1,000,000",
    period: "per 10 credits",
    summary: "Prepaid hours for meeting rooms.",
    benefits: ["1 credit = 1 hour, small room", "Valid 6 months", "Shareable across your team", "Bookable at any location"],
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "annual agreement",
    summary: "Multi-location workspace for larger teams.",
    benefits: ["Multi-location allocation", "Team management", "Centralised billing", "Access management and usage analytics"],
    highlight: false,
  },
];

export const rupiah = (value: number) =>
  "Rp " + value.toLocaleString("en-US", { maximumFractionDigits: 0 });

export const availabilityLabel: Record<Availability, string> = {
  available: "Available",
  limited: "Limited availability",
  full: "Fully booked",
  unavailable: "Temporarily unavailable",
};

export const getLocation = (slug: string) => locations.find((l) => l.slug === slug);
export const getWorkspace = (id: string) => workspaces.find((w) => w.id === id);
export const locationName = (slug: string) => getLocation(slug)?.name ?? slug;
