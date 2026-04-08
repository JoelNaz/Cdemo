export default function DataTable({ columns, data, highlightRules = {} }) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, ri) => (
            <tr key={ri}>
              {columns.map((col, ci) => {
                const val = row[col.key];
                let cls = '';
                if (highlightRules[col.key]) {
                  const rule = highlightRules[col.key];
                  if (rule.negative && val < rule.negative) cls = 'negative';
                  if (rule.positive && val > rule.positive) cls = 'positive';
                  if (rule.highlight && rule.highlight(val)) cls = 'highlight';
                }
                return (
                  <td key={ci} className={cls}>
                    {col.format ? col.format(val, row) : val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
