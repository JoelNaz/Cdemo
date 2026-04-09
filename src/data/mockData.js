// ============================================================
// CLARYNT GROWTH COMMAND CENTRE — MOCK DATA
// All L2 aggregates, drift findings, KPIs, and screen data
// ============================================================

// --- USER / ROLE ---
export const currentUser = {
  id: 'usr_rsm_001',
  name: 'Rajesh Sharma',
  role: 'RSM',
  region: 'North-2',
  defaultScope: { zone: 'North', region: 'North-2' },
  screens: ['S-00','S-01','S-02','S-03','S-04','S-05','S-06','S-07','S-08','S-09'],
};

// --- GEO HIERARCHY ---
export const geoHierarchy = {
  zones: ['North', 'South', 'East', 'West'],
  regions: {
    North: ['North-1', 'North-2', 'North-3'],
    South: ['South-1', 'South-2'],
    East: ['East-1', 'East-2'],
    West: ['West-1', 'West-2', 'West-3'],
  },
  districts: {
    'North-2': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut', 'Bareilly', 'Gorakhpur'],
  },
};

// --- KPI SUMMARY (S-00 Landing) ---
export const kpiSummary = {
  totalRevenue: { value: 68000000, unit: '₹', label: 'Total Revenue', sply: 85000000, delta: -20, mtdCompletion: 58 },
  nd: { value: 42.3, unit: '%', label: 'ND%', sply: 47.1, delta: -4.8 },
  wd: { value: 61.7, unit: '%', label: 'WD%', sply: 65.2, delta: -3.5 },
  pipelineRatio: { value: 0.69, unit: 'ratio', label: 'Sec:Pri', sply: 0.87, delta: -18 },
  collectionRate: { value: 72.4, unit: '%', label: 'Collection Rate', sply: 81.3, delta: -8.9 },
  mau: { value: 78, unit: '%', label: 'MAU', sply: 86, delta: -8 },
};

// --- L2 REACH DATA ---
export const l2Reach = [
  { mm_id: 'MM-N2-001', district: 'Lucknow', town_class: 'Metro', channel: 'GT', period: '2026-03', active_outlets: 1240, total_viable: 2100, nd_pct: 59.0, geo_eco_count: 980, geo_eco_pct: 46.7, outlet_additions: 45, outlet_churn: 82, coverage_gap: 860 },
  { mm_id: 'MM-N2-002', district: 'Kanpur', town_class: 'TLP', channel: 'GT', period: '2026-03', active_outlets: 680, total_viable: 1400, nd_pct: 48.6, geo_eco_count: 520, geo_eco_pct: 37.1, outlet_additions: 22, outlet_churn: 65, coverage_gap: 720 },
  { mm_id: 'MM-N2-003', district: 'Agra', town_class: 'TLP', channel: 'GT', period: '2026-03', active_outlets: 520, total_viable: 1100, nd_pct: 47.3, geo_eco_count: 410, geo_eco_pct: 37.3, outlet_additions: 18, outlet_churn: 54, coverage_gap: 580 },
  { mm_id: 'MM-N2-004', district: 'Varanasi', town_class: 'FLP', channel: 'GT', period: '2026-03', active_outlets: 390, total_viable: 950, nd_pct: 41.1, geo_eco_count: 290, geo_eco_pct: 30.5, outlet_additions: 12, outlet_churn: 48, coverage_gap: 560 },
  { mm_id: 'MM-N2-005', district: 'Allahabad', town_class: 'FLP', channel: 'GT', period: '2026-03', active_outlets: 310, total_viable: 800, nd_pct: 38.8, geo_eco_count: 220, geo_eco_pct: 27.5, outlet_additions: 8, outlet_churn: 41, coverage_gap: 490 },
  { mm_id: 'MM-N2-006', district: 'Meerut', town_class: 'OLP', channel: 'GT', period: '2026-03', active_outlets: 280, total_viable: 700, nd_pct: 40.0, geo_eco_count: 200, geo_eco_pct: 28.6, outlet_additions: 10, outlet_churn: 35, coverage_gap: 420 },
  { mm_id: 'MM-N2-007', district: 'Bareilly', town_class: 'OLP', channel: 'GT', period: '2026-03', active_outlets: 210, total_viable: 600, nd_pct: 35.0, geo_eco_count: 150, geo_eco_pct: 25.0, outlet_additions: 6, outlet_churn: 30, coverage_gap: 390 },
  { mm_id: 'MM-N2-008', district: 'Gorakhpur', town_class: 'OLM', channel: 'GT', period: '2026-03', active_outlets: 170, total_viable: 550, nd_pct: 30.9, geo_eco_count: 110, geo_eco_pct: 20.0, outlet_additions: 4, outlet_churn: 28, coverage_gap: 380 },
];

// --- L2 EXTRACTION DATA ---
export const l2Extraction = [
  { mm_id: 'MM-N2-001', district: 'Lucknow', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 4200000, avg_sales_per_outlet: 3387, wd_pct: 68.2, extraction_rate: 72, benchmark_extraction: 88, extraction_gap: 16, uos: 890, lines_per_call: 3.2 },
  { mm_id: 'MM-N2-001', district: 'Lucknow', channel: 'GT', category: 'Skin Care', period: '2026-03', secondary_value: 3100000, avg_sales_per_outlet: 2500, wd_pct: 55.4, extraction_rate: 61, benchmark_extraction: 82, extraction_gap: 21, uos: 720, lines_per_call: 2.8 },
  { mm_id: 'MM-N2-002', district: 'Kanpur', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 2800000, avg_sales_per_outlet: 4118, wd_pct: 62.1, extraction_rate: 68, benchmark_extraction: 88, extraction_gap: 20, uos: 540, lines_per_call: 2.9 },
  { mm_id: 'MM-N2-002', district: 'Kanpur', channel: 'GT', category: 'Skin Care', period: '2026-03', secondary_value: 1900000, avg_sales_per_outlet: 2794, wd_pct: 48.3, extraction_rate: 55, benchmark_extraction: 82, extraction_gap: 27, uos: 410, lines_per_call: 2.4 },
  { mm_id: 'MM-N2-003', district: 'Agra', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 2100000, avg_sales_per_outlet: 4038, wd_pct: 58.7, extraction_rate: 64, benchmark_extraction: 88, extraction_gap: 24, uos: 390, lines_per_call: 2.7 },
  { mm_id: 'MM-N2-004', district: 'Varanasi', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 1500000, avg_sales_per_outlet: 3846, wd_pct: 52.3, extraction_rate: 58, benchmark_extraction: 88, extraction_gap: 30, uos: 280, lines_per_call: 2.3 },
  { mm_id: 'MM-N2-005', district: 'Allahabad', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 980000, avg_sales_per_outlet: 3161, wd_pct: 44.1, extraction_rate: 49, benchmark_extraction: 88, extraction_gap: 39, uos: 200, lines_per_call: 2.0 },
  { mm_id: 'MM-N2-006', district: 'Meerut', channel: 'GT', category: 'Skin Care', period: '2026-03', secondary_value: 1100000, avg_sales_per_outlet: 3929, wd_pct: 51.2, extraction_rate: 56, benchmark_extraction: 82, extraction_gap: 26, uos: 190, lines_per_call: 2.5 },
  { mm_id: 'MM-N2-007', district: 'Bareilly', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 630000, avg_sales_per_outlet: 3000, wd_pct: 42.5, extraction_rate: 52, benchmark_extraction: 88, extraction_gap: 36, uos: 150, lines_per_call: 2.1 },
  { mm_id: 'MM-N2-008', district: 'Gorakhpur', channel: 'GT', category: 'Hair Care', period: '2026-03', secondary_value: 408000, avg_sales_per_outlet: 2400, wd_pct: 35.2, extraction_rate: 42, benchmark_extraction: 88, extraction_gap: 46, uos: 110, lines_per_call: 1.8 },
];

