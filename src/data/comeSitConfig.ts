/**
 * "Come sit with yourself" — bucket routing, media placeholders, research links.
 * Replace video URLs and RESEARCH_BASE with your production assets when ready.
 */

export type MentalHealthBucket = "depression" | "anxiety" | "psychosis";

export const MENTAL_HEALTH_BUCKETS: MentalHealthBucket[] = [
  "depression",
  "anxiety",
  "psychosis",
];

/** Bucket video clips served from /public/clips/ */
export const BUCKET_VIDEO_URLS: Record<MentalHealthBucket, string> = {
  depression: "/clips/Depression.mp4",
  anxiety: "/clips/Anxiety.mp4",
  psychosis: "/clips/Psychosis.mp4",
};

/** Placeholder “research” destination — swap for your real studies page. */
export const RESEARCH_LINK_BASE = "/research";

export function researchLinkForBucket(bucket: MentalHealthBucket): string {
  return `${RESEARCH_LINK_BASE}?topic=${bucket}`;
}

/** Warm copy for the highlighted theme area (not a clinical label). */
export const BUCKET_WARM_HIGHLIGHT: Record<
  MentalHealthBucket,
  { theme: string; message: string }
> = {
  depression: {
    theme: "Themes connected to depression",
    message:
      "Low mood and heaviness touch many of us. Putting it into words is already brave — you don’t have to carry it in silence.",
  },
  anxiety: {
    theme: "Themes connected to anxiety",
    message:
      "A wired mind and tight body are deeply human responses. What you feel matters, and there are gentle ways to soften the edges.",
  },
  psychosis: {
    theme: "Themes around perception & reality",
    message:
      "When how we experience the world shifts, kind, professional support can make a real difference. You deserve steady, respectful care.",
  },
};

export const BUCKET_DISPLAY: Record<
  MentalHealthBucket,
  { headline: string; videoCaption: string }
> = {
  depression: {
    headline: "What you’re carrying may sit close to low mood & energy",
    videoCaption: "A short reflection on how this can show up in daily life",
  },
  anxiety: {
    headline: "What you’re carrying may sit close to worry & nervous system strain",
    videoCaption: "A short reflection on how this can show up in daily life",
  },
  psychosis: {
    headline: "What you shared may relate to how we perceive reality",
    videoCaption: "A gentle overview — professional support matters here",
  },
};
