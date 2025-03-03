const AccountLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full max-w-6xl mx-auto py-4 space-y-4">{children}</main>
  );
};

export default AccountLayout;
