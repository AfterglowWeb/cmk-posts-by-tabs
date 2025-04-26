import {FeatureCollection, Point} from 'geojson';

export async function loadCastlesGeojson() {
  const url = new URL('../data/castles.json', import.meta.url);

  return await fetch(url).then(res => res.json());
}
