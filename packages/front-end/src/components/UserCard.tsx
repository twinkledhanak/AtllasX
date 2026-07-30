export function UserCard({ user }) {
    return (
      <div className="border rounded p-4 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold">{user.firstName} {user.lastName}</h2>
        <p className="text-sm text-neutral-600">{user.email}</p>
        <p className="text-sm">{user.address}</p>
      </div>
    );
  }
  