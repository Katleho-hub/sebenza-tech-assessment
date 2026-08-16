export function BalanceDisplay({ userBalance }: { userBalance: number }) {
  return (
    <div className="stats bg-base-100 border-base-300 border w-fit">
      <div className="stat">
        <div className="stat-title">Account balance</div>
        <div className="stat-value">{userBalance} SB</div>
      </div>
    </div>
  );
}
