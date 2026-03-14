export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian-bg text-obsidian-text">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">404 - Not Found</h2>
        <p className="text-obsidian-text-muted">Could not find requested resource</p>
      </div>
    </div>
  );
}
