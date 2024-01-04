import { ChoiceDefinition, ThemeDefinition } from "./types";
import { generateColors } from "./colors";
import chroma from "chroma-js";

export const SUPPORTED_THEMES: ThemeDefinition[] = [
  {
    id: "sky",
    label: "Sky",
    baseColors: ["#38bdf8", "#3b82f6"],
    class: "bg-gradient-to-r from-sky-500 to-blue-500",
  },
  {
    id: "cotton_candy",
    label: "Cotton Candy",

    baseColors: ["#c4b5fd", "#c084fc"],
    class: "bg-gradient-to-r from-purple-300 to-pink-300",
  },
  {
    id: "smoke",
    label: "Smoke",

    baseColors: ["#22d3ee", "#a5f3fc"],
    class: "bg-gradient-to-r from-cyan-400 to-light-blue-500",
  },
  {
    id: "honey",
    label: "Honey",

    baseColors: ["#fcd34d", "#f97316"],
    class: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
  {
    id: "jade",
    label: "Jade",

    baseColors: ["#2dd4bf", "#059669"],
    class: "bg-gradient-to-r from-emerald-400 to-green-500",
  },
  {
    id: "bubblegum",
    label: "Bubblegum",

    baseColors: ["#d946ef", "#db2777"],
    class: "bg-gradient-to-r from-fuchsia-400 to-rose-500",
  },
  {
    id: "salem",
    label: "Salem",

    baseColors: ["#581c87", "#6d28d9"],
    class: "bg-gradient-to-r from-violet-800 to-indigo-800",
  },
  {
    id: "custom",
    label: "Custom...",

    baseColors: [chroma.random().hex(), chroma.random().hex()],
    class: "bg-gradient-to-r from-violet-800 to-indigo-800",
  },
];

export const SUPPORTED_PADDING_CHOICES: ChoiceDefinition[] = [
  { id: "sm", label: "16", class: "p-4" },
  { id: "md", label: "32", class: "p-8" },
  { id: "lg", label: "64", class: "p-16" },
  { id: "xl", label: "128", class: "p-32" },
];
