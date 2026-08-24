// Oldtimerregeling: passenger cars 40 years or older are fully exempt from MRB.
export const OLDTIMER_EXEMPT_AGE_YEARS = 40;

export function isOldtimerExempt(datumEersteToelating: string | undefined | null, now: Date): boolean {
  if (!datumEersteToelating || datumEersteToelating.length < 8) return false;
  const year = +datumEersteToelating.substring(0, 4);
  const month = +datumEersteToelating.substring(4, 6);
  const day = +datumEersteToelating.substring(6, 8);
  const firstRegistration = new Date(year, month - 1, day);
  if (isNaN(firstRegistration.getTime())) return false;

  const ageThreshold = new Date(firstRegistration);
  ageThreshold.setFullYear(ageThreshold.getFullYear() + OLDTIMER_EXEMPT_AGE_YEARS);
  return ageThreshold <= now;
}
