export interface LocationEntry {
  label: string;
  aliases: string[];
  latitude: number;
  longitude: number;
}

export interface CityEntry {
  l: string;
  la: number;
  lo: number;
}

const stateAbbrs = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH",
  "NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT",
  "VT","VA","WA","WV","WI","WY",
];

const stateNameMap: Record<string, string> = {
  AL:"Alabama",AK:"Alaska",AZ:"Arizona",AR:"Arkansas",CA:"California",
  CO:"Colorado",CT:"Connecticut",DE:"Delaware",DC:"District of Columbia",
  FL:"Florida",GA:"Georgia",HI:"Hawaii",ID:"Idaho",IL:"Illinois",
  IN:"Indiana",IA:"Iowa",KS:"Kansas",KY:"Kentucky",LA:"Louisiana",
  ME:"Maine",MD:"Maryland",MA:"Massachusetts",MI:"Michigan",MN:"Minnesota",
  MS:"Mississippi",MO:"Missouri",MT:"Montana",NE:"Nebraska",NV:"Nevada",
  NH:"New Hampshire",NJ:"New Jersey",NM:"New Mexico",NY:"New York",
  NC:"North Carolina",ND:"North Dakota",OH:"Ohio",OK:"Oklahoma",OR:"Oregon",
  PA:"Pennsylvania",RI:"Rhode Island",SC:"South Carolina",SD:"South Dakota",
  TN:"Tennessee",TX:"Texas",UT:"Utah",VT:"Vermont",VA:"Virginia",
  WA:"Washington",WV:"West Virginia",WI:"Wisconsin",WY:"Wyoming",
};

const stateCoords: Record<string, [number, number]> = {
  AL:[32.3182,-86.9023],AK:[64.2008,-149.4937],AZ:[34.0489,-111.0937],
  AR:[34.7465,-92.2896],CA:[36.7783,-119.4179],CO:[39.5501,-105.7821],
  CT:[41.6032,-73.0877],DE:[38.9108,-75.5277],DC:[38.9072,-77.0369],
  FL:[27.6648,-81.5158],GA:[32.1656,-82.9001],HI:[19.8968,-155.5828],
  ID:[44.0682,-114.742],IL:[40.6331,-89.3985],IN:[40.2672,-86.1349],
  IA:[41.878,-93.0977],KS:[39.0119,-98.4842],KY:[37.8393,-84.27],
  LA:[30.9843,-91.9623],ME:[45.2538,-69.4455],MD:[39.0458,-76.6413],
  MA:[42.4072,-71.3824],MI:[44.3148,-85.6024],MN:[46.7296,-94.6859],
  MS:[32.3547,-89.3985],MO:[37.9643,-91.8318],MT:[46.8797,-110.3626],
  NE:[41.4925,-99.9018],NV:[38.8026,-116.4194],NH:[43.1939,-71.5724],
  NJ:[40.0583,-74.4057],NM:[34.5199,-105.8701],NY:[40.7128,-74.006],
  NC:[35.7596,-79.0193],ND:[47.5515,-101.002],OH:[40.4173,-82.9071],
  OK:[35.0078,-97.0929],OR:[43.8041,-120.5542],PA:[41.2033,-77.1945],
  RI:[41.5801,-71.4774],SC:[33.8361,-81.1637],SD:[43.9695,-99.9018],
  TN:[35.5175,-86.5804],TX:[31.9686,-99.9018],UT:[39.321,-111.0937],
  VT:[44.5588,-72.5778],VA:[37.4316,-78.6569],WA:[47.7511,-120.7401],
  WV:[38.5976,-80.4549],WI:[43.7844,-88.7879],WY:[42.7559,-107.3025],
};

const US_STATES_CACHE: LocationEntry[] = [];

function getStates(): LocationEntry[] {
  if (US_STATES_CACHE.length === 0) {
    for (const abbr of stateAbbrs) {
      const name = stateNameMap[abbr];
      const coords = stateCoords[abbr];
      US_STATES_CACHE.push({
        label: name,
        aliases: [name.toLowerCase(), abbr.toLowerCase()],
        latitude: coords[0],
        longitude: coords[1],
      });
    }
  }
  return US_STATES_CACHE;
}

let citiesPromise: Promise<CityEntry[]> | null = null;

function loadCities(): Promise<CityEntry[]> {
  if (citiesPromise) return citiesPromise;
  citiesPromise = import("./generated/us-cities").then((m) => m.US_CITIES);
  return citiesPromise;
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s']/g, "").replace(/\s+/g, " ").trim();
}

export async function searchLocations(query: string): Promise<LocationEntry[]> {
  const q = normalize(query);
  if (q.length < 2) return [];

  const results: LocationEntry[] = [];
  const seen = new Set<string>();

  for (const state of getStates()) {
    if (results.length >= 5) break;
    for (const alias of state.aliases) {
      if (alias.startsWith(q)) {
        if (!seen.has(state.label)) {
          results.push(state);
          seen.add(state.label);
        }
        break;
      }
    }
  }

  if (results.length >= 5) return results;

  const cities = await loadCities();

  for (const city of cities) {
    if (results.length >= 5) break;
    const labelLower = city.l.toLowerCase();
    if (labelLower.startsWith(q)) {
      if (!seen.has(city.l)) {
        results.push({
          label: city.l,
          aliases: [labelLower],
          latitude: city.la,
          longitude: city.lo,
        });
        seen.add(city.l);
      }
    }
  }

  if (results.length >= 5) return results;

  for (const city of cities) {
    if (results.length >= 5) break;
    const labelLower = city.l.toLowerCase();
    if (labelLower.includes(q)) {
      if (!seen.has(city.l)) {
        results.push({
          label: city.l,
          aliases: [labelLower],
          latitude: city.la,
          longitude: city.lo,
        });
        seen.add(city.l);
      }
    }
  }

  return results;
}

export async function geocodeLocation(text: string): Promise<{ latitude: number; longitude: number } | null> {
  const q = normalize(text);
  if (!q) return null;

  for (const state of getStates()) {
    for (const alias of state.aliases) {
      // Match exact alias or alias as a separate word (e.g. "chicago il" matches "il")
      if (q === alias || q.endsWith(` ${alias}`) || q.startsWith(`${alias} `)) {
        return { latitude: state.latitude, longitude: state.longitude };
      }
    }
  }

  const cities = await loadCities();

  for (const city of cities) {
    if (city.l.toLowerCase().includes(q)) {
      return { latitude: city.la, longitude: city.lo };
    }
  }

  return null;
}
