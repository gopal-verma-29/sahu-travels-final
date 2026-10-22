// The site's content rules as code, shared by the launch guard (scripts/check-placeholders.mjs)
// and the acceptance harness. One definition, so the two can never disagree.

// The business shows no prices. Any money amount or rate wording is a policy violation.
// Official entry fees are money too: leave them out.
export const PRICE_RE =
  /₹|रुपय|\bRs\.?\s*\d|\bINR\b|\brupees?\b|\bper\s?km\b|\/\s?km\b|\bfares?\b|\bcheap(est)?\b|\baffordable\b|\bdiscount|\brate card\b|\blowest (price|rate)/i

// Text that means a field was never filled in.
export const PLACEHOLDER_RE =
  /lorem|\bTODO\b|\bTBD\b|\bTBC\b|\bTBA\b|\bN\/A\b|coming soon|to be confirmed|\bundefined\b|\bnull\b|\[object|\{\{/i

// Claims about the BUSINESS that only the client can make. Advisory in the harness (a human decides),
// because facts about places ("declared in 1976") are fine and a regex cannot always tell them apart.
export const CLAIM_RE =
  /\b(((\d+|one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty)\+?\s+years?\s+(of\s+)?(experience|in business|of service|serving))|years? of experience|since\s+(19|20)\d\d|[\d,]+\+?\s*(happy\s+)?(customers|clients|travell?ers)|guarantee[d]?|licen[sc]ed|certified|award[- ]winning|trusted by|5[- ]star|24\s*(x|\/)\s*7|24\s*(hours?|hrs?)|round[- ]the[- ]clock)\b|★/i
