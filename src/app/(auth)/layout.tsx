export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col w-full gap-4 items-center justify-center py-32">
      {children}
    </main>
  );
}
