import {
  Accessibility,
  Activity,
  AlignHorizontalDistributeCenter,
  Baby,
  Bolt,
  Car,
  CircleAlert,
  CircleMinus,
  Clock,
  Cpu,
  HeartHandshake,
  Layers,
  Link2,
  MapPin,
  ScanFace,
  ShieldCheck,
  Slice,
  Smile,
  Sparkles,
  SquareParking,
  Stethoscope,
  Sun,
  Zap,
  type LucideIcon,
} from "lucide-react";

/*
 * The seed stores an icon name per card; this is the only place a name is
 * turned into a component, so a renamed icon is a one-line fix.
 */
const icons: Record<string, LucideIcon> = {
  accessibility: Accessibility,
  activity: Activity,
  "align-horizontal-distribute-center": AlignHorizontalDistributeCenter,
  baby: Baby,
  bolt: Bolt,
  car: Car,
  "circle-alert": CircleAlert,
  "circle-minus": CircleMinus,
  clock: Clock,
  cpu: Cpu,
  "heart-handshake": HeartHandshake,
  layers: Layers,
  "link-2": Link2,
  "map-pin": MapPin,
  "scan-face": ScanFace,
  "shield-check": ShieldCheck,
  slice: Slice,
  smile: Smile,
  sparkles: Sparkles,
  "square-parking": SquareParking,
  stethoscope: Stethoscope,
  sun: Sun,
  zap: Zap,
};

export function getIcon(name: string): LucideIcon {
  return icons[name] ?? Sparkles;
}
