import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Command Center | Momo - The Cat',
  description: 'Manage dual-schema inventory, Amazon affiliate links, orders, fulfillment tracking, and lead database.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full">{children}</div>;
}
