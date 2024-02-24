/* eslint-disable camelcase */
import type { GetAccessor } from "./conf";

// Declared.
const legacy_2_5 = {
  //
  clip: "clip-text",
  overbreath: "overbreath-text",
  typewriter: "typewriter-text",
  tabs: "tab-group",
  input: "base-input",
  form: "base-form",
  //
  alert: "alert-item",
  avatar: "avatar-a",
  button: "base-button",
  card: "card-item",
  dialog: "dialog-item",
  "router-a": "link-a",
  progress: "load-progress",
  a: "super-a",
  time: "time-bar",
  //
  divider: "div-line",
  dragbox: "drag-box",
  skeleton: "skeleton-screen",
  //
  details: "details-expand",
  "open-offset": "offset-expand",
  carousel: "rotation-pool",
  tooltip: "tool-tip",
  wrapper: "with-wrap",
  get(key: string) {
    return this[key];
  },
};

const legacy_2_6 = {
  ...legacy_2_5,
  avatar: "avatar-a",
  carousel: "carousel-slider",
  details: "open-details",
  dialog: "open-dialog",
  divider: "divider-line",
  progress: "loading-progress",
  tooltip: "open-tooltip",
  wrapper: "wrap-view",
};

// Declared.
const gPrefix: GetAccessor = {
  get(key) {
    return "g-" + key;
  },
};

const godownPrefix: GetAccessor = {
  get(key) {
    return "godown-" + key;
  },
};

const namings = {
  latest: gPrefix,
  //
  "g-prefix": gPrefix,
  "godown-prefix": godownPrefix,
  //
  legacy: legacy_2_5,
  "legacy-2.5": legacy_2_5,
  "legacy-2.6": legacy_2_6,
};

export default namings;