// --- L2 PIPELINE DATA ---
export const l2Pipeline = [
  { mm_id: 'MM-N2-001', distributor_id: 'DB-001', name: 'Sharma Distributors', district: 'Lucknow', category: 'All', period: '2026-03', primary_value: 8500000, secondary_value: 5865000, pipeline_ratio: 0.69, billing_frequency: 18, days_stock: 42, ofr: 78, saly_primary: 12, saly_secondary: -8 },
  { mm_id: 'MM-N2-001', distributor_id: 'DB-002', name: 'Gupta Agencies', district: 'Lucknow', category: 'All', period: '2026-03', primary_value: 6200000, secondary_value: 3720000, pipeline_ratio: 0.60, billing_frequency: 14, days_stock: 55, ofr: 72, saly_primary: 18, saly_secondary: -12 },
  { mm_id: 'MM-N2-002', distributor_id: 'DB-003', name: 'Singh Traders', district: 'Kanpur', category: 'All', period: '2026-03', primary_value: 5400000, secondary_value: 4050000, pipeline_ratio: 0.75, billing_frequency: 20, days_stock: 35, ofr: 84, saly_primary: 5, saly_secondary: -3 },
  { mm_id: 'MM-N2-002', distributor_id: 'DB-004', name: 'Verma & Sons', district: 'Kanpur', category: 'All', period: '2026-03', primary_value: 4100000, secondary_value: 2460000, pipeline_ratio: 0.60, billing_frequency: 12, days_stock: 48, ofr: 68, saly_primary: 22, saly_secondary: -15 },
  { mm_id: 'MM-N2-003', distributor_id: 'DB-005', name: 'Patel Distribution', district: 'Agra', category: 'All', period: '2026-03', primary_value: 3800000, secondary_value: 2850000, pipeline_ratio: 0.75, billing_frequency: 16, days_stock: 38, ofr: 80, saly_primary: 8, saly_secondary: -5 },
  { mm_id: 'MM-N2-004', distributor_id: 'DB-006', name: 'Kumar Enterprises', district: 'Varanasi', category: 'All', period: '2026-03', primary_value: 3200000, secondary_value: 1920000, pipeline_ratio: 0.60, billing_frequency: 11, days_stock: 52, ofr: 65, saly_primary: 25, saly_secondary: -18 },
  { mm_id: 'MM-N2-005', distributor_id: 'DB-007', name: 'Mishra Trading Co', district: 'Allahabad', category: 'All', period: '2026-03', primary_value: 2600000, secondary_value: 2080000, pipeline_ratio: 0.80, billing_frequency: 19, days_stock: 32, ofr: 86, saly_primary: 3, saly_secondary: 2 },
  { mm_id: 'MM-N2-006', distributor_id: 'DB-008', name: 'Yadav Agencies', district: 'Meerut', category: 'All', period: '2026-03', primary_value: 2100000, secondary_value: 1365000, pipeline_ratio: 0.65, billing_frequency: 13, days_stock: 45, ofr: 71, saly_primary: 15, saly_secondary: -10 },
];

// --- L2 CHANNEL MIX ---
export const l2ChannelMix = [
  { mm_id: 'MM-N2-001', district: 'Lucknow', period: '2026-03', gt_share: 62, mt_share: 22, qc_share: 10, ecomm_share: 6, gt_share_delta_sply: -4.2, structural_shift: true },
  { mm_id: 'MM-N2-002', district: 'Kanpur', period: '2026-03', gt_share: 71, mt_share: 16, qc_share: 8, ecomm_share: 5, gt_share_delta_sply: -3.1, structural_shift: true },
  { mm_id: 'MM-N2-003', district: 'Agra', period: '2026-03', gt_share: 74, mt_share: 14, qc_share: 7, ecomm_share: 5, gt_share_delta_sply: -2.8, structural_shift: false },
  { mm_id: 'MM-N2-004', district: 'Varanasi', period: '2026-03', gt_share: 78, mt_share: 11, qc_share: 6, ecomm_share: 5, gt_share_delta_sply: -1.5, structural_shift: false },
  { mm_id: 'MM-N2-005', district: 'Allahabad', period: '2026-03', gt_share: 82, mt_share: 8, qc_share: 5, ecomm_share: 5, gt_share_delta_sply: -0.8, structural_shift: false },
  { mm_id: 'MM-N2-006', district: 'Meerut', period: '2026-03', gt_share: 69, mt_share: 18, qc_share: 8, ecomm_share: 5, gt_share_delta_sply: -3.5, structural_shift: true },
  { mm_id: 'MM-N2-007', district: 'Bareilly', period: '2026-03', gt_share: 80, mt_share: 10, qc_share: 5, ecomm_share: 5, gt_share_delta_sply: -1.2, structural_shift: false },
  { mm_id: 'MM-N2-008', district: 'Gorakhpur', period: '2026-03', gt_share: 86, mt_share: 7, qc_share: 4, ecomm_share: 3, gt_share_delta_sply: -0.5, structural_shift: false },
];

