export const COW_BREEDS = [
  "Local Desi",
  "Tripura Local",
  "Jersey",
  "Jersey Cross",
  "Holstein Friesian (HF)",
  "HF Cross",
  "Sahiwal",
  "Sahiwal Cross",
  "Gir",
  "Gir Cross",
  "Red Sindhi",
  "Red Sindhi Cross",
  "Tharparkar",
  "Kankrej",
  "Ongole",
  "Hariana",
  "Siri",
  "Hill Cattle",
  "Indigenous Crossbreed",
  "Desi Cross",
  "Dairy Crossbreed",
  "Local Hill-Type Cattle",
  "Mixed Breed Cattle",
  "Frieswal",
  "Holdeo",
  "Sunandini",
  "Brown Swiss Cross",
  "Ayrshire Cross",
  "Local Buffalo-Type Cross Cattle"
];

export const GOAT_BREEDS = [
  "Black Bengal",
  "Jamunapari",
  "Barbari",
  "Beetal",
  "Sirohi",
  "Jakhrana",
  "Osmanabadi",
  "Malabari (Tellicherry)",
  "Sojat",
  "Kanni",
  "Sangamneri",
  "Surti Goat",
  "Zalawadi",
  "Gaddi",
  "Changthangi",
  "Chegu",
  "Barbari Cross",
  "Sirohi Cross",
  "Black Bengal Cross",
  "Local Desi Goat"
];

export const BUFFALO_BREEDS = [
  "Murrah",
  "Surti",
  "Jaffarabadi",
  "Mehsana",
  "Nili-Ravi",
  "Bhadawari",
  "Toda",
  "Banni",
  "Chilika",
  "Kalahandi",
  "Luit (Swamp)",
  "Pandharpuri",
  "Murrah Cross",
  "Local Desi Buffalo"
];

export const SHEEP_BREEDS = [
  "Nellore",
  "Marwari",
  "Deccani",
  "Bellary",
  "Ganjam",
  "Kathiawari",
  "Mandya",
  "Chokla",
  "Magra",
  "Nali",
  "Sonadi",
  "Jaisalmeri",
  "Malpura",
  "Muzzafarnagri",
  "Avikalin",
  "Kashmir Merino",
  "Gaddi Sheep",
  "Rambouillet Cross",
  "Merino Cross",
  "Local Desi Sheep"
];

export const MITHUN_BREEDS = [
  "Arunachal Mithun",
  "Nagaland Mithun",
  "Manipur Mithun",
  "Mizoram Mithun",
  "Mithun Cross",
  "Local Mithun"
];

export const getBreedsForType = (type: string): string[] => {
  const t = (type || "").toLowerCase();
  if (t.includes("goat")) {
    return GOAT_BREEDS;
  }
  if (t.includes("buffalo")) {
    return BUFFALO_BREEDS;
  }
  if (t.includes("sheep")) {
    return SHEEP_BREEDS;
  }
  if (t.includes("mithun")) {
    return MITHUN_BREEDS;
  }
  return COW_BREEDS;
};
