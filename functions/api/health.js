export async function onRequest() {
  return Response.json({
    ok: true,
    app: "Movie AI World Platform",
    message: "API is working"
  });
}