// --- L2 DEMAND ---
export const l2Demand = [
  { mm_id: 'MM-N2-001', district: 'Lucknow', category: 'Hair Care', period: '2026-03', demand_index: 92, demand_rank: 1, demand_vs_distribution_gap: 18, hotspot_score: 88, market_share_estimate: 24.5 },
  { mm_id: 'MM-N2-002', district: 'Kanpur', category: 'Hair Care', period: '2026-03', demand_index: 78, demand_rank: 3, demand_vs_distribution_gap: 28, hotspot_score: 72, market_share_estimate: 18.2 },
  { mm_id: 'MM-N2-003', district: 'Agra', category: 'Hair Care', period: '2026-03', demand_index: 71, demand_rank: 4, demand_vs_distribution_gap: 32, hotspot_score: 65, market_share_estimate: 15.8 },
  { mm_id: 'MM-N2-004', district: 'Varanasi', category: 'Hair Care', period: '2026-03', demand_index: 65, demand_rank: 5, demand_vs_distribution_gap: 38, hotspot_score: 58, market_share_estimate: 12.1 },
  { mm_id: 'MM-N2-005', district: 'Allahabad', category: 'Hair Care', period: '2026-03', demand_index: 82, demand_rank: 2, demand_vs_distribution_gap: 45, hotspot_score: 81, market_share_estimate: 9.4 },
  { mm_id: 'MM-N2-006', district: 'Meerut', category: 'Skin Care', period: '2026-03', demand_index: 68, demand_rank: 6, demand_vs_distribution_gap: 35, hotspot_score: 62, market_share_estimate: 14.3 },
  { mm_id: 'MM-N2-007', district: 'Bareilly', category: 'Hair Care', period: '2026-03', demand_index: 52, demand_rank: 7, demand_vs_distribution_gap: 40, hotspot_score: 48, market_share_estimate: 8.2 },
  { mm_id: 'MM-N2-008', district: 'Gorakhpur', category: 'Hair Care', period: '2026-03', demand_index: 42, demand_rank: 8, demand_vs_distribution_gap: 52, hotspot_score: 38, market_share_estimate: 6.5 },
];

// --- L2 TERRITORY ---
export const l2Territory = [
  { mm_id: 'MM-N2-001', beat_id: 'BT-001', district: 'Lucknow', territory_owner: 'ASM Priya Mehta', period: '2026-03', planned_outlets: 120, actual_visited: 92, visit_compliance: 76.7, productive_calls: 68.5, mau: 82, pjp_mau: 74, qau: 88, avg_lines_per_call: 3.1, beat_revenue: 1800000, beat_revenue_vs_design: -12 },
  { mm_id: 'MM-N2-001', beat_id: 'BT-002', district: 'Lucknow', territory_owner: 'ASM Priya Mehta', period: '2026-03', planned_outlets: 95, actual_visited: 78, visit_compliance: 82.1, productive_calls: 72.3, mau: 85, pjp_mau: 78, qau: 90, avg_lines_per_call: 3.4, beat_revenue: 1500000, beat_revenue_vs_design: -8 },
  { mm_id: 'MM-N2-002', beat_id: 'BT-003', district: 'Kanpur', territory_owner: 'ASM Priya Mehta', period: '2026-03', planned_outlets: 110, actual_visited: 72, visit_compliance: 65.5, productive_calls: 58.2, mau: 71, pjp_mau: 62, qau: 78, avg_lines_per_call: 2.6, beat_revenue: 1200000, beat_revenue_vs_design: -25 },
  { mm_id: 'MM-N2-002', beat_id: 'BT-004', district: 'Kanpur', territory_owner: 'ASM Priya Mehta', period: '2026-03', planned_outlets: 88, actual_visited: 70, visit_compliance: 79.5, productive_calls: 70.1, mau: 80, pjp_mau: 72, qau: 85, avg_lines_per_call: 3.0, beat_revenue: 1100000, beat_revenue_vs_design: -10 },
  { mm_id: 'MM-N2-003', beat_id: 'BT-005', district: 'Agra', territory_owner: 'ASM Vikram Patel', period: '2026-03', planned_outlets: 100, actual_visited: 64, visit_compliance: 64.0, productive_calls: 55.8, mau: 68, pjp_mau: 58, qau: 74, avg_lines_per_call: 2.4, beat_revenue: 950000, beat_revenue_vs_design: -28 },
  { mm_id: 'MM-N2-004', beat_id: 'BT-006', district: 'Varanasi', territory_owner: 'ASM Rahul Singh', period: '2026-03', planned_outlets: 85, actual_visited: 60, visit_compliance: 70.6, productive_calls: 62.4, mau: 75, pjp_mau: 66, qau: 80, avg_lines_per_call: 2.7, beat_revenue: 820000, beat_revenue_vs_design: -15 },
  { mm_id: 'MM-N2-006', beat_id: 'BT-007', district: 'Meerut', territory_owner: 'ASM Amit Kumar', period: '2026-03', planned_outlets: 78, actual_visited: 55, visit_compliance: 70.5, productive_calls: 61.3, mau: 73, pjp_mau: 64, qau: 79, avg_lines_per_call: 2.8, beat_revenue: 780000, beat_revenue_vs_design: -18 },
];

// --- L2 PROMO ---
export const l2Promo = [
  { mm_id: 'MM-N2-001', scheme_id: 'SCH-001', name: 'Summer Hair Care Push', district: 'Lucknow', period: '2026-03', baseline_value: 4200000, actual_value: 4620000, uplift_value: 420000, uplift_pct: 10, roi: 1.8, eligible_outlets: 800, participating_outlets: 480, participation_rate: 60 },
  { mm_id: 'MM-N2-002', scheme_id: 'SCH-002', name: 'Skin Care Bundle Offer', district: 'Kanpur', period: '2026-03', baseline_value: 1900000, actual_value: 1995000, uplift_value: 95000, uplift_pct: 5, roi: 0.9, eligible_outlets: 520, participating_outlets: 210, participation_rate: 40 },
  { mm_id: 'MM-N2-004', scheme_id: 'SCH-003', name: 'Rural Penetration Scheme', district: 'Varanasi', period: '2026-03', baseline_value: 1500000, actual_value: 1575000, uplift_value: 75000, uplift_pct: 5, roi: 0.7, eligible_outlets: 350, participating_outlets: 105, participation_rate: 30 },
  { mm_id: 'MM-N2-003', scheme_id: 'SCH-004', name: 'GT Loyalty Program', district: 'Agra', period: '2026-03', baseline_value: 2100000, actual_value: 2520000, uplift_value: 420000, uplift_pct: 20, roi: 3.2, eligible_outlets: 400, participating_outlets: 320, participation_rate: 80 },
  { mm_id: 'MM-N2-006', scheme_id: 'SCH-005', name: 'Monsoon Stock-Up', district: 'Meerut', period: '2026-03', baseline_value: 1100000, actual_value: 1155000, uplift_value: 55000, uplift_pct: 5, roi: 0.6, eligible_outlets: 280, participating_outlets: 84, participation_rate: 30 },
];

