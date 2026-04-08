// ============================================================
// AI QUESTIONNAIRE CHATBOT — Decision trees per screen
// Each node: question + options → next node or screen navigation
// ============================================================

export const questionnaireTree = {
  'S-00': {
    entry: {
      message: "I've detected **5 critical** and **5 warning** drift findings in North-2 this month. The most severe issues are in pipeline health (Sec:Pri at 0.69), reach erosion (Kanpur ND% down 6.6pp), and outstanding concentration (Varanasi). Where would you like to investigate first?",
      options: [
        { label: '🔴 Pipeline Stuffing — Sec:Pri dropped to 0.69', next: 'pipeline_deep', navigateTo: 'S-03' },
        { label: '🔴 Reach Erosion — Kanpur losing outlets', next: 'reach_deep', navigateTo: 'S-01' },
        { label: '🔴 Outstanding Crisis — Varanasi distributor at 50%', next: 'outstanding_deep', navigateTo: 'S-08' },
        { label: '🟡 Show me the full severity ranking', next: 'severity_rank' },
        { label: '📊 Give me the executive summary first', next: 'exec_summary' },
      ],
    },
    severity_rank: {
      message: "Here's the severity ranking of all active findings:\n\n**Critical (5):**\n1. Pipeline Stuffing — Sec:Pri 0.69, 4 months declining\n2. Reach Erosion — Kanpur ND% -6.6pp\n3. Outlet Churn Spike — Varanasi 2.4x normal\n4. Outstanding Concentration — Kumar Enterprises 50%\n5. Extraction Decay — Allahabad 39pp below benchmark\n\n**Warning (5):**\n6. Channel Shift — Lucknow GT -6pp\n7. Beat Productivity — Agra -28% vs design\n8. Promo Underperformance — Varanasi 5% vs 15% target\n9. Benchmark Gap — Widening 6 months\n10. SFA Decay — MAU down to 78%\n\nWhich area concerns you most?",
      options: [
        { label: 'Start with Pipeline — it affects the whole region', next: 'pipeline_deep', navigateTo: 'S-03' },
        { label: 'Varanasi seems to have multiple issues clustering', next: 'varanasi_cluster' },
        { label: 'Show me what\'s driving the extraction decay', next: 'extraction_deep', navigateTo: 'S-02' },
      ],
    },
    exec_summary: {
      message: "**North-2 Executive Summary — March 2026:**\n\nRevenue: ₹6.8Cr (-20% SPLY) | MTD: 58% complete\n\nThe decline decomposes as:\n- **Reach erosion** contributes 14pp — outlet churn in 3 districts\n- **Extraction decay** contributes 6pp — WSP/outlet declining\n- **Pipeline stuffing** masks the true picture — primary up but secondary down\n\nThe causal chain: Outlets churning → fewer billing points → lower secondary → distributors compensating with primary loading → Sec:Pri collapsing → outstanding growing as unsold inventory piles up.\n\nThis is a connected problem, not isolated incidents.",
      showChart: 'revenue_decomposition',
      options: [
        { label: 'Walk me through the reach problem first', next: null, navigateTo: 'S-01' },
        { label: 'Show me the pipeline stuffing pattern', next: null, navigateTo: 'S-03' },
        { label: 'Which distributors are the biggest concern?', next: 'distributor_concern' },
      ],
    },
    varanasi_cluster: {
      message: "Good observation. Varanasi has **4 concurrent drift findings** — this is the most concentrated problem geography:\n\n1. 🔴 Outlet churn at 2.4x normal (DA-08)\n2. 🔴 Outstanding at Kumar Enterprises at 50% (DA-09)\n3. 🟡 Promo underperformance — 30% participation (DA-06)\n4. 🟡 Extraction decay cascading from churn\n\n**Hypothesis:** Kumar Enterprises has a credit/collection issue → restricting fresh billing → outlets not getting stock → churn accelerating → promo can't work because outlets aren't active.\n\nThis is likely a single root cause manifesting as 4 findings.",
      options: [
        { label: 'Show me Kumar Enterprises\' outstanding details', next: null, navigateTo: 'S-08' },
        { label: 'Check if the outlet churn is real or data lag', next: null, navigateTo: 'S-01' },
        { label: 'What about the promo — can we course-correct?', next: null, navigateTo: 'S-06' },
      ],
    },
    distributor_concern: {
      message: "**Top 3 Distributors of Concern:**\n\n| Distributor | Sec:Pri | Outstanding:Primary | SALY Secondary |\n|---|---|---|---|\n| Kumar Enterprises (Varanasi) | 0.60 | 50% | -18% |\n| Verma & Sons (Kanpur) | 0.60 | 46% | -15% |\n| Gupta Agencies (Lucknow) | 0.60 | 39% | -12% |\n\nAll three show the same pattern: primary loading up, secondary declining, outstanding growing. This suggests scheme-driven loading without adequate secondary pull.",
      showChart: 'distributor_scatter',
      options: [
        { label: 'Deep dive into distributor pipeline', next: null, navigateTo: 'S-03' },
        { label: 'Check outstanding health for these distributors', next: null, navigateTo: 'S-08' },
        { label: 'Are there schemes driving this loading?', next: null, navigateTo: 'S-06' },
      ],
    },
  },

  'S-01': {
    entry: {
      message: "**Reach Health Analysis — North-2**\n\nND% has dropped from 47.1% to 42.3% over 6 months. The region is losing outlets faster than adding them.\n\nKey signals:\n- 344 outlets churned across 8 districts\n- Only 125 added (net loss: 219)\n- Churn concentrated in FLP and OLP town classes\n- Varanasi and Kanpur are the worst affected\n\nWhat would you like to investigate?",
      showChart: 'nd_trend',
      options: [
        { label: 'Which districts have the worst churn?', next: 'district_churn' },
        { label: 'Is this real churn or data quality issue?', next: 'data_quality_check' },
        { label: 'Show me the outlet funnel breakdown', next: 'outlet_funnel' },
        { label: 'What\'s the coverage gap by town class?', next: 'coverage_gap' },
      ],
    },
    district_churn: {
      message: "**Outlet Churn by District (Monthly):**\n\n| District | Churn | Additions | Net | Historical Norm |\n|---|---|---|---|---|\n| Varanasi | 48 | 12 | -36 | 20/month |\n| Kanpur | 65 | 22 | -43 | 28/month |\n| Agra | 54 | 18 | -36 | 22/month |\n| Allahabad | 41 | 8 | -33 | 18/month |\n| Meerut | 35 | 10 | -25 | 15/month |\n\nVaranasi churn is 2.4x historical norm — this triggered the DA-08 alert. Kanpur and Agra are 2.3x and 2.5x respectively.\n\n80% of churned outlets had declining visit frequency in prior 2 months — this suggests SFA/visit compliance is a leading indicator.",
      showChart: 'churn_by_district',
      options: [
        { label: 'Check visit compliance in these districts', next: null, navigateTo: 'S-05' },
        { label: 'Is there a connection to outstanding issues?', next: null, navigateTo: 'S-08' },
        { label: 'Show coverage gap for expansion potential', next: null, navigateTo: 'S-09' },
        { label: 'What extraction looks like at remaining outlets?', next: null, navigateTo: 'S-02' },
      ],
    },
    data_quality_check: {
      message: "**Data Quality Cross-Check:**\n\nI've cross-referenced the churn against SFA visit logs and secondary billing:\n\n- **Real churn (confirmed):** 72% of churned outlets — no billing AND no visit in 2+ months\n- **Possible data lag:** 18% — no billing but SFA shows recent visits (may be order capture issue)\n- **Misclassified:** 10% — outlet reassigned to different distributor, not actually churned\n\nSo ~28% of the churn number might be overstated due to data lag and reassignment. But the core signal is real — 72% confirmed churn is still 1.7x the historical norm.\n\nRecommendation: Flag the 18% data lag outlets for SFA team to verify visit-to-order conversion.",
      options: [
        { label: 'Show me only confirmed churn by geography', next: 'district_churn' },
        { label: 'What\'s causing the real churn?', next: 'churn_causes' },
        { label: 'Go back to reach overview', next: 'entry' },
      ],
    },
    churn_causes: {
      message: "**Root Cause Analysis of Confirmed Churn:**\n\nBased on correlating churned outlets with visit logs, billing patterns, and competitor signals:\n\n1. **Visit frequency decline** (38% of churn): Outlets visited <2x/month before churn. SFA adoption decay is the leading indicator.\n2. **Competitor displacement** (26%): New competitor distributor active in same micromarket. Particularly in Kanpur FLP areas.\n3. **Credit/collection issues** (22%): Distributor restricting supply due to outstanding. Concentrated around Kumar Enterprises (Varanasi).\n4. **Low extraction** (14%): Outlets with WSP below ₹2,000/month — economically unviable for distributor service.\n\nThe first two causes are addressable. Visit frequency is an SFA discipline issue. Competitor displacement needs field intelligence.",
      options: [
        { label: 'Show me SFA/territory health', next: null, navigateTo: 'S-05' },
        { label: 'Check the outstanding connection', next: null, navigateTo: 'S-08' },
        { label: 'Look at extraction at surviving outlets', next: null, navigateTo: 'S-02' },
      ],
    },
    outlet_funnel: {
      message: "**Outlet Funnel — North-2:**\n\n```\nTotal Viable (POI)    : 8,200\nGeo-Tagged            : 5,400  (65.9%)\nPJP (Permanent Journey): 4,100  (50.0%)\nBilled (1+ month)     : 3,800  (46.3%)\nActive (3-month)      : 3,200  (39.0%)\nGEO ECO (profitable)  : 2,880  (35.1%)\n```\n\nBiggest drop-offs:\n- Tagged → PJP: 1,300 outlets tagged but not in any salesperson's plan\n- Billed → Active: 600 outlets billed once but went dormant\n- Active → GEO ECO: 320 outlets active but below profitability threshold",
      showChart: 'outlet_funnel',
      options: [
        { label: 'Why are 1,300 outlets not in PJP?', next: 'pjp_gap' },
        { label: 'What makes outlets go dormant?', next: 'churn_causes' },
        { label: 'Show me the untapped potential', next: null, navigateTo: 'S-09' },
      ],
    },
    pjp_gap: {
      message: "**1,300 Tagged but Not-in-PJP Outlets:**\n\nThese outlets are known and geotagged but no salesperson covers them. Decomposition:\n\n- **Beat capacity overflow** (45%): Existing beats already at max outlets. Need beat redesign to absorb.\n- **Remote locations** (28%): Outlets >15km from nearest beat centre. Unviable for daily coverage.\n- **New additions not assigned** (18%): Recently tagged but beat assignment pending.\n- **Vacant territories** (9%): ASM/SE position vacant or recently changed.\n\nThe 45% beat capacity issue maps directly to the DB-04 (Route Re-Optimisation) war room finding for Agra.",
      options: [
        { label: 'Check territory/beat health', next: null, navigateTo: 'S-05' },
        { label: 'Look at expansion potential', next: null, navigateTo: 'S-09' },
        { label: 'Go back to reach overview', next: 'entry' },
      ],
    },
    coverage_gap: {
      message: "**Coverage Gap by Town Class:**\n\n| Town Class | Viable | Active | Gap | ND% |\n|---|---|---|---|---|\n| Metro | 2,100 | 1,240 | 860 | 59.0% |\n| TLP | 2,500 | 1,200 | 1,300 | 48.0% |\n| FLP | 1,750 | 700 | 1,050 | 40.0% |\n| OLP | 1,300 | 490 | 810 | 37.7% |\n| OLM | 550 | 170 | 380 | 30.9% |\n\nThe largest absolute gap is in TLP towns (1,300 outlets). But the lowest penetration is OLM (30.9%). Priority depends on strategy: volume recovery (Metro/TLP) vs market expansion (FLP/OLP/OLM).",
      showChart: 'coverage_gap_chart',
      options: [
        { label: 'Show me where demand is high but distribution low', next: null, navigateTo: 'S-09' },
        { label: 'What extraction looks like by town class?', next: null, navigateTo: 'S-02' },
        { label: 'Check benchmark — how do we compare?', next: null, navigateTo: 'S-07' },
      ],
    },
  },

  'S-02': {
    entry: {
      message: "**Extraction Health — North-2**\n\nOverall extraction rate at 62% vs 74% cohort median — a 12pp gap that has been widening for 6 months.\n\nWSP/outlet at ₹3,200 vs category median ₹4,100. Lines per call declining from 3.4 to 2.8.\n\nThe extraction problem means even where we have outlets, we're getting less revenue from each one.",
      showChart: 'extraction_trend',
      options: [
        { label: 'Which districts have the worst extraction?', next: 'district_extraction' },
        { label: 'Is this a category mix issue?', next: 'category_mix' },
        { label: 'What\'s the relationship to visit quality?', next: 'visit_quality' },
        { label: 'Show extraction vs benchmark by geography', next: 'benchmark_compare' },
      ],
    },
    district_extraction: {
      message: "**Extraction Rate by District:**\n\n| District | Rate | Benchmark | Gap | WSP/Outlet |\n|---|---|---|---|---|\n| Lucknow | 72% | 88% | -16pp | ₹3,387 |\n| Kanpur | 68% | 88% | -20pp | ₹4,118 |\n| Agra | 64% | 88% | -24pp | ₹4,038 |\n| Varanasi | 58% | 88% | -30pp | ₹3,846 |\n| Allahabad | 49% | 88% | -39pp | ₹3,161 |\n| Meerut | 56% | 82% | -26pp | ₹3,929 |\n\nAllahabad is the worst — 39pp below benchmark. This triggered the DA-02 critical finding. Even Lucknow (best in region) is 16pp below benchmark.",
      showChart: 'extraction_by_district',
      options: [
        { label: 'Deep dive into Allahabad — why so low?', next: 'allahabad_deep' },
        { label: 'Is this connected to the reach problem?', next: null, navigateTo: 'S-01' },
        { label: 'Check if schemes are helping extraction', next: null, navigateTo: 'S-06' },
      ],
    },
    category_mix: {
      message: "**Extraction by Category:**\n\n| Category | Rate | Benchmark | Lines/Call |\n|---|---|---|---|\n| Hair Care | 64% | 88% | 2.8 |\n| Skin Care | 56% | 82% | 2.4 |\n\nBoth categories are below benchmark but Skin Care has a wider relative gap. The lines/call metric suggests salespersons are not pitching the full portfolio.\n\nSkin Care was launched in this region only 8 months ago — some of the gap is maturity-related, but 26pp below benchmark suggests distribution depth issues beyond just newness.",
      options: [
        { label: 'Which outlets carry Skin Care vs Hair Care?', next: 'sku_depth' },
        { label: 'Is the sales team trained on Skin Care?', next: 'visit_quality' },
        { label: 'Check if promotions cover Skin Care', next: null, navigateTo: 'S-06' },
      ],
    },
    sku_depth: {
      message: "**SKU Distribution Depth:**\n\n- Hair Care: 4 SKUs available, avg outlet carries 2.8 SKUs (70% depth)\n- Skin Care: 3 SKUs available, avg outlet carries 1.2 SKUs (40% depth)\n\nSkin Care has a severe depth problem — most outlets carry only 1 SKU (the hero product). The other 2 SKUs have <25% WD%.\n\nThis directly impacts extraction rate — you can't extract well from a shelf with only 1 product.",
      options: [
        { label: 'Is there a scheme to push Skin Care depth?', next: null, navigateTo: 'S-06' },
        { label: 'Go back to extraction overview', next: 'entry' },
        { label: 'Check territory health for training gaps', next: null, navigateTo: 'S-05' },
      ],
    },
    visit_quality: {
      message: "**Visit-to-Extraction Correlation:**\n\nOutlets with 4+ visits/month: Extraction rate 78%, Lines/call 3.6\nOutlets with 2-3 visits/month: Extraction rate 62%, Lines/call 2.8\nOutlets with <2 visits/month: Extraction rate 41%, Lines/call 1.9\n\nThere's a clear relationship: higher visit frequency → higher extraction. The SFA adoption decay (MAU dropping from 86% to 78%) is directly causing extraction to fall.\n\nFix visit compliance first, and extraction will follow.",
      options: [
        { label: 'Show me territory & SFA health', next: null, navigateTo: 'S-05' },
        { label: 'Back to extraction overview', next: 'entry' },
      ],
    },
    allahabad_deep: {
      message: "**Allahabad Deep Dive:**\n\nExtraction at 49% is the worst in the region. Contributing factors:\n\n1. **SKU depth:** Only 1.8 avg SKUs/outlet (vs 2.8 regional avg)\n2. **Visit frequency:** 1.6 visits/month (vs 2.4 regional avg)\n3. **Lines/call:** 2.0 (vs 2.8 regional avg)\n4. **No active scheme** currently running for this district\n5. **Distributor capacity:** Only 1 distributor covering 310 outlets with limited beat reach\n\nThis is also the district with the highest whitespace opportunity (demand index P82). Paradoxically, the highest-potential market has the worst execution.",
      options: [
        { label: 'Look at Allahabad expansion potential', next: null, navigateTo: 'S-09' },
        { label: 'Check scheme coverage', next: null, navigateTo: 'S-06' },
        { label: 'Review territory design for Allahabad', next: null, navigateTo: 'S-05' },
      ],
    },
    benchmark_compare: {
      message: "**Extraction vs Benchmark by Geography:**\n\nEvery district in North-2 is below the sector cohort median (74%). The gap has been widening for 6 consecutive months.\n\nThe region is at the 22nd percentile for extraction — below 78% of peer geographies. Even the best-performing district (Lucknow at 72%) is below the cohort median.",
      showChart: 'extraction_benchmark',
      options: [
        { label: 'Show full benchmark comparison', next: null, navigateTo: 'S-07' },
        { label: 'What would closing the gap mean in revenue?', next: 'revenue_impact' },
      ],
    },
    revenue_impact: {
      message: "**Revenue Impact of Closing Extraction Gap:**\n\nIf North-2 reaches the cohort median extraction rate (74% vs current 62%):\n\n- Additional WSP/outlet: +₹900/month\n- Active outlets: 3,200\n- **Monthly revenue uplift: ₹28.8L**\n- **Annual impact: ₹3.46Cr**\n\nThis is the single largest revenue lever — more impactful than new outlet additions in the short term because it works with existing infrastructure.",
      options: [
        { label: 'What would improve extraction fastest?', next: 'visit_quality' },
        { label: 'Compare with reach expansion impact', next: null, navigateTo: 'S-09' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
  },

  'S-03': {
    entry: {
      message: "**Pipeline Health — North-2**\n\nSec:Pri ratio collapsed from 0.87 to 0.69 in 4 months. This is the most critical finding in the region.\n\n**What this means:** For every ₹100 loaded into distributors (primary), only ₹69 is flowing out to outlets (secondary). ₹31 is sitting as inventory. This is textbook pipeline stuffing.\n\n3 distributors have Sec:Pri below 0.65, and the pattern correlates with Q4 scheme loading.",
      showChart: 'pipeline_trend',
      options: [
        { label: 'Which distributors are stuffed?', next: 'stuffed_distributors' },
        { label: 'Is this scheme-driven loading?', next: 'scheme_loading' },
        { label: 'What\'s the stock days situation?', next: 'stock_days' },
        { label: 'Show me the primary vs secondary scatter', next: 'pri_sec_scatter' },
      ],
    },
    stuffed_distributors: {
      message: "**Distributor Pipeline Health:**\n\n| Distributor | District | Sec:Pri | Stock Days | SALY Pri | SALY Sec |\n|---|---|---|---|---|---|\n| 🔴 Gupta Agencies | Lucknow | 0.60 | 55 | +18% | -12% |\n| 🔴 Verma & Sons | Kanpur | 0.60 | 48 | +22% | -15% |\n| 🔴 Kumar Enterprises | Varanasi | 0.60 | 52 | +25% | -18% |\n| 🟡 Yadav Agencies | Meerut | 0.65 | 45 | +15% | -10% |\n| ✅ Singh Traders | Kanpur | 0.75 | 35 | +5% | -3% |\n| ✅ Patel Distribution | Agra | 0.75 | 38 | +8% | -5% |\n| ✅ Mishra Trading | Allahabad | 0.80 | 32 | +3% | +2% |\n\nThe bottom 3 show a clear pattern: primary growing 18-25% while secondary declining 12-18%. Classic stuffing.",
      showChart: 'distributor_pipeline_table',
      options: [
        { label: 'What happens when stock days exceed 45?', next: 'stock_days_risk' },
        { label: 'Check if these 3 also have outstanding issues', next: null, navigateTo: 'S-08' },
        { label: 'Are schemes driving the primary loading?', next: 'scheme_loading' },
      ],
    },
    scheme_loading: {
      message: "**Scheme Loading Analysis:**\n\nCross-referencing primary loading spikes with active scheme windows:\n\n- **Q4 Target Scheme (Dec-Mar):** Volume-linked primary target for all distributors. Gupta, Verma, and Kumar loaded heavily in Jan-Feb to hit quarterly targets.\n- **Summer Push (Feb-Mar):** Hair Care seasonal scheme. Additional loading on top of Q4 scheme.\n\nThe two schemes stacked created a double-loading incentive. Distributors loaded to hit both targets simultaneously.\n\n**The problem:** Loading happened. Secondary pull didn't follow. Now these distributors have 45-55 days of stock when norm is 30-35.",
      options: [
        { label: 'Show me promo health for these schemes', next: null, navigateTo: 'S-06' },
        { label: 'What should we do about excess stock?', next: 'stock_action' },
        { label: 'Will this self-correct next quarter?', next: 'forecast' },
      ],
    },
    stock_days: {
      message: "**Stock Days by Distributor:**\n\nNorm for the category: 30-35 days\n\n- Kumar Enterprises: 52 days (+17 above norm)\n- Gupta Agencies: 55 days (+20 above norm)\n- Verma & Sons: 48 days (+13 above norm)\n- Yadav Agencies: 45 days (+10 above norm)\n\nAt current secondary offtake rates, Gupta Agencies has nearly 2 months of unsold stock. This will suppress primary orders for the next 2-3 months as they burn through inventory.",
      options: [
        { label: 'How does this affect next quarter targets?', next: 'forecast' },
        { label: 'Check outstanding — are they paying for this stock?', next: null, navigateTo: 'S-08' },
      ],
    },
    stock_days_risk: {
      message: "**High Stock Days Risk:**\n\nWhen distributor stock days exceed 45:\n\n1. **Fresh billing stops** — distributor won't order until old stock moves\n2. **Product aging** — risk of near-expiry returns (especially in personal care)\n3. **Credit strain** — outstanding grows as payment cycles stretch\n4. **Market damage** — distress selling or scheme leakage to unauthorized channels\n\nKumar Enterprises (52 days) and Gupta Agencies (55 days) are in the danger zone. Both also have outstanding issues flagged in S-08.",
      options: [
        { label: 'Check outstanding health now', next: null, navigateTo: 'S-08' },
        { label: 'What remedial actions can we take?', next: 'stock_action' },
      ],
    },
    stock_action: {
      message: "**Recommended Actions for Pipeline Correction:**\n\n1. **Immediate:** Pause primary loading for Gupta, Verma, Kumar until Sec:Pri recovers to 0.75+\n2. **Secondary push:** Redirect scheme spend to secondary activation (outlet-level incentives vs distributor-level targets)\n3. **Stock rotation:** Deploy salesperson-led stock redistribution from overstocked distributors to under-served beats\n4. **Monitoring:** Weekly Sec:Pri tracking with automatic loading pause at 0.65\n\nThis is a Discussion Action — share with ASMs for ground validation before implementation.",
      options: [
        { label: 'How will this affect revenue targets?', next: 'forecast' },
        { label: 'Go to landing to share findings', next: null, navigateTo: 'S-00' },
      ],
    },
    pri_sec_scatter: {
      message: "**Primary vs Secondary Scatter:**\n\nThe scatter plot shows each distributor plotted by primary (x-axis) vs secondary (y-axis). The diagonal line represents Sec:Pri = 1.0 (perfect flow-through).\n\nPoints below the line are stuffed. Points above the line have good pull.\n\n- **Cluster below line:** Gupta, Verma, Kumar (stuffed)\n- **Near the line:** Singh, Patel (healthy)\n- **Above the line:** Mishra (secondary actually exceeding recent primary — burning through old stock)",
      showChart: 'pri_sec_scatter',
      options: [
        { label: 'Deep dive into the stuffed cluster', next: 'stuffed_distributors' },
        { label: 'What makes Mishra different?', next: 'mishra_case' },
      ],
    },
    mishra_case: {
      message: "**Mishra Trading Co (Allahabad) — The Healthy Exception:**\n\nSec:Pri at 0.80 with stock days at 32 (within norm). SALY primary +3%, SALY secondary +2%.\n\nWhy is Mishra healthy when others aren't?\n- Only distributor that **declined** additional Q4 loading\n- Conservative credit policy — outstanding:primary at 17% (lowest in region)\n- Consistent secondary pull driven by 80% visit compliance in their beats\n\nMishra is the model. But they're in Allahabad, which has other problems (low extraction, whitespace gaps).",
      options: [
        { label: 'Look at Allahabad expansion potential', next: null, navigateTo: 'S-09' },
        { label: 'Back to pipeline overview', next: 'entry' },
      ],
    },
    forecast: {
      message: "**Forward-Looking Impact:**\n\nAt current secondary offtake rates:\n- Gupta will burn stock in ~8 weeks (no primary orders until May)\n- Verma in ~6 weeks (limited primary from mid-April)\n- Kumar in ~7 weeks (complicated by outstanding issue)\n\n**Q1 FY27 impact:** Primary revenue will dip 15-20% as distributors de-stock. This is the delayed cost of Q4 stuffing. Secondary should stabilize as the pipeline normalizes.\n\nThe net effect: Q1 will look bad on primary, but it's a necessary correction. Secondary health should improve by June if execution holds.",
      options: [
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
        { label: 'Review benchmark position', next: null, navigateTo: 'S-07' },
      ],
    },
  },

  'S-04': {
    entry: {
      message: "**Channel Mix — North-2**\n\nGT share has declined from 68% to 62% over 3 quarters. This is a structural shift, not seasonal.\n\nMT is gaining (+4pp), QC stable, ecomm stable. The shift is GT→MT, concentrated in Metro and TLP town classes.\n\nLucknow, Kanpur, and Meerut show the strongest shift. Rural districts remain GT-dominant (78-82%).",
      showChart: 'channel_trend',
      options: [
        { label: 'Is this a problem or just the market evolving?', next: 'structural_assessment' },
        { label: 'Show district-wise channel breakdown', next: 'district_channel' },
        { label: 'What\'s driving the GT decline?', next: 'gt_decline_causes' },
      ],
    },
    structural_assessment: {
      message: "**Assessment: Structural vs Concerning**\n\nThis is a real structural shift driven by:\n1. MT chain expansion in Lucknow/Kanpur (2 new DMart, 1 Reliance Retail in last 6 months)\n2. Quick commerce gaining in Metro pincodes (Blinkit, Zepto)\n\n**Is it a problem?** Depends on your MT execution:\n- If you're present in MT with good shelf share: Revenue shifts but stays with you\n- If MT presence is weak: Revenue shifts to competitors who are better placed\n\nCurrently North-2 MT share of shelf is estimated at 18% vs 24% in GT. **You're losing the channel migration.**",
      options: [
        { label: 'What should the GT vs MT strategy be?', next: 'strategy_recommendation' },
        { label: 'Show me where GT is still strong', next: 'district_channel' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    district_channel: {
      message: "**Channel Share by District:**\n\n| District | GT | MT | QC | Ecomm | GT Δ SPLY |\n|---|---|---|---|---|---|\n| Lucknow | 62% | 22% | 10% | 6% | -4.2pp |\n| Meerut | 69% | 18% | 8% | 5% | -3.5pp |\n| Kanpur | 71% | 16% | 8% | 5% | -3.1pp |\n| Agra | 74% | 14% | 7% | 5% | -2.8pp |\n| Varanasi | 78% | 11% | 6% | 5% | -1.5pp |\n| Allahabad | 82% | 8% | 5% | 5% | -0.8pp |\n\nUrban districts (Lucknow, Meerut, Kanpur) have the fastest GT erosion. Rural districts are GT-stable for now but will follow the same pattern in 12-18 months.",
      showChart: 'channel_by_district',
      options: [
        { label: 'Focus on protecting GT in rural', next: 'strategy_recommendation' },
        { label: 'Back to channel overview', next: 'entry' },
      ],
    },
    gt_decline_causes: {
      message: "**GT Decline Drivers:**\n\n1. **MT expansion** (50% of shift): New modern trade stores taking wallet share in Metro areas\n2. **Quick commerce** (25%): Blinkit/Zepto capturing impulse + convenience in urban pincodes\n3. **GT outlet quality** (25%): Our GT outlets have lower extraction, fewer SKUs, and less visibility vs MT shelf presence\n\nThe third point is actionable — improving GT execution (visibility, SKU depth, visit quality) can retain share even as MT grows.",
      options: [
        { label: 'How to improve GT execution?', next: 'strategy_recommendation' },
        { label: 'Check extraction at GT outlets', next: null, navigateTo: 'S-02' },
      ],
    },
    strategy_recommendation: {
      message: "**Channel Strategy Recommendation:**\n\n**GT (defend):** Focus on quality, not just coverage. Improve SKU depth, visibility, and visit frequency at top-50% GT outlets. Don't fight for unviable micro-outlets.\n\n**MT (invest):** Negotiate shelf space in new DMart/Reliance stores. Current MT presence is under-indexed. This is a War Room action (DB-06).\n\n**QC/Ecomm (monitor):** Small share but growing. Ensure product listings and pricing are competitive.\n\nThis is a strategic decision — recommend escalating to War Room for channel strategy revision.",
      options: [
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
        { label: 'Check benchmark for channel mix', next: null, navigateTo: 'S-07' },
      ],
    },
  },

  'S-05': {
    entry: {
      message: "**Territory & SFA Health — North-2**\n\nMAU has declined from 86% to 78% over 4 months. PJP MAU at 68% (was 79%). Visit compliance averaging 72% with Agra and Kanpur worst.\n\nThis is the leading indicator for almost every other problem — low visits → low extraction → outlet churn → reach erosion.",
      showChart: 'mau_trend',
      options: [
        { label: 'Which beats are underperforming?', next: 'beat_performance' },
        { label: 'What\'s causing the MAU decline?', next: 'mau_causes' },
        { label: 'Show visit compliance by district', next: 'visit_compliance' },
      ],
    },
    beat_performance: {
      message: "**Beat Performance (Worst 5):**\n\n| Beat | District | Compliance | Productive | Revenue vs Design |\n|---|---|---|---|---|\n| BT-005 | Agra | 64% | 55.8% | -28% |\n| BT-003 | Kanpur | 65.5% | 58.2% | -25% |\n| BT-007 | Meerut | 70.5% | 61.3% | -18% |\n| BT-006 | Varanasi | 70.6% | 62.4% | -15% |\n| BT-001 | Lucknow | 76.7% | 68.5% | -12% |\n\nBT-005 (Agra) and BT-003 (Kanpur) have triggered DA-05 (Beat Productivity Drift). Both are >20% below design — candidates for route re-optimisation.",
      options: [
        { label: 'What\'s wrong with Agra\'s beats?', next: 'agra_beats' },
        { label: 'How does this connect to outlet churn?', next: null, navigateTo: 'S-01' },
        { label: 'Is this a headcount problem?', next: 'mau_causes' },
      ],
    },
    mau_causes: {
      message: "**MAU Decline Root Causes:**\n\n1. **2 ASM positions vacant** (Agra, Bareilly) — no supervision for 4 beats\n2. **Salesperson turnover:** 3 SEs resigned in Q4, replacements still onboarding\n3. **App fatigue:** SFA tool shows declining session times even for active users\n4. **Beat overload:** Average beat size at 96 outlets vs design of 75 — some beats are physically unserviceable\n\nThe vacancy in Agra directly correlates with BT-005's -28% performance.",
      options: [
        { label: 'How to fix the beat overload?', next: 'agra_beats' },
        { label: 'Back to territory overview', next: 'entry' },
        { label: 'Check impact on extraction', next: null, navigateTo: 'S-02' },
      ],
    },
    visit_compliance: {
      message: "**Visit Compliance by District:**\n\n| District | Target | Actual | Compliance | Productive |\n|---|---|---|---|---|\n| Lucknow | 215 | 170 | 79.1% | 70.4% |\n| Kanpur | 198 | 142 | 71.7% | 64.1% |\n| Agra | 100 | 64 | 64.0% | 55.8% |\n| Varanasi | 85 | 60 | 70.6% | 62.4% |\n| Meerut | 78 | 55 | 70.5% | 61.3% |\n\nAgra is the worst. With ASM vacancy + SE resignations, effective coverage is at emergency levels.",
      options: [
        { label: 'What\'s the revenue impact of low compliance?', next: 'compliance_impact' },
        { label: 'Show me the beat redesign case', next: 'agra_beats' },
      ],
    },
    agra_beats: {
      message: "**Agra Beat Redesign Case (DB-04 War Room):**\n\nCurrent state:\n- 100 planned outlets on BT-005, 64 actually visited\n- Beat geometry designed 18 months ago for 75 outlets\n- Since then: 25 new outlets added, no beat restructuring\n- ASM position vacant since Jan 2026\n\nRecommendation: This is a War Room action.\n1. Split BT-005 into 2 beats (60 outlets each)\n2. Re-route using current outlet locations\n3. Hire replacement ASM for Agra\n4. Target: 80%+ compliance within 60 days of restructure",
      options: [
        { label: 'How will this affect reach and extraction?', next: 'compliance_impact' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    compliance_impact: {
      message: "**Revenue Impact of Visit Compliance:**\n\nModeling from historical data:\n\nEvery 10pp improvement in visit compliance → +6pp extraction rate → +₹540/outlet/month\n\nIf Agra and Kanpur reach 80% compliance (from 64% and 72%):\n- Agra: +16pp → +₹864/outlet × 520 outlets = **₹4.5L/month additional**\n- Kanpur: +8pp → +₹432/outlet × 680 outlets = **₹2.9L/month additional**\n\nCombined annual impact: **₹88.8L** from just fixing visit discipline in 2 districts.",
      options: [
        { label: 'Back to territory overview', next: 'entry' },
        { label: 'Review the full picture on landing', next: null, navigateTo: 'S-00' },
      ],
    },
  },

  'S-06': {
    entry: {
      message: "**Promo Health — North-2**\n\n5 active schemes. Average uplift at 9% vs 15% target. Average ROI at 1.44x. 2 schemes performing well (GT Loyalty, Summer Push), 3 underperforming.\n\nThe biggest concern is the Rural Penetration Scheme in Varanasi — 30% participation, 0.7x ROI.",
      showChart: 'promo_performance',
      options: [
        { label: 'Show scheme-by-scheme performance', next: 'scheme_details' },
        { label: 'Why is the Rural Penetration Scheme failing?', next: 'rural_scheme' },
        { label: 'What\'s the connection to pipeline stuffing?', next: 'scheme_stuffing_link' },
      ],
    },
    scheme_details: {
      message: "**Scheme Performance Summary:**\n\n| Scheme | District | Uplift | ROI | Participation |\n|---|---|---|---|---|\n| ✅ GT Loyalty | Agra | 20% | 3.2x | 80% |\n| ✅ Summer Hair Push | Lucknow | 10% | 1.8x | 60% |\n| 🟡 Skin Care Bundle | Kanpur | 5% | 0.9x | 40% |\n| 🔴 Rural Penetration | Varanasi | 5% | 0.7x | 30% |\n| 🔴 Monsoon Stock-Up | Meerut | 5% | 0.6x | 30% |\n\nGT Loyalty in Agra is the standout — high participation, strong ROI. This model should be replicated.",
      options: [
        { label: 'Why does GT Loyalty work so well?', next: 'gt_loyalty_success' },
        { label: 'Fix the Rural Penetration Scheme', next: 'rural_scheme' },
        { label: 'Back to promo overview', next: 'entry' },
      ],
    },
    rural_scheme: {
      message: "**Rural Penetration Scheme (Varanasi) — Diagnosis:**\n\nParticipation at 30% (105 of 350 eligible outlets). Uplift only 5% vs 15% target.\n\n**Why it's failing:**\n1. **Eligibility criteria too strict:** Minimum order size of ₹5,000 — too high for FLP outlets averaging ₹3,846 WSP\n2. **Distributor bottleneck:** Kumar Enterprises (sole distributor) has outstanding issues — limiting supply to outlets\n3. **Low awareness:** Only 42% of eligible outlets even know about the scheme (SFA visit data)\n4. **No field push:** With SFA adoption declining, salespersons aren't pitching the scheme\n\nThis is the DB-05 (Promo Course-Correction) finding. Recommend mid-course adjustment.",
      options: [
        { label: 'What adjustments would fix it?', next: 'scheme_fix' },
        { label: 'Check Kumar Enterprises\' outstanding', next: null, navigateTo: 'S-08' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    scheme_fix: {
      message: "**Recommended Mid-Course Corrections:**\n\n1. **Lower eligibility:** Reduce minimum order to ₹3,000 (covers 70% more outlets)\n2. **Fix supply:** Resolve Kumar Enterprises outstanding to restore supply flow\n3. **Awareness push:** Mandate scheme communication in next 2 weeks of SFA visits\n4. **Add SE incentive:** ₹50/outlet commission for first scheme sale to increase field push\n\nEstimated impact: Participation from 30% → 55%, Uplift from 5% → 12%, ROI from 0.7x → 1.5x\n\nThis requires M05 Scheme Design Engine adjustment — War Room action.",
      options: [
        { label: 'Compare with GT Loyalty success model', next: 'gt_loyalty_success' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    gt_loyalty_success: {
      message: "**GT Loyalty Program (Agra) — Success Model:**\n\nParticipation: 80% | Uplift: 20% | ROI: 3.2x\n\n**Why it works:**\n1. Low barrier: Any purchase counts, tiered rewards\n2. Immediate gratification: Instant discount vs end-of-month rebate\n3. Patel Distribution (Agra) actively promotes — healthy pipeline (Sec:Pri 0.75)\n4. SE incentive aligned — per-outlet bonus for enrollment\n\nThis is the template for rural schemes. The Rural Penetration Scheme did the opposite on every parameter.",
      options: [
        { label: 'Apply this model to fix other schemes', next: 'scheme_fix' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    scheme_stuffing_link: {
      message: "**Scheme-Pipeline Connection:**\n\nQ4 volume-linked target scheme + Summer Hair Care Push = double loading incentive.\n\nDistributors loaded primary to hit both scheme targets simultaneously. But the secondary pull didn't follow because:\n1. Outlet reach is declining (fewer billing points)\n2. Extraction is low (less pull per outlet)\n3. Some scheme eligibility criteria are too strict (outlets can't participate)\n\nResult: Primary bloated, secondary weak, Sec:Pri collapsed. The schemes meant to drive growth actually accelerated the pipeline stuffing.",
      options: [
        { label: 'See pipeline health details', next: null, navigateTo: 'S-03' },
        { label: 'Back to promo overview', next: 'entry' },
      ],
    },
  },

  'S-07': {
    entry: {
      message: "**Benchmark — North-2 vs Sector Cohort**\n\nNorth-2 is below the cohort median on every tracked metric. The gaps have been widening for 3-6 months.\n\nOverall percentile rank: **28th** — we're in the bottom third of peer geographies.",
      showChart: 'benchmark_gap_trend',
      options: [
        { label: 'Where are we worst vs the cohort?', next: 'worst_gaps' },
        { label: 'Which gaps are widening fastest?', next: 'widening_gaps' },
        { label: 'What would it take to reach median?', next: 'path_to_median' },
      ],
    },
    worst_gaps: {
      message: "**Metric Gaps vs Cohort Median:**\n\n| Metric | Us | Median | P75 | Percentile | Gap |\n|---|---|---|---|---|---|\n| Sec:Pri | 0.69 | 0.82 | 0.91 | 18th | -0.13 |\n| ND% | 42.3% | 52.1% | 61.4% | 28th | -9.8pp |\n| Extraction | 62% | 74% | 82% | 22nd | -12pp |\n| WSP/Outlet | ₹3,200 | ₹4,100 | ₹5,200 | 30th | -₹900 |\n| Collection | 72.4% | 80.2% | 87.5% | 32nd | -7.8pp |\n| WD% | 61.7% | 68.5% | 75.2% | 35th | -6.8pp |\n\nSec:Pri ratio is our worst metric (18th percentile). Extraction and ND% are close behind.",
      showChart: 'benchmark_comparison',
      options: [
        { label: 'Pipeline is the priority — go there', next: null, navigateTo: 'S-03' },
        { label: 'What\'s the path to median?', next: 'path_to_median' },
      ],
    },
    widening_gaps: {
      message: "**Gap Trend (Last 6 Months):**\n\n| Metric | Oct 25 Gap | Mar 26 Gap | Δ |\n|---|---|---|---|\n| ND% | -5.2pp | -9.8pp | -4.6pp widening |\n| Extraction | -8pp | -12pp | -4pp widening |\n| Sec:Pri | -0.05 | -0.13 | -0.08 widening |\n\nAll three core metrics are diverging from the cohort. We're not just below average — we're falling further behind each month. The rate of decline is accelerating.",
      showChart: 'benchmark_gap_trend',
      options: [
        { label: 'What\'s causing us to fall behind?', next: 'path_to_median' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    path_to_median: {
      message: "**Path to Cohort Median — Priority Actions:**\n\n1. **Fix pipeline first** (Sec:Pri 0.69→0.82): Pause stuffing, activate secondary pull. Impact: 2-3 months. This also improves collection rate.\n\n2. **Restore visit discipline** (MAU 78%→86%): Fill 2 ASM vacancies, redesign overloaded beats. Impact: 6-8 weeks. This drives extraction improvement.\n\n3. **Stem reach erosion** (ND% 42.3%→52.1%): Stop churn via better visits + outlet support. Add outlets in coverage gaps. Impact: 3-6 months.\n\n4. **Improve extraction** (62%→74%): Higher visit quality + SKU depth + scheme redesign. Impact: 3-4 months. Dependent on #2.\n\n**Total revenue impact of reaching median: ₹12-15Cr annually.**",
      options: [
        { label: 'Start with pipeline health', next: null, navigateTo: 'S-03' },
        { label: 'Start with territory health', next: null, navigateTo: 'S-05' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
  },

  'S-08': {
    entry: {
      message: "**Outstanding Health — North-2**\n\nTotal outstanding: ₹1.04Cr. Outstanding >30 days: ₹47.4L (46% of total). Collection rate: 72.4% (was 81.3% SPLY).\n\n2 distributors have outstanding:primary ratio above the 30% danger threshold.",
      showChart: 'outstanding_trend',
      options: [
        { label: 'Show distributor-level aging', next: 'distributor_aging' },
        { label: 'Which distributors are at risk?', next: 'at_risk_distributors' },
        { label: 'How does outstanding connect to pipeline?', next: 'outstanding_pipeline_link' },
      ],
    },
    distributor_aging: {
      message: "**Distributor Outstanding Aging:**\n\n| Distributor | Total O/S | >30d | <30d | Collection% | O/S:Pri |\n|---|---|---|---|---|---|\n| 🔴 Kumar (Varanasi) | ₹16L | ₹8.8L | ₹7.2L | 55% | 50% |\n| 🔴 Verma (Kanpur) | ₹19L | ₹10.5L | ₹8.6L | 58% | 46% |\n| 🟡 Gupta (Lucknow) | ₹24L | ₹12L | ₹12L | 65% | 39% |\n| ✅ Singh (Kanpur) | ₹9L | ₹2.7L | ₹6.3L | 82% | 17% |\n| ✅ Patel (Agra) | ₹7.5L | ₹2.3L | ₹5.3L | 80% | 20% |",
      showChart: 'outstanding_by_distributor',
      options: [
        { label: 'Deep dive into Kumar Enterprises', next: 'kumar_deep' },
        { label: 'What\'s the total exposure?', next: 'total_exposure' },
        { label: 'Connection to pipeline stuffing', next: 'outstanding_pipeline_link' },
      ],
    },
    at_risk_distributors: {
      message: "**At-Risk Distributors (O/S:Primary > 30%):**\n\n**Kumar Enterprises (Varanasi)** — CRITICAL\n- O/S:Primary at 50% (threshold: 30%)\n- Collection rate dropping: 72% → 55% in 3 months\n- >30d outstanding growing ₹2L/month\n- Already restricting supply to outlets → causing churn\n\n**Verma & Sons (Kanpur)** — CRITICAL\n- O/S:Primary at 46%\n- Collection rate at 58%\n- Combined with pipeline stuffing: loaded stock they can't sell, can't pay for\n\nBoth need immediate intervention.",
      options: [
        { label: 'What can we do about Kumar?', next: 'kumar_deep' },
        { label: 'Is this connected to the pipeline problem?', next: 'outstanding_pipeline_link' },
      ],
    },
    kumar_deep: {
      message: "**Kumar Enterprises (Varanasi) — Full Picture:**\n\n- Outstanding: ₹16L (₹8.8L >30 days)\n- Collection rate: 55% (worst in region)\n- Sec:Pri: 0.60 (pipeline stuffed)\n- Stock days: 52 (above norm)\n- Outlet churn in territory: 2.4x normal\n- Promo participation: 30% (scheme failing)\n\n**Root cause chain:** Excess primary loading (Q4 scheme) → stock not moving (low secondary pull) → can't pay for stock (outstanding growing) → restricting supply to outlets → outlets churning → promo can't work → secondary falls further.\n\nThis is a death spiral. Intervention needed before it becomes a distributor loss.",
      options: [
        { label: 'What intervention do you recommend?', next: 'kumar_action' },
        { label: 'Check the Varanasi churn pattern', next: null, navigateTo: 'S-01' },
      ],
    },
    kumar_action: {
      message: "**Recommended Intervention for Kumar Enterprises:**\n\n**Immediate (Week 1):**\n1. Freeze all primary billing until outstanding <35% of primary\n2. Restructure payment: convert ₹8.8L >30d to EMI plan\n\n**Short-term (Week 2-4):**\n3. Deploy focused secondary activation: outlet-level incentives to clear existing stock\n4. Redirect 50% of Kumar's outlets to Mishra Trading temporarily (only 17% O/S:Pri, healthy pipeline)\n\n**Medium-term (Month 2-3):**\n5. Resume gradual primary billing as collection improves\n6. Reassess distributor viability — if collection doesn't improve, consider SD replacement\n\nThis is a Discussion Action for immediate sharing with ASM Rahul Singh.",
      options: [
        { label: 'Back to landing to share findings', next: null, navigateTo: 'S-00' },
        { label: 'Check pipeline health overall', next: null, navigateTo: 'S-03' },
      ],
    },
    outstanding_pipeline_link: {
      message: "**Outstanding ↔ Pipeline Connection:**\n\nThe three distributors with worst outstanding are the same three with worst Sec:Pri ratios:\n\n| Distributor | Sec:Pri | O/S:Primary | Stock Days |\n|---|---|---|---|\n| Kumar | 0.60 | 50% | 52 |\n| Verma | 0.60 | 46% | 48 |\n| Gupta | 0.60 | 39% | 55 |\n\nThis is not a coincidence. The causal chain:\n**Scheme-driven primary loading → stock piles up → can't sell through → can't pay → outstanding grows → cash crunch → restricts supply → outlets churn → less secondary → worse Sec:Pri.**\n\nFix the pipeline, and outstanding improves. Fix outstanding, and the pipeline unblocks.",
      options: [
        { label: 'Go to pipeline health', next: null, navigateTo: 'S-03' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    total_exposure: {
      message: "**Total Outstanding Exposure:**\n\n- Total across all distributors: ₹1.04Cr\n- Amount >30 days: ₹47.4L (46%)\n- At-risk amount (O/S:Pri >30%): ₹59L (57% of total)\n\nIf Kumar or Verma defaults, the write-off would be ₹16-19L each. Combined worst case: ₹35L write-off.\n\nThis is 5% of quarterly primary revenue. Significant but not catastrophic — IF caught early.",
      options: [
        { label: 'Action plan for at-risk distributors', next: 'kumar_deep' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
  },

  'S-09': {
    entry: {
      message: "**Untapped Potential — North-2**\n\n8 districts analyzed. Total coverage gap: 4,400 outlets. Highest potential in Allahabad (demand index P82, ND% only 38.8%) and Gorakhpur (ND% 30.9%).\n\n90 under-penetrated towns and 69 under-indexed towns identified. Combined expansion potential estimated at ₹8-12Cr annually.",
      showChart: 'untapped_scatter',
      options: [
        { label: 'Where should we expand first?', next: 'priority_districts' },
        { label: 'Show me the whitespace map', next: 'whitespace_detail' },
        { label: 'What investment is needed for expansion?', next: 'expansion_investment' },
      ],
    },
    priority_districts: {
      message: "**Priority Ranking for Expansion:**\n\n| Rank | District | Demand Index | ND% | Gap Outlets | Potential |\n|---|---|---|---|---|---|\n| 1 | Allahabad | 82 (P82) | 38.8% | 490 | ₹2.5Cr |\n| 2 | Gorakhpur | 68 | 30.9% | 380 | ₹1.8Cr |\n| 3 | Kanpur | 78 | 48.6% | 720 | ₹2.2Cr |\n| 4 | Varanasi | 65 | 41.1% | 560 | ₹1.6Cr |\n| 5 | Bareilly | 58 | 35.0% | 390 | ₹1.2Cr |\n\nAllahabad is #1 because highest demand with lowest distribution. But Kanpur has the largest absolute gap (720 outlets).\n\n**Warning:** Don't expand before fixing existing execution. New outlets added to a system with 78% MAU and 62% extraction will churn quickly.",
      options: [
        { label: 'What should we fix before expanding?', next: 'fix_before_expand' },
        { label: 'Show Allahabad expansion plan', next: 'allahabad_expansion' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
    whitespace_detail: {
      message: "**Whitespace Analysis:**\n\n**Under-penetrated (ND% <20% in high-demand areas):**\n- 90 towns across 8 districts\n- Concentrated in FLP and OLP town classes\n- Average demand index: P72\n- Potential: 2,800 new outlets\n\n**Under-indexed (ND% >60% but extraction below median):**\n- 69 towns\n- Present but under-performing\n- SKU depth and visit frequency issues\n- Potential: ₹4Cr incremental from existing footprint\n\nThe under-indexed opportunity is faster to capture (no new distribution needed — just better execution at existing outlets).",
      options: [
        { label: 'Focus on under-indexed first', next: null, navigateTo: 'S-02' },
        { label: 'Plan for under-penetrated expansion', next: 'allahabad_expansion' },
      ],
    },
    allahabad_expansion: {
      message: "**Allahabad Expansion Plan (DB-01 War Room):**\n\nTarget: Add 490 outlets across 11 under-penetrated towns\n\nRequirements:\n1. **Distribution:** 1-2 additional sub-distributors needed (Mishra Trading alone can't cover)\n2. **Beats:** 6 new beats required (75 outlets each)\n3. **Headcount:** 2 additional SEs + 1 ASM (currently vacant)\n4. **Investment:** ₹12-15L setup cost + ₹8L/month operating\n5. **Timeline:** 4-6 months to full activation\n\n**Expected ROI:** ₹2.5Cr annual revenue vs ₹1.1Cr annual cost = 2.3x ROI in Year 1",
      options: [
        { label: 'This needs the territory fix first', next: 'fix_before_expand' },
        { label: 'Back to landing to review priorities', next: null, navigateTo: 'S-00' },
      ],
    },
    fix_before_expand: {
      message: "**Recommended Sequence:**\n\n**Phase 1 (Month 1-2): Stabilize**\n- Fix pipeline stuffing (pause loading, activate secondary)\n- Resolve Kumar Enterprises outstanding\n- Fill ASM vacancies (Agra, Bareilly)\n- Redesign overloaded beats\n\n**Phase 2 (Month 2-4): Recover**\n- Restore MAU to 85%+\n- Stem outlet churn (target: back to historical norms)\n- Improve extraction at existing outlets\n- Course-correct underperforming schemes\n\n**Phase 3 (Month 4-6): Expand**\n- Launch Allahabad expansion\n- Add Gorakhpur sub-distributors\n- Open under-penetrated towns in Kanpur/Varanasi\n\nExpanding before Phase 1-2 would be building on a crumbling foundation.",
      options: [
        { label: 'This makes sense — back to landing', next: null, navigateTo: 'S-00' },
        { label: 'Start with pipeline fix', next: null, navigateTo: 'S-03' },
        { label: 'Start with territory fix', next: null, navigateTo: 'S-05' },
      ],
    },
    expansion_investment: {
      message: "**Full Expansion Investment Model:**\n\n| Item | One-Time | Monthly | Annual |\n|---|---|---|---|\n| Sub-distributors (4) | ₹20L | — | — |\n| New SEs (8) | ₹4L | ₹4.8L | ₹57.6L |\n| ASMs (3) | ₹3L | ₹3.6L | ₹43.2L |\n| Beat setup & POS | ₹8L | — | — |\n| Scheme activation | ₹5L | ₹2L | ₹24L |\n| **Total** | **₹40L** | **₹10.4L** | **₹164.8L** |\n\n**Revenue potential:** ₹8-12Cr annually\n**Payback period:** 6-8 months\n\nBut this assumes existing operations are healthy. With current execution gaps, payback extends to 12-15 months.",
      options: [
        { label: 'Fix first, then expand', next: 'fix_before_expand' },
        { label: 'Back to landing', next: null, navigateTo: 'S-00' },
      ],
    },
  },
};
