import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import { districtGeo } from '../data/mockData';

const METRIC_CONFIG = {
  nd_pct: {
    label: 'ND%',
    benchmark: 55,
    getColor: (v) => v >= 55 ? '#22c55e' : v >= 45 ? '#f59e0b' : v >= 35 ? '#ef4444' : '#991b1b',
    getStatus: (v) => v >= 55 ? 'Good' : v >= 45 ? 'Watch' : v >= 35 ? 'Critical' : 'Severe',
    format: (v) => `${v.toFixed(1)}%`,
    thresholds: [
      { label: '≥55% Good',       color: '#22c55e' },
      { label: '45–55% Watch',    color: '#f59e0b' },
      { label: '35–45% Critical', color: '#ef4444' },
      { label: '<35% Severe',     color: '#991b1b' },
    ],
  },
  extraction_rate: {
    label: 'Extraction Rate',
    benchmark: 88,
    getColor: (v) => v >= 65 ? '#22c55e' : v >= 50 ? '#f59e0b' : '#ef4444',
    getStatus: (v) => v >= 65 ? 'On Track' : v >= 50 ? 'Below Benchmark' : 'Critical',
    format: (v) => `${v.toFixed(0)}%`,
    thresholds: [
      { label: '≥65% On Track',          color: '#22c55e' },
      { label: '50–65% Below Benchmark', color: '#f59e0b' },
      { label: '<50% Critical',          color: '#ef4444' },
    ],
  },
  visit_compliance: {
    label: 'Visit Compliance',
    benchmark: 84,
    getColor: (v) => v >= 75 ? '#22c55e' : v >= 60 ? '#f59e0b' : '#ef4444',
    getStatus: (v) => v >= 75 ? 'Target Met' : v >= 60 ? 'Watch' : 'Critical',
    format: (v) => `${v.toFixed(1)}%`,
    thresholds: [
      { label: '≥75% Target Met', color: '#22c55e' },
      { label: '60–75% Watch',    color: '#f59e0b' },
      { label: '<60% Critical',   color: '#ef4444' },
    ],
  },
};

function makeIcon(color, formattedVal, district, isCritical) {
  const size = 44;
  const ring = isCritical
    ? `<div style="position:absolute;inset:-4px;border-radius:50%;border:2px solid ${color};opacity:0.45;"></div>`
    : '';

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;gap:3px;font-family:'Outfit',system-ui,sans-serif;">
      <div style="
        position:relative;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};
        border:2px solid rgba(255,255,255,0.22);
        box-shadow:0 2px 12px ${color}55;
        display:flex;align-items:center;justify-content:center;
        flex-direction:column;gap:0;
      ">
        ${ring}
        <span style="font-size:10.5px;font-weight:800;color:#fff;line-height:1;letter-spacing:-0.3px;">${formattedVal}</span>
      </div>
      <span style="
        font-size:8.5px;font-weight:700;color:#fff;
        background:rgba(10,12,20,0.78);
        border:1px solid rgba(255,255,255,0.12);
        border-radius:4px;padding:1px 5px;
        white-space:nowrap;
        backdrop-filter:blur(4px);
        max-width:72px;text-align:center;overflow:hidden;text-overflow:ellipsis;
      ">${district}</span>
    </div>
  `;

  return L.divIcon({
    className: '',
    iconSize: [size, size + 22],
    iconAnchor: [size / 2, size / 2],
    html,
  });
}

export default function MapPanel({ metric = 'nd_pct', height = 340 }) {
  const config = METRIC_CONFIG[metric] || METRIC_CONFIG.nd_pct;
  const entries = Object.entries(districtGeo);

  return (
    <div
      className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden relative"
      style={{ height, boxShadow: 'var(--card-shadow)' }}
    >
      <MapContainer
        center={[26.8, 80.5]}
        zoom={7}
        scrollWheelZoom={false}
        zoomControl
        style={{ width: '100%', height: '100%' }}
      >
        {/* Labeled dark basemap for geographic context */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />

        {entries.map(([district, geo]) => {
          const val = geo[metric];
          const color = config.getColor(val);
          const status = config.getStatus(val);
          const isCritical = status === 'Critical' || status === 'Severe';
          const gap = val - config.benchmark;

          return (
            <Marker
              key={district}
              position={[geo.lat, geo.lng]}
              icon={makeIcon(color, config.format(val), district, isCritical)}
            >
              <Tooltip
                direction="top"
                offset={[0, -26]}
                opacity={1}
                className="leaflet-clarynt-tooltip"
              >
                <div style={{
                  background: 'rgba(10,12,22,0.97)',
                  border: `1px solid ${color}55`,
                  borderRadius: 10,
                  padding: '9px 14px',
                  minWidth: 160,
                  fontFamily: "'Outfit',system-ui,sans-serif",
                  lineHeight: 1.55,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#e8eaed', marginBottom: 5 }}>
                    {district}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#9ca3b4' }}>{config.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color }}>{config.format(val)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <span style={{ fontSize: 11, color: '#9ca3b4' }}>vs Benchmark</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: gap >= 0 ? '#22c55e' : '#ef4444' }}>
                      {gap >= 0 ? '+' : ''}{gap.toFixed(1)}pp
                    </span>
                  </div>
                  <div style={{ marginTop: 5, fontSize: 10, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {status}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 rounded-xl px-3 py-2.5 z-[500]"
        style={{ background: 'rgba(10,12,22,0.88)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }}
      >
        <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.9px', marginBottom: 6 }}>
          {config.label}
        </div>
        {config.thresholds.map((t, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: i < config.thresholds.length - 1 ? 4 : 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: '#9ca3af', fontWeight: 500 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
