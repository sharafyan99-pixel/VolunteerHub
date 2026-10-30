// A simple table. headers = ['Name', 'Date'],  rows = [['Ani', 'Sep 1'], ['Vahe', 'Sep 2']]
export default function DataTable({ headers, rows }) {
  return (
    <table>
      <thead>
        <tr>{headers.map(h => <th key={h}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => <td key={j}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
