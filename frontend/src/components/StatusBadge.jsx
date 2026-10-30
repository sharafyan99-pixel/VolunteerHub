// The small colored label: Approved, Pending, Completed, Rejected, Upcoming.
export default function StatusBadge({ status }) {
  return <span className={'st ' + status}>{status}</span>;
}
