export const dynamic = "force-static";

export async function GET() {
  const a = { good: true };
  console.log("in route");
  return a;
}
