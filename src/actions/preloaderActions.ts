export const SHOW_PRELOADER = "SHOW_PRELOADER";

export const togglePreloader = (show = true) => ({
  type: SHOW_PRELOADER,
  show,
});
