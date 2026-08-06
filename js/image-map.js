// Image map for Samyati Holidays packages
// Single source of truth for package hero images
// All images served as WebP from assets/images/1200w/

const IMAGE_MAP = {
  "ayodhya-kashi-prayagraj": "ayodhya-kashi-prayagraj",
  "bhutan":                  "bhutan",
  "coorg":                   "coorg",
  "goa":                     "goa",
  "gokarna-murudeshwar":     "gokarna-murudeshwar",
  "hampi":                   "hampi",
  "himachal":                "himachal",
  "hyderabad":               "hyderabad",
  "jagannath-puri":          "jagannath-puri",
  "jaipur":                  "jaipur",
  "kashmir":                 "kashmir",
  "kedarnath-badrinath":     "kedarnath-badrinath",
  "kerala":                  "kerala",
  "kodaikanal":              "kodaikanal",
  "manali-kasol":            "manali-kasol",
  "mathura-vrindavan":       "mathura-vrindavan",
  "nainital-mussoorie":      "nainital-mussoorie",
  "ooty-mysore":             "ooty-mysore",
  "rajasthan":               "rajasthan",
  "rameshwaram":             "rameshwaram",
  "rann-utsav":              "rann-utsav",
  "sikkim-darjeeling":       "sikkim-darjeeling",
  "somnath-dwarka":          "somnath-dwarka",
  "tadoba":                  "tadoba",
  "ujjain-indore":           "ujjain-indore",
  "wayanad":                 "wayanad"
};

function pkgImage(slug) {
  const base = IMAGE_MAP[slug];
  if (!base) return '';
  return `../assets/images/1200w/${base}.webp`;
}