// --- L2 OUTSTANDING ---
export const l2Outstanding = [
  { mm_id: 'MM-N2-001', distributor_id: 'DB-001', name: 'Sharma Distributors', district: 'Lucknow', period: '2026-03', total_outstanding: 2800000, outstanding_gt30d: 1120000, outstanding_lt30d: 1680000, collection_value: 6120000, collection_rate: 72, outstanding_vs_primary: 33 },
  { mm_id: 'MM-N2-001', distributor_id: 'DB-002', name: 'Gupta Agencies', district: 'Lucknow', period: '2026-03', total_outstanding: 2400000, outstanding_gt30d: 1200000, outstanding_lt30d: 1200000, collection_value: 4340000, collection_rate: 65, outstanding_vs_primary: 39 },
  { mm_id: 'MM-N2-002', distributor_id: 'DB-004', name: 'Verma & Sons', district: 'Kanpur', period: '2026-03', total_outstanding: 1900000, outstanding_gt30d: 1045000, outstanding_lt30d: 855000, collection_value: 2460000, collection_rate: 58, outstanding_vs_primary: 46 },
  { mm_id: 'MM-N2-004', distributor_id: 'DB-006', name: 'Kumar Enterprises', district: 'Varanasi', period: '2026-03', total_outstanding: 1600000, outstanding_gt30d: 880000, outstanding_lt30d: 720000, collection_value: 1920000, collection_rate: 55, outstanding_vs_primary: 50 },
  { mm_id: 'MM-N2-002', distributor_id: 'DB-003', name: 'Singh Traders', district: 'Kanpur', period: '2026-03', total_outstanding: 900000, outstanding_gt30d: 270000, outstanding_lt30d: 630000, collection_value: 4590000, collection_rate: 82, outstanding_vs_primary: 17 },
  { mm_id: 'MM-N2-003', distributor_id: 'DB-005', name: 'Patel Distribution', district: 'Agra', period: '2026-03', total_outstanding: 750000, outstanding_gt30d: 225000, outstanding_lt30d: 525000, collection_value: 3230000, collection_rate: 80, outstanding_vs_primary: 20 },
];

// --- L2 UNTAPPED POTENTIAL ---
export const l2UntappedPotential = [
  { state: 'Uttar Pradesh', district: 'Lucknow', total_towns: 48, under_penetrated: 12, under_indexed: 8, nd_pct: 59, market_share: 24.5, asm_market_share: 28.1, ideal_outlets: 2100, total_outlets: 1240, infra_count: 320 },
  { state: 'Uttar Pradesh', district: 'Kanpur', total_towns: 35, under_penetrated: 14, under_indexed: 10, nd_pct: 48.6, market_share: 18.2, asm_market_share: 22.5, ideal_outlets: 1400, total_outlets: 680, infra_count: 210 },
  { state: 'Uttar Pradesh', district: 'Agra', total_towns: 28, under_penetrated: 11, under_indexed: 9, nd_pct: 47.3, market_share: 15.8, asm_market_share: 20.1, ideal_outlets: 1100, total_outlets: 520, infra_count: 180 },
  { state: 'Uttar Pradesh', district: 'Varanasi', total_towns: 22, under_penetrated: 12, under_indexed: 10, nd_pct: 41.1, market_share: 12.1, asm_market_share: 18.4, ideal_outlets: 950, total_outlets: 390, infra_count: 145 },
  { state: 'Uttar Pradesh', district: 'Allahabad', total_towns: 18, under_penetrated: 11, under_indexed: 9, nd_pct: 38.8, market_share: 9.4, asm_market_share: 16.2, ideal_outlets: 800, total_outlets: 310, infra_count: 110 },
  { state: 'Uttar Pradesh', district: 'Meerut', total_towns: 25, under_penetrated: 10, under_indexed: 7, nd_pct: 40.0, market_share: 14.3, asm_market_share: 19.7, ideal_outlets: 700, total_outlets: 280, infra_count: 160 },
  { state: 'Uttar Pradesh', district: 'Bareilly', total_towns: 16, under_penetrated: 10, under_indexed: 8, nd_pct: 35.0, market_share: 8.2, asm_market_share: 14.8, ideal_outlets: 600, total_outlets: 210, infra_count: 95 },
  { state: 'Uttar Pradesh', district: 'Gorakhpur', total_towns: 14, under_penetrated: 10, under_indexed: 9, nd_pct: 30.9, market_share: 6.5, asm_market_share: 12.3, ideal_outlets: 550, total_outlets: 170, infra_count: 80 },
];

// --- BENCHMARK DATA ---
export const l2Benchmark = [
  { geography: 'North-2', metric: 'ND%', client_value: 42.3, cohort_median: 52.1, cohort_p75: 61.4, percentile_rank: 28, gap_to_median: -9.8, trend_3m: 'widening' },
  { geography: 'North-2', metric: 'WD%', client_value: 61.7, cohort_median: 68.5, cohort_p75: 75.2, percentile_rank: 35, gap_to_median: -6.8, trend_3m: 'widening' },
  { geography: 'North-2', metric: 'Extraction Rate', client_value: 62, cohort_median: 74, cohort_p75: 82, percentile_rank: 22, gap_to_median: -12, trend_3m: 'widening' },
  { geography: 'North-2', metric: 'WSP/Outlet', client_value: 3200, cohort_median: 4100, cohort_p75: 5200, percentile_rank: 30, gap_to_median: -900, trend_3m: 'stable' },
  { geography: 'North-2', metric: 'Sec:Pri Ratio', client_value: 0.69, cohort_median: 0.82, cohort_p75: 0.91, percentile_rank: 18, gap_to_median: -0.13, trend_3m: 'widening' },
  { geography: 'North-2', metric: 'Collection Rate', client_value: 72.4, cohort_median: 80.2, cohort_p75: 87.5, percentile_rank: 32, gap_to_median: -7.8, trend_3m: 'stable' },
];

