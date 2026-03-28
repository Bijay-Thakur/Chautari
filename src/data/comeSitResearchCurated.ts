import type { MentalHealthBucket } from "./comeSitConfig";

export type CuratedResearchLink = {
  title: string;
  href: string;
  /** Shown first when the user’s reflection matched this bucket. */
  relatedBuckets: MentalHealthBucket[];
};

export type CuratedResearchSection = {
  id: string;
  title: string;
  subtitle: string;
  links: CuratedResearchLink[];
};

export const COME_SIT_RESEARCH_SECTIONS: CuratedResearchSection[] = [
  {
    id: "scholarly",
    title: "Scholarly & clinical research",
    subtitle: "Trusted institutions and peer-reviewed work — read at your own pace.",
    links: [
      {
        title: "NIMH — Understanding psychosis",
        href: "https://www.nimh.nih.gov/health/publications/understanding-psychosis",
        relatedBuckets: ["psychosis"],
      },
      {
        title: "PMC — Acceptance-based behavior therapy for depression with psychosis",
        href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4704101/",
        relatedBuckets: ["depression", "psychosis"],
      },
      {
        title: "Psychiatrist.com — “Caseness” for depression and anxiety in outpatients",
        href: "https://www.psychiatrist.com/pcc/caseness-depression-anxiety-depressed-outpatient-population/",
        relatedBuckets: ["depression", "anxiety"],
      },
      {
        title: "The Lancet Psychiatry — Coordinated specialty care for first-episode psychosis",
        href: "https://www.thelancet.com/journals/lanpsy/article/PIIS2215-0366(14)00069-2/fulltext",
        relatedBuckets: ["psychosis"],
      },
    ],
  },
  {
    id: "cases",
    title: "Clinical case studies",
    subtitle: "How care shows up for real people — illustrative, not a template for self-diagnosis.",
    links: [
      {
        title: "SCIRP — Comorbid MDD and GAD (case report)",
        href: "https://www.scirp.org/journal/paperinformation?paperid=136810",
        relatedBuckets: ["depression", "anxiety"],
      },
      {
        title: "Frontiers in Psychiatry — Case reports in anxiety and stress",
        href: "https://www.frontiersin.org/research-topics/45195/case-reports-in-anxiety-and-stress/magazine",
        relatedBuckets: ["anxiety"],
      },
      {
        title: "Journal of Clinical Medicine — Treatment-resistant depression with psychotic features",
        href: "https://www.mdpi.com/2077-0383/10/11/2445",
        relatedBuckets: ["depression", "psychosis"],
      },
    ],
  },
  {
    id: "lived",
    title: "Lived experience & stories",
    subtitle: "Voices from people who’ve been there — hope without minimizing how hard it can be.",
    links: [
      {
        title: "NAMI — Personal stories of recovery (searchable)",
        href: "https://my.nami.org/Personal-Stories/",
        relatedBuckets: ["depression", "anxiety", "psychosis"],
      },
      {
        title: "Psychology Today — Thriving after psychosis (personal narrative)",
        href: "https://www.psychologytoday.com/us/blog/divergent-minds/202512/it-is-possible-to-thrive-after-psychosis-i-am-proof",
        relatedBuckets: ["psychosis"],
      },
      {
        title: "Rethink Mental Illness — Laura’s story: surviving psychotic depression",
        href: "https://www.rethink.org/news-and-stories/blogs/2024/03/i-have-survived-100-of-my-darkest-days-laura-s-story/",
        relatedBuckets: ["depression", "psychosis"],
      },
      {
        title: "Mind UK — Recovery, hallucinations & anxiety (personal stories)",
        href: "https://www.mind.org.uk/information-support/types-of-mental-health-problems/psychosis/recovery-and-support/",
        relatedBuckets: ["psychosis", "anxiety"],
      },
    ],
  },
];

function linkScore(link: CuratedResearchLink, bucket: MentalHealthBucket): number {
  return link.relatedBuckets.includes(bucket) ? 1 : 0;
}

export function sortSectionLinksForBucket(
  links: CuratedResearchLink[],
  bucket: MentalHealthBucket
): CuratedResearchLink[] {
  return [...links].sort((a, b) => linkScore(b, bucket) - linkScore(a, bucket));
}
