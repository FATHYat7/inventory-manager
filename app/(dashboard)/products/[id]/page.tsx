type Params = { id: string };

export default async function EditProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
      <p className="text-sm text-zinc-600">Product ID: {id}</p>
    </div>
  );
}