// --- TREND DATA (6-month trailing) ---
export const trendData = {
  nd_trend: [
    { month: 'Oct 25', value: 47.1 }, { month: 'Nov 25', value: 46.2 }, { month: 'Dec 25', value: 45.5 },
    { month: 'Jan 26', value: 44.8 }, { month: 'Feb 26', value: 43.6 }, { month: 'Mar 26', value: 42.3 },
  ],
  extraction_trend: [
    { month: 'Oct 25', value: 74 }, { month: 'Nov 25', value: 72 }, { month: 'Dec 25', value: 70 },
    { month: 'Jan 26', value: 68 }, { month: 'Feb 26', value: 65 }, { month: 'Mar 26', value: 62 },
  ],
  pipeline_trend: [
    { month: 'Oct 25', value: 0.87 }, { month: 'Nov 25', value: 0.83 }, { month: 'Dec 25', value: 0.79 },
    { month: 'Jan 26', value: 0.75 }, { month: 'Feb 26', value: 0.72 }, { month: 'Mar 26', value: 0.69 },
  ],
  channel_trend: [
    { month: 'Oct 25', gt: 68, mt: 18, qc: 8, ecomm: 6 },
    { month: 'Nov 25', gt: 67, mt: 19, qc: 8, ecomm: 6 },
    { month: 'Dec 25', gt: 66, mt: 19, qc: 9, ecomm: 6 },
    { month: 'Jan 26', gt: 65, mt: 20, qc: 9, ecomm: 6 },
    { month: 'Feb 26', gt: 64, mt: 20, qc: 10, ecomm: 6 },
    { month: 'Mar 26', gt: 62, mt: 22, qc: 10, ecomm: 6 },
  ],
  mau_trend: [
    { month: 'Oct 25', mau: 86, pjp_mau: 79, qau: 91 },
    { month: 'Nov 25', mau: 84, pjp_mau: 77, qau: 89 },
    { month: 'Dec 25', mau: 83, pjp_mau: 76, qau: 88 },
    { month: 'Jan 26', mau: 81, pjp_mau: 73, qau: 86 },
    { month: 'Feb 26', mau: 79, pjp_mau: 70, qau: 84 },
    { month: 'Mar 26', mau: 78, pjp_mau: 68, qau: 82 },
  ],
  outstanding_trend: [
    { month: 'Oct 25', outstanding: 6200000, collection: 22100000, primary: 28500000 },
    { month: 'Nov 25', outstanding: 6800000, collection: 21200000, primary: 29100000 },
    { month: 'Dec 25', outstanding: 7400000, collection: 20500000, primary: 30200000 },
    { month: 'Jan 26', outstanding: 8100000, collection: 19800000, primary: 31500000 },
    { month: 'Feb 26', outstanding: 9000000, collection: 19200000, primary: 33000000 },
    { month: 'Mar 26', outstanding: 10350000, collection: 18660000, primary: 35900000 },
  ],
  revenue_trend: [
    { month: 'Oct 25', value: 85000000 }, { month: 'Nov 25', value: 82000000 }, { month: 'Dec 25', value: 79000000 },
    { month: 'Jan 26', value: 75000000 }, { month: 'Feb 26', value: 71000000 }, { month: 'Mar 26', value: 68000000 },
  ],
  benchmark_gap_trend: [
    { month: 'Oct 25', nd_gap: -5.2, extraction_gap: -8, pipeline_gap: -0.05 },
    { month: 'Nov 25', nd_gap: -6.1, extraction_gap: -9, pipeline_gap: -0.07 },
    { month: 'Dec 25', nd_gap: -7.0, extraction_gap: -10, pipeline_gap: -0.08 },
    { month: 'Jan 26', nd_gap: -7.8, extraction_gap: -11, pipeline_gap: -0.10 },
    { month: 'Feb 26', nd_gap: -8.9, extraction_gap: -11.5, pipeline_gap: -0.12 },
    { month: 'Mar 26', nd_gap: -9.8, extraction_gap: -12, pipeline_gap: -0.13 },
  ],
  wsp_trend: [
    { month: 'Oct', wsp: 3840, bench: 5200 }, { month: 'Nov', wsp: 3720, bench: 5200 },
    { month: 'Dec', wsp: 3610, bench: 5200 }, { month: 'Jan', wsp: 3480, bench: 5200 },
    { month: 'Feb', wsp: 3350, bench: 5200 }, { month: 'Mar', wsp: 3200, bench: 5200 },
  ],
};

// ============================================================
// DRIFT FINDINGS
// ============================================================

export const driftFindings = [
  // Category A — Drill-Down Tactical
  {
    finding_id: 'F-001', rule_id: 'DA-01', category: 'A', severity: 'critical',
    rule_name: 'Reach Erosion',
    geo_level: 'district', geo_id: 'Kanpur', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'ND%', current_value: 48.6, comparison_value: 55.2, drift_magnitude: -6.6, drift_direction: 'down',
    causal_dims: { channel: 'GT', category: 'All', outlet_class: 'FLP+OLP', territory_owner: 'ASM Priya Mehta', distributor: 'Gupta Agencies', distributor_id: 'DB-002' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Kanpur GT ND% dropped 6.6pp vs SPLY over 3 consecutive months. Outlet churn concentrated in FLP and OLP town classes. 65 outlets lost, only 22 added.',
    target_screen: 'S-01', status: 'new',
  },
  {
    finding_id: 'F-002', rule_id: 'DA-02', category: 'A', severity: 'critical',
    rule_name: 'Extraction Decay',
    geo_level: 'district', geo_id: 'Allahabad', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Extraction Rate', current_value: 49, comparison_value: 88, drift_magnitude: -39, drift_direction: 'down',
    causal_dims: { channel: 'GT', category: 'Hair Care', outlet_class: 'All', territory_owner: 'ASM Rahul Singh', distributor: 'Multiple' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Allahabad Hair Care extraction rate at 49% vs 88% benchmark — 39pp gap widening for 3 months. WSP/outlet at ₹3,161 vs category median ₹4,800. Lines/call declining.',
    target_screen: 'S-02', status: 'new',
  },
  {
    finding_id: 'F-003', rule_id: 'DA-03', category: 'A', severity: 'critical',
    rule_name: 'Pipeline Stuffing',
    geo_level: 'region', geo_id: 'North-2', geo_ancestors: { zone: 'North', region: 'North-2' },
    metric_name: 'Sec:Pri Ratio', current_value: 0.69, comparison_value: 0.87, drift_magnitude: -18, drift_direction: 'down',
    causal_dims: { channel: 'All', category: 'All', outlet_class: 'All', territory_owner: 'RSM Rajesh Sharma', distributor: 'Gupta Agencies, Verma & Sons, Kumar Enterprises', distributor_ids: ['DB-002', 'DB-004', 'DB-006'] },
    period_start: '2025-12', period_end: '2026-03', consecutive_periods: 4,
    summary_text: 'North-2 Sec:Pri ratio dropped from 87% to 69% in 4 months. Primary up 12-25% SALY while secondary declining 8-18%. 3 distributors (Gupta, Verma, Kumar) show Sec:Pri <65%. Pattern correlates with Q4 scheme loading.',
    target_screen: 'S-03', status: 'new',
  },
  {
    finding_id: 'F-004', rule_id: 'DA-04', category: 'A', severity: 'warning',
    rule_name: 'Channel Structural Shift',
    geo_level: 'district', geo_id: 'Lucknow', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'GT Share', current_value: 62, comparison_value: 68, drift_magnitude: -6, drift_direction: 'down',
    causal_dims: { channel: 'GT→MT', category: 'All', outlet_class: 'Metro', territory_owner: 'ASM Priya Mehta' },
    period_start: '2025-07', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Lucknow GT share declining 2pp/quarter for 3 quarters (68%→62%). MT gaining structurally, not seasonal. QC and ecomm stable. GT volume decline concentrated in Metro town class.',
    target_screen: 'S-04', status: 'viewed',
  },
  {
    finding_id: 'F-005', rule_id: 'DA-05', category: 'A', severity: 'warning',
    rule_name: 'Beat Productivity Drift',
    geo_level: 'district', geo_id: 'Agra', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Beat Revenue vs Design', current_value: -28, comparison_value: 0, drift_magnitude: -28, drift_direction: 'down',
    causal_dims: { channel: 'GT', category: 'All', outlet_class: 'TLP', territory_owner: 'ASM Vikram Patel', distributor: 'Patel Distribution' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Agra Beat BT-005 revenue 28% below design intent for 3 months. Visit compliance at 64%, productive calls at 55.8%. Beat geometry may be mismatched to outlet density.',
    target_screen: 'S-05', status: 'new',
  },
  {
    finding_id: 'F-006', rule_id: 'DA-06', category: 'A', severity: 'warning',
    rule_name: 'Promo Underperformance',
    geo_level: 'district', geo_id: 'Varanasi', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Promo Uplift', current_value: 5, comparison_value: 15, drift_magnitude: -10, drift_direction: 'down',
    causal_dims: { channel: 'GT', category: 'Hair Care', outlet_class: 'FLP', territory_owner: 'ASM Rahul Singh', distributor: 'Kumar Enterprises', distributor_id: 'DB-006' },
    period_start: '2026-02', period_end: '2026-03', consecutive_periods: 1,
    summary_text: 'Rural Penetration Scheme (SCH-003) in Varanasi showing only 5% uplift vs 15% target at midpoint. Participation rate at 30% — 70% of eligible outlets not participating. ROI at 0.7x.',
    target_screen: 'S-06', status: 'new',
  },
  {
    finding_id: 'F-007', rule_id: 'DA-07', category: 'A', severity: 'warning',
    rule_name: 'Benchmark Gap Widening',
    geo_level: 'region', geo_id: 'North-2', geo_ancestors: { zone: 'North', region: 'North-2' },
    metric_name: 'ND% vs Cohort', current_value: -9.8, comparison_value: -5.2, drift_magnitude: -4.6, drift_direction: 'widening',
    causal_dims: { channel: 'All', category: 'All' },
    period_start: '2025-10', period_end: '2026-03', consecutive_periods: 6,
    summary_text: 'North-2 ND% gap to cohort median widened from -5.2pp to -9.8pp over 6 months. Now at 28th percentile. Extraction gap also widening (-8 to -12pp). Pipeline ratio gap worst in cohort.',
    target_screen: 'S-07', status: 'new',
  },
  {
    finding_id: 'F-008', rule_id: 'DA-08', category: 'A', severity: 'critical',
    rule_name: 'Outlet Churn Spike',
    geo_level: 'district', geo_id: 'Varanasi', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Monthly Churn', current_value: 48, comparison_value: 20, drift_magnitude: 2.4, drift_direction: 'up',
    causal_dims: { channel: 'GT', category: 'All', outlet_class: 'FLP', territory_owner: 'ASM Rahul Singh' },
    period_start: '2026-03', period_end: '2026-03', consecutive_periods: 1,
    summary_text: 'Varanasi outlet churn at 48/month — 2.4x the historical norm of 20/month. Concentrated in FLP town class. 80% of churned outlets had declining visit frequency in prior 2 months.',
    target_screen: 'S-01', status: 'new',
  },
  {
    finding_id: 'F-009', rule_id: 'DA-09', category: 'A', severity: 'critical',
    rule_name: 'Outstanding Concentration',
    geo_level: 'distributor', geo_id: 'DB-006', geo_ancestors: { zone: 'North', region: 'North-2', district: 'Varanasi' },
    metric_name: 'Outstanding:Primary', current_value: 50, comparison_value: 30, drift_magnitude: 20, drift_direction: 'up',
    causal_dims: { distributor: 'Kumar Enterprises', distributor_id: 'DB-006' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Kumar Enterprises (Varanasi) outstanding:primary ratio at 50% — well above 30% threshold. >30d outstanding at ₹8.8L growing. Collection rate at 55%, declining from 72% 3 months ago.',
    target_screen: 'S-08', status: 'new',
  },
  {
    finding_id: 'F-010', rule_id: 'DA-10', category: 'A', severity: 'warning',
    rule_name: 'SFA Adoption Decay',
    geo_level: 'region', geo_id: 'North-2', geo_ancestors: { zone: 'North', region: 'North-2' },
    metric_name: 'MAU', current_value: 78, comparison_value: 86, drift_magnitude: -8, drift_direction: 'down',
    causal_dims: { territory_owner: 'Multiple ASMs' },
    period_start: '2025-12', period_end: '2026-03', consecutive_periods: 4,
    summary_text: 'North-2 MAU declined from 86% to 78% over 4 months (-9.3% vs L3M avg). PJP MAU at 68% (was 79%). OFR declining. Agra and Kanpur beats showing steepest drop.',
    target_screen: 'S-05', status: 'viewed',
  },
  // Category B — War Room / Strategic
  {
    finding_id: 'F-011', rule_id: 'DB-01', category: 'B', severity: 'info',
    rule_name: 'Whitespace Opportunity',
    geo_level: 'district', geo_id: 'Allahabad', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Demand-Distribution Gap', current_value: 45, comparison_value: 0, drift_magnitude: 45, drift_direction: 'gap',
    causal_dims: { category: 'Hair Care' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Allahabad: Demand index at P82 but ND% only 38.8%. 11 under-penetrated towns, 9 under-indexed. Expansion targeting can unlock ₹2.5Cr potential with 490 outlet additions.',
    target_screen: 'S-09', target_action: { module: 'M02', agent: 'Gap Scoring', action_type: 'expansion_targeting' }, status: 'new',
  },
  {
    finding_id: 'F-012', rule_id: 'DB-02', category: 'B', severity: 'info',
    rule_name: 'Under-Indexed Markets',
    geo_level: 'district', geo_id: 'Gorakhpur', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Extraction vs Benchmark', current_value: 42, comparison_value: 88, drift_magnitude: -46, drift_direction: 'gap',
    causal_dims: { category: 'All' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Gorakhpur: ND% at 30.9% but extraction at 42% of benchmark. Present but severely under-performing. SKU depth gaps in 8 of 14 towns. Visit frequency below 2x/month.',
    target_screen: 'S-09', target_action: { module: 'M02', agent: 'Extraction Benchmarking', action_type: 'extraction_diagnostic' }, status: 'new',
  },
  {
    finding_id: 'F-013', rule_id: 'DB-04', category: 'B', severity: 'info',
    rule_name: 'Route Re-Optimisation',
    geo_level: 'district', geo_id: 'Agra', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Visit Compliance + Productive Calls', current_value: 64, comparison_value: 80, drift_magnitude: -16, drift_direction: 'down',
    causal_dims: { territory_owner: 'ASM Vikram Patel' },
    period_start: '2026-01', period_end: '2026-03', consecutive_periods: 3,
    summary_text: 'Agra beat geometry mismatched to current outlet density. Visit compliance at 64% with productive calls at 55.8%. Beat re-routing recommended with current outlet universe.',
    target_screen: 'S-05', target_action: { module: 'Rural Growth Agent 02', agent: 'Beat Routing', action_type: 'beat_rerouting' }, status: 'new',
  },
  {
    finding_id: 'F-014', rule_id: 'DB-05', category: 'B', severity: 'warning',
    rule_name: 'Promo Course-Correction',
    geo_level: 'district', geo_id: 'Varanasi', geo_ancestors: { zone: 'North', region: 'North-2', state: 'UP' },
    metric_name: 'Participation Rate', current_value: 30, comparison_value: 60, drift_magnitude: -30, drift_direction: 'down',
    causal_dims: { category: 'Hair Care', distributor: 'Kumar Enterprises', distributor_id: 'DB-006' },
    period_start: '2026-03', period_end: '2026-03', consecutive_periods: 1,
    summary_text: 'Rural Penetration Scheme in Varanasi needs mid-course correction. Participation at 30% vs 60% target. Eligibility criteria may be too restrictive for FLP outlets.',
    target_screen: 'S-06', target_action: { module: 'M05', agent: 'Scheme Design Engine', action_type: 'scheme_adjustment' }, status: 'new',
  },
];

// --- DATA REFRESH ---
export const dataRefreshDate = '2026-04-07';
export const dataRefreshLabel = 'Refreshed 7 Apr 2026, 02:14 IST';

// --- DISTRICT GEO COORDINATES (for Leaflet map) ---
export const districtGeo = {
  Lucknow:    { lat: 26.85, lng: 80.95, nd_pct: 59.0, extraction_rate: 72, visit_compliance: 76.7 },
  Kanpur:     { lat: 26.45, lng: 80.33, nd_pct: 48.6, extraction_rate: 68, visit_compliance: 72.5 },
  Agra:       { lat: 27.18, lng: 78.01, nd_pct: 47.3, extraction_rate: 64, visit_compliance: 64.0 },
  Varanasi:   { lat: 25.32, lng: 82.97, nd_pct: 41.1, extraction_rate: 58, visit_compliance: 70.6 },
  Allahabad:  { lat: 25.43, lng: 81.84, nd_pct: 38.8, extraction_rate: 49, visit_compliance: 68.0 },
  Meerut:     { lat: 28.98, lng: 77.71, nd_pct: 40.0, extraction_rate: 56, visit_compliance: 70.5 },
  Bareilly:   { lat: 28.35, lng: 79.43, nd_pct: 35.0, extraction_rate: 52, visit_compliance: 65.0 },
  Gorakhpur:  { lat: 26.76, lng: 83.37, nd_pct: 30.9, extraction_rate: 42, visit_compliance: 60.0 },
};

// --- KPI CONTEXTUAL DECOMPOSITION DATA (for Contextual Detail Panel) ---
export const kpiContextualData = {
  'ND%': {
    metric: 'ND%', unit: '%', current: 42.3, sply: 47.1, delta: -4.8,
    description: 'Numeric Distribution — % of viable outlets actively billed in the period',
    spatial: [
      { geo: 'Lucknow', value: 59.0, delta: -3.2, status: 'ok' },
      { geo: 'Kanpur', value: 48.6, delta: -6.6, status: 'warn' },
      { geo: 'Agra', value: 47.3, delta: -5.1, status: 'warn' },
      { geo: 'Varanasi', value: 41.1, delta: -7.2, status: 'critical' },
      { geo: 'Allahabad', value: 38.8, delta: -8.9, status: 'critical' },
      { geo: 'Meerut', value: 40.0, delta: -5.5, status: 'critical' },
      { geo: 'Bareilly', value: 35.0, delta: -6.8, status: 'critical' },
      { geo: 'Gorakhpur', value: 30.9, delta: -7.1, status: 'critical' },
    ],
    temporal: [
      { month: 'Oct', value: 47.1 }, { month: 'Nov', value: 46.2 },
      { month: 'Dec', value: 45.5 }, { month: 'Jan', value: 44.8 },
      { month: 'Feb', value: 43.6 }, { month: 'Mar', value: 42.3 },
    ],
    causal: [
      { driver: 'Outlet Churn (FLP+OLP)', contribution: -2.8, direction: 'down' },
      { driver: 'New Additions Below Target', contribution: -1.4, direction: 'down' },
      { driver: 'Beat Coverage Gaps', contribution: -0.6, direction: 'down' },
    ],
  },
  'Total Revenue': {
    metric: 'Total Revenue', unit: '₹Cr', current: 6.8, sply: 8.5, delta: -20,
    description: 'Gross Secondary Value across all channels and categories',
    spatial: [
      { geo: 'Lucknow', value: 1.92, delta: -12, status: 'warn' },
      { geo: 'Kanpur', value: 1.48, delta: -18, status: 'critical' },
      { geo: 'Agra', value: 1.12, delta: -15, status: 'warn' },
      { geo: 'Varanasi', value: 0.82, delta: -24, status: 'critical' },
      { geo: 'Allahabad', value: 0.62, delta: -28, status: 'critical' },
      { geo: 'Meerut', value: 0.48, delta: -20, status: 'critical' },
    ],
    temporal: [
      { month: 'Oct', value: 8.5 }, { month: 'Nov', value: 8.2 },
      { month: 'Dec', value: 7.9 }, { month: 'Jan', value: 7.5 },
      { month: 'Feb', value: 7.1 }, { month: 'Mar', value: 6.8 },
    ],
    causal: [
      { driver: 'ND% Decline', contribution: -1.2, direction: 'down' },
      { driver: 'WSP/Outlet Drop', contribution: -0.8, direction: 'down' },
      { driver: 'Pipeline Stuffing (Sec↓)', contribution: -0.9, direction: 'down' },
      { driver: 'GT→MT Channel Shift', contribution: 0.2, direction: 'up' },
    ],
  },
  'Sec:Pri Ratio': {
    metric: 'Sec:Pri Ratio', unit: '', current: 0.69, sply: 0.87, delta: -20.7,
    description: 'Secondary-to-Primary ratio — measures pipeline health, secondary sell-through',
    spatial: [
      { geo: 'Sharma Distributors', value: 0.69, delta: -21, status: 'warn' },
      { geo: 'Gupta Agencies', value: 0.60, delta: -29, status: 'critical' },
      { geo: 'Singh Traders', value: 0.75, delta: -14, status: 'ok' },
      { geo: 'Verma & Sons', value: 0.60, delta: -28, status: 'critical' },
      { geo: 'Kumar Enterprises', value: 0.60, delta: -31, status: 'critical' },
    ],
    temporal: [
      { month: 'Oct', value: 0.87 }, { month: 'Nov', value: 0.83 },
      { month: 'Dec', value: 0.79 }, { month: 'Jan', value: 0.75 },
      { month: 'Feb', value: 0.72 }, { month: 'Mar', value: 0.69 },
    ],
    causal: [
      { driver: 'Q4 Primary Loading (Scheme)', contribution: -0.12, direction: 'down' },
      { driver: 'Secondary Sell-Through Low', contribution: -0.06, direction: 'down' },
    ],
  },
  'Collection Rate': {
    metric: 'Collection Rate', unit: '%', current: 72.4, sply: 81.3, delta: -8.9,
    description: 'Collections as % of billing — measures credit health of distributor network',
    spatial: [
      { geo: 'Sharma Distributors', value: 72, delta: -10, status: 'warn' },
      { geo: 'Gupta Agencies', value: 65, delta: -15, status: 'critical' },
      { geo: 'Singh Traders', value: 82, delta: 2, status: 'ok' },
      { geo: 'Kumar Enterprises', value: 55, delta: -20, status: 'critical' },
      { geo: 'Patel Distribution', value: 80, delta: -3, status: 'ok' },
    ],
    temporal: [
      { month: 'Oct', value: 81.3 }, { month: 'Nov', value: 79.8 },
      { month: 'Dec', value: 78.2 }, { month: 'Jan', value: 76.5 },
      { month: 'Feb', value: 74.1 }, { month: 'Mar', value: 72.4 },
    ],
    causal: [
      { driver: 'Outstanding Concentration (Kumar)', contribution: -4.2, direction: 'down' },
      { driver: 'Ageing >30d Growing', contribution: -2.8, direction: 'down' },
      { driver: 'Visit Frequency Drop', contribution: -1.9, direction: 'down' },
    ],
  },
  'SFA MAU': {
    metric: 'SFA MAU', unit: '%', current: 78, sply: 86, delta: -8,
    description: 'Monthly Active Users of SFA app — proxy for field execution discipline',
    spatial: [
      { geo: 'Lucknow', value: 82, delta: -4, status: 'ok' },
      { geo: 'Kanpur', value: 75, delta: -9, status: 'warn' },
      { geo: 'Agra', value: 68, delta: -14, status: 'critical' },
      { geo: 'Varanasi', value: 75, delta: -8, status: 'warn' },
    ],
    temporal: [
      { month: 'Oct', value: 86 }, { month: 'Nov', value: 84 },
      { month: 'Dec', value: 83 }, { month: 'Jan', value: 81 },
      { month: 'Feb', value: 79 }, { month: 'Mar', value: 78 },
    ],
    causal: [
      { driver: 'Agra Beat Productivity Drop', contribution: -4.5, direction: 'down' },
      { driver: 'Kanpur MAU Decline', contribution: -2.2, direction: 'down' },
      { driver: 'PJP MAU Divergence', contribution: -1.3, direction: 'down' },
    ],
  },
};

// --- WAR ROOM EXERCISES ---
export const warRoomExercises = [
  { id: 'EX-001', title: 'Kanpur Outlet Recovery Drive', type: 'beat_redesign', status: 'in_progress', owner: 'ASM Priya Mehta', finding_ids: ['F-001', 'F-008'], created: '2026-03-15', target_date: '2026-04-30', disseminated: false, notes: 'Beat geometry review underway. Targeting 80 outlet re-additions by April end.' },
  { id: 'EX-002', title: 'North-2 Pipeline Correction', type: 'distributor_action', status: 'pending', owner: 'RSM Rajesh Sharma', finding_ids: ['F-003'], created: '2026-03-20', target_date: '2026-04-15', disseminated: false, notes: 'Joint review with Gupta, Verma, Kumar distributors scheduled.' },
  { id: 'EX-003', title: 'Allahabad Expansion Targeting', type: 'expansion', status: 'pending', owner: 'ASM Rahul Singh', finding_ids: ['F-011'], created: '2026-03-28', target_date: '2026-05-31', disseminated: false, notes: '490 target outlets mapped. SD appointment under review.' },
];

// --- SCREEN DEFINITIONS ---
export const screenDefinitions = {
  'S-00': { id: 'S-00', name: 'Landing', description: 'Drift findings feed + summary KPIs', icon: 'LayoutDashboard', path: '/' },
  'S-01': { id: 'S-01', name: 'Reach Health', description: 'ND%, GEO ECO, outlet funnel, coverage gaps', icon: 'Target', path: '/reach' },
  'S-02': { id: 'S-02', name: 'Extraction Health', description: 'WD%, WSP/outlet, extraction vs benchmark', icon: 'TrendingUp', path: '/extraction' },
  'S-03': { id: 'S-03', name: 'Pipeline Health', description: 'Sec:Pri ratio, distributor pipeline, stock days', icon: 'GitBranch', path: '/pipeline' },
  'S-04': { id: 'S-04', name: 'Channel Mix', description: 'GT/MT/QC/ecomm share, structural shifts', icon: 'PieChart', path: '/channel' },
  'S-05': { id: 'S-05', name: 'Territory & SFA Health', description: 'Visit compliance, MAU, beat productivity', icon: 'Map', path: '/territory' },
  'S-06': { id: 'S-06', name: 'Promo Health', description: 'Scheme performance, uplift, ROI', icon: 'Zap', path: '/promo' },
  'S-07': { id: 'S-07', name: 'Benchmark', description: 'Client vs cohort gaps, percentile rank', icon: 'BarChart3', path: '/benchmark' },
  'S-08': { id: 'S-08', name: 'Outstanding Health', description: 'Outstanding aging, collection rate', icon: 'Wallet', path: '/outstanding' },
  'S-09': { id: 'S-09', name: 'Untapped Potential', description: 'Whitespace, under-penetrated towns, expansion', icon: 'Radar', path: '/untapped' },
};
